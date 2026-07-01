// Vai su console.firebase.google.com → Il tuo progetto → Impostazioni → Configurazione web
const firebaseConfig = {
  apiKey: "INSERISCI_API_KEY",
  authDomain: "INSERISCI_AUTH_DOMAIN",
  projectId: "INSERISCI_PROJECT_ID",
  storageBucket: "INSERISCI_STORAGE_BUCKET",
  messagingSenderId: "INSERISCI_MESSAGING_SENDER_ID",
  appId: "INSERISCI_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
