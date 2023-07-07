<template>
    <div class="login-page">
        <div class="login-overlay-2"></div>
        <div class="login-overlay"></div>
        <div class="form-container">
            <div class="overlay"></div>
            <div v-if="existingUser">
                <form class="login-form" @submit.prevent="login" v-if="existingUser">
                    <h2>Log In</h2>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email"
                            required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" v-model="password"
                            placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Log In</button>
                    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                </form>
            </div>
            <div v-if="!existingUser">
                <form class="signup-form" @submit.prevent="signup">
                    <h2>Sign Up</h2>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" v-model="name" placeholder="Enter name"
                            required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="email" v-model="email" placeholder="Enter email"
                            required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" v-model="password"
                            placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
                    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                </form>
            </div>
            <div class="existing-user" v-if="existingUser">
                <p>Don't have an account? <a href="#" @click.prevent="showSignupForm">Sign up</a></p>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "LoginView",
    data() {
        return {
            name: "",
            email: "",
            password: "",
            existingUser: true,
            successMessage: "",
            errorMessage: ""
        };
    },
    methods: {
        showSignupForm() {
            this.existingUser = false;
            this.errorMessage = "";
        },
        async login() {
            try {
                const response = await axios.post("/login", {
                    email: this.email,
                    password: this.password
                });
                console.log("Logging in:");
                console.log(response.data.user);
                this.$store.commit("setUser", response.data.user);
                this.$store.commit("clearContext");
                this.$store.commit("setChatHistory", []);
                this.$store.state.activeConversationId = "";
                this.$router.push("/chat");
            }
            catch (error) {
                console.log(error.response.data);
                const errorCode = error.response.status;
                switch (errorCode) {
                    case 400:
                        this.errorMessage = "Invalid email or password. Please try again, or sign up for a new account.";
                        break;
                    case 401:
                        this.errorMessage = "Invalid email or password. Please try again, or sign up for a new account.";
                        break;
                    case 403:
                        this.errorMessage = "Your account has been suspended. Please contact support.";
                        break;
                    case 404:
                        this.errorMessage = "User not found. Please check your email and try again.";
                        break;
                    case 500:
                        this.errorMessage = "An error occurred on the server. Please try again later.";
                        break;
                    default:
                        this.errorMessage = "Login failed. Please try again.";
                }
            }
        }
    },
    async signup() {
        try {
            const response = await axios.post("/signup", {
                name: this.name,
                email: this.email,
                password: this.password,
                isSubscribed: false
            });
            console.log(response.data);
            this.successMessage = "Sign up successful 💚";
            setTimeout(() => {
                this.login();
            }, 1000);
        }
        catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            if (error.response.status === 400) {
                this.successMessage = "Email already exists. Please log in to continue.";
            }
        }
    },

}
</script>

<style scoped>
.login-page {
    display: flex;
    width: 100%;
    height: 100vh;
    padding: 1rem;
    justify-content: center;
    align-items: center;
}

.login-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(91.4deg, #000000 14.64%, rgba(0, 0, 0, 0) 34.64%, rgba(0, 0, 0, 0) 61.07%, #000000 74.29%);
    filter: blur(150px);
}

.login-overlay-2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/hero-background.png");
    background-color: black;
    filter: sepia(0.2) saturate(1.2) hue-rotate(10deg);
    background-size: 78%;
    background-position: 0 60%;
    opacity: 0.5;
    filter: blur(50px);
}

.form-container {
    width: 350px;
    text-align: center;
    padding: 1rem;
    position: relative;
}

.form-container .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: hsl(0deg 0% 9.41%);
    border-radius: 50px;
    mix-blend-mode: lighten;
}
.form-group {
    margin-bottom: 1rem;
    text-align: left;
}

.form-control {
    border-radius: 2rem;
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.5rem 0.7rem;
    background-color: #eee;
}

.social-login {
    margin-top: 1rem;
}

.social-login button {
    margin-right: 1rem;
}

.existing-user {
    margin-top: 1rem;
}

.alert {
    margin-top: 1rem;
}

.alert-danger {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
    border-radius: 1rem;
    padding: 0.5rem;
    margin: 1.5rem 4rem;
    font-weight: bold;
    transition: 1s;
}

.alert-success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
    border-radius: 1rem;
    padding: 0.5rem;
    margin: 1.5rem 4rem;
    font-weight: bold;
    transition: 1s;
}

@media (max-width: 768px) {
}</style>
