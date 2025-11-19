const backendUrl = "http://localhost:8080"
export const BackendPaths = {
    "auth": {
        "signUp": `${backendUrl}/api/v1/auth/sign-up`,
        "signIn": `${backendUrl}/api/v1/auth/sign-in`,
        "signOut": `${backendUrl}/api/v1/auth/sign-out`,
        "refresh": `${backendUrl}/api/v1/auth/refresh`,
    },
    "user": {
        "me": `${backendUrl}/api/v1/user/me`
    },
}
