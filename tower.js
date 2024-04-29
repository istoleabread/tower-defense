class Tower extends GameEntityAttributes {
    static attackList = {}; // maintain info regarding all towers ongoing combat
    constructor(hitpoints, dph, pos) {
        super(hitpoints, dph, pos);
        this.id = pos;
        this.addTowerToDOM();
    }

    addTowerToDOM() {
        const tower = this.util.createElement(this.getTowerProps());
        const healthBar = this.util.createElement(this.getHealthProps());
        const healthColor = this.util.createElement(this.getHealthProps(false));

        healthBar.appendChild(healthColor);
        tower.appendChild(healthBar);
        DOMCache.towerArea.appendChild(tower);

        this.setHealthBar();
    }

    findAndAttack() {
        if (!Object.values(Tower.attackList).length) return; // If there is no combat ongoing, return
        const target = Object.values(Tower.attackList)[0][0];
        const troopFound = new CustomEvent("troopFound", {
            detail: { target: target },
        });
        document.dispatchEvent(troopFound);
    }

    // currentTarget -> troop which the tower will be attacking
    attackOnTroop(currentTarget) {
        let attackInterval;
        attackInterval = setInterval(() => {
            // If tower is destroyed or troop is dead, stop attacking
            if (!currentTarget.isActive() || !this.isActive()) {
                clearInterval(attackInterval);
                delete Tower.attackList[this.pos];
                this.findAndAttack();
                return;
            }
            this.attackTroop(currentTarget);

            // Do damage to opponent after weapon reaches their position
            setTimeout(() => {
                currentTarget.takeDamage(this.getDPH());
                currentTarget.setHealthBar();
            }, 890);
        }, 900);
        Tower.attackList[this.pos] = [currentTarget, attackInterval];
    }

    getTowerProps() {
        return {
            className: `tower ${this.pos}`,
            id: this.pos,
            title: this.pos,
        };
    }

    getHealthProps(bar = true) {
        if (bar) {
            return {
                className: `toHealthBar ${this.id}health`,
            };
        }
        return {
            className: `toHealthColor ${this.id}color`,
        };
    }
}

class FireTower extends Tower {
    constructor() {
        super(600, 40, "towerFire");
    }

    attackTroop(target) {
        this.inventory.throwWeapon("fire", this.getCoordinates(), target);
    }
}

class CannonTower extends Tower {
    constructor() {
        super(650, 50, "towerCannon");
    }

    attackTroop(target) {
        this.inventory.throwWeapon("cannon", this.getCoordinates(), target);
    }
}

class ArcherTower extends Tower {
    constructor() {
        super(500, 30, "towerArrow");
    }

    attackTroop(target) {
        this.inventory.throwWeapon("arrow", this.getCoordinates(), target);
    }
}
