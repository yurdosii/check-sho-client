import axios from 'axios';
import jwt_decode from "jwt-decode";

export default function checkNameToDisplay(token, setNameToDisplay) {
    const decoded = jwt_decode(token);
    const user_id = decoded.user_id;
    const API_URL = "http://127.0.0.1:8000/api"

    axios.get(
        `${API_URL}/users/${user_id}/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    ).then(res => {
        console.log("getNameToDisplay");
        // console.log(res);
        // console.log();

        setNameToDisplay(res.data.username);
    }).catch(error => {
        console.log(error)
    })
}
