import '../styles/globals.css'

import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }) {

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="app">
                <Component {...pageProps} />
            </div>
        </SnackbarProvider>
    )
}

export default MyApp

// npm run dev