<template>
    <div class="main-content">
        <div class="container">
            <div class="profile-page">
                <h1>Profile</h1>
                <div class="tokens-info">
                    <h2>Hi, <span class="user-name">{{ this.$store.state.user.name }}</span></h2>
                    <div class="info-row">
                        <p>Total tokens used this month:</p>
                        <p class="tokens-used">{{ this.$store.state.tokensUsed }}</p>
                    </div>
                    <loading v-if="tokenNumbersLoading" />
                    <div class="info-row">
                        <p>Charge due next cycle:</p>
                        <p class="charge-due">${{ this.$store.state.chargeDue }}</p>
                    </div>
                    <div class="info-row" v-if="this.$store.state.user.isSubscribed">
                        <p>Current monthly token limit:</p>
                        <p class="token-limit">{{ displayedTokenLimit }}</p>
                    </div>
                </div>
                <p v-if="!this.$store.state.user.isSubscribed"> These values will be available once your subscription is
                    active.
                </p>
                <div v-if="this.$store.state.user.isSubscribed">
                    <p>
                        Set maximum tokens per month:
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" value="1000" v-model="selectedOption" />
                            <span></span> 1k
                        </label>
                        <label class="radio-option">
                            <input type="radio" value="10000" v-model="selectedOption" />
                            <span></span> 10k
                        </label>
                        <label class="radio-option">
                            <input type="radio" value="100000" v-model="selectedOption" />
                            <span></span> 100k
                        </label>
                        <label class="radio-option">
                            <input type="radio" value="custom" v-model="selectedOption" />
                            <span></span> Custom: <input class="manual" v-model="maxTokens" type="number" min="0"
                                :readonly="selectedOption !== 'custom'" />
                        </label>
                    </div>
                    </p>
                </div>

                <div class="buttons-container">
                    <button v-if="!this.$store.state.user.isSubscribed" class="btn btn-primary"
                        @click="subcribe">Subscribe</button>
                    <button v-if="this.$store.state.user.isSubscribed" class="btn btn-primary" @click="setMaxTokens">Save
                        Token
                        Limit</button>
                    <button class="btn btn-primary" @click="logout">Logout</button>
                </div>

                <div v-if="this.$store.state.user.isSubscribed" class="tokens-info">
                    <p class="billing-details">Cancel subscription / update billing details:</p>
                    <div class="buttons-container">
                        <button v-if="this.$store.state.user.isSubscribed" @click="toStripeBilling"
                            class="btn btn-primary">Stripe Customer Portal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import loading from '../components/loading.vue';

export default {
    name: 'ProfilePage',
    components: {
        loading,
    },
    data() {
        return {
            tokensUsed: '',
            chargeDue: '',
            maxTokens: '',
            selectedOption: '',
            tokenLimit: '',
        };
    },
    async created() {
        await this.$store.dispatch('fetchTokensInfo', this.$store.state.user.email);
    },
    computed: {
        tokenNumbersLoading() {
            return this.$store.state.tokenNumbersLoading;
        },
        displayedTokenLimit() {
            return this.$store.state.tokenLimit === Number.POSITIVE_INFINITY
                ? 'Unlimited'
                : this.$store.state.tokenLimit;
        },
    },
    methods: {
        logout() {
            this.$store.commit('clearUser');
            this.$router.push('/');
        },
        subcribe() {
            this.$router.push('/subscribe');
        },
        async setMaxTokens() {
            try {
                const userEmail = this.$store.state.user.email;
                const response = await axios.post('/api/set-max-tokens', {
                    email: userEmail,
                    maxTokens: this.maxTokens,
                });

                if (response.data.success) {
                    alert('Token Limit updated successfully.');
                } else {
                    console.error('Error updating max tokens');
                }
            } catch (error) {
                console.error('Error updating max tokens:', error);
            }
            this.$store.dispatch('fetchTokensInfo', this.$store.state.user.email);
        },
        toStripeBilling() {
            const userEmail = encodeURIComponent(this.$store.state.user.email);
            window.location.href = `https://billing.stripe.com/p/login/6oEeW30155ci7du8ww?prefilled_email=${userEmail}`;
        }
    },
    watch: {
        selectedOption(newVal, oldVal) {
            this.maxTokens = newVal;
        },
    },
};
</script>

<style scoped>
h1 {
    color: #19BC9B;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
}

h2 {
    margin-bottom: 0.5rem;
}

.profile-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    box-sizing: border-box;
}

.tokens-info {
    margin-top: 1rem;
}

.tokens-info p {
    margin-bottom: 0.5rem;
}

.user-name,
.tokens-used,
.charge-due,
.token-limit {
    font-weight: 500;
    color: #dfdfdf;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin: 2rem 4rem;
}

.radio-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: left;
    margin: 0 1rem;
    margin-top: 1rem;
}

.radio-option {
    display: flex;
    align-items: center;
    margin-right: 16px;
    font-size: 14px;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    display: none;
}

.radio-option span {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #01BD7E;
    border-radius: 50%;
    margin-right: 4px;
    position: relative;
}

.radio-option input[type="radio"]:checked+span {
    background-color: #01BD7E;
}

.radio-option input[type="radio"]:checked+span::after {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background-color: #575757;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.manual {
    width: 100px;
    margin-left: 8px;
    border-radius: 0.3rem;
    padding: 0 0.2rem;
    background-color: #575757;
    color: #fff;
    border: 1px solid #7f7f7f;
}

.buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
}

.billing-details {
    margin-top: 2rem;
    font-weight: bold;
    text-align: center;
    color: #dfdfdf;
}

.btn {
    margin: 0 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 0.3rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #19BC9B;
    color: #fff;
}

.btn-primary:hover {
    background-color: #17a473;
    color: #fff;
}

.btn-primary:focus {
    box-shadow: none;
    outline: none;
}

.btn-primary:disabled {
    background-image: linear-gradient(60deg, #757575, #a2a2a2);
    border-color: #ccc;
    color: #5b5b5b;
    cursor: not-allowed;
}
</style>
