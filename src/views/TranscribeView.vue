<template>
    <div class="main-content">
        <div class="container">
            <div class="transcription-uploader">
                <div v-if="isNotSubscribed">
                    <h3 class="subscribe-header">
                        <router-link to="/subscribe"><a>Subscribe</a></router-link> to transcribe and summarise anything -
                        and
                        pay only for what you use.
                    </h3>
                </div>

                <div class="dropzone"
                    title="Supported file types include audio (mp3, m4a, wav, aac) and video (mp4, mov, mkv, avi)."
                    @dragover.prevent @dragleave.prevent @drop.prevent="upload" :disabled="isNotSubscribed">
                    <input type="file" ref="fileInput" @change="upload" accept="audio/mp3" class="file-input"
                        :disabled="isNotSubscribed" />
                    <div v-if="loading" class="loading-spinner"></div>
                    <div v-else>
                        <div v-if="!isNotSubscribed">
                            <p> {{ dropzoneText }} </p>
                        </div>
                    </div>
                </div>

                <div class="checkbox-container">
                    <div class="checkbox-check-container">
                        <label for="summarize-checkbox" class="custom-checkbox">
                            <input class="summarize-checkbox" type="checkbox" id="summarize-checkbox"
                                v-model="summarizeTranscript" />
                            <span class="checkmark"></span>
                        </label>
                        <label class="summarize-checkbox-label" for="summarize-checkbox">Summarise Transcript</label>
                    </div>
                    <button @click="showSummarizerOptions" class="modal-btn modal-btn-primary">Options</button>
                </div>

                <summarizer-options-modal ref="summarizerOptionsModal" :visible="summarizerOptionsVisible"
                    :savedSummaryPrompt="$store.state.user.savedSummaryPrompt" @save-options="saveSummarizerOptions"
                    @close-modal="closeModal" />

                <div class="grid-layout">
                    <div class="grid-section">
                        <h3 class="grid-section-heading">Transcription</h3>
                        <div v-if="loading" class="loading-spinner"></div>
                        <div v-else>
                            <p class="align-left">{{ transcription }}</p>
                        </div>
                        <CopyButton :textToCopy="transcription" />
                    </div>
                    <div class="grid-section">
                        <h3 class="grid-section-heading">Summary</h3>
                        <div v-if="summarizing" class="loading-spinner"></div>
                        <div v-else>
                            <p class="align-left">{{ summary }}</p>
                        </div>
                        <CopyButton :textToCopy="summary" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CopyButton from "@/components/CopyButton.vue";
import SummarizerOptionsModal from "@/components/SummarizerOptionsModal.vue";
import axios from "axios";
import {
    createFFmpeg,
    fetchFile
} from "@ffmpeg/ffmpeg";
import {
    getApiKey,
    createOpenAIApi,
    getAndStoreUserDetails,
    updateTokensUsed,
    sendUsageReport,
} from '@/api/api';

export default {
    components: {
        CopyButton,
        SummarizerOptionsModal,
    },
    data() {
        return {
            transcription: "",
            summary: "",
            loading: false,
            summarizing: false,
            sessionTokensUsed: 0,
            tokensUsed: 0,
            openAi: null,
            taskId: null,
            taskCheckInterval: null,
            summarizeTranscript: true,
            summarizerOptionsVisible: false,
            summarizerOptions: {},
        };
    },
    mounted() {
        getApiKey()
            .then(apiKey => {
                this.openAi = createOpenAIApi(apiKey);
            })
            .catch(error => {
                console.log(error);
            });
    },
    computed: {
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

        dropzoneText() {
            if (this.isNotSubscribed) {
                return 'Subscribe to access this functionality.';
            } else if (this.isTokenLimitExceeded) {
                return 'Token limit exceeded. Please update your Profile page if you wish to continue.';
            } else {
                return 'Drag and drop a file here to have it transcribed.';
            }
        },
    },
    methods: {
        async upload(event) {
            if (this.isNotSubscribed) {
                return;
            }
            event.preventDefault();
            this.loading = true;
            const file = event.dataTransfer?.files[0] || event.target.files[0];
            if (file) {
                try {
                    console.log("Uploading file:", file);

                    // Convert the file to MP3
                    const mp3Blob = await this.convertFileToMp3(file);
                    const mp3File = new File([mp3Blob], file.name.replace(/\.[^.]+$/, ".mp3"), {
                        type: "audio/mp3"
                    });

                    // Console log filesize
                    const fileSize = mp3File.size / 1000000;
                    console.log("File size:", fileSize, "MB");

                    // Upload the converted file
                    const formData = new FormData();
                    formData.append("file", mp3File);
                    const response = await axios.post("/api/transcribe", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        maxBodyLength: Infinity,
                        maxContentLength: Infinity,
                    });
                    this.taskId = response.data.taskId;
                    console.log("Task ID:", this.taskId);

                    // Start polling task status
                    this.taskCheckInterval = setInterval(this.checkTaskStatus, 5000);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            }
        },

        async convertFileToMp3(file) {
            const ffmpeg = createFFmpeg({
                log: true
            });
            await ffmpeg.load();

            // Read the input file
            ffmpeg.FS("writeFile", file.name, await fetchFile(file));

            // Check if the file is a video
            const supportedVideoExtensions = [".mp4", ".avi", ".mov", ".mkv", ".flv", ".webm"];
            const ext = file.name.split('.').pop().toLowerCase();
            const isVideo = supportedVideoExtensions.includes(`.${ext}`);

            // Convert the file to MP3
            if (isVideo) {
                await ffmpeg.run("-i", file.name, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", "output.mp3");
            } else {
                await ffmpeg.run("-i", file.name, "output.mp3");
            }

            // Read the output file
            const data = ffmpeg.FS("readFile", "output.mp3");

            // Create a blob from the output data
            const mp3Blob = new Blob([data.buffer], {
                type: "audio/mp3"
            });

            // Remove the input and output files from the FFmpeg filesystem
            ffmpeg.FS("unlink", file.name);
            ffmpeg.FS("unlink", "output.mp3");

            return mp3Blob;
        },

        async checkTaskStatus() {
            try {
                const response = await axios.get(`/api/transcribe/status/${this.taskId}`);
                const task = response.data;
                console.log("Task status:", task.status);
                console.log("Task:", task);

                if (task.status === "completed") {
                    clearInterval(this.taskCheckInterval);
                    this.transcription = task.result.text;
                    this.loading = false;

                    if (this.transcription && this.summarizeTranscript) {
                        this.summarizing = true;
                        await this.summarizeTranscription(this.transcription);
                        this.summarizing = false;
                    }
                } else if (task.status === "error") {
                    clearInterval(this.taskCheckInterval);
                    this.loading = false;
                    console.error("Error processing task:", task);
                } else {
                    console.log("Task still processing...");
                }
            } catch (error) {
                console.error("Error checking task status:", error);
            }
        },

        async summarizeTranscription(transcription) {
            try {
                const result = await this.summarizeText(transcription, this.summarizerOptions);
                const {
                    summary,
                    tokens_used
                } = result;
                this.summary = summary;
                this.tokensUsed = tokens_used;
                console.log(result);
                this.updateTokensAndUsage(this.tokensUsed);
            } catch (error) {
                console.error("Error summarizing transcription:", error);
            }
        },

        async summarizeText(text, options) {
            const maxLength = 12000;
            const sentences = text.split(". ");
            const parts = [];
            let currentPart = "";

            for (const sentence of sentences) {
                if ((currentPart + sentence).length > maxLength) {
                    parts.push(currentPart);
                    currentPart = "";
                }
                currentPart += sentence + ". ";
            }
            if (currentPart) parts.push(currentPart);

            // Log options
            console.log("Summarizer options:", options);
            let summary = "";
            let tokens_used = 0;
            let completion = null;
            for (const part of parts) {

                let optionsContent = "";
                if (options.summaryFormat) {
                    optionsContent += `Summary format: ${options.summaryFormat}\n`;
                }
                if (options.wordCount) {
                    optionsContent += `Word count: ${options.wordCount}\n`;
                }
                if (options.writingStyle) {
                    optionsContent += `Writing style: ${options.writingStyle}\n`;
                }
                if (options.freeTextPrompt) {
                    optionsContent += `Free text prompt. Pay particular attention to these user preferences: ${options.freeTextPrompt}\n`;
                }

                let systemMessage = "You are an audio transcription summariser. You are provided with a block of transcribed audio, which may contain a summary of the previous section at its beginning. Create a thorough, thoughtful and extremely well-written dot-point summary.";
                if (optionsContent) {
                    systemMessage += `Please adhere to the following user-specified options: \n\n${optionsContent}`;
                }

                completion = await this.openAi.createChatCompletion({
                    model: "gpt-4",
                    messages: [{
                        role: "system",
                        content: systemMessage,
                    },
                    {
                        role: "user",
                        content: `${summary} ${part}`,
                    },
                    ],
                });

                console.log(completion.data);
                summary = completion.data.choices[0].message.content;
                tokens_used += completion.data.usage.total_tokens;

                if (summary.startsWith("Summary:")) {
                    summary = summary.replace("Summary:", "");
                    summary = summary.replace("\n\n", "");
                }

            }
            return {
                summary,
                tokens_used
            };
        },

        updateTokensAndUsage(tokens) {
            if (!this.$store.state.user || !this.$store.state.user.isSubscribed) {
                return;
            }

            getAndStoreUserDetails(this.$store.state.user.email, this.$store);
            updateTokensUsed(this.$store.state.user.email, tokens);
            sendUsageReport(this.$store.state.user.customerId, this.$store.state.user.subscriptionItemId, tokens);
        },

        showSummarizerOptions() {
            this.summarizerOptionsVisible = true;
        },

        saveSummarizerOptions(options) {
            this.summarizerOptions = options;
        },

        closeModal() {
            this.summarizerOptionsVisible = false;
        },

    },
};
</script>

<style scoped>
.subscribe-header {
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-align: center;
}

.transcription-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 1rem 3rem;
}

