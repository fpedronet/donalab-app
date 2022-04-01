// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  // UrlApi:'https://service.poclab.pe/encuesta/api',  
  // UrlImage:'assets/',

  //UrlApi:'https://sitedev.poclab.pe/donalabdev/api',  
  //UrlImage:'assets/',

   UrlApi:'http://localhost:48394/api',
   UrlImage:'../../../../assets/',

  TOKEN_AUTH_USERNAME: 'mitomediapp',
  TOKEN_AUTH_PASSWORD: 'mito89codex',
  TOKEN_NAME: 'access_token',
  CODIGO_BANCO: 'access_banco',

  ERROR: 0,
  EXITO: 1,
  ALERT: 2,

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
