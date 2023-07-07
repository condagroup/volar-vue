<template>
<div class="sidebar">
    <div class="chat-history">
        <div class="chat-history-heading">
            <h3>Chat History</h3>
            <button class="new-conversation-button" @click="$emit('start-new-conversation')" :disabled="isNotSubscribed">
                +
            </button>
        </div>
        <div v-if="isNotSubscribed">
            <p class="warn">Available for subscribed users.</p>
        </div>
        <div v-else class="conversation-container">
            <div v-if="loadingConversations">
                <div class="loading-white">
                    <p class="loading-bar-white"></p>
                    <p class="loading-bar-white"></p>
                    <p class="loading-bar-white"></p>
                </div>
            </div>
            <div v-if="!loadingConversations" v-for="chat in chatHistory" :key="chat.conversationId" class="history-item" @click="$emit('select-conversation', chat.conversationId)">
                <div class="text">
                    {{ chat.firstUserMessage ? chat.firstUserMessage.message : formatTimestamp(chat.timestamp) }}
                </div>
                <button class="delete-conversation-button" @click.stop="deleteConversation(chat.conversationId)">
                    <IconDelete />
                </button>
            </div>
        </div>
    </div>
    <div class="button-container">
        <button class="modal-btn modal-btn-primary" @click="showBlogPostModal = true" :disabled="isNotSubscribed">
            Blog Post
        </button>
    </div>
    <blog-post-modal :visible="showBlogPostModal" @create-blog-post="handleCreateBlogPost" :savedBlogPostPrompt="getSavedBlogPostPrompt" @close-modal="showBlogPostModal = false"></blog-post-modal>
</div>
</template>

<script>
import IconDelete from "./icons/IconDelete.vue";
import BlogPostModal from "./BlogPostModal.vue";
export default {
    name: "Sidebar",
    components: {
        IconDelete,
        BlogPostModal,
    },
    data() {
        return {
            showBlogPostModal: false,
        };
    },
    props: {
        isNotSubscribed: {
            type: Boolean,
            default: false,
        },
        loadingConversations: {
            type: Boolean,
            default: false,
        },
        chatHistory: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        getSavedBlogPostPrompt() {
            return this.$store.state.user && this.$store.state.user.savedBlogPostPrompt;
        },
    },
    methods: {
        async deleteConversation(conversationId) {
            console.log('Deleting conversation:', conversationId);
            try {
                await this.$store.dispatch('deleteConversation', conversationId);
                this.$emit('conversation-deleted');
            } catch (error) {
                console.error('Error deleting conversation:', error);
            }
        },
        formatTimestamp(timestamp) {
            if (!timestamp) {
                return "";
            }

            const date = new Date(timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
        handleCreateBlogPost(blogPostData) {
            this.showBlogPostModal = false;
            let modelInput = `Please create a blog post about ${blogPostData.topic}, written by a ${blogPostData.profession} in ${blogPostData.style} style. It should be approximately ${blogPostData.length} words long, and be aimed at ${blogPostData.audience}.`;
            if (blogPostData.freeTextPrompt) {
                modelInput += `Pay particular attention to the following user-specified details: ${blogPostData.freeTextPrompt}`;
            }
            this.$emit("submit-blog-post", modelInput);
        },
    },
};
</script>

<style scoped>
.sidebar {
    position: relative;
    width: 20%;
    height: 100%;
    font-size: 0.8rem;
    overflow: hidden;
}

.chat-history {
    overflow-y: auto;
    font-size: 0.8rem;
    min-height: 60vh;
}

.chat-history-heading {
    display: flex;
    justify-content: space-between;
    padding: 0rem 0.5rem;
    margin-right: 3rem;
    margin-top: 0.5rem;
    border-bottom: 1px solid #ccc;
}

.new-conversation-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: #181818;
    border-radius: 50%;
    border: #fff 1px solid;
    color: white;
    font-size: 20px;
    cursor: pointer;
    outline: none;
    margin-right: -3rem;
}

.new-conversation-button:hover {
    background-image: linear-gradient(60deg, #233d33, #1b8a62);
}

.warn {
    padding: 1rem;
}

.history-item {
    padding: 0.5rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.history-item .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    margin-right: 1rem;
}

.delete-conversation-button {
    visibility: hidden;
    opacity: 0;
    float: right;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #888;
    margin-bottom: -0.6rem;
}

.history-item:hover .delete-conversation-button {
    visibility: visible;
    opacity: 1;
}

.delete-conversation-button:hover {
    color: #eee;
}

.history-item:hover {
    cursor: pointer;
    color: #ccc
}

.loading-white {
    display: flex;
    margin: 0.5rem;
    padding: 0.5rem 1rem;
}

.loading-bar-white {
    width: 6px;
    height: 6px;
    margin: 0 2px;
    border-radius: 4px;
    background-color: #fff;
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

/* Button container should be positioned at the bottom of the sidebar */
.button-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-top: 1rem;
    border-top: 1px solid #ccc;
}

.modal-btn {
    margin: 0 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
    border: 2px solid #848484;
}

.modal-btn-primary {
    background-color: #333333;
    color: #fff;
}

.modal-btn-primary:hover {
    background-color: #606060;
    color: #fff;
}

.modal-btn-primary:focus {
    box-shadow: none;
    outline: none;
}

.modal-btn-primary:disabled {
    background-image: linear-gradient(60deg, #757575, #a2a2a2);
    border-color: #ccc;
    cursor: not-allowed;
}

@media (max-width: 768px) {

    .sidebar {
        width: 100%;
        margin-bottom: 1rem;
        max-height: 200px;
        overflow-y: auto;
        min-height: 0;
    }

    .conversation-container {
        overflow-y: scroll;
        max-height: 80px;
    }

    .delete-conversation-button {
        visibility: visible;
        opacity: 1;
    }

}
</style>
