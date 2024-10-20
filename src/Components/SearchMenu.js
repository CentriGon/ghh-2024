import { useEffect, useState } from "react"
import "../CSS/SearchMenu.css"
import searchIcon from "../images/search-icon.png"
import { MealTab } from "./DayTab"
import { auth, db } from "../config/firebase"
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth"
import "../CSS/MenuStyle.css"
import { NutrientBar } from "./NutrientInfoBar"
import { useNavigate } from "react-router-dom"
import isLoadingIcon from "../images/loadingIcon.gif"


export const SearchMenu = (props) => {

    const navigate = useNavigate()

    //the various variables needed to use the serach menu
    const [foodInfo, setFoodInfo] = useState([{
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
    },
    {
        period: "Brunch",
        products: []
    },
    {
        period: "All day",
        products: []
    }]);
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
            },
            {
                period: "Brunch",
                products: []
            },
            {
                period: "All day",
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
        totalFat: 65,
        cholesterol: 300,
        sodium: 2400,
        totalCarbs: 300,
        protein: 50
    })
    const [selectedDate, setSelectedDate] = useState("")
    const [diningLocation, setDiningLocation] = useState({
        code: 695,
        name: "Ohill Dining Hall"
    })
    const [isLoading, setIsLoading] = useState(false)


    //fetches the nutrtional preferences for the user if they exist
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
            
              navigate('/login');
            }
            if (user) {
            
                const mealsRef = collection(db, 'nutritional_pref'); 
                const q = query(mealsRef, where('userID', '==', user.uid)); 

                try {
                    const querySnapshot = await getDocs(q); 

                    const documents = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    
                    
                    if (documents.length) {
                        setMaxNutValue(documents[0].nutrient_pref)
                    }
                } catch (error) {
                    console.error('Error retrieving documents:', error);
                }
            }
          });

    }, [])


    //each time the selected foods change, update the caloric values information
    useEffect(() => {

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


    //used for fetching data from backend
    const fetcher = async (url) => {
        let res = null
        await fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response as JSON
            })
            .then((data) => {
                console.log(data)
                res = data
            })
            .catch((error) => {
                console.log(error)
        });

        return res;
    }

    //used for making the query that searches for the foods, and sends it to the formatters
    const searchForFoods = async () => {

        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

        if (!datePattern.test(selectedDate))
            return;

        console.log(diningLocation.code)

        setIsLoading(true)
        let arr = [[await fetcher(`https://my-web-server-3zzi.onrender.com/api/menu?location=${diningLocation.code}&date=${selectedDate}&period=${1421}`), "Breakfast"]]
        arr.push([await fetcher(`https://my-web-server-3zzi.onrender.com/api/menu?location=${diningLocation.code}&date=${selectedDate}&period=${1422}`), "All day"])
        arr.push([await fetcher(`https://my-web-server-3zzi.onrender.com/api/menu?location=${diningLocation.code}&date=${selectedDate}&period=${1423}`), "Lunch"])
        arr.push([await fetcher(`https://my-web-server-3zzi.onrender.com/api/menu?location=${diningLocation.code}&date=${selectedDate}&period=${1424}`), "Dinner"])
        
        setIsLoading(false)
        let arra = null;
        for (let i = 0 ; i < arr.length; i++) {
            if (arr[i][0])
                arra = requestParser(selectedDate, arr[i][0], arr[i][1], arra)

        }

        setFoodInfo(arra)
    }

    //saves the choices that hte user has made to the database
    const saveChoicesHandler = async () => {
        const mealSavedRef = collection(db, "meals_saved");
        try {
            await addDoc(mealSavedRef, {
              userID: auth?.currentUser?.uid,
              meal_plan: selectedFoods,
              nutrient_values: selectedNutrInfo,
              date: selectedDate,
              diningHall: diningLocation.name
            }).then((data) => {
                navigate("/redirect")
            });

          }
          catch(e) {
            console.log(e)
          }
    }

    //parses the json data that was recieved from the request
    const requestParser = (date, data, pname, arra) => {
        let jsonInfo = data
        console.log("doing: ", jsonInfo)

        //console.log(jsonInfo)
        //console.log(jsonInfo.Menu.MenuProducts[0].PeriodId)
        //console.log(jsonInfo.Menu.MenuPeriods[parseInt(jsonInfo.Menu.MenuProducts[0].PeriodId) - 1422])

        let period = pname
        console.log(pname)
       

        let updatedArray = {
            period: period,
            products: []
        }
        

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
            updatedArray.products.push(foodInf)
        }

        let arr = arra? [...arra] : [...foodInfo]
        for (let i = 0; i < foodInfo.length; i++) {
            console.log("scan: " + foodInfo[i].period) 
            if (foodInfo[i].period == period) {
                arr[i] = updatedArray
                break;
            }
            
        }

        console.log("arr", arr)
        
        return arr;
    }
    

    //loads all the components
    return <div className="search-menu" onClick={(e) => {
        e.stopPropagation()
    }}>
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
            <div className="select-dining">
                <label htmlFor="sel-loc"> Select Dining Location </label>
                <select id="sel-loc" value={diningLocation.code} onChange={(e) => {
                    if (e.target.value == "695") {
                        setDiningLocation({
                            code: e.target.value,
                            name: "Ohill Dining Hall",
                        })
                    }
                    else if (e.target.value == "704") {
                        setDiningLocation({
                            code: e.target.value,
                            name: "Newcomb Dining Hall",
                        })
                    }

                    console.log(diningLocation)

                }}> 
                    <option value={"695"}> Observatory Hill </option>
                    <option value={"704"}> Newcomb Hall</option>
                </select>
            </div>

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
            {selectedFoods[0].products.length > 0 && <MealTab mealType="Breakfast" foods={selectedFoods[0]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {selectedFoods[1].products.length > 0 && <MealTab mealType="Lunch" foods={selectedFoods[1]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {selectedFoods[2].products.length > 0 &&  <MealTab mealType="Dinner" foods={selectedFoods[2]} food={selectedFoods} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {selectedFoods[3].products.length > 0 &&  <MealTab mealType="Brunch" foods={selectedFoods[3]} food={selectedFoods} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {selectedFoods[4].products.length > 0 &&  <MealTab mealType="All day" foods={selectedFoods[4]} food={selectedFoods} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {(!selectedFoods[0].products.length && !selectedFoods[1].products.length && !selectedFoods[2].products.length && !selectedFoods[3].products.length && !selectedFoods[4].products.length) && <h2> When you add food, it will appear here</h2>}
        </div>
        {!(props.mode == "view") && <div className="available-additions">
            <h1>Available Items</h1>
            {foodInfo[0].products.length > 0 && <MealTab mealType="Breakfast" foods={foodInfo[0]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {foodInfo[1].products.length > 0 && <MealTab mealType="Lunch" foods={foodInfo[1]} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {foodInfo[2].products.length > 0 &&  <MealTab mealType="Dinner" foods={foodInfo[2]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {foodInfo[3].products.length > 0 &&  <MealTab mealType="Brunch" foods={foodInfo[3]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {foodInfo[4].products.length > 0 &&  <MealTab mealType="All day" foods={foodInfo[4]} food={foodInfo} setSelectedFoods={[selectedFoods, setSelectedFoods]} isEditAble={isEditAble}/>}
            {(!foodInfo[0].products.length && !foodInfo[1].products.length && !foodInfo[2].products.length && !foodInfo[3].products.length && !foodInfo[4].products.length && !isLoading) && <h2> Try Searching for a specific date</h2>}
            {isLoading && <img src={isLoadingIcon} className="loading-icon" />}
        </div>}
        {
            (props.mode == "edit" || props.mode == "edit-info") &&<button className="submit-button-f"onClick={(e) => {
                e.target.disabled = true;
                saveChoicesHandler();
            }
        }>
            Save
        </button>}
    </div>
}