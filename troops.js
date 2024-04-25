// hitpoints -> health, dph -> damage per hit
// We dont the position of troop while deploting it, so ""
class Troop extends CommonProps {
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
        let attackInterval, currentTarget;
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

        // If all the towers are already destroyed, do nothing
        if (!currentTarget) {
            return;
        }

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
                const troop = document.getElementById(troopObj.id);
                document.querySelector(`.${troopObj.pos}`).removeChild(troop);
                return;
            }

            troopObj.attackTower(coord);

            // Do damage to opponent after weapon reaches their
            setTimeout(() => {
                currentTarget.takeDamage(troopObj.getDPH());
                currentTarget.setHealthBar(currentTarget.calculateHpPercent());
            }, 990);
        }, 1000);
    }

    setHealthBar(percent) {
        const elem = document.querySelector(`.${this.id}color`);
        elem.style.backgroundColor = this.getBarColor(percent);
        elem.style.right = 100 - percent + "%";
    }

    attackTower(target) {}
}

// An archer will have 130 hitpoints
class Archer extends Troop {
    constructor(name) {
        super(130, 30, name);
    }

    attackTower(target) {
        this.inventory.throwWeapon("arrow", this.getCoordinates(), target);
    }
}

// A wizard has 110 hitpoints
class Wizard extends Troop {
    constructor(name) {
        super(110, 50, name);
    }

    attackTower(target) {
        this.inventory.throwWeapon("magic", this.getCoordinates(), target);
    }
}

// A Noir has 100 hitpoints
class Noir extends Troop {
    constructor(name) {
        super(100, 40, name);
    }

    attackTower(target) {
        this.inventory.throwWeapon("bats", this.getCoordinates(), target);
    }
}
