import { useEffect, useState } from "react"
import "../CSS/SearchMenu.css"
import searchIcon from "../images/search-icon.png"
import jsonData from "../info.json"
import { MealTab } from "./DayTab"
import { auth, db } from "../config/firebase"
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';


export const SearchMenu = () => {

    const [foodInfo, setFoodInfo] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([{
        period: "Breakfast",
        products: []
    },
    {
        period: "Lunch",
        products: []
    },
    {
        period: "Dinner",
        products: []
    }])

    useEffect(() => {
        console.log(selectedFoods)
    }, [selectedFoods])

    const searchForFoods = () => {
        requestParser()
    }

    const saveChoicesHandler = async () => {
        const mealSavedRef = collection(db, "meals_saved");
        try {
            await addDoc(mealSavedRef, {
              userID: auth?.currentUser?.uid,
              meal_plan: selectedFoods
            });
          }
          catch(e) {
            console.log(e)
          }
    }

    const requestParser = () => {
        let jsonInfo = jsonData
        let foodArray = [...foodInfo];
        let currIndex = foodArray.length

        //console.log(jsonInfo)
        //console.log(jsonInfo.Menu.MenuProducts[0].PeriodId)
        //console.log(jsonInfo.Menu.MenuPeriods[parseInt(jsonInfo.Menu.MenuProducts[0].PeriodId) - 1422])
        let period =jsonInfo.Menu.MenuPeriods[parseInt(jsonInfo.Menu.MenuProducts[0].PeriodId) - 1422].Name;
        foodArray.push({
            period: period,
            products: []
        })


        let products = jsonInfo.Menu.MenuProducts

        for (let i = 0; i < products.length; i++) {
            let loc = "";
        
            for (let j = 0; j < jsonInfo.Menu.MenuStations.length; j++){
                if (products[i].StationId == jsonInfo.Menu.MenuStations[j].StationId)
                    loc = jsonInfo.Menu.MenuStations[j].Name

            }
    
            let prod = products[i].Product
            let foodInf = {
                name: prod.MarketingName,
                healthInfo: prod.NutritionalTree,
                location: loc,
                description: prod.ShortDescription,
                period: period

            }
            foodArray[currIndex].products.push(foodInf)
        }

        setFoodInfo((prev) => foodArray)
        console.log(foodArray)
    }
    


    return <div className="search-menu">
        <div className="top-bar">
            <h1> Create New Meal Plan</h1>
        </div>
        <div className="search-bar">
            <label htmlFor="date-search"> Enter a date (e.g 10/19/2024)</label>
            <input type="text" id="date-search"/>
            <button onClick={
                searchForFoods
            }>
                <img src={searchIcon} />
            </button>
        </div>
        <div className="selected-items">
            <MealTab mealType="Breakfast" foods={selectedFoods[0]} setSelectedFoods={[selectedFoods, setSelectedFoods]}/>
            <MealTab mealType="Lunch" foods={selectedFoods[1]} setSelectedFoods={[selectedFoods, setSelectedFoods]}/>
            <MealTab mealType="Dinner" foods={selectedFoods[2]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]}/>
        </div>
        <div className="available-additions">
            <MealTab mealType="Breakfast" foods={foodInfo[0]} setSelectedFoods={[selectedFoods, setSelectedFoods]}/>
            <MealTab mealType="Lunch" foods={foodInfo[1]} setSelectedFoods={[selectedFoods, setSelectedFoods]}/>
            <MealTab mealType="Dinner" foods={foodInfo[2]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]}/>
        </div>
        <button onClick={
            saveChoicesHandler
        }>
            Save
        </button>
    </div>
}