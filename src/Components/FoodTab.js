import { useEffect, useState } from "react"




export const FoodTab = (props) => {


    const [isVisible, setIsVisible] = useState(false)
    const [shouldAdd, setShouldAdd] = useState("Add to Plan")

    //checks to see if the food is already on the persons planned meal plan, and if it is, allow them to remove it.
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


    //handles adding it to the planned meal plan. if its already there, this button will remove it
    const addHandler = () => {
    
        let obje = props.setSelectedFoods[0];
        let obje2 = obje.find(item => item.period === props.fullFood.period);

        let array = [...obje2.products];

        let itemIndex = array.findIndex(item => item.name === props.foodName);

        if (itemIndex !== -1) {
            array.splice(itemIndex, 1); 
        } else {
            array.push(props.fullFood);  
        }

        obje.forEach((element, index) => {
            if (element.period === props.fullFood.period) {
                obje[index].products = array;
            }
        });

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