import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA, type ManifestOptions } from 'vite-plugin-pwa';

type AppleManifestOptions = Partial<ManifestOptions> & {
  'apple-mobile-web-app-capable': string;
  'apple-mobile-web-app-status-bar-style': string;
};

const iconSizes = [72, 96, 128, 144, 152, 180, 192, 256, 384, 512];
const icons = iconSizes.map((size) => ({
  src: `icon-${size}.png`,
  sizes: `${size}x${size}`,
  type: 'image/png',
  purpose: 'any maskable'
}));

const manifest: AppleManifestOptions = {
  name: 'The Dartmouth Saga',
  short_name: 'Dartmouth Saga',
  description: 'A card-swipe game about 70 years of AI history.',
  theme_color: '#f5f1e8',
  background_color: '#f5f1e8',
  display: 'standalone',
  'apple-mobile-web-app-capable': 'yes',
  'apple-mobile-web-app-status-bar-style': 'black-translucent',
  icons
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      includeAssets: [
        ...icons.map((icon) => icon.src),
        'og-image.png',
        'splash-1170x2532.png',
        'splash-1290x2796.png',
        'splash-2048x2732.png'
      ],
      manifest
    })
  ]
});
