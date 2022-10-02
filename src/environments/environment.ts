// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // URL_API_COEXPAN: 'https://test.coexpan.cl/api/v1/wscoexpan',
  // URL_API_COEXPAN: 'https://api.coexpan.cl/cat-services/app/n-api-coexpan/wscoexpan',
  // URL_API_COEXPAN: 'http://192.168.37.150:9094/cat-services/app/n-api-coexpan/wscoexpan',
  // URL_API_COEXPAN: 'http://localhost:44302/wscoexpan',
  URL_API_COEXPAN: 'https://api.coexpan.cl/api/v1/wscoexpan',
  URL_API_IMPRESORA: 'https://api.coexpan.cl/api/logistica-etq/impresion/emision-etiqueta-recepcion',

  // SAP BO
  BD_SAP: 'SBO_COEMBAL_FUSION',
  // BD_SAP: '01TEST_COEMBAL',
  // BD_SAP: 'Z_SBO_COEXPAN_TEST',
  // BD_SAP: 'SBO_COEXPAN_OFI',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
