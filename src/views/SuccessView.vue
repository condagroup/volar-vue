<template>
<div class="main-content success-container">
    <h1>Subscription Successful</h1>
    <div class="p-box">
        <p>You are now subscribed!</p>
        <p>A charge for the number of GPT tokens used will be initiated by Stripe at the end of your first month.</p>
        <p>Thank you for supporting our work 💚</p>
    </div>
    <button class="btn-primary" @click="goToChat">Get Started</button>
</div>
</template>

<script>
export default {
    name: 'Success',
    methods: {
        goToChat() {
            this.$router.push('/chat');
        },
    },
};
</script>

<style scoped>
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
}

h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #19BC9B;
}

p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

.p-box {
    margin-bottom: 2rem;
}
</style>
