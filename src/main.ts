/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

// Plugins
import { registerPlugins } from "@/plugins";
import { Client } from "./client";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

registerPlugins(app);
app.provide("$client", new Client());
app.mount("#app");
