export const environment = {
  production: true,

  // UrlApi:'https://service.poclab.pe/donalab/api',  
  // UrlImage:'assets/',

  // UrlApi:'https://sitedev.poclab.pe/donalabdev/api',  
  // UrlImage:'assets/',

   UrlApi:'http://localhost:48394/api',
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

  validateNumber (dato: string){
    var valoresAceptados = /^[0-9]+$/;

    dato = dato.toString();

    if(dato=="" || dato==null || dato==undefined){
      return environment.OTRO;
    }
    else if (dato.indexOf(".") === -1 ){
        if (dato.match(valoresAceptados)){
           return environment.EXITO;
        }else{
           return environment.ALERT;
        }
    }else{
        var particion = dato.split(".");
        if (particion[0].match(valoresAceptados) || particion[0]==""){
            if (particion[1].match(valoresAceptados)){
                return environment.EXITO;
            }else {
                return environment.ALERT;
            }
        }else{
            return environment.ALERT;
        }
    }
  }
};
