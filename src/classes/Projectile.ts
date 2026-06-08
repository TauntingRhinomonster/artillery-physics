export class Projectile {
    private position: [x: number, y: number] = [0, 0];
    private currentVelocity: [vx: number, vy: number] = [0, 0];
    private weight: number; // This is in Kilograms = 27
    private gravity: number = -9.81;
    private dragCoefficient: number; 
    private trajectory: number; // this is Theta
    private deltaTime: number;
    private scale: number;
    private power: number; // In Newtons. It represents _Force_
    

    constructor(trajectory: number, deltaTime: number, weight: number, dragCoefficient: number, power: number, scale: number = 15) {
        // This constructor initializes the variables using user input. When the user fills out the information before firing a round. When the user presses enter, it will initialize a Projectile object based on the inputs recieved.
        if (trajectory > 90 || trajectory < 0) {
            throw new Error("Cannot have a trajectory that is less than 0 or greater than 90!");
        }
        if (power <= 0) {
            throw new Error("Power must be greater than 0!");
        }
        this.weight = weight;
        this.dragCoefficient = dragCoefficient;
        this.deltaTime = deltaTime;
        this.scale = scale;
        this.trajectory = trajectory;
        this.power = power;
        this.currentVelocity = this.calculateInitialVelocity();
        this.position = this.calculateCurrentPosition(this.deltaTime);
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
    public calculateDragForce(dragCoefficient: number): number {
        this.dragCoefficient = dragCoefficient;

        const vx = this.currentVelocity[0];
        const vy = this.currentVelocity[1];
        const speed = Math.hypot(vx, vy);

        return dragCoefficient * speed * speed;
    }
    public updatePhysics(dragCoefficient: number, deltaTime: number) {
        // Only update the physics IF the height is at or greater than 0. When it reaches -1, there is no more calculations required.
        if (this.position[1] >= 0){
            let vx = this.currentVelocity[0];
            let vy = this.currentVelocity[1];
            
            let speed = Math.hypot(vx, vy);
            
            // Only calculate drag if we are actually moving to avoid dividing by zero
            if (speed > 0) {
                let dragForce = this.calculateDragForce(dragCoefficient);
                let dragAcceleration = dragForce / this.weight;
                let dragAccX = dragAcceleration * (vx / speed);
                let dragAccY = dragAcceleration * (vy / speed);
                
                this.currentVelocity[0] = vx - (dragAccX * deltaTime);
                this.currentVelocity[1] = vy - (dragAccY * deltaTime) + (this.gravity * deltaTime);
            } else {
                // If we aren't moving, only gravity affects us
                this.currentVelocity[1] = vy + (this.gravity * deltaTime);
            }

            // Finally, move the projectile based on the new velocities
            this.calculateCurrentPosition(deltaTime);
        }
        
    }

    // AI gave this to me to show me how I can now draw it on the console.
    public drawToGrid(
        grid: string[][],
        maxWidth: number,
        maxHeight: number,
        symbol: string = "*"
    ): void {
        let x = Math.round(this.position[0] / this.scale);
        let y = Math.round(this.position[1] / this.scale);

        if (x >= 0 && x < maxWidth && y >= 0 && y < maxHeight) {
            // Invert the Y axis: index 0 is the top row, physics Y=0 is the bottom.
            let arrayY = (maxHeight - 1) - y;
            grid[arrayY][x] = symbol;
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