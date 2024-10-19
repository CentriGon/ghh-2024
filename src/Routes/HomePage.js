import "../CSS/HomePage.css"
import cavaLogo from "../images/cavalierLogo.png"
import { useNavigate } from "react-router-dom"
export const HomePage = () => {

    const navigate = useNavigate();


    const handleLoginSwitch = () => {
        navigate("/login")
    }

  return (

    <div className="hero-page">
        <div className="outer-box">
        <div className="hero-text">
            <h1> HoosNutriPlan</h1>
            <p>"The meal plan for the meal plan"</p>
            <button onClick={
                handleLoginSwitch
            }> Get Started </button>
        </div>
        <img src={cavaLogo} />
        </div>
        <div className="bottom-box">
            <p>HoosNutriPlan is a way for students to..</p>
            <p>1. Plan your meals for the week based on your diet (vegetarian, low-carbs, etc.)</p>
            <p>2. Track nutritional information like calories, protein, and more</p>
            <p>3. Optimize your dining schedule to meet your health goals</p>
        </div>
      
    </div>
  );
}

