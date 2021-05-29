import '../styles/globals.css'

import { SnackbarProvider } from 'notistack';
import useToken from 'components/useToken';

function MyApp({ Component, pageProps }) {
    const { token, setToken } = useToken();

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="app">
                <Component {...pageProps} token={token} setToken={setToken} />
            </div>
        </SnackbarProvider>
    )
}

export default MyApp

// npm run dev