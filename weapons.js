class Weapons {
    throwWeapon(weaponType, origin, target) {
        const div = document.createElement("div");
        div.className = `weapon ${weaponType}`;

        const animationType = [
            { transform: `translate(${origin.x}px, ${origin.y}px)` },
            { transform: `translate(${target.x}px, ${target.y}px)` },
        ];
        const animationOptions = {
            duration: 1000,
            iterations: 1,
            fill: "forwards",
        };

        document.body.appendChild(div);
        div.animate(animationType, animationOptions);
        setTimeout(() => {
            document.body.removeChild(div);
        }, 1000);
    }
}
