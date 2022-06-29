<template>
  <h1>{{ headerTitle }}</h1>
</template>
<script>
  export default {
    name: 'HeaderSection', 
    props:{},
    data(){
      return{
        headerTitle : 'Mars Trading Platform'
      }
    }
  }
</script>
<style scoped>
h1 {
  position: absolute;
  width: 254px;
  height: 24px;
  left: 136px;
  top: 50px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffffff;
  z-index: 10;
  background-color: transparent;
}
</style>