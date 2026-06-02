export class Projectile {
    private position: [x: number, y: number] = [0, 0];
    private currentVelocity: [vx: number, vy: number] = [0, 0];
    private weight: number = 27; // This is in Kilograms
    private gravity: number = -9.81
    private dragCoefficient: number; 
    private trajectory: number; // this is Theta
    private deltaTime: number;
    private power: number; // In Newtons. It represents _Force_

    constructor(trajectory: number) {
        // This constructor initializes the variables using user input. When the user fills out the information before firing a round. When the user presses enter, it will initialize a Projectile object based on the inputs recieved.
        if (trajectory > 90 || trajectory < 0) {
            throw new Error("Cannot have a trajectory that is less than 0 or greater than 90!");
        }
        
        this.trajectory = trajectory;
        this.power = this.weight * 1500;
        // Calculate the initial velocity
    }

    // INSANE METHODS! :o
    public calculateInitialVelocity(): [number, number] {
        let time: number = 0.05;
        let initialVelocity: number = (this.power * time) / this.weight; // the math for the hypotenuse
        // find the VX and VY using Trig functions
        let radians = this.trajectory * (Math.PI / 180)
        let vx: number = initialVelocity * (Math.cos(radians));
        let vy: number = initialVelocity * (Math.sin(radians));
        this.currentVelocity = [vx, vy];
        return this.currentVelocity;
    }
    public calculateCurrentPosition(deltaTime: number): [number, number] {
        // Distance = Speek * Time
        let currentX = this.position[0];
        let currentY = this.position[1];

        let vx = this.currentVelocity[0];
        let vy = this.currentVelocity[1];

        let newX = currentX + (vx * deltaTime);
        let newY = currentY + (vy * deltaTime);

        this.position = [newX, newY];

        return this.position;
    }
    public calculateDragCoefficient(dragCoefficient: number): number {
        this.dragCoefficient = dragCoefficient;

        const vx = this.currentVelocity[0];
        const vy = this.currentVelocity[1];
        const speed = Math.hypot(vx, vy);

        return dragCoefficient * speed * speed;
    }
    public updatePhysics(dragCoefficient: number) {
        // Only update the physics IF the height is greater than 0. When it reaches zero, there is no more calculations required.
        if (this.position[1] > 0){
            let vx = this.currentVelocity[0];
            let vy = this.currentVelocity[1];
            let drag = this.calculateDragCoefficient(dragCoefficient);
            this.currentVelocity[0] = vx - drag; // This math I am NOT certain of.
            this.currentVelocity[1] = vy + (this.gravity * this.deltaTime);
        }
    }
    
    // Your typical methods :D
    public getPositoin (): [number, number] {
        return this.position;
    }
    public getTrajectory(): number {
        return this.trajectory;
    }
    public getPower(): number {
        return this.power;
    }
    public getWeight(): number {
        return this.weight;
    }

}