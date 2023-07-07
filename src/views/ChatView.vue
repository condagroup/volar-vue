<template>
<div class="main-content">
    <div class="container">
        <div class="chatbot">
            <div class="header">
                <div v-if="isNotSubscribed">
                    <h3>
                        <router-link to="/subscribe"><a>Subscribe</a></router-link> for unlimited messaging - and pay only for what you use.
                    </h3>
                </div>
            </div>

            <div class="openai-chat">

                <ChatSidebar :is-not-subscribed="isNotSubscribed" :loading-conversations="$store.state.loadingConversations" :chat-history="$store.state.chatHistory" @start-new-conversation="startNewConversation" @select-conversation="selectConversation" @submit-blog-post="submitBlogPost"></ChatSidebar>

                <div class="current-chat">
                    <div>
                        <div class="chat-messages" ref="chatMessages">
                            <div v-if="!blogPost" class="chat-message chatbot-message">
                                <div class="chat-message-content">
                                    <p>Hello, how can I help you?</p>
                                </div>
                            </div>
                            <div v-if="!changingConversations" v-for="(message, index) in displayedMessages" :key="index" class="chat-message" :class="message.sender === 'chatbot' ? 'chatbot-message' : 'user-message'">
                                <div class="chat-message-content">
                                    <p>{{ message.message }}</p>
                                    <CopyButton v-if="message.sender === 'chatbot'" :text-to-copy="message.message" class="copy-button-chatbot" />
                                </div>
                            </div>
                            <div class="chat-message chatbot-message" v-if="streamingText">
                                <div class="chat-message-content">
                                    <p>{{ streamingText }}</p>
                                </div>
                            </div>

                            <div v-if="changingConversations" class="loading">
                                <p class="loading-bar"></p>
                                <p class="loading-bar"></p>
                                <p class="loading-bar"></p>
                            </div>
                        </div>
                    </div>

                    <token-usage-modal :show-modal.sync="showModal"></token-usage-modal>

                    <div class="chat-input">
                        <textarea id="inputText" v-model="inputText" name="inputText" :placeholder="isTokenLimitExceeded
                                ? 'Token limit exceeded. Please update your limit in the profile page.'
                                : isMessageLimitReached
                                ? 'Message limit reached for non-subscribed users. Please subscribe to continue.'
                                : 'Type your message here...'
                                " @keydown="handleKeyDown" :disabled="isTokenLimitExceeded || isMessageLimitReached" rows="1" ref="inputTextarea"></textarea>
                        <button class="btn btn-primary" type="submit" id="submit" name="button" v-on:click="submitMessage(false)" :disabled="inputText.length === 0 || isTokenLimitExceeded">
                            <icon-post-message />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TokenUsageModal from "@/components/TokenUsageModal.vue";
import IconPostMessage from "@/components/icons/IconPostMessage.vue";
import ChatSidebar from "@/components/ChatSidebar.vue";
import CopyButton from "@/components/CopyButton.vue";
import {
    getApiKey,
    createOpenAIApi,
    getAndStoreUserDetails,
    updateTokensUsed,
    sendUsageReport,
} from '@/api/api';

export default {
    name: 'Chatbot',
    components: {
        TokenUsageModal,
        ChatSidebar,
        CopyButton,
        IconPostMessage,
    },
    data() {
        return {
            model: 'gpt-4',
            inputText: '',
            openAi: null,
            changingConversations: false,
            conversationId: null,
            showModal: false,
            streamingText: '',
            API_KEY: '',
            chunkCounter: 0,
            blogPost: false,
        };
    },
    created() {
        this.$store.dispatch('fetchConversations');
        this.$store.dispatch('fetchTokensInfo', this.$store.state.user.email);
    },
    mounted() {
        getApiKey()
            .then(apiKey => {
                this.API_KEY = apiKey;
                this.openAi = createOpenAIApi(apiKey);
            })
            .catch(error => {
                console.log(error);
            });

        this.initialiseContext();
        this.startNewConversation();
    },
    computed: {
        displayedMessages() {
            const messages = this.$store.getters.displayedMessages;

            return messages.map(message => ({
                ...message,
                sender: message.metadata.sender || 'unknown',
            }));
        },

        isNotSubscribed() {
            return !this.$store.state.user || this.$store.state.user.isSubscribed !== true;
        },

        isTokenLimitExceeded() {
            return (
                this.$store.state.user &&
                this.$store.state.user.isSubscribed &&
                this.$store.state.tokenLimit !== Number.POSITIVE_INFINITY &&
                this.$store.state.tokensUsed >= this.$store.state.tokenLimit
            );
        },

        isMessageLimitReached() {
            const userMessages = this.$store.getters.displayedMessages.filter(
                (message) => message.metadata.sender === "user"
            );
            return this.isNotSubscribed && userMessages.length >= 1;
        }
    },

    methods: {
        async startNewConversation() {
            this.clearContext();
            await this.$store.dispatch('startNewConversation');
            this.conversationId = this.$store.state.activeConversationId;
        },

        async selectConversation(conversationId) {
            this.changingConversations = true;
            console.log('Selecting conversation:', conversationId);

            try {
                await this.$store.dispatch('fetchConversation', conversationId);
                this.$store.commit('setActiveConversation', conversationId);
            } finally {
                this.changingConversations = false;
            }
        },

        clearContext() {
            this.$store.commit('clearContext');
            this.$store.commit('setSelectedConversation', []);
        },

        initialiseContext() {
            if (!this.$store.state.user) {
                this.clearContext();
                return;
            }

            // If the user has no conversations, clear the context
            const currentUserConversations = this.$store.state.chatHistory.some(
                conversation => conversation.userId === this.$store.state.user._id
            );

            if (!currentUserConversations) {
                this.clearContext();
            }
        },

        async sendApiStreamingRequest(apiKey, model, messages, onEvent, temperature = 0.7) {
            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        stream: true,
                        temperature,
                    }),
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                async function read() {
                    const {
                        done,
                        value
                    } = await reader.read();
                    if (done) return;
                    buffer += decoder.decode(value, {
                        stream: true
                    });
                    const start = buffer.indexOf("data:");
                    const end = buffer.indexOf("\n\n", start);
                    if (end === -1) return read();

                    const event = JSON.parse(buffer.slice(start + 5, end).trim());
                    buffer = buffer.slice(end + 2);
                    onEvent(event);
                    return read();
                }

                await read();
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        },

        async handleStreamedEvents(messages) {
            try {
                await this.sendApiStreamingRequest(this.API_KEY, this.model, messages, (event) => {
                    console.log(event);
                    const text = event.choices[0].delta?.content || "";
                    this.streamingText += text;
                    this.chunkCounter += 1;
                });
            } catch (error) {
                console.error("Error handling streamed events:", error);
            }
        },

        async submitMessage(fromBlogPost = false) {
            if (!this.openAi || !this.inputText) {
                return;
            }
            
            let modelInput = this.inputText;
            this.inputText = '';
            this.adjustTextareaHeight();

            if (!fromBlogPost) {
                const message = {
                    id: this.$store.state.messages.length + 1,
                    message: modelInput,
                    metadata: {
                        sender: 'user'
                    }
                };
                this.$store.commit('addMessage', message);
                modelInput = this.$store.getters.displayedMessages.map(message => message.message).join('\n');
            }

            try {
                const messages = [{
                        role: 'system',
                        name: 'system_instructions',
                        content: 'You are a helpful chatbot.'
                    },
                    {
                        role: 'user',
                        name: 'user_instructions',
                        content: modelInput
                    }
                ];
                await this.handleStreamedEvents(messages, (event) => {});
            } catch (error) {
                console.error("Error handling streamed events:", error);
            }

            this.addChatbotResponse(this.streamingText);
            this.updateTokensAndUsage(Math.round(this.chunkCounter + 1 + modelInput.split(' ').length * 0.75));
            this.$store.dispatch("updateConversation", this.$store.state.activeConversationId);

            if (this.$store.state.user.isSubscribed) {
                if (this.$store.state.user.showTokenModal) {
                    this.showModal = true;
                }
            }

        },

        updateTokensAndUsage(tokens) {
            if (!this.$store.state.user || !this.$store.state.user.isSubscribed) {
                return;
            }
            getAndStoreUserDetails(this.$store.state.user.email, this.$store);
            updateTokensUsed(this.$store.state.user.email, tokens);
            sendUsageReport(this.$store.state.user.customerId, this.$store.state.user.subscriptionItemId, tokens);
        },

        addChatbotResponse(response) {
            this.$store.commit('addMessage', {
                message: response,
                metadata: {
                    sender: 'chatbot'
                },
            });

            this.streamingText = "";

            this.$nextTick(() => {
                this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
            });
        },

        handleKeyDown(event) {
            if (event.shiftKey && event.key === 'Enter') {
                // Add a newline character
                this.inputText += '\n';
                event.preventDefault();
                this.adjustTextareaHeight();
            } else if (event.key === 'Enter') {
                // Submit the message
                this.submitMessage();
                event.preventDefault();
            }
        },

        adjustTextareaHeight() {
            // Adjust the height of the textarea to fit the content
            const textarea = this.$refs.inputTextarea;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        },

        async submitBlogPost(modelInput) {
            this.inputText = modelInput;
            this.blogPost = true;
            await this.startNewConversation();
            // submit message with fromBlogPost = true
            await this.submitMessage(true);
            this.inputText = '';
        },
    },
}
</script>

