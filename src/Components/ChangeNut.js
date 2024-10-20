import { useState, useEffect } from "react"
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";


export const ChangeNutrtionalValues = () => {

    const navigate = useNavigate()

    //uses firebase to see if the user is logged in, if they are, gets their nutritional information and stores it in the useState variable
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

    //the cap/maximum value for nutritional information, will be used to adjust the bars
    const [maxNutValue, setMaxNutValue] = useState({
        calories: 2000,
        totalFat: 65,
        cholesterol: 300,
        sodium: 2400,
        totalCarbs: 300,
        protein: 50
    })

    //uses firebase firestore to store the data to a database for fruther use later
    const saveInfoHandler = async (e) => {
        e.target.disabled = true; 
        const mealSavedRef = collection(db, "nutritional_pref");
    
       
        const userID = auth?.currentUser?.uid;
    
        const q = query(mealSavedRef, where("userID", "==", userID));
    
        try {
            const querySnapshot = await getDocs(q);
    
          
            if (!querySnapshot.empty) {
                const docID = querySnapshot.docs[0].id; 
                const docRef = doc(db, "nutritional_pref", docID);
    
                await updateDoc(docRef, {
                    nutrient_pref: maxNutValue
                });
            } 
         
            else {
                await addDoc(mealSavedRef, {
                    userID: userID,
                    nutrient_pref: maxNutValue
                });
            }
    
    
            navigate("/redirect");
    
        } catch (error) {
            console.error("Error saving or updating document: ", error);
        } finally {
            e.target.disabled = false; // Re-enable the button
        }
    };

    
    return <div className="change-nut" onClick={(e) => {
        e.stopPropagation()
    }}>
        <div className="deco-bar" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px"
        }}><h1 style={{
            fontSize: "26px"
        }}> Change Nutrional Goals</h1></div>
        <div className="nut-input">
            <label htmlFor="calories">Calories</label>
            <input type="number" id="calories" value={maxNutValue.calories} onChange={(e) => {
                let g = {...maxNutValue};
                g.calories = e.target.value;
                setMaxNutValue(g)
            }}/>
        </div>
        <div className="nut-input">
            <label htmlFor="totalFat">Total Fat</label>
            <input type="number" id="totalFat" value={maxNutValue.totalFat} onChange={(e) => {
                let g = {...maxNutValue};
                g.totalFat = e.target.value;
                setMaxNutValue(g)
            }}/>
        </div>
        <div className="nut-input">
            <label htmlFor="cholesterol">Cholesterol</label>
            <input type="number" id="cholesterol" value={maxNutValue.cholesterol} onChange={(e) => {
                let g = {...maxNutValue};
                g.cholesterol = e.target.value;
                setMaxNutValue(g)
            }}/>
        </div>
        <div className="nut-input">
            <label htmlFor="sodium">Sodium</label>
            <input type="number" id="sodium" value={maxNutValue.sodium} onChange={(e) => {
                let g = {...maxNutValue};
                g.sodium = e.target.value;
                setMaxNutValue(g)
            }}/>
        </div>
        <div className="nut-input">
            <label htmlFor="totalcarbs">Total Carbohydrates</label>
            <input type="number" id="totalcarbs" value={maxNutValue.totalCarbs} onChange={(e) => {
                let g = {...maxNutValue};
                g.totalCarbs = e.target.value;
                setMaxNutValue(g)
            }}/>
        </div>
        <div className="nut-input">
            <label htmlFor="protein">Protein</label>
            <input type="number" id="protein" value={maxNutValue.protein} onChange={(e) => {
                let g = {...maxNutValue};
                g.protein = e.target.value;
                setMaxNutValue(g)
            }}/>
        </div>

        <button onClick={saveInfoHandler}> Save </button>
    </div>
}