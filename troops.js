class Troop extends GameEntityAttributes {
    static count = 0;
    constructor(hitpoints, dph, name) {
        super(hitpoints, dph, "");
        this.id = name + Troop.count++;
        this.name = name;
        this.x;
        this.y;
    }

    setTroopPos(pos) {
        this.pos = pos;
    }

    static prepareAttackOnTowers(troopObj, towerObjs) {
        let currentTarget;
        const mainTower = troopObj.getCurrentEnemy(); // Get the tower in front of troop
        currentTarget = towerObjs.find((tower) => {
            return tower.pos === mainTower && tower.isActive();
        });
        // If currentTarget is already destroyed, find the first standing tower
        if (!currentTarget) {
            currentTarget = towerObjs.find((tower) => {
                return tower.isActive();
            });
        }
        if (!currentTarget) {
            console.log("All towers destroyed!");
            return;
        }

        Troop.attackOnTower(currentTarget, troopObj, towerObjs);
    }

    static attackOnTower(currentTarget, troopObj, towerObjs) {
        let attackInterval;
        const coord = currentTarget.getCoordinates();
        attackInterval = setInterval(() => {
            // If current tower is destroyed, clearInterval and find new standing tower
            if (!currentTarget.isActive()) {
                clearInterval(attackInterval);
                Troop.prepareAttackOnTowers(troopObj, towerObjs);
                return;
            }
            // If troop is dead, stop attacking and remove from DOM
            if (!troopObj.isActive()) {
                clearInterval(attackInterval);
                troopObj.util.removeTroopFromDOM(troopObj);
                return;
            }
            troopObj.attackTower(coord);

            // Do damage to opponent after weapon reaches their position
            setTimeout(() => {
                currentTarget.takeDamage(troopObj.getDPH());
                currentTarget.util.setHealthBar(currentTarget);
            }, 990);
        }, 1000);
    }

    getTroopProps(parentPosition) {
        return {
            className: `arenaTroop ${this.name}`,
            id: this.id,
            title: this.name,
            dataset: {
                type: parentPosition,
            },
        };
    }

    getHealthProps(bar = true) {
        if (bar) {
            return {
                className: `trHealthBar ${this.id}health`,
            };
        }
        return {
            className: `trHealthColor ${this.id}color`,
        };
    }
}

// An archer will have 260 hitpoints
class Archer extends Troop {
    constructor() {
        super(260, 30, "archer");
    }

    attackTower(target) {
        this.inventory.throwWeapon("arrow", this.getCoordinates(), target);
    }
}

// A wizard has 200 hitpoints
class Wizard extends Troop {
    constructor() {
        super(200, 50, "wizard");
    }

    attackTower(target) {
        this.inventory.throwWeapon("magic", this.getCoordinates(), target);
    }
}

// A Noir has 220 hitpoints
class Noir extends Troop {
    constructor() {
        super(220, 40, "noir");
    }

    attackTower(target) {
        this.inventory.throwWeapon("bats", this.getCoordinates(), target);
    }
}
