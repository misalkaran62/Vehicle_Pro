import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { enableProdMode } from '@angular/core';

// if (environment.isLocalhost) {
//   // Disable all console methods in production
//   console.log = () => {};
//   console.warn = () => {};
//   console.error = () => {};
//   console.info = () => {};

//   enableProdMode(); // Enable Angular production mode for performance optimizations
// }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
