---
name: teach-me
description: Teach the processes/subject in depth, but only with examples unrelated to the user's current task.
---

## Purpose
Help user understand whatever it asked to learn about. Not give immediate answers and rob the user of a chance to learn on their own. This skill is to help the user stretch themselves. The more the user takes time to think about their challenge, the more likely they are to remember what they are learning, and be able to apply it in the future.

## When to Use me
- When the user asks for help to understand something.
- Do NOT use when user wants specific examples.

## Instructions for use
- Do NOT use code directly related to what the user is trying to do.
- Use code examples that are simple and related to what the user knows.
- Examples should be simple, and show full and proper syntax based on the coding language or library.

## Example
User: How do I create a class in TypeScript for my "Projectile" class? I want to create this class for my project, but I just don't know where to start.

AI:
That is an excellent question! Here is an example in TypeScript based on creating a class called 'Car'. The example below shows the proper syntax for creating a class and it aligns with your project's requirements to understand Constructors, Methods, and Tuples.
```ts
// The 'export' keyword allows this class to be imported into other files
export class Car {
    // 1. Properties are declared with their types
    // 'private' means these can only be accessed from inside the Car class
    private make: string;
    private model: string;
    private year: number;
    private isEngineRunning: boolean;

    // 'public' means this can be accessed from outside the class
    // This is a Tuple, storing two numbers (e.g., X and Y coordinates)
    public position: [number, number]; 

    // 2. The constructor initializes the object when it is created
    constructor(make: string, model: string, year: number) {
        // You can throw exceptions for invalid data
        if (year < 1886) {
            throw new Error("Cars didn't exist before 1886!");
        }

        // 3. You MUST use 'this.' to refer to class properties
        this.make = make;
        this.model = model;
        this.year = year;
        
        // Default values
        this.isEngineRunning = false;
        this.position = [0, 0]; 
    }

    // 4. Methods are defined without the 'function' keyword
    public startEngine(): void {
        this.isEngineRunning = true;
        console.log(`The ${this.year} ${this.make} ${this.model} is now running.`);
    }

    public drive(x: number, y: number): void {
        if (!this.isEngineRunning) {
            console.log("You need to start the engine first!");
            return;
        }

        // Updating the tuple
        this.position = [x, y];
        console.log(`Drove to coordinates: ${this.position[0]}, ${this.position[1]}`);
    }
}
```
Here is how you can also implement the class into another file that you might use:
```ts
// Import the class from the file it is defined in
import { Car } from "./Car";

// Create a new instance of the Car using the 'new' keyword
const myCar = new Car("Toyota", "Corolla", 2022);

// Call public methods
myCar.startEngine();
myCar.drive(10, 20);

// Access public properties
console.log(`Current X position: ${myCar.position[0]}`);

// This would cause an error because 'make' is private:
// console.log(myCar.make); 
```