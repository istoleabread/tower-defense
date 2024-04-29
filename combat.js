class Combat {
    constructor() {
        this.towerObjs = [];
        this.troopObjs = [];
        this.util = new Utility();
    }

    init() {
        this.createTowers();
        this.addListeners();
    }

    addListeners() {
        // Adding new troops on click event
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

                this.prepareAttackOnTroops(currentTarget);
            });
        };
        const observer = new MutationObserver(callback);
        observer.observe(arena, config);

        // Tower destroyed event
        document.addEventListener("towerDestroyed", (ev) => {
            const { troop } = ev.detail;
            this.prepareAttackOnTowers(troop);
        });

        // Empty Troop Found event
        document.addEventListener("troopFound", (ev) => {
            const { target } = ev.detail;
            this.prepareAttackOnTroops(target);
        });
    }

    getEmptyTroopPosition() {
        let emptyPos;
        for (const pos of DOMCache.allPositions) {
            if (pos.children.length === 0) {
                emptyPos = pos;
                break;
            }
        }
        return emptyPos;
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
                archer.addTroopToDOM(parentPos).then(() => {
                    this.prepareAttackOnTowers(archer);
                });
                return;
            case "wizard":
                const wizard = new Wizard();
                this.troopObjs.push(wizard);
                wizard.addTroopToDOM(parentPos).then(() => {
                    this.prepareAttackOnTowers(wizard);
                });
                return;
            case "noir":
                const noir = new Noir();
                this.troopObjs.push(noir);
                noir.addTroopToDOM(parentPos).then(() => {
                    this.prepareAttackOnTowers(noir);
                });
                return;
            default:
                return;
        }
    }

    prepareAttackOnTowers(troop) {
        let currentTarget;
        const mainTower = troop.getCurrentEnemy(); // Get the tower in front of troop
        currentTarget = this.towerObjs.find((tower) => {
            return tower.pos === mainTower && tower.isActive();
        });
        // If currentTarget is already destroyed, find the first standing tower
        if (!currentTarget) {
            currentTarget = this.towerObjs.find((tower) => {
                return tower.isActive();
            });
        }
        if (!currentTarget) {
            console.log("All towers destroyed!");
            this.util.showMsg("All towers destroyed!", "green");
            return;
        }

        troop.attackOnTower(currentTarget);
    }

    prepareAttackOnTroops(currentTarget) {
        if (!currentTarget.isActive()) {
            return;
        }
        for (const tower of this.towerObjs) {
            // if tower is already destroyed, skip the loop
            if (!tower.isActive()) {
                continue;
            }
            // if current target is the tower's main enemy
            if (currentTarget.pos === tower.getCurrentEnemy()) {
                // If tower is already in a combat other than its main enemy, leave that combat and start a new combat with its main enemy
                if (Tower.attackList[tower.pos]) {
                    clearInterval(Tower.attackList[tower.pos][1]);
                    delete Tower.attackList[tower.pos];
                }
                tower.attackOnTroop(currentTarget);
            } else if (!Tower.attackList[tower.pos]) {
                // If tower is not already occupied with its main enemy, attack the troop at any position
                tower.attackOnTroop(currentTarget);
            }
        }
    }
}

const combat = new Combat();
combat.init();
