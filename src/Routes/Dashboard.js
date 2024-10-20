import { useEffect, useState } from "react"
import "../CSS/Dashboard.css"
import { auth, googleProvider, db } from "../config/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DayCard } from "../Components/DayCard"
import { useNavigate } from "react-router-dom"
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { SearchMenu } from "../Components/SearchMenu"

export const Dashboard = () => {

    const [name, setName] = useState(null)
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [fetchedResources, setFetchedResources] = useState([])
    const [menuMode, setMenuMode] = useState("edit")

    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
            
              navigate('/login');
            }
            if (user) {
                setName(auth.currentUser.displayName)
                const mealsRef = collection(db, 'meals_saved'); // Reference to the collection
                const q = query(mealsRef, where('userID', '==', user.uid)); // Create the query

                try {
                    const querySnapshot = await getDocs(q); // Execute the query

                    const documents = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    
                    console.log(documents);
                    setFetchedResources(documents)
                } catch (error) {
                    console.error('Error retrieving documents:', error);
                }
            }
          });

    }, [])

    useEffect(() => {
        console.log(fetchedResources)
    }, [fetchedResources])

    return <div className="dashboard">
        {menuIsOpen && (
                <div className="overlay" onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <SearchMenu mode={menuMode} selectedItems={selectedInfo} setMenuIsOpen={setMenuIsOpen}/>
                </div>
        )}
        <div className="top-nav-bar">
            <h2>HoosNutriPlan</h2>
            <h1>Personalized Meal Plan</h1>
            <h4> Welcome, {name}! </h4>
        </div>
        <div className="main-section">
            <div className="cards">
                {fetchedResources.map((item) => {
                    return <DayCard date={item.date} setMenuMode={setMenuMode} setMenuIsOpen={setMenuIsOpen} setSelectedInfo={setSelectedInfo} diningHall={item.diningHall} fullInfo={item} calories={item.nutrient_values.calories} />
                })}
                <button onClick={
                    (e) => {
                        if (setMenuIsOpen) {
                            e.target.classList.add("let-hover")
                        }
                        else {
                            e.target.classList.remove("let-hover")
                        }
                        setMenuMode("edit")
                        setSelectedInfo(null)
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