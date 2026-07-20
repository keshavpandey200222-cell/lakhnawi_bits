import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home.html'),
        menu: resolve(__dirname, 'menu.html'),
        profile: resolve(__dirname, 'profile.html'),
        tracking: resolve(__dirname, 'tracking.html'),
        restaurant: resolve(__dirname, 'restaurant.html')
      }
    }
  }
});