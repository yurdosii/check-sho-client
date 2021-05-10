// Custom HOOK to store JWT token in LocalStorage
// https://www.digitalocean.com/community/tutorials/
// how-to-add-login-authentication-to-react-applications

import {useState} from 'react';

export default function useToken() {
    const getToken = () => {
        console.log(!process);
        let token = undefined;
        if (process.browser) {
            token = localStorage.token;
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
