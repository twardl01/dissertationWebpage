class Credentials {
    constructor() { /*no need for constructor*/ }
    
    //getters
    static get username() {
        return sessionStorage.getItem("botUsername");
    }

    static get OAuth() {
        return sessionStorage.getItem("botOAuth");
    }

    static get channel() {
        return sessionStorage.getItem("botChannel");
    }

    //setters
    static set username(username) {
        sessionStorage.setItem("botUsername",username);
    }

    static set OAuth(oAuth) {
        sessionStorage.setItem("botOAuth",oAuth);
    }

    static set channel(channel) {
        sessionStorage.setItem("botChannel",channel);
    }

    //clears session storage
    static clear() {
        sessionStorage.removeItem("botUsername")
        sessionStorage.removeItem("botOAuth")
        sessionStorage.removeItem("botChannel")
    }
}