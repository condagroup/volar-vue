<template>
<div :class="{ 'copy-container': true, 'copied': copied }" @click="copyToClipboard(transcription)">
    <icon-copy v-if="!copied" class="copy-icon"></icon-copy>
    <span v-else>Copied!</span>
</div>
</template>

<script>
import IconCopy from "@/components/icons/IconCopy.vue";

export default {
    name: "CopyButton",
    components: {
        IconCopy,
    },
    props: {
        textToCopy: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            copied: false,
        };
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.textToCopy);
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 2000);
        },
    },
};
</script>

<style>
.copy-container {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background-color: #138a73;
    border: none;
    color: white;
    font-weight: bold;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
}

.copy-container:hover {
    background-color: #0e6949;
}

.copy-container span {
    display: none;
}

.copy-container.copied {
    width: 5rem;
}

.copy-container.copied span {
    display: block;
    font-size: 0.9rem;
    padding-bottom: 0.25rem;
    margin-top: -0.25rem;
}

.copy-icon {
    width: 1rem;
    height: 1rem;
}
</style>
