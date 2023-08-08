/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import '@/styles/main.scss'
// import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

const myCustomDarkTheme = {
  dark: true,
  colors: {
    primary: '#6200EE',
    "primary-variant": "#3700B3",
    secondary: "#03DAC6",
    "secondary-variant": "#018786",
    background: '#121212',
    surface: '#121212',
  }
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    // themes: { myCustomDarkTheme }
  },
});
