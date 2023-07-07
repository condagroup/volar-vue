<script setup>
</script>

<template>
    <div id="app">
        <div :class="{ 'onScroll': !view.topOfPage, 'navbar': true, 'container':true }">
            <div id="nav-container">
                <div id="nav-logo">
                    <router-link to="/" class="nav-logo">
                        <span>🦾&nbsp;</span><span class="nav-logo-text">Volar</span>
                    </router-link>
                </div>
                <div id="nav">
                    <router-link v-if=" !$store.state.user " to="/login">Login</router-link>
                    <router-link v-if=" $store.state.user " to="/profile">Profile</router-link>
                    <router-link to="/chat">Chat</router-link>
                    <router-link to="/transcribe">Scribe</router-link>
                    <router-link to="/about">About</router-link>
                </div>
            </div>
        </div>
        <div class="content">
            <router-view />
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            view: {
                topOfPage: true
            }
        }
    },
    beforeMount() {
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        logout() {
            this.$store.commit('clearUser');
        },
        handleScroll() {
            if (window.pageYOffset > 0) {
                if (this.view.topOfPage) this.view.topOfPage = false
            } else {
                if (!this.view.topOfPage) this.view.topOfPage = true
            }
        }
    },
}
</script>

<style scoped>
.onScroll {
    background-color: #000;
}

.onScroll #nav-container {
    padding: 1rem 0;
}

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999999;
}

#nav-container {
    display: flex;
    justify-content: space-between;
    padding: 2rem 0;
}

#nav {
    display: flex;
    padding: 12px 0px;
    margin-right: 0.5rem;
}

#nav a {
    font-size: 12px;
    font-weight: 500;
    color: #8D8D8D;
    padding: 3px 10px;
    border-radius: 1rem
}
.onScroll #nav a {
    /* color: #00bd7e; */
    /* background: transparent; */
}

.onScroll #nav a:hover {
    /* color: hsla(160, 100%, 37%, 0.8); */
    /* background: transparent; */
}

#nav a:hover {
    color: #aaa;
    cursor: pointer;
}

#nav a.router-link-exact-active {
    color: #ccc;
}

.nav-logo {
    font-size: 2rem;
    font-weight: bold;
    padding: 0.75rem 0;
    border-radius: 1rem;
}

.nav-logo:hover {
    background-color: transparent;
}

.nav-logo:hover .nav-logo-text {
    color: hsla(160, 100%, 37%, 0.8);
}

.nav-logo-text {
    font-size: 20px;
    font-weight: bold;
}

@media (max-width: 768px) {

    #nav-container {
        padding: 1rem 0;
    }
    .onScroll #nav-container {
    padding: 1rem 0;
}
    .nav-logo-text {
        display: none;
    }

    .nav-logo {
        padding: 0.5rem;
        margin-left: 0rem;
    }
}
</style>
