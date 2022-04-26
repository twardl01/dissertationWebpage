class Credentials {
    constructor() { /*no need for constructor*/ }
    
    //getters
    get username() {
        return sessionStorage.getItem("botUsername");
    }

    get OAuth() {
        return sessionStorage.getItem("botOAuth");
    }

    get channels() {
        return sessionStorage.getItem("botChannels");
    }

    //setters
    set username(username) {
        sessionStorage.setItem("botUsername",username);
    }

    set OAuth(oAuth) {
        sessionStorage.setItem("botOAuth",oAuth);
    }

    set channels(channels) {
        sessionStorage.setItem("botChannels",channels);
    }

    //clears session storage
    clear() {
        sessionStorage.removeItem("botUsername")
        sessionStorage.removeItem("botOAuth")
        sessionStorage.removeItem("botChannel")
    }
}