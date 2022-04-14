class credentials {
    constructor() { /* TODO document why this constructor is empty */ }

    getCredentials() {
        sessionStorage.getItem("botUsername")
        sessionStorage.getItem("botPass")
        sessionStorage.getItem("botChannel")
    }

    setCredentials(newName, newPass, newChannel) {
        sessionStorage.setItem("botUsername",newName)
        sessionStorage.setItem("botPass",newPass)
        sessionStorage.setItem("botChannel",newChannel)
    }

    clearCredentials() {
        sessionStorage.removeItem("botUsername")
        sessionStorage.removeItem("botPass")
        sessionStorage.removeItem("botChannel")
    }
}