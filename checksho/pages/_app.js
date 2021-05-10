import '../styles/globals.css'

import useToken from 'components/useToken';

function MyApp({ Component, pageProps }) {
  const { token, setToken } = useToken();

  return (
    <div className="app">
      <Component {...pageProps} token={token} setToken={setToken}/>
    </div>
  )
}

export default MyApp
