import '../styles/globals.css'

import { SnackbarProvider } from 'notistack';
import checkNameToDisplay from "@/components/checkNameToDisplay";
import { useState } from 'react';
import useToken from 'components/useToken';

function MyApp({ Component, pageProps }) {
    const { token, setToken } = useToken();
    const [nameToDisplay, setNameToDisplay] = useState(null);

    if (token && !nameToDisplay) {
        checkNameToDisplay(token, setNameToDisplay);
    }

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="app">
                <Component {...pageProps}
                    token={token}
                    setToken={setToken}
                    nameToDisplay={nameToDisplay}
                    setNameToDisplay={setNameToDisplay}
                />
            </div>
        </SnackbarProvider>
    )
}

export default MyApp

// npm run dev