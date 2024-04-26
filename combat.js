class Combat {
    constructor() {
        this.towerObjs = [];
        this.troopObjs = [];
        this.allPositions = document.querySelectorAll(".position");
        this.util = new Utility();
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
        const parentPos = this.getEmptyTroopPosition();
        // If there is no empty space in arena, show error
        if (!parentPos) {
            this.util.showMsg(
                "Please wait for a position to get empty before deploying a new troop!"
            );
            return;
        }

        switch (troop) {
            case "archer":
                const archer = new Archer();
                this.troopObjs.push(archer);
                this.util.addTroopToDOM(archer, parentPos, this.towerObjs);
                archer.calculateCurrentCoordinates();
                return;
            case "wizard":
                const wizard = new Wizard();
                this.troopObjs.push(wizard);
                this.util.addTroopToDOM(wizard, parentPos, this.towerObjs);
                wizard.calculateCurrentCoordinates();
                return;
            case "noir":
                const noir = new Noir();
                this.troopObjs.push(noir);
                this.util.addTroopToDOM(noir, parentPos, this.towerObjs);
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
                if (mutation.removedNodes.length) return; // Do nothing if a troop is removed

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

    getEmptyTroopPosition() {
        let emptyPos;
        this.allPositions.forEach((ele) => {
            if (ele.children.length === 0 && !emptyPos) {
                emptyPos = ele;
            }
        });
        return emptyPos;
    }
}

const combat = new Combat();
combat.init();
