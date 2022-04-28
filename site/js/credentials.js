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

    static get timeframe() {
        let sessionTimeframe = sessionStorage.getItem("botTimeframe");
        return sessionTimeframe == undefined ? 15 : sessionTimeframe;
    }

    static get mode() {
        let sessionMode = sessionStorage.getItem("botMode");
        return sessionMode == undefined ? 0 : sessionMode;
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

    static set timeframe(timer) {
        sessionStorage.setItem("botTimeframe",timer);
    }

    static set mode(mode) {
        sessionStorage.setItem("botMode", mode)
    }
}