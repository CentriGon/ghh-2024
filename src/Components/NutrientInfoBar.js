import { useEffect, useState } from "react"




export const NutrientBar = (props) => {

    const [percentage, setPercentage] = useState(0)
    const [truePercentage, setTruePercentage] = useState(0)


    useEffect(() => {
        let truePercentage = Math.round(props.currentValue / props.capValue * 100)
        let p = Math.min(truePercentage, 100)

        setTruePercentage(truePercentage)
        setPercentage(p)
        
    }, [props])



    return <div className="nut">
            <h2> {props.nutrient}: {props.currentValue} ({truePercentage}%)</h2>
            <div className="red-background">
            <div className="blue-background" style={{
                width: percentage + "%",
                background: "green",
                height: "100%"
            }}></div>
        </div>
    </div>
}