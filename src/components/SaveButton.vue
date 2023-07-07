<template>
<div :class="{ 'save-container': true, 'saved': saved }" @click="showSaved()">
    <icon-save v-if="!saved" class="save-icon"></icon-save>
    <span v-else>Saved!</span>
</div>
</template>
    
<script>
import IconSave from "@/components/icons/IconSave.vue";

export default {
    name: "SaveButton",
    components: {
        IconSave,
    },
    props: {
        textTosave: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            saved: false,
        };
    },
    methods: {
        showSaved() {
            this.saved = true;
            this.$emit('save')
            setTimeout(() => {
                this.saved = false;
            }, 2000);
        },
    },
};
</script>
    
    
<style>
.save-container {
    background-color: #138a73;
    border: none;
    color: white;
    font-weight: bold;
    padding-top: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
}

.save-container:hover {
    background-color: #0e6949;
}

.save-container span {
    display: none;
}

.save-container.saved {
    width: 5rem;
}

.save-container.saved span {
    display: block;
    font-size: 0.9rem;
    padding-bottom: 0.32rem;
    margin-top: -0.25rem;
}

.save-icon {
    width: 1rem;
    height: 1rem;
}
</style>
