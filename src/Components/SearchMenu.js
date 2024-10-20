import { useEffect, useState } from "react"
import "../CSS/SearchMenu.css"
import searchIcon from "../images/search-icon.png"
import jsonData from "../info.json"
import { MealTab } from "./DayTab"
import { auth, db } from "../config/firebase"
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import "../CSS/MenuStyle.css"
import { NutrientBar } from "./NutrientInfoBar"


export const SearchMenu = (props) => {

    const [foodInfo, setFoodInfo] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState(() => {
        if (!props.selectedItems) {
            return [{
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
            }]
        }
        else {
            return props.selectedItems
        }
    })
    const [selectedNutrInfo, setSelectedNutrInfo] = useState({
        calories: 0,
        totalFat: 0,
        cholesterol: 0,
        sodium: 0,
        totalCarbs: 0,
        protein: 0
    })   
    const [isEditAble, setIsEditAble] = useState(() => {
        if (props.mode == "edit")
            return true
        else {
            return false;
        }
    })
    const [maxNutValue, setMaxNutValue] = useState({
        calories: 2000,
        totalFat: 50,
        cholesterol: 1500,
        sodium: 2000,
        totalCarbs: 300,
        protein: 60
    })
    const [selectedDate, setSelectedDate] = useState("")


    useEffect(() => {
        console.log(selectedFoods)

        let nutrinfo = {
            calories: 0,
            totalFat: 0,
            cholesterol: 0,
            sodium: 0,
            totalCarbs: 0,
            protein: 0,
        };
        
        for (let i = 0; i < selectedFoods.length; i++) {
            for (let j = 0; j < selectedFoods[i].products.length; j++) {
                const healthInfo = selectedFoods[i].products[j].healthInfo;
        
               
                nutrinfo.calories += parseInt(healthInfo[0]?.Value) || 0;        
                nutrinfo.totalFat += parseInt(healthInfo[1]?.Value) || 0;       
                nutrinfo.cholesterol += parseInt(healthInfo[2]?.Value) || 0;    
                nutrinfo.sodium += parseInt(healthInfo[3]?.Value) || 0;         
                nutrinfo.totalCarbs += parseInt(healthInfo[4]?.Value) || 0;     
                nutrinfo.protein += parseInt(healthInfo[5]?.Value) || 0;        
            }
        }
        

        
        setSelectedNutrInfo(nutrinfo);
    }, [selectedFoods])

    useEffect(() => {
        console.log(selectedNutrInfo.calories)
    }, [selectedNutrInfo])

    const searchForFoods = () => {
        requestParser(selectedDate)
    }

    const saveChoicesHandler = async () => {
        const mealSavedRef = collection(db, "meals_saved");
        try {
            await addDoc(mealSavedRef, {
              userID: auth?.currentUser?.uid,
              meal_plan: selectedFoods,
              nutrient_values: selectedNutrInfo,
              date: selectedDate,
              diningHall: "Ohill Dining Hall"
            });
          }
          catch(e) {
            console.log(e)
          }
    }

    const requestParser = (date) => {
        let jsonInfo = jsonData
        console.log(selectedDate)
        if (!jsonInfo.Date == date)
            return;

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
            <h1 style={{
                marginLeft: "20px"
            }}> Create New Meal Plan</h1>
            <div><button onClick={() => {
                props.setMenuIsOpen(false)
            }}>
                X
            </button>
            </div>
        </div>
        {props.mode == "edit" && <div className="search-bar">
            <label htmlFor="date-search"> Enter a date (e.g 10/19/2024)</label>
            <input type="text" id="date-search" onChange={(e) => {
                setSelectedDate(e.target.value)
            }}/>
            <button onClick={
                searchForFoods
            }>
                <img src={searchIcon} />
            </button>
        </div>}
        <div className="nutritional-info">
            <h1> Nutrional Information </h1>
            <NutrientBar 
                capValue={maxNutValue.calories} 
                currentValue={selectedNutrInfo.calories} 
                nutrient="Calories" 
            />
            <NutrientBar 
                capValue={maxNutValue.totalFat} 
                currentValue={selectedNutrInfo.totalFat} 
                nutrient="Total Fat" 
            />
            <NutrientBar 
                capValue={maxNutValue.cholesterol} 
                currentValue={selectedNutrInfo.cholesterol} 
                nutrient="Cholesterol" 
            />
            <NutrientBar 
                capValue={maxNutValue.sodium} 
                currentValue={selectedNutrInfo.sodium} 
                nutrient="Sodium" 
            />
            <NutrientBar 
                capValue={maxNutValue.totalCarbs} 
                currentValue={selectedNutrInfo.totalCarbs} 
                nutrient="Total Carbohydrates" 
            />
            <NutrientBar 
                capValue={maxNutValue.protein} 
                currentValue={selectedNutrInfo.protein} 
                nutrient="Protein" 
            />
        </div>
        <div className="selected-items">
            <h1>Selected Items</h1>
            <MealTab mealType="Breakfast" foods={selectedFoods[0]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>
            <MealTab mealType="Lunch" foods={selectedFoods[1]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>
            <MealTab mealType="Dinner" foods={selectedFoods[2]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>
        </div>
        {!(props.mode == "view") && <div className="available-additions">
            <h1>Available Items</h1>
            <MealTab mealType="Breakfast" foods={foodInfo[0]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>
            <MealTab mealType="Lunch" foods={foodInfo[1]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>
            <MealTab mealType="Dinner" foods={foodInfo[2]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>
        </div>}
        {
            (props.mode == "edit" || props.mode == "edit-info") &&<button className="submit-button-f"onClick={
            saveChoicesHandler
        }>
            Save
        </button>}
    </div>
}