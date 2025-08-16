export const getAuthToken = (): string | null => {
    try {
        const persistedAuth = localStorage.getItem("persist:auth");
        if (!persistedAuth) return null;

        const authData = JSON.parse(persistedAuth);
        const token = JSON.parse(authData.token);
        return token.replace(/^"|"$/g, "");
    } catch (error) {
        console.error("Error parsing auth token:", error);
        return null;
    }
};
