



export const DayCard = (props) => {




    return <div className="day-card">
        <div className="deco-bar"></div>
        <div className="text">
            <h1> Meal Plan for {props.date} </h1>
            <h3> {props.diningHall}</h3>
            <p> Calories: {props.calories} </p>
            <div className="button-cont">
                <button>Edit</button>
                <button>Delete </button>
            </div>
            
        </div>
    </div>
}