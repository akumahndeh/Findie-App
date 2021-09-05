
import firebase from "firebase";;
var firebaseConfig = {
  apiKey: "AIzaSyAjUdWh1UVBBVtUf9GVtBVb6CZT6c9epw4",
  authDomain: "findieapp.firebaseapp.com",
  databaseURL: "https://findieapp.firebaseio.com",
  projectId: "findieapp",
  storageBucket: "findieapp.appspot.com",
  messagingSenderId: "932527026886",
  appId: "1:932527026886:web:be0900678804038cdaddc7",
  measurementId: "G-X6DYVWTFB5"
};

const app = firebase.initializeApp(firebaseConfig)
const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const fstore = firebase.firestore()


  try{
    firebase.analytics()
  }catch{

  }


export {db, auth, fstore, app, storage}
export default firebase