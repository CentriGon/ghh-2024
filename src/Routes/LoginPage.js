import "../CSS/LoginPage.css"
import cavaLogo from "../images/cavalierLogo.png"
import { useNavigate } from "react-router-dom"
import { auth, googleProvider, db } from "../config/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"

export const LoginPage = () => {

    const navigate = useNavigate();


    //authenticates the user using firebase auth
    const authenticateHandler = async () => {
       
        try {
          await signInWithPopup(auth, googleProvider).then(() => {
            navigate("/dashboard")
          })
      }
      catch (e) {
          console.log(e.message)
      }
    }

  return (

    <div className="login-page">
        <div className="outer-o-box">
            <h1> HoosNutriPlan</h1>
            <div className="outer-box" style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
            
                <div className="login-box">
                    <button onClick={authenticateHandler}> Sign in With Google </button>
                </div>
                <img src={cavaLogo} />
            </div>
        </div>
        <div className="bottom-box">
        </div>
      
    </div>
  );
}
