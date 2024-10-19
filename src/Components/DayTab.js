import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { FoodTab } from "./FoodTab"





export const MealTab = (props) => {

    useEffect(() => {
        console.log(props)
    }, [props])
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
                <FoodTab foodName="hamburger"/>
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
                <p> {props.foods.products[0].name}</p>
                {props.foods.products.map((item, index) => {
                    return <FoodTab foodName={item.name} healthInfo={item.healthInfo} location={item.location} description={item.description} />
                })}
            </div>
        )}
        
    </div>
}