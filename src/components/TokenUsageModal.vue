<template>
<div v-if="showModal" class="token-usage-modal">
    <div class="token-usage-modal-content">
        <span class="close" @click="toggleTokenUsageModal">&times;</span>
        <p>
            Please note that each message sent in a conversation passes all prior
            messages to the GPT model, which may result in excessive token costs. To
            minimize token usage, we recommend starting a new conversation for each
            new topic you'd like to discuss.
        </p>
        <button class="dont-show-again-btn" @click="dontShowMeAgain">Don't Show Me Again</button>
    </div>
</div>
</template>

  
  
<script>
import {
    dontShowTokenModalAgain,
} from '@/api/api';

export default {
    name: 'TokenUsageModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        isSubscribedUserWithOneMessage() {
            const userMessages = this.$store.getters.displayedMessages.filter(
                (message) => message.metadata.sender === "user"
            );
            return !this.isNotSubscribed && userMessages.length === 1;
        },
    },
    methods: {
        toggleTokenUsageModal() {
            this.showModal = !this.showModal;
        },
        dontShowMeAgain() {
            dontShowTokenModalAgain(this.$store);
            this.toggleTokenUsageModal();
        },
    },
};
</script>

<style scoped>
.token-usage-modal {
    position: relative;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;
    overflow: auto;
}

.token-usage-modal-content {
    background-color: #333;
    margin-top: 2rem;
    margin-left: 15%;
    margin-right: 15%;
    padding: 1rem;
    border: 1px solid #888;
    width: 80%;
    border-radius: 1rem;
    border: 2px solid #60d581;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    z-index: 2;
    margin: -0.5rem 0.4rem 0 3rem;
}

.close:hover,
.close:focus {
    color: #666;
    text-decoration: none;
    cursor: pointer;
}

.dont-show-again-btn {
    background-color: #f1f1f1;
    color: #333;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    margin: 1rem 0 0 0;
    margin-bottom: 0.3rem;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease-in-out;
}

.dont-show-again-btn:hover {
    background-color: #ddd;
}

@media screen and (max-width: 700px) {
    .token-usage-modal-content {
        width: 90%;
    }
}
</style>
