import { useState } from "react"




export const FoodTab = (props) => {


    const [isVisible, setIsVisible] = useState(false)


    return <div className="food-tab">
        <div className="header">
            <h2> {props.foodName}</h2>
            <button onClick={() => {
                if (isVisible) 
                    setIsVisible(false)
                else{
                    setIsVisible(true)}
            }}> ^ </button>
        </div>
        {isVisible && (
            <div className="more-info">
                <p> </p>
            </div>
        )}
    </div>
}