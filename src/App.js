import logo from './logo.svg';
import './App.css';
import { auth, googleProvider, db } from "./config/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { doc, getDoc } from 'firebase/firestore';

//this file was not used, just here for reference on how firebase api works
function App() {

  const authenticateHandler = async () => {
       
    try {
      await signInWithPopup(auth, googleProvider)
  }
  catch (e) {
      console.log(e.message)
  }
}

const getDocTest = async () => {
  const docRef = doc(db, 'test_section', 'RKEu4IdCAClKA0BpgmcU');
  const docSnap = await getDoc(docRef).then((data) => {
    console.log(data)
  });

}


  return (
    <div className="App">
      <button onClick={authenticateHandler}>
        Hello
      </button>

      <button onClick={getDocTest}>
        click
      </button>
    </div>
  );
}

export default App;
