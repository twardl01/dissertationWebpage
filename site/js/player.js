class Player {
    constructor(id) {
        this.id = id;
        this.myTurn = false;
    }

    playerChanged(id) {
        if (id == this.id) {
            this.myTurn = true;
        } else {
            this.myTurn = false;
        }
    }

    disable() {
        this.myTurn = false;
    }
}