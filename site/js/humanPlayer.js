class HumanPlayer extends Player {
    constructor(id, engine) {
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', (clickedCellEvent) => this.handleCellClick(clickedCellEvent)));
        super(id);

        this.engine = engine;
    }

    handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        console.log("Processing cell click: " + clickedCellIndex);

        if (!this.engine.isEmpty(clickedCellIndex)) {
            console.log("Cell already used")
            return;
        }

        if (!this.engine.isActive()) {
            console.log("Engine is inactive, ignoring click")
            return;
        }

        if (!this.myTurn) {
            console.log("Not my turn, ignoring click")
            return;
        }


        this.handleCellPlayed(clickedCell, clickedCellIndex);

        console.log("Processed cell click: " + clickedCellIndex);
    }

   handleCellPlayed(clickedCell, clickedCellIndex) {
       this.engine.makeMove(this.id, clickedCellIndex);
       clickedCell.innerHTML = this.id;
   }
}