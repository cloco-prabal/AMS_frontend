import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
// import "ant-design-vue/dist/reset.css";
import "primeicons/primeicons.css";
import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(router);
app.use(Antd);

app.mount("#app");
