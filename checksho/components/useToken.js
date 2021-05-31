// Custom HOOK to store JWT token in LocalStorage
// https://www.digitalocean.com/community/tutorials/
// how-to-add-login-authentication-to-react-applications

import jwt_decode from "jwt-decode";
import {useState} from 'react';

export const isTokenExpired = (token) => {
    const decodedToken = jwt_decode(token)
    const today = new Date();

    let result = false;
    if (decodedToken.exp * 1000 < today.getTime()) {
        console.log("Expired token")
        result = true;
    } else {
        console.log("Valid token")
    }
    return result
}

export default function useToken() {
    const getToken = () => {
        let token = undefined;
        if (process.browser) {
            const saved_token = localStorage.token;

            if (saved_token && !isTokenExpired(saved_token)) {
                token = localStorage.token;
            } else {
                token = undefined;
            }
        }
        return token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = token => {
        localStorage.setItem('token', token);
        setToken(token);
    }

    return {
        setToken: saveToken,
        token
    }
}