.dropzone {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 100px;
    border: 2px dashed #60d581;
    border-radius: 5px;
    background-color: #333;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 1rem;
}

.grid-section-heading {
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
}

.file-input {
    display: none;
}

.align-left {
    white-space: pre-wrap;
}

.grid-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    margin-top: 1rem;
    width: 100%;
}

.grid-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #94ae9b;
    padding: 1rem;
    border-radius: 5px;
    min-height: 400px;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #60d581;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.summary-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.checkbox-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    width: 300px;
}

.checkbox-check-container {
    display: flex;
    align-items: center;
}

.custom-checkbox {
    padding-top: 0.3rem;
}

/* Hide the default checkbox */
.custom-checkbox input[type="checkbox"] {
    display: none;
}

/* Create a custom checkbox */
.custom-checkbox .checkmark {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #3f8753;
    border: 1px solid #475645;
    border-radius: 4px;
    margin-top: 0.2rem;
    margin-right: 0.5rem;
}

/* Create the checkmark when the checkbox is checked */
.custom-checkbox input[type="checkbox"]:checked~.checkmark::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 12px;
    border: solid #565656;
    border-width: 0 3px 3px 0;
    top: 3px;
    left: 7px;
    transform: rotate(45deg);
}

/* Change the background color of the custom checkbox when checked */
.custom-checkbox input[type="checkbox"]:checked~.checkmark {
    background-color: #60d581;
    border: none;
}

.modal-btn {
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
    .transcription-uploader {
        padding: 1rem;
    }

    .grid-layout {
        grid-template-columns: 1fr;
    }

    .grid-section {
        min-height: 200px;
    }

    .dropzone {
        width: 100%;
    }

    .checkbox-container {
        width: 100%;
    }
}
</style>
