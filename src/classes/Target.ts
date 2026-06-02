export class Target {
    private hp: number = 50;

    constructor(hp: number) {
        this.hp = hp;
    }

    public updateHp() {
        this.hp -= 10;
    }
}