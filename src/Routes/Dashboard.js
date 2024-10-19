import { useEffect, useState } from "react"
import "../CSS/Dashboard.css"
import { auth, googleProvider, db } from "../config/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DayCard } from "../Components/DayCard"
import { useNavigate } from "react-router-dom"
import { SearchMenu } from "../Components/SearchMenu"

export const Dashboard = () => {

    const [name, setName] = useState(null)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
              // If the user is not logged in, redirect to the login page
              navigate('/login');
            }
            if (user) {
                setName(auth.currentUser.displayName)

            }
          });

    }, [])

    return <div className="dashboard">
        {menuIsOpen && (
                <div className="overlay" onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <SearchMenu />
                </div>
        )}
        <div className="top-nav-bar">
            <h2>HoosNutriPlan</h2>
            <h1>Personalized Meal Plan</h1>
            <h4> Welcome, {name}! </h4>
        </div>
        <div className="main-section">
            <div className="cards">
                <DayCard date="09/11/2001" diningHall="Ohill Dining Hall" calories={2001}/>
                <DayCard date="09/11/2001" diningHall="Ohill Dining Hall" calories={2001}/>
                <button onClick={
                    () => {
                        setMenuIsOpen(true)
                        console.log('clicked')
                    }
                }>
                +
                </button>
            </div>
        </div>
    </div>
}