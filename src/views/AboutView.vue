<template>
    <div class="about-page">
        <HeroSection>
            <div class="container">
                <div class="header-section">
                    Welcome to Volar. We’re a group of health professionals committed to improving the working life of
                    people like us, by creating technology-driven solutions to the challenges we all face.
                </div>
                <div class="team-section">
                    <div class="team-member">
                        <div class="rounded">

                        </div>
                        <div>
                            <h3>Reuben Schmidt</h3>
                            <p>Reuben is a medical doctor, a radiology registrar, a father of two and maintainer of the
                                YouTube channel About Medicine in his spare time. He is responsible for the development of
                                our technology platform.
                            </p>
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="rounded">

                        </div>
                        <div>
                            <h3>Reuben Schmidt</h3>
                            <p>Reuben is a medical doctor, a radiology registrar, a father of two and maintainer of the
                                YouTube channel About Medicine in his spare time. He is responsible for the development of
                                our technology platform.
                            </p>
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="rounded">

                        </div>
                        <div>
                            <h3>Reuben Schmidt</h3>
                            <p>Reuben is a medical doctor, a radiology registrar, a father of two and maintainer of the
                                YouTube channel About Medicine in his spare time. He is responsible for the development of
                                our technology platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HeroSection>
        <div class="fees-section">
            <div class="fees-overlay"></div>
            <div class="container">
                <h3>
                    Fees
                </h3>
                <p>
                    Our token-based model allows you to pay only for what you need and use as much or as little of our
                    services as your projects demand. Each GPT token represents about 4 characters of input or output text,
                    and costs just $0.00025 - equal to only $0.10 for 300 words.
                </p>
                <p>
                    Our pricing is unique for AI services, with no surprise fees or restrictive long-term contracts. You
                    have the freedom to cancel at any time.
                </p>
                <p>
                    We are committed to transparent pricing and stand behind the value we offer. All payments are handled
                    securely through Stripe, using encryption and fraud prevention to keep your data private at every step
                    of the process.
                </p>
                <p>
                    As an AI assistant built by healthcare professionals, our team understands the importance of quality,
                    conciseness, and expertise in every piece of writing we produce. We charge by the token simply because
                    it provides the fairest, most straightforward system - pay for only what you need.
                    For any questions about our fees, please get in touch. We look forward to partnering with you.
                </p>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import HeroSection from '@/components/HeroSection.vue';

export default {
    name: "AboutView",
    components: {
        Footer,
        HeroSection
    },
    data() {
        return {};
    },
}
</script>

<style>
.fees-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.5;
}
.about-page .hero-section {
    padding: 8rem 0 5rem 0;
}

.header-section {
    font-size: 18px;
    max-width: 500px;
    padding: 6rem 0 4rem 0;
}

.team-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-left: 450px;
}

.team-member {
    display: flex;
    gap: 20px;
}

.team-member h3 {
    font-size: 16px;
    font-weight: 700;
}

.team-member p {
    font-size: 12px;
    font-weight: 400;
}

.rounded {
    min-width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #44D193;
}

.fees-section {
    background: radial-gradient(103.36% 103.36% at 75.93% 80.38%, #084c2f 0%, rgba(17, 17, 17, 0) 100%);
    padding: 4rem 0;
}

.fees-section h3 {
    color: #44D193;
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 2rem;
}

.fees-section p {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 2rem;
}

@media (max-width: 1240px) {
    .team-section {
        padding-left: 0;
    }
}

@media (max-width: 768px) {
    .header-section {
        padding: 0 1rem 4rem 1rem;
    }

    .team-section {
        padding: 0 1rem;
    }

    .fees-section {
        padding: 4rem 1rem;
    }
}</style>
