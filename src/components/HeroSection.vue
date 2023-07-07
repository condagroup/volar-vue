<template lang="">
    <div>
        <section class="hero-section">
            <div class="overlay"></div>
            <slot></slot>
        </section>
    </div>
</template>
<script>
export default {
    name: 'HeroSection'
}
</script>
<style scoped>
.hero-section {
    background-color: black;
    background-image: url("../assets/images/hero-background.png");
    filter: sepia(0.2) saturate(1.2) hue-rotate(10deg);
    padding: 8rem 0 19rem 0;
    background-size: 78%;
    background-position: 0 60%;
    position: relative;
    z-index: 9;
    /* opacity: 0.8; */
}
.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(90deg, #000000 14.06%, rgba(0, 0, 0, 0) 56.56%, rgba(0, 0, 0, 0) 61.66%, #000000 75.21%);
}
</style>