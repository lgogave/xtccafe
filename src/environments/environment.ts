// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseAPIKey:'AIzaSyDgCRLM4MnehywkTps-5WeVQeHQMKIRGrc',
  firebaseConfig : {
    apiKey: "AIzaSyDgCRLM4MnehywkTps-5WeVQeHQMKIRGrc",
    authDomain: "db-xtc-cafe-dev.firebaseapp.com",
    projectId: "db-xtc-cafe-dev",
    storageBucket: "db-xtc-cafe-dev.appspot.com",
    messagingSenderId: "678229863683",
    appId: "1:678229863683:web:cf91d1d003f1b448e1cd36",
    measurementId: "G-58CENDS2S6"
  },
  cloudFunctions : {
    createOrder: 'https://us-central1-db-xtc-cafe-dev.cloudfunctions.net/createOrder',
    capturePayment: 'https://us-central1-db-xtc-cafe-dev.cloudfunctions.net/capturePayments'
  },
  RAZORPAY_KEY_ID: 'rzp_test_a3qHM6OKjhZUGV'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
