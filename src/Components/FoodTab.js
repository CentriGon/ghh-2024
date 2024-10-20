import { useEffect, useState } from "react"




export const FoodTab = (props) => {


    const [isVisible, setIsVisible] = useState(false)
    const [shouldAdd, setShouldAdd] = useState("Add to Plan")

    useEffect(() => {
        let obje = props.setSelectedFoods[0]
        let obje2 = obje.find(item => item.period == props.fullFood.period)
        
        let array = [...obje2.products]


        for (let i = 0; i < array.length; i++) {
            
            if (array[i]?.name == props.foodName){
                setShouldAdd("Remove from plan")
                return;
            }
        }

        setShouldAdd("Add to Plan")

    }, [props])

    const addHandler = () => {
    
        let obje = props.setSelectedFoods[0];
        let obje2 = obje.find(item => item.period === props.fullFood.period);

        // Create a new array from obje2.products
        let array = [...obje2.products];

        // Find the index of the item in the array
        let itemIndex = array.findIndex(item => item.name === props.foodName);

        // If the item exists, remove it, otherwise add it
        if (itemIndex !== -1) {
            array.splice(itemIndex, 1);  // Remove the item if it exists
        } else {
            array.push(props.fullFood);  // Add the item if it doesn't exist
        }

        // Update the original obje with the modified products array
        obje.forEach((element, index) => {
            if (element.period === props.fullFood.period) {
                obje[index].products = array;
            }
        });

        // Create a new copy of obje and update the state
        let newob = [...obje];
        props.setSelectedFoods[1](newob);
    }


    return <div className="food-tab">
        <div className="deco-bar"></div>
        <div className="header">
            <h2> {props.foodName}</h2>
            <button className="more-button" onClick={(e) => {
              
                if (isVisible) {
                    setIsVisible(false)
                    e.target.classList.remove("dropped-downed")
                }
                else{
                    setIsVisible(true)
                   
                    e.target.classList.add("dropped-downed")}
            }}> ^ </button>
            {props.isEditAble && <button className="add-button" onClick={addHandler}> {shouldAdd}</button>
            }
        </div>
        {isVisible && (
            <div className="more-info">
                {props.healthInfo.map((item, index) => {
                    if (item.SubList) {
                        return <div className="sub-contain">
                                <p> {item.Name}: {item.Value}{item.Unit}</p>
                                <div className="subList">
                                    {item.SubList.map((item1) => {
                                         <p> {item1.Name}: {item1.Value}{item1.Unit}</p>
                                    })}
                                </div>

                            </div>
                    }
                    if (item.Value) {
                        return  <p> {item.Name}: {item.Value}{item.Unit}</p>
                    }
                })}
            </div>
        )}
    </div>
}