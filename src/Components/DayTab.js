import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { FoodTab } from "./FoodTab"





export const MealTab = (props) => {


    const [isVisible, setIsVisible] = useState(false)

    //if the props.foods value is not there, it means that no items are in the meal tab, so it is not loaded in.
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


    //otherwise, it loads in the values
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
                {!props.foods.products.length && <h1> No food</h1>}
            </div>
        )}
        
    </div>
}