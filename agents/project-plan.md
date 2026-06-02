# 10-Hour Project Roadmap
The following is the plan for how I am creating the artillery physics game using TypeScript.

## Phase 1: Architecture & Typing (Hours 1–3)

* **The Setup:** Getting your TypeScript compiler (`tsc`) running and linking it to a basic `index.html` file.
* **The Blueprint:** Designing your core `Projectile` and `Target` classes.
* **Hitting the Rubric:** This is where you define your Variables, Arrays (to store past attempts), and Tuples (e.g., storing a 2D vector as `[number, number]`).
* **The Stretch Goal:** Writing the logic that throws an Exception if the user tries to fire with a negative velocity or an angle outside of 0 to 90 degrees.

## Phase 2: The Physics Engine (Hours 4–6)+

* **The Math:** Translating standard kinematics into code. You get to flex your math skills by calculating the $X$ and $Y$ positions over time ($t$):
* Horizontal: $x(t) = v_0 \cos(\theta) t$
* Vertical: $y(t) = v_0 \sin(\theta) t - \frac{1}{2} g t^2$


* **The Loop:** Creating a function that updates the position of your projectile frame-by-frame until it hits the ground (when $y \le 0$).

## Phase 3: Basic Input & Output (Hours 7–9)

* **Wiring it Up:** Capturing the angle and velocity from simple HTML `<input>` fields.
* **Rendering:** Drawing the trajectory. Even if you just use an HTML Canvas and draw a tiny black square at the $X$ and $Y$ coordinates for each frame, it will clearly demonstrate that your math and logic work perfectly.

## Phase 4: Buffer & Bug Fixing (Hour 10)

* Handling edge cases, cleaning up the code, and ensuring your TypeScript compiles cleanly without any warnings.

---

## Why this works for your experience level

You aren't learning how to program from scratch; you are just learning how to translate what you already know into TypeScript syntax. C# uses strict classes and types, and JavaScript uses the DOM and event listeners. TypeScript is just the bridge between the two.

Since you are prioritizing the algorithm over the visuals, how do you want to handle the output to start with—would you prefer to try drawing simple dots on an HTML Canvas, or just log the $X$ and $Y$ coordinates to the screen as text to verify the math first?

 
https://github.com/TauntingRhinomonster/artillery-physics.git