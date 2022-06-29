/* Set up using Vue 3 */
import { createApp } from 'vue'
import App from './App.vue'

/* Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCirclePlus,faCircleMinus } from '@fortawesome/free-solid-svg-icons'
/* SweetAlert */
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/* add icons to the library */
library.add(faCirclePlus, faCircleMinus)

createApp(App)
.use(VueSweetalert2)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')