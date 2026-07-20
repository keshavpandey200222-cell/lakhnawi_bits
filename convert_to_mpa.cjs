const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const viewsDir = path.join('src', 'views');

// Extract modals
const modalsFile = fs.readFileSync(path.join(viewsDir, 'modalsView.js'), 'utf8');
const modalsMatch = modalsFile.match(/export const modalsView = `([\s\S]*?)`;/);
const modalsHtml = modalsMatch ? modalsMatch[1] : '';

const pages = [
  { name: 'index', viewFile: 'portalLandingView.js', varName: 'portalLandingView', route: 'portal-landing' },
  { name: 'home', viewFile: 'homeView.js', varName: 'homeView', route: 'home' },
  { name: 'menu', viewFile: 'menuView.js', varName: 'menuView', route: 'menu' },
  { name: 'profile', viewFile: 'profileView.js', varName: 'profileView', route: 'profile' },
  { name: 'tracking', viewFile: 'trackingView.js', varName: 'trackingView', route: 'tracking' },
  { name: 'restaurant', viewFile: 'restaurantView.js', varName: 'restaurantView', route: 'restaurant' }
];

for (const page of pages) {
  const viewFile = fs.readFileSync(path.join(viewsDir, page.viewFile), 'utf8');
  const viewMatch = viewFile.match(new RegExp(`export const ${page.varName} = \\\`([\\s\\S]*?)\\\`;`));
  let viewHtml = viewMatch ? viewMatch[1] : '';
  
  // Remove d-none from the root container of the view
  viewHtml = viewHtml.replace(/class="([^"]*)d-none([^"]*)"/, 'class="$1$2"');

  let newHtml = indexHtml.replace(
    /<div id="views-container">[\s\S]*?<\/div>/,
    `<div id="views-container">\n${viewHtml}\n</div>`
  );

  newHtml = newHtml.replace(
    /<div id="modals-container">[\s\S]*?<\/div>/,
    `<div id="modals-container">\n${modalsHtml}\n</div>`
  );
  
  // Inject the page context so main.js knows which view to render
  newHtml = newHtml.replace(
    '</body>',
    `<script>window.ACTIVE_PAGE_ROUTE = '${page.route}';</script>\n  </body>`
  );

  fs.writeFileSync(`${page.name}.html`, newHtml, 'utf8');
  console.log('Created', `${page.name}.html`);
}

// Generate vite.config.js
const viteConfig = `import { defineConfig } from 'vite';
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
});`;

fs.writeFileSync('vite.config.js', viteConfig, 'utf8');
console.log('Created vite.config.js');
