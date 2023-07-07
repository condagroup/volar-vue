<template lang="">
    <div>
        <footer>
            <div class="container">
                <div class="row-3-1">
                    <div class="row-3">
                        <div class="col-md-3">
                            <div class="footer-list">
                                <h3>
                                    About Us
                                </h3>
                                <a href="#">Careers</a>
                                <a href="#">Contact Us</a>
                                <a href="#">FAQ</a>
                                <a href="#">Why Volar?</a>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="footer-list">
                                <h3>
                                    Community
                                </h3>
                                <a href="#">Blog</a>
                                <a href="#">Community Guidelines</a>
                                <a href="#">User Safety</a>
                                <a href="#">Non-Discrimination Policy</a>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="footer-list">
                                <h3>
                                    Legal
                                </h3>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Service Terms of Use</a>
                                <a href="#">PaymentsTerms of Service</a>
                                <a href="#">Independent Tutor Agreement</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="footer-made">
                            <h3>Made with</h3>&nbsp;&nbsp;&nbsp;
                            <HeartIcon />
                            &nbsp;&nbsp;&nbsp;<h3>in Volar</h3>
                        </div>
                    </div>
                </div>
                <div class="footer-social">
                    <div class="social-list">
                        <div class="social-store">
                            <a href="#">
                                <GooglePlayIcon />
                            </a>
                            <a href="#">
                                <AppStore />
                            </a>
                        </div>
                        <div class="social-png">
                            <div>
                                <a href="#">
                                    <img src="../assets/images/BBB.png" width="auto" height="40px" />
                                </a>
                            </div>
                            <div>
                                <a href="#">
                                    <img src="../assets/images/green.png" width="40px" height="40px" />
                                </a>
                            </div>
                        </div>
                        <div class="social-site-list">
                            <a href="#">
                                <TwitterIcon />
                            </a>
                            <a href="#">
                                <LInkedinIcon />
                            </a>
                            <a href="#">
                                <InstagramIcon />
                            </a>
                            <a href="#">
                                <YoutubeIcon />
                            </a>
                            <a href="#">
                                <FacebookIcon />
                            </a>
                        </div>
                    </div>
                    <p class="copyright-text">
                        @ 2023 Volar. All Rights Reserved.
                    </p>
                </div> 
            </div>
        </footer>
    </div>
</template>
<script>
import HeartIcon from '@/components/icons/IconHeart.vue'
import GooglePlayIcon from '@/components/icons/IconGooglePlay.vue'
import AppStore from '@/components/icons/IconAppStore.vue'
import TwitterIcon from '@/components/icons/IconTwitter.vue'
import LInkedinIcon from '@/components/icons/IconLinkedin.vue'
import InstagramIcon from '@/components/icons/IconInstagram.vue'
import YoutubeIcon from '@/components/icons/IconYoutube.vue'
import FacebookIcon from '@/components/icons/IconFacebook.vue'
export default {
    name: "Footer",
    components: {
        HeartIcon,
        GooglePlayIcon,
        AppStore,
        TwitterIcon,
        LInkedinIcon,
        InstagramIcon,
        YoutubeIcon,
        FacebookIcon
    }

}
</script>
<style scoped>
.social-list {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
}

.social-site-list {
    padding: 10px;
    display: flex;
}

.social-site-list a {
    padding: 0px 12px;
}

.social-list a:hover {
    opacity: 0.5;
    background-color: transparent;
}

.social-store {
    display: flex;
    gap: 20px;
}

.social-png {
    display: flex;
    gap: 50px;
}

.footer-made {
    display: flex;
    align-items: center;
}

.footer-made h3 {
    font-size: 17px;
}

svg {
    margin-bottom: 0;
}

.row-3-1 {
    display: grid;
    grid-template-columns: 3fr 1fr;
}

.row-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.row-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 40px;
}

.footer-list {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.footer-list h3 {
    font-size: 17px;
    margin-bottom: 20px;
}

.footer-list a {
    margin-bottom: 10px;
    text-decoration: none;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.17;
    letter-spacing: .3;
    color: #707070;
}

.footer-list a:hover {
    color: #fff;
    background-color: transparent;
}

.footer-social {
    margin-top: 25px;
    padding-top: 40px;
    margin-left: -100px;
    margin-right: -100px;
    border-top: 1px solid #607070;
}

.copyright-text {
    margin: 0 auto;
    font-size: 16px;
    text-align: center;
}

@media (max-width: 1240px) {
    .row-3-1 {
        grid-template-columns: 1fr;
        grid-gap: 2rem;
    }

    .row-3-1 .col-md-4 {
        display: flex;
        justify-content: center;
    }
}

@media (max-width: 1000px) {
    .row-3 {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }
}

@media (max-width: 768px) {
    .row-4 {
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    .footer-social {
        margin-left: 0;
        margin-top: 0;
        padding-top: 20px;
        margin-right: 0;
        border: 0;
    }

    .social-list {
        flex-direction: column;
    }

    .social-store {
        justify-content: center;
        margin-bottom: 1rem;
    }

    .social-png {
        justify-content: center;
        margin-bottom: 1rem;
    }

    .social-site-list {
        justify-content: space-between;
        border-top: 1px solid #607070;
        border-bottom: 1px solid #607070;
    }
}</style>