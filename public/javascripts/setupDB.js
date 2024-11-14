
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getDatabase, ref, get } from 'firebase/database';
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCcQxPTCHWPCIC21Q4UzFO9y9vlDzQ6jo8",
    authDomain: "green-bean-118d2.firebaseapp.com",
    projectId: "green-bean-118d2",
    storageBucket: "green-bean-118d2.appspot.com",
    messagingSenderId: "388579552805",
    appId: "1:388579552805:web:4a63dfdb5179d20dbc19cc",
    measurementId: "G-3KCRCNDZ82"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  document.getElementById("submit").addEventListener('click', function(){
    // set(ref(db, 'users/' + 12312), {
    //     username: "hello",
    //     email: "there@hotmail.com",
    //   });

      alert("DB object made");
  })
