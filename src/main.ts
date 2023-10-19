import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import naive from "naive-ui";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

const app = createApp(App)
  app
    .use(router)
    .use(naive)
    .use(createPinia())
    .use(PrimeVue)
    .use(ToastService)
    .mount('#app')
