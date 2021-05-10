export default function getToken() {
    let token = undefined;
    if (process.browser) {
        token = localStorage.token;
    }
    return token
}
