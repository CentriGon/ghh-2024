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
            <button onClick={() => {

                let obje = props.setSelectedFoods[0]
                let obje2 = obje.find(item => item.period == props.fullFood.period)
                console.log(obje2)
                console.log(obje)
                let array = [...obje2.products]
                
                
                for (let i = 0; i < array.length; i++) {
                    
                    if (array[i]?.name == props.foodName){
                        return;
                    }
                }
                
                array.push(props.fullFood)
                obje.forEach((element, index) => {
                    if (element.period == props.fullFood.period) {
                        obje[index].products = array;
                    }
                });
                let newob = [...obje]
                props.setSelectedFoods[1](newob)
            }}> add</button>
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