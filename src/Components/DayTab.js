import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { FoodTab } from "./FoodTab"





export const MealTab = (props) => {


    const [isVisible, setIsVisible] = useState(false)

    if (!props.foods) {
        return <div className="meal-tab">
        <div className="header">
            <h2> {props.mealType}</h2>
            <button onClick={(e) => {

                if (isVisible) {
                    setIsVisible(false)
                    e.target.classList.remove("dropped-down")
                }
                else{
                    setIsVisible(true)
                    console.log(e)
                    e.target.classList.add("dropped-down")
                }

            }}> ^ </button>
        </div>
        {isVisible && (
            <div>
                <h1>No food </h1>
            </div>
        )}
        
    </div>
    }


    return <div className="meal-tab">
        <div className="header">
            <h2> {props.mealType}</h2>
            <button className="drop-down" onClick={(e) => {

                if (isVisible) {
                    setIsVisible(false)
                    e.target.classList.remove("dropped-down")
                }
                else{
                    setIsVisible(true)
                    e.target.classList.add("dropped-down")
                }
                
            }}> ^ </button>
            
        </div>
        {isVisible && (
            <div className="help-me-please">
                {props.foods.products.map((item, index) => {
                    return item.healthInfo[0].Value ? <FoodTab key={index} foodName={item.name} healthInfo={item.healthInfo} location={item.location} description={item.description} setSelectedFoods={props.setSelectedFoods} fullFood={item} isEditAble={props.isEditAble}/> : null;
                })}
                {() => {
                    
                    if (!props.foods.products.length) {
                        console.log(props.foods.products)
                        return <h1> No food</h1>
                    }
                }}
            </div>
        )}
        
    </div>
}