class Combat {
    constructor() {
        this.towerObjs = [];
        this.troopObjs = [];
        this.errorBox = document.querySelector(".errorMsg");
        this.errorTimeout = "";
    }

    init() {
        this.createTowers();
        this.addListeners();
    }

    createTowers() {
        const fireTower = new FireTower();
        const cannonTower = new CannonTower();
        const archerTower = new ArcherTower();
        this.towerObjs.push(fireTower, cannonTower, archerTower);

        // Since tower area is display flex, center, we need to calculate the coords after all the divs have been added to avoid error
        this.towerObjs.forEach((tower) => {
            tower.calculateCurrentCoordinates();
        });
        console.log(this.towerObjs);
    }

    createTroop(troop) {
        console.log(troop);
        // If there is no empty space in arena, show error
        if (!this.getEmptyTroopPosition()) {
            this.showMsg("Please wait for a position to get empty before deploying a new troop!");
            return;
        }

        switch (troop) {
            case "archer":
                const archer = new Archer("archer");
                this.troopObjs.push(archer);
                this.addTroopToDom(archer);
                archer.calculateCurrentCoordinates();
                return;
            case "wizard":
                const wizard = new Wizard("wizard");
                this.troopObjs.push(wizard);
                this.addTroopToDom(wizard);
                wizard.calculateCurrentCoordinates();
                return;
            case "noir":
                const noir = new Noir("noir");
                this.troopObjs.push(noir);
                this.addTroopToDom(noir);
                noir.calculateCurrentCoordinates();
                return;
            default:
                return;
        }
    }

    addListeners() {
        document.querySelector(".troops").addEventListener("click", (ev) => {
            if (ev.target.classList.contains("troop")) {
                this.createTroop(ev.target.dataset.type);
            }
        });

        // Whenever a new troop is deployed in the arena, notify the towers to attack it by running the callback function
        const arena = document.querySelector(".arena");
        const config = { attributes: false, childList: true, subtree: true };
        const callback = (mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.removedNodes.length) return;

                let targetPos = mutation.addedNodes[0].id;
                let currentTarget = this.troopObjs.find((troop) => {
                    return troop.id === targetPos;
                });

                Tower.prepareAttackOnTroops(currentTarget, this.towerObjs);
            });
        };
        const observer = new MutationObserver(callback);
        observer.observe(arena, config);
    }

    addTroopToDom(troopObj) {
        const troop = document.createElement("div");
        const healthBar = document.createElement("div");
        const healthColor = document.createElement("div");

        troop.className = `arenaTroop ${troopObj.name}`;
        troop.id = troopObj.id;
        troop.title = troopObj.name;
        healthBar.className = `trHealthBar ${troopObj.id}health`;
        healthColor.className = `trHealthColor ${troopObj.id}color`;

        const parentDiv = this.getEmptyTroopPosition();
        const parentPosition = parentDiv.dataset.type;
        troop.dataset.type = parentPosition;
        troopObj.setTroopPos(parentPosition);

        healthBar.appendChild(healthColor);
        troop.appendChild(healthBar);
        parentDiv.appendChild(troop);

        Troop.prepareAttackOnTowers(troopObj, this.towerObjs);
    }

    getEmptyTroopPosition() {
        let emptyPos;
        document.querySelectorAll(".position").forEach((ele) => {
            if (ele.children.length === 0 && !emptyPos) {
                emptyPos = ele;
            }
        });
        return emptyPos;
    }

    showMsg(msg, color = "orangered") {
        if (this.errorTimeout) clearTimeout(this.errorTimeout);
        this.errorBox.textContent = msg;
        this.errorBox.style.backgroundColor = color;
        this.errorTimeout = setTimeout(() => {
            this.errorBox.textContent = "";
        }, 1700);
    }
}

const combat = new Combat();
combat.init();
