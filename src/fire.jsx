import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDS_0WVGbae7pE2Z2IJanBJuOpJaRY1TNQ",
  authDomain: "socialmediaapp-dc59a.firebaseapp.com",
  databaseURL: "https://socialmediaapp-dc59a.firebaseio.com",
  projectId: "socialmediaapp-dc59a",
  storageBucket: "socialmediaapp-dc59a.appspot.com",
  messagingSenderId: "958454087975",
  appId: "1:958454087975:web:19983d655c888f222c2902",
};

const fire = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, fire as default };
