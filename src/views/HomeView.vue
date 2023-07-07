<template>
    <div class="home-page">
        <HeroSection>
            <div class="container">
                <div class="row-2">
                    <div class="col-md-6 hero-left">
                        <h1>Simplify<br /> Documentation</h1>
                        <h6>Meet your new personal<br /> assistant, Volar.</h6>
                        <div class="btn-group">
                            <button class="btn btn-primary">Communicate</button>
                            <button class="btn btn-primary">Transcribe</button>
                            <button class="btn btn-primary">Summarise</button>
                        </div>
                    </div>
                    <div class="col-md-6 hero-right">
                        <div>
                            <h3>
                                Healthcare Documentation: Better with AI
                            </h3>
                            <p>
                                Whether you need to summarise meetings, organise notes, or write emails - we've got you covered. Discover ways to enhance your practise with our suite of AI-powered tools.
                            </p>
                            <router-link to="/chat">
                                <button class="btn btn-primary">Start a Conversation</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </HeroSection>
        <section class="features-section">
            <div class="features-overlay"></div>
            <div class="gradient-overlay"></div>
            <div class="tablet-bar">
                <TabletBottom style="margin-bottom: 70px;" />
            </div>
            <div class="tablet">
                <div class="tablet-screen">
                    <div class="tablet-content"></div>
                </div>
                <div class="tablet-bottom"></div>
            </div>
            <div class="container">
                <div class="row-4 features-wrapper">
                    <div class="col-md-4">
                        <div class="feature">
                            <div class="center">
                                <div class="feature-rounded">
                                    <DocumentationIcon />
                                </div>
                            </div>
                            <h3>Testing test test test</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis nulla mi. Duis ex
                                nisi, suscipit eu metus sit amet, varius pulvinar nunc.<br /><br />
                                In fermentum ligula magna, nec facilisis mi mattis nec.</p>
                        </div>
                        <div class="feature-button">
                            <button class="btn btn-second">Lorem ipsum </button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature">
                            <div class="center">
                                <div class="feature-rounded">
                                    <SupportIcon />
                                </div>
                            </div>
                            <h3>Testing test test test</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis nulla mi. Duis ex
                                nisi, suscipit eu metus sit amet, varius pulvinar nunc.<br /><br />
                                In fermentum ligula magna, nec facilisis mi mattis nec.</p>
                        </div>
                        <div class="feature-button">
                            <button class="btn btn-second">Lorem ipsum </button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature">
                            <div class="center">
                                <div class="feature-rounded">
                                    <CommunityIcon />
                                </div>
                            </div>
                            <h3>Testing test test test</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis nulla mi. Duis ex
                                nisi, suscipit eu metus sit amet, varius pulvinar nunc.<br /><br />
                                In fermentum ligula magna, nec facilisis mi mattis nec.</p>
                        </div>
                        <div class="feature-button">
                            <button class="btn btn-second">Lorem ipsum </button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature">
                            <div class="center">
                                <div class="feature-rounded">
                                    <EcosystemIcon />
                                </div>
                            </div>
                            <h3>Testing test test test</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis nulla mi. Duis ex
                                nisi, suscipit eu metus sit amet, varius pulvinar nunc.<br /><br />
                                In fermentum ligula magna, nec facilisis mi mattis nec.</p>
                        </div>
                        <div class="feature-button">
                            <button class="btn btn-second">Lorem ipsum </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- <section class="cta-section">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <router-link to="/chat">
                <button class="btn btn-primary">Start a Conversation</button>
            </router-link>
        </div>
    </section> -->
        <Footer />
    </div>
</template>

<script>
import ToolingIcon from '@/components/icons/IconTooling.vue'
import SupportIcon from '@/components/icons/IconSupport.vue'
import DocumentationIcon from '@/components/icons/IconDocumentation.vue'
import EcosystemIcon from '@/components/icons/IconEcosystem.vue'
import CommunityIcon from '@/components/icons/IconCommunity.vue'
import Footer from '@/components/Footer.vue'
import TabletBottom from '@/components/TabletBottom.vue'
import HeroSection from '@/components/HeroSection.vue'

