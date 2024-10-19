import { useState } from "react"
import "../CSS/Dashboard.css"
import { DayCard } from "../Components/DayCard"

export const Dashboard = () => {

    const [name, setName] = useState(null)




    return <div className="dashboard">
        <div className="top-nav-bar">
            <h2>HoosNutriPlan</h2>
            <h1>Personalized Meal Plan</h1>
            <h4> Welcome, {name}! </h4>
        </div>
        <div className="main-section">
            <DayCard />
        </div>
    </div>
}