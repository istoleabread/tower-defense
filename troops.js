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

    addTroopToDOM(parentDiv) {
        return new Promise((resolve, reject) => {
            const parentPosition = parentDiv.dataset.type;
            this.setTroopPos(parentPosition);

            const troop = this.util.createElement(this.getTroopProps(parentPosition));
            const healthBar = this.util.createElement(this.getHealthProps());
            const healthColor = this.util.createElement(this.getHealthProps(false));

            healthBar.appendChild(healthColor);
            troop.appendChild(healthBar);
            parentDiv.appendChild(troop);

            this.calculateCurrentCoordinates();
            resolve(this);
        });
    }

    // currentTarget -> Tower which the troop will be attacking
    attackOnTower(currentTarget) {
        let attackInterval;
        const coord = currentTarget.getCoordinates();
        attackInterval = setInterval(() => {
            // If current tower is destroyed, clearInterval and find new standing tower
            if (!currentTarget.isActive()) {
                clearInterval(attackInterval);
                this.towerDestroyedEvent();
                return;
            }
            // If troop is dead, stop attacking and remove from DOM
            if (!this.isActive()) {
                clearInterval(attackInterval);
                const troop = document.getElementById(this.id);
                DOMCache[`${this.pos}`].removeChild(troop);
                return;
            }
            this.attackTower(coord);

            // Do damage to opponent after weapon reaches their position
            setTimeout(() => {
                currentTarget.takeDamage(this.getDPH());
                currentTarget.setHealthBar();
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

    towerDestroyedEvent() {
        const event = new CustomEvent("towerDestroyed", { detail: { troop: this } });
        document.dispatchEvent(event);
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
