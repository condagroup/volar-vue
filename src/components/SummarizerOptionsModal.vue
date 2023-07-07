<template>
<div class="modal" v-if="visible">
    <div class="modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>
        <h2>Summariser Options</h2>
        <form novalidate>
            <div class="input-container">
                <label for="summary-format">Summary format:</label>
                <select id="summary-format" v-model="summaryFormat">
                    <option value="Write the summary as meeting notes with a list of key actions beneath.">Meeting notes with key actions</option>
                    <option value="Write the summary as a training document for allied health staff. Take key points and put them under specific steps to create a process document.">Training document</option>
                    <option value="Write the summary as a todo list.">Todo / task list</option>
                    <option value="Write the summary as a blog post for a physiotherapy clinic.">Blog post</option>
                </select>
            </div>
            <div class="input-container">
                <label for="free-text-prompt">Custom prompt:</label>
                <div class="textarea-wrapper">
                    <textarea id="free-text-prompt" v-model="freeTextPrompt" rows="1" placeholder="Require something specific? Add it in here."></textarea>
                    <save-button @save="saveCustomPrompt"></save-button>
                </div>
            </div>
            <div class="input-container">
                <label for="word-count">Word count:</label>
                <input type="number" id="word-count" v-model="wordCount" />
            </div>
            <div class="input-container">
                <label for="writing-style">Writing style:</label>
                <select id="writing-style" v-model="writingStyle">
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="assertive">Assertive</option>
                    <option value="empathetic">Empathetic</option>
                </select>
            </div>
            <div class="input-container" v-if="savedSummaryPrompt.length > 0">
                <label for="saved-prompts">Saved Prompts:</label>
                <select id="saved-prompts" v-model="selectedPrompt" @change="loadSavedPrompt">
                    <option value="" disabled>Select a saved prompt here.</option>
                    <option v-for="(prompt, index) in savedSummaryPrompt" :key="index" :value="index">{{ prompt.freeTextPrompt }}</option>
                </select>
            </div>
            <button class="save-btn" @click="saveOptions">Save</button>
        </form>
    </div>
</div>
</template>

<script>
import SaveButton from "@/components/SaveButton.vue";

export default {
    name: "SummarizerOptionsModal",
    components: {
        SaveButton,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        savedSummaryPrompt: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            summaryFormat: "",
            freeTextPrompt: "",
            wordCount: "",
            writingStyle: "",
            selectedPrompt: "",
        };
    },
    methods: {
        getOptions() {
            return {
                summaryFormat: this.summaryFormat,
                freeTextPrompt: this.freeTextPrompt,
                wordCount: this.wordCount,
                writingStyle: this.writingStyle,
            };
        },
        saveOptions() {
            this.$emit("save-options", this.getOptions());
            console.log("Options saved");
            console.log(this.getOptions());
            this.closeModal();
        },
        saveCustomPrompt() {
            this.$store.dispatch("saveSummaryPrompt", this.getOptions());
            console.log("Custom prompt saved");
        },
        loadSavedPrompt() {
            if (this.selectedPrompt !== "") {
                const prompt = this.savedSummaryPrompt[this.selectedPrompt];
                this.summaryFormat = prompt.summaryFormat;
                this.freeTextPrompt = prompt.freeTextPrompt;
                this.wordCount = prompt.wordCount;
                this.writingStyle = prompt.writingStyle;
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
    font-size: 1rem;
}

label {
    flex: 1;
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
    font-size: 0.8rem;
    padding: 0.1rem;
    margin-right: 1rem;
    margin-left: 0.5rem;
    width: calc(100% - 1rem); /* subtract the save button's margin */
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
