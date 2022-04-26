class Credentials {
    constructor() { /* TODO document why this constructor is empty */ }
    
    get username() {
        return sessionStorage.getItem("botUsername");
    }

    get OAuth() {
        return sessionStorage.getItem("botOAuth");
    }

    get channels() {
        return sessionStorage.getItem("botChannels");
    }

    set username(username) {
        sessionStorage.setItem("botUsername",username);
    }

    set OAuth(oAuth) {
        sessionStorage.setItem("botOAuth",oAuth);
    }

    set channels(channels) {
        sessionStorage.setItem("botChannels",channels);
    }

    clear() {
        sessionStorage.removeItem("botUsername")
        sessionStorage.removeItem("botOAuth")
        sessionStorage.removeItem("botChannel")
    }
}