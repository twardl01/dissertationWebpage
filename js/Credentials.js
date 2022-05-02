class Credentials {
    constructor() { /*no need for constructor*/ }
    //deals with the session storage management
    //setters and getters to retrieve data

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

    //ternary deals with unassigned values for timeframe & mode
    static get timeframe() {
        let sessionTimeframe = sessionStorage.getItem("botTimeframe");
        return sessionTimeframe == undefined ? 15000 : sessionTimeframe;
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

    static isDefined() {
        return Credentials.channel != undefined && Credentials.OAuth != undefined && Credentials.username != undefined;
    }
}