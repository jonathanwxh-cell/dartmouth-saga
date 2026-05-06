import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'The Dartmouth Saga',
        short_name: 'Dartmouth Saga',
        description: 'A card-swipe game about 70 years of AI history.',
        theme_color: '#f5f1e8',
        background_color: '#f5f1e8',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
