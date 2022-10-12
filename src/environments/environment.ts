// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  //UrlApi:'http://181.176.170.149:8022/api',  
  //UrlApi:'https://service.poclab.pe/donalab/api',  
  //UrlApi:'https://sitedev.poclab.pe/donalabdev/api', 
  UrlApi:'http://localhost:48394/api',

  //*Prod
  //UrlImage:'assets/',
  //*Dev
  UrlImage:'../../../../assets/',

  TOKEN_AUTH_USERNAME: 'mitomediapp',
  TOKEN_AUTH_PASSWORD: 'mito89codex',
  TOKEN_NAME: 'access_token',
  CODIGO_BANCO: 'access_banco',
  CODIGO_FILTRO: 'access_filtro',

  ERROR: 0,
  EXITO: 1,
  ALERT: 2,
  OTRO: 3,

};

