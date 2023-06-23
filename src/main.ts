import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {

  //For Demo Purpose (On Site POC)
  if(false){
    console.log('Main file');
    let currentUrl = window.location.href;
    let slices = currentUrl.split(':');
    let reqUrl = slices[1].slice(2);
    let cPieces = reqUrl.split('/')
    // console.log(cPieces);
    environment.apiUrl = "http://"+cPieces[0]+":8000";
    // console.log('env:',environment.apiUrl);
  }
  enableProdMode();
}


// if (environment.production) {
//   enableProdMode();
// }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