<style scoped>
.header {
    text-align: center;
}

.openai-chat {
    display: flex;
    height: 100%;
    padding: 1rem 0;
}

.current-chat {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 4rem;
}

.chat-message {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 0.5rem;
    margin-left: 2rem;
    white-space: pre-wrap;
}

.chatbot-message .chat-message-content {
    background-color: #f5f5f5;
    color: #333;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin-right: auto;
}

.user-message .chat-message-content {
    background-color: #007bff;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin-left: auto;
}

.chat-message-content {
    display: inline-block;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin-left: 0.5rem;
    margin-right: 2rem;
    max-width: 70%;
}

.loading {
    display: flex;
    background-color: #f5f5f5;
    color: #333;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    margin-right: 2.5rem;
    max-width: 4rem;
    margin-left: 2.5rem;
    padding: 0.5rem 1rem;
}

.chat-input {
    display: flex;
    align-items: center;
    margin: 1rem;
    position: fixed;
    bottom: 0;
    width:55%
}

.chat-input textarea {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 2rem;
    padding: 1.1rem;
    font-size: medium;
    font-family: inherit;
    margin-left: 0.5rem;
    padding-right: 2rem;
    resize: none;
    /* Disable resizing */
    overflow-wrap: break-word;
    /* Break long words/URLs */
}

.chat-input textarea:focus {
    outline: none;
}

.chat-input button {
    background-image: linear-gradient(0deg, #498563,#0a3c2a);
    margin-left: -3rem;
    padding: 0.25rem;
    height: 3.8rem;
    border: 2px solid #2b7740;
}

.chat-input button:focus {
    outline: none;
}

.loading-bar {
    width: 6px;
    height: 6px;
    margin: 0 2px;
    border-radius: 4px;
    background-color: #333;
    animation: loading 1s ease-in-out infinite;
}

@keyframes loading {
    0% {
        opacity: .2;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: .2;
    }
}

.copy-button-chatbot {
    right: -3rem !important;
    background-color: #555 !important;
}

@media (max-width: 768px) {
    .openai-chat {
        padding: 1rem 0rem;
        flex-direction: column;
    }

    .current-chat {
        margin-bottom: 6rem;
    }

    button {
        padding: 1rem;
    }

    .chat-input {
        right: 0;
        width: 100%;
        padding: 0 1rem;
    }

    .chat-input input {
        flex: 1;
        padding: 1.1rem 1rem;
        font-size: medium;
    }

    .chat-message {
        margin-left: 0rem;
        margin-right: 0rem;
    }

    #clear {
        padding: 0.5rem 0.5rem;
    }

    .chat-messages {
        padding: 0.5rem;
        margin-left: 0rem;
    }

    .openai-chat {
        padding: 0;
    }

    .chat-message-content {
        margin-right: 0;
        max-width: 80%;
    }

    .loading {
        margin-left: 0.5rem;
    }


}
</style>
