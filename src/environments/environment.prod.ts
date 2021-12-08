export const environment = {
  production: true,
  firebaseAPIKey:'AIzaSyAwd927lekPm-EWbc353WqhGCVSyPCg98A',
  firebaseConfig : {
    apiKey: "AIzaSyAwd927lekPm-EWbc353WqhGCVSyPCg98A",
    authDomain: "db-xtc-cafe.firebaseapp.com",
    projectId: "db-xtc-cafe",
    storageBucket: "db-xtc-cafe.appspot.com",
    messagingSenderId: "800211055983",
    appId: "1:800211055983:web:d872721b5c4a5065dee49a",
    measurementId: "G-G0V2LS3SG0"
  },
  cloudFunctions : {
    createOrder: 'https://us-central1-db-xtc-cafe-dev.cloudfunctions.net/createOrder',
    capturePayment: 'https://us-central1-db-xtc-cafe-dev.cloudfunctions.net/capturePayments'
  },
  RAZORPAY_KEY_ID: 'rzp_test_a3qHM6OKjhZUGV'
};
