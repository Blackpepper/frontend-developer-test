<template>

  <HeaderSection />
  <MainContent />
  <div class="linearOverlay"></div>
  <div class="bgImg">
    <div class="overlay"></div>
  </div>
</template>

<script>
import HeaderSection from './views/HeaderSection.vue'
import MainContent from './views/MainContent.vue'

export default {
  
  name: 'App',
  components: {
    HeaderSection,
    MainContent
}
}
</script>

<style>
body {
  border:0;
  margin:0;
  padding:0;
  background:#000;
  color: #ffffff; 
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.linearOverlay{
  position: absolute;
  width: 560px;
  height: 100%;
  left: 0px;
  top: 0px;
  background: linear-gradient(90deg, #500005 0%, rgba(80, 1, 0, 0) 100%);
}
.bgImg {
  position: absolute;
  width: 1041px;
  height: 100vh;
  right:0;
  background:
    url('./assets/mars-img.png');
}


.overlay{
  position: absolute;
  width: 1041px;
  height: 935px;
  right:0;
  background: #BB7474;
  mix-blend-mode: multiply;
}
</style>
