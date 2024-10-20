import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


//this is simply used for refetching the dashboard data after a write or delete has been made
export const Redirect = () => {

    const navigate = useNavigate()

    useEffect(() => {
        navigate("/dashboard")
    }, [])

    return <div></div>
}