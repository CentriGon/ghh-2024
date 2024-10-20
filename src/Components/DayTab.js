import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { FoodTab } from "./FoodTab"





export const MealTab = (props) => {


    const [isVisible, setIsVisible] = useState(false)

    if (!props.foods) {
        return <div className="meal-tab">
        <div className="header">
            <h2> {props.mealType}</h2>
            <button onClick={() => {
                if (isVisible) 
                    setIsVisible(false)
                else{
                    setIsVisible(true)}
            }}> ^ </button>
        </div>
        {isVisible && (
            <div>

            </div>
        )}
        
    </div>
    }

   


    return <div className="meal-tab">
        <div className="header">
            <h2> {props.mealType}</h2>
            <button onClick={() => {
                if (isVisible) 
                    setIsVisible(false)
                else{
                    setIsVisible(true)}
            }}> ^ </button>
            
        </div>
        {isVisible && (
            <div>
                {props.foods.products.map((item, index) => {
                    return item.healthInfo[0].Value ? <FoodTab foodName={item.name} healthInfo={item.healthInfo} location={item.location} description={item.description} setSelectedFoods={props.setSelectedFoods} fullFood={item}/> : null;
                })}
            </div>
        )}
        
    </div>
}