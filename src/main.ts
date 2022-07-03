import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import callsApi from '@/mixins/callsApi'
import VueLoading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import './scss/styles.scss'

const app = createApp(App);

app.mixin(callsApi)
app.use(router)
app.use(VueLoading, {
    canCancel: false, // default false
    // color: '#500005',
    color: '#BB7474',
    loader: 'bars',
    width: 50,
    height: 50,
    backgroundColor: '#050505',
    opacity: 0.7,
    transition: 'fade',
    zIndex: 999,
  })


app.mount("#app");
