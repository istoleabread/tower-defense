// pos here is the troop/tower position
// dph -> damage per hit, hitpoints -> health
class GameEntityAttributes {
    constructor(hitpoints, dph, pos) {
        this._totalHP = hitpoints;
        this.hitpoints = hitpoints;
        this._dph = dph;
        this.pos = pos;
        this.inventory = new Weapons();
        this.util = new Utility();
        this.x;
        this.y;
        this.mappings = {
            pos1: "towerFire",
            pos2: "towerCannon",
            pos3: "towerArrow",
            towerFire: "pos1",
            towerCannon: "pos2",
            towerArrow: "pos3",
        };
    }

    getDPH() {
        return this._dph;
    }

    getTotalHP() {
        return this._totalHP;
    }

    calculateHpPercent() {
        return (this.hitpoints / this._totalHP) * 100;
    }

    takeDamage(damage) {
        this.hitpoints = this.hitpoints - damage;
    }

    isActive() {
        return this.hitpoints > 0;
    }

    // calculates and saves coordinates of troops/towers on deployment
    calculateCurrentCoordinates() {
        const ele = document.getElementById(this.id);
        this.x = ele.getBoundingClientRect().x - 25 + ele.getBoundingClientRect().width / 2;
        this.y = ele.getBoundingClientRect().y - 25 + ele.getBoundingClientRect().height / 2;
    }

    getCoordinates() {
        return { x: this.x, y: this.y };
    }

    // Gets the troop/tower in front of you
    getCurrentEnemy() {
        return this.mappings[this.pos];
    }

    getBarColor(healthPercent) {
        if (60 < healthPercent) {
            return "limegreen";
        } else if (30 < healthPercent) {
            return "orange";
        } else {
            return "red";
        }
    }

    setHealthBar() {
        const percent = this.calculateHpPercent() || 0;
        const elem = document.querySelector(`.${this.id}color`);
        if (!elem) return;
        elem.style.backgroundColor = this.getBarColor(percent);
        elem.style.right = 100 - percent + "%";
    }
}