export default {
    name: 'HomeView',
    components: {
        ToolingIcon,
        SupportIcon,
        DocumentationIcon,
        EcosystemIcon,
        CommunityIcon,
        Footer,
        TabletBottom,
        HeroSection
    },
}
</script>

<style scoped>
h1 {
    color: #ffffff;
}

h2 {
    color: #01BD7E;
}

.feature-button {
    margin-top: 20px;
    font-size: 10px;
}

.feature-button .btn {
    padding: 7px 14px;
}

.feature-rounded {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #44D193;
}

.row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}

.row-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 40px;
}

.hero-section h1 {
    font-size: 38px;
    font-weight: 600;
    margin-bottom: 3rem;
    line-height: 1.3;
    color: #fff;
}

.hero-section h6 {
    font-size: 18px;
    color: #fff;
    margin-bottom: 2rem;
}

.hero-section h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 2rem;
}

.hero-section p {
    font-size: 12px;
    margin-bottom: 2rem;
}

.hero-left {
    padding-right: 100px;
}

.hero-right {
    margin-top: 135px;
    padding-left: 100px;
    display: flex;
    align-items: center;
}

.hero-right .btn {
    font-size: 14px;
}

.center {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.tablet-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.features-section {
    padding-bottom: 4rem;
    position: relative;
    background: radial-gradient(62.85% 92.49% at 68.85% 72.45%, #44D193 0%, rgba(17, 17, 17, 0) 100%);
}

.features-section .features-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("../assets/images/hero-background.png");
    filter: brightness(0.8) contrast(1) sepia(0.3) saturate(1.2) hue-rotate(15deg) blur(20px);
    background-position: 1519px 1131px;
    background-size: 1680px 1700px;
}

.features-section .gradient-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(103.36% 103.36% at 75.93% 80.38%, #2D7D5A 0%, rgba(17, 17, 17, 0) 100%);
    opacity: 0.5;
}

.features-wrapper {
    background: #0B0E14;
    border-radius: 24px;
    padding: 5%;
    z-index: 11;
}

.features-section h2 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
}

.feature {
    text-align: center;
}

.feature i {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.feature h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;

}

.feature p {
    font-size: 10px;
    color: #DDDDDD;
}

.cta-section {
    background-color: #1d1d1d;
    padding: 4rem 0;
    text-align: center;
}

.cta-section h2 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
}

.social-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: flex-end;
}

.social-links li {
    margin-right: 1rem;
}

.social-links a {
    color: #f8f9fa;
    font-size: 1.5rem;
}

.tablet {
    width: 400px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    z-index: 10;
}

.tablet-screen {
    width: 400px;
    height: 290px;
    background-color: #000;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    padding: 30px 10px 20px 10px;
}

.tablet-bottom {
    width: 400px;
    background-color: #6B6B6B;
    border-bottom-right-radius: 16px;
    border-bottom-left-radius: 16px;
    box-shadow: 0px 100px 110px 100px #000000;
    padding: 25px 10px;
    z-index: -1;
}

.tablet-content {
    background-color: #fff;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

.curve {
    width: 60%;
    height: 120px;
    margin-inline: auto;
    border-radius: 0 0px 200px 200px;
    box-shadow: 0px 200px 200px 100px #000000;
    background: linear-gradient(221.98deg, #152828 23.68%, #1D6256 85.68%);
    margin-bottom: 80px;
    opacity: 0.5;
}

.btn-group {
    display: flex;
}

.btn-group .btn {
    font-size: 12px;
    font-weight: 500;
    margin-top: 0;
    border-radius: 0;
}

.btn-group .btn:first-child {
    border-right: 0;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
}

.btn-group .btn:last-child {
    border-left: 0;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
}

@media (max-width: 1240px) {
    .row-4 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 40px;
    }

    .hero-left {
        padding-right: 50px;
        display: none;
    }

    .hero-right {
        margin-top: 50px;
        padding-left: 1rem;
    }

    .tablet-bar {
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .row-2 {
        grid-template-columns: 1fr;
    }

    .row-4 {
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    .features-section {
        padding: 0 1rem 1rem 1rem;
    }


    .hero-section {
        padding: 6rem 1rem 12rem 1rem;
    }

    .hero-left {
        padding-left: 3rem;
    }
}
</style>
