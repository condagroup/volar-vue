<template>
<div class="modal" v-if="visible">
    <div class="modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>
        <h2>Create Blog Post</h2>
        <form @submit.prevent="createBlogPost" novalidate>
            <div class="input-container">
                <label for="profession">Your Profession:</label>
                <input type="text" id="profession" v-model="profession" :class="{ 'input-error': showError }" />
                <p v-if="professionError && showError" class="error">{{ professionError }}</p>
            </div>
            <div class="input-container">
                <label for="topic">Topic:</label>
                <input type="text" id="topic" v-model="topic" :class="{ 'input-error': showError }" />
                <p v-if="topicError && showError" class="error">{{ topicError }}</p>
            </div>
            <div class="input-container">
                <label for="free-text-prompt">Custom prompt:</label>
                <div class="textarea-wrapper">
                    <textarea id="free-text-prompt" v-model="freeTextPrompt" rows="1" placeholder="Require something specific? Add it in here."></textarea>
                    <save-button @save="saveCustomPrompt"></save-button>
                </div>
            </div>
            <div class="input-container">
                <label for="style">Style:</label>
                <select id="style" v-model="style" :class="{ 'input-error': showError }">
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="academic">Academic</option>
                </select>
                <p v-if="styleError && showError" class="error">{{ styleError }}</p>
            </div>
            <div class="input-container">
                <label for="wordCount">Word Count:</label>
                <input type="number" id="wordCount" v-model="wordCount" :class="{ 'input-error': showError }" />
                <p v-if="wordCountError && showError" class="error">{{ wordCountError }}</p>
            </div>
            <div class="input-container">
                <label for="audience">Target Audience:</label>
                <input type="text" id="audience" v-model="audience" :class="{ 'input-error': showError }" />
                <p v-if="audienceError && showError" class="error">{{ audienceError }}</p>
            </div>
            <div class="input-container" v-if="savedBlogPostPrompt.length > 0">
                <label for="saved-prompts">Saved Prompts:</label>
                <select id="saved-prompts" v-model="selectedPrompt" @change="loadSavedPrompt">
                    <option value="" disabled>Select a saved prompt here.</option>
                    <option v-for="(prompt, index) in savedBlogPostPrompt" :key="index" :value="index">{{ prompt.freeTextPrompt }}</option>
                </select>
            </div>
            <button type="submit" class="save-btn">Create</button>
        </form>
    </div>
</div>
</template>

<script>
import SaveButton from "@/components/SaveButton.vue";

export default {
    name: "BlogPostModal",
    components: {
        SaveButton,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        savedBlogPostPrompt: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            profession: "",
            topic: "",
            wordCount: "",
            audience: "",
            style: "",
            showError: false,
            freeTextPrompt: "",
            selectedPrompt: "",
        };
    },
    computed: {
        professionError() {
            return this.profession.trim() === "" ? "Profession required." : "";
        },
        topicError() {
            return this.topic.trim() === "" ? "Topic required." : "";
        },
        wordCountError() {
            return this.wordCount === "" ?
                "word count is required." :
                isNaN(this.wordCount) || this.wordCount <= 0 ?
                "Invalid word count. Please enter a positive number." :
                "";
        },
        audienceError() {
            return this.audience.trim() === "" ? "Target audience required." : "";
        },
        isFormValid() {
            return !this.professionError && !this.topicError && !this.wordCountError && !this.audienceError;
        },
    },
    methods: {
        createBlogPost() {
            this.showError = true;
            if (!this.isFormValid) {
                return;
            }
            this.$emit("create-blog-post", {
                profession: this.profession,
                topic: this.topic,
                wordCount: this.wordCount,
                audience: this.audience,
                style: this.style,
                freeTextPrompt: this.freeTextPrompt,
            });
        },
        getOptions() {
            return {
                profession: this.profession,
                topic: this.topic,
                wordCount: this.wordCount,
                audience: this.audience,
                style: this.style,
                freeTextPrompt: this.freeTextPrompt,
            };
        },
        saveOptions() {
            this.$emit("save-options", this.getOptions());
            console.log("Options saved");
            console.log(this.getOptions());
            this.closeModal();
        },
        saveCustomPrompt() {
            this.$store.dispatch("saveBlogPostPrompt", this.getOptions());
            console.log("Custom prompt saved");
        },
        loadSavedPrompt() {
            if (this.selectedPrompt !== "") {
                const prompt = this.savedBlogPostPrompt[this.selectedPrompt];
                this.profession = prompt.profession;
                this.topic = prompt.topic;
                this.wordCount = prompt.wordCount;
                this.audience = prompt.audience;
                this.style = prompt.style;
                this.freeTextPrompt = prompt.freeTextPrompt;
            }
        },
        closeModal() {
            this.$emit("close-modal");
        },
    },
};
</script>

<style scoped>
h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #333;
    margin: 15% auto;
    padding: 1rem;
    border: 1px solid #888;
    width: 50%;
    border-radius: 1rem;
    border: 2px solid #60d581;
    display: flex;
    flex-direction: column;
}

.input-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    align-items: center;
}

label {
    flex: 1;
    font-size: 1rem;
}

input,
select,
textarea {
    flex: 2;
    border-radius: 0.3rem;
    padding: 0.1rem 0.2rem;
    background-color: #575757;
    color: #fff;
    border: 1px solid #7f7f7f;
    width: 100%;
    font-size: 0.9rem;
}

input,
select {
    margin: 0 1rem;
}

.textarea-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 2;
    margin-right: 1rem;
}

textarea {
    font-family: inherit;
    font-size: 0.9rem;
    padding: 0.1rem 0.2rem;
    margin-right: 1rem;
    margin-left: 0.5rem;
    width: calc(100% - 1rem);
    /* subtract the save button's margin */
}

textarea::placeholder {
    color: rgb(154, 154, 154);
}

.input-error {
    border-color: red;
}

.error {
    color: red;
    flex: 1;
    margin-left: 1rem;
}

.save-btn {
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
    width: 100px;
}

.save-btn:hover {
    background-color: #ddd;
}

.save-prompt-btn {
    padding: 0.5rem;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    z-index: 2;
}

.close-btn:hover,
.close-btn:focus {
    color: #666;
    text-decoration: none;
    cursor: pointer;
}

@media screen and (max-width: 700px) {
    .modal-content {
        width: 90%;
    }
}
</style>
