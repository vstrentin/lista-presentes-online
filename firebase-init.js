// firebase-init.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJn5FasSRlGCMcPTvsiqb4KdfjzwG5aQo",
  authDomain: "lista-presentes-online-7e5fc.firebaseapp.com",
  databaseURL: "https://lista-presentes-online-7e5fc-default-rtdb.firebaseio.com",
  projectId: "lista-presentes-online-7e5fc",
  storageBucket: "lista-presentes-online-7e5fc.firebasestorage.app",
  messagingSenderId: "363392714019",
  appId: "1:363392714019:web:6cfdfca5c4956d5d71f896"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta as funções necessárias
export { database, ref, onValue, set };