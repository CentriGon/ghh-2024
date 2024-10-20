import "../CSS/Dashboard.css"
import { auth, googleProvider, db } from "../config/firebase"
import { useNavigate } from "react-router-dom"
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';




export const DayCard = (props) => {

    //used for navigating around the web pages
    const navigate = useNavigate()

    //deletes the info when the button is pressed, uses firebase api
    const deleteInfo = async () => {
        try {
            const mealsRef = collection(db, 'meals_saved');
            const q = query(mealsRef, where('userID', '==', auth.currentUser.uid), where('date', '==', props.date));
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              
                const docSnapshot = querySnapshot.docs[0];
                const docRef = doc(db, 'meals_saved', docSnapshot.id);
                await deleteDoc(docRef); 
                console.log(`Deleted document with ID: ${docSnapshot.id}`);
                navigate("/redirect")
            } else {
                console.log('No document found with the specified userID and date.');
            }
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
    }

    //change the settings of menu so that it is in view mode and they can see the values of the current meal plans
    const viewHandler = () => {
        console.log(props.fullInfo)
        props.setSelectedInfo(props.fullInfo.meal_plan)
        props.setMenuIsOpen(true)
        props.setMenuMode("view")
    }

    return <div className="day-card">
        <div className="deco-bar"></div>
        <div className="text">
            <h1> Meal Plan for {props.date} </h1>
            <h3> {props.diningHall}</h3>
            <p> Calories: {props.calories} </p>
            <div className="button-cont">
                <button onClick={viewHandler}>View</button>
                <button onClick={deleteInfo}>Delete </button>
            </div>
            
        </div>
    </div>
}