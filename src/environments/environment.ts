// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  // apiUrl: 'https://51.20.122.168/',
  // apiUrl: "http://127.0.0.1:8000/",
  apiUrl_web: "http://localhost:8000/",
    apiUrl: 'https://13.61.182.4/',
  
  // apiUrl_fe:"http://localhost:4200/",
  apiUrl_fe:"https://16.16.79.221/",
  // apiUrl_fe:"https://thephoenixguild.com/",

  recaptcha: {
    siteKey: '6LfhKxUqAAAAADTIEBB4IRPhETpFycTuWF0Svb-6',
  },

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
