<template>
    <div class="main-content">
        <div class="container">
            <div class="payment-processing">
                <h1>Subscribe</h1>

                <div class="token-info">
                    <p>Welcome to Volar!</p>
                    <p>We charge per GPT token used, where each token represents approximately 4 characters of input/output
                        text. This flexible model allows you to use as many or as few tokens as you need for your projects.
                    </p>
                    <p>In your <router-link to="/profile">account</router-link>, you can see details on your cycle token
                        usage,
                        current balance, and set a limit for the next cycle if you wish. </p>
                    <p>Our token-based pricing is unique compared to other AI services. You only pay for the tokens you use,
                        with no long-term contracts or commitments. One token costs you only $0.00025, equal to $0.10 for a
                        300-word page of text.</p>
                    <p>Charges will continue on a monthly cycle-to-cycle basis until you cancel your account. If you have
                        any
                        questions or need help getting started, please let us know.</p>
                </div>

                <div class="payment-method">
                    <p>We use <a href="https://stripe.com/">Stripe</a>, a trusted and secure payment processor, to handle
                        your
                        credit or debit card information. Your payment details are encrypted and stored securely, so you can
                        be
                        confident that your information is safe.</p>
                </div>

                <form @submit.prevent="handleSubmit">

                    <label for="card-element">Submit Payment Details</label>
                    <div id="card-element"></div>
                    <div id="card-errors" role="alert"></div>

                    <button class="btn-primary" :disabled="submitting">Subscribe to Volar</button>
                    <div v-if="submitting">
                        <loading class="loader-1" />
                        <loading class="loader-2" />
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {
    loadStripe
} from '@stripe/stripe-js';
import * as axios from 'axios';
import {
    getAndStoreUserDetails,
} from '@/api/api';
import loading from '@/components/loading.vue'

export default {
    name: 'PaymentProcessing',
    components: {
        loading
    },
    data() {
        return {
            stripe: null,
            cardElement: null,
            email: '',
            submitting: false,
        };
    },
    async mounted() {
        const stripePublicKey = 'pk_live_POz0yfeCwPgFfwVm8cp2xdiu';  // Live key
        // const stripePublicKey = 'pk_test_12pRn1lnib3TJdiO5saZkXBF'; // Testing key
        this.stripe = await loadStripe(stripePublicKey);

        const elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            hidePostalCode: true
        });
        this.cardElement.mount('#card-element');

        this.cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    },
    methods: {
        async handleSubmit() {
            this.submitting = true;

            const {
                token,
                error
            } = await this.stripe.createToken(this.cardElement);

            if (error) {
                console.error('Stripe error:', error);
                this.submitting = false;
            } else {
                await this.createCustomerAndSubscription(token);
                getAndStoreUserDetails(this.$store.state.user.email, this.$store);
            }
        },
        async createCustomerAndSubscription(token) {
            try {
                const response = await axios.post('/api/create-customer-and-subscription', {
                    email: this.$store.state.user.email,
                    token: token.id,
                });

                if (response.data.success) {
                    alert('Subscription successful.');
                    this.$router.push('/success');
                } else {
                    alert('Payment failed. Please try again.');
                }
            } catch (error) {
                console.error('API error:', error);
                alert('Payment failed. Please try again.');
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<style scoped>
h1 {
    color: #19BC9B;
    font-weight: bold;
    margin-bottom: 1rem;
}

.loader-1 {
    position: relative;
    right: 10rem;
    bottom: 4rem
}

.loader-2 {
    position: relative;
    left: 10rem;
    bottom: 4.4rem
}

.payment-processing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    margin: 2rem 0;
    padding: 1rem;
    box-sizing: border-box;
}

.token-info {
    margin-bottom: 20px;
    max-width: 600px;
}

.token-info p {
    margin-bottom: 10px;
}

.payment-method {
    margin-bottom: 20px;
    max-width: 600px;
    color: #ffffff;
}

.payment-method p {
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    margin-bottom: 3rem;
}

form label {
    margin-bottom: 1rem;
    font-weight: bold;
}

button {
    margin-bottom: 2rem;
    margin-top: 1rem
}

button:disabled {
    background-color: #ccc;
    border-color: #999;
    color: #666;
    cursor: not-allowed;
}

label {
    margin-bottom: 10px;
    font-weight: bold;
}

#card-element {
    border: 1px solid #bbb;
    width: 100%;
    border-radius: 5px;
    padding: 2rem;
    margin-bottom: 10px;
    background-color: #fff;
}

#card-errors {
    color: #dc3545;
    margin-bottom: 10px;
    font-size: 14px;
}

@media (max-width: 768px) {
    .payment-processing {
        margin: 0;
        overflow: auto;
        justify-content: flex-start;
    }
}</style>
