import { describe, it, expect } from 'vitest';
import { Projectile } from '../classes/Projectile';

// ─────────────────────────────────────────────────────────
//  Helper: The fixed physics constants used in tests
//    weight          = 27 kg
//    power           = 40,500 N
//    burstTime       = 0.05 s
//    initialVelocity = (40500 * 0.05) / 27 = 75 m/s
// ─────────────────────────────────────────────────────────

const WEIGHT = 27;
const DRAG = 0.1;
const POWER = 40500;
const DELTA = 0.05;
const INITIAL_SPEED = 75; // m/s — expected hypotenuse speed for default power/weight

function createProjectile(trajectory: number, deltaTime = DELTA) {
    return new Projectile(trajectory, deltaTime, WEIGHT, DRAG, POWER);
}

describe('Projectile — Constructor Validation', () => {

    it('creates a Projectile successfully with a valid trajectory of 0°', () => {
        expect(() => createProjectile(0)).not.toThrow();
    });

    it('creates a Projectile successfully with a valid trajectory of 90°', () => {
        expect(() => createProjectile(90)).not.toThrow();
    });

    it('creates a Projectile successfully with a mid-range trajectory of 45°', () => {
        expect(() => createProjectile(45)).not.toThrow();
    });

    it('throws an error when trajectory is below 0°', () => {
        expect(() => createProjectile(-1)).toThrow('Cannot have a trajectory that is less than 0 or greater than 90!');
    });

    it('throws an error when trajectory is above 90°', () => {
        expect(() => createProjectile(91)).toThrow('Cannot have a trajectory that is less than 0 or greater than 90!');
    });

    it('throws an error for extreme negative trajectory', () => {
        expect(() => createProjectile(-180)).toThrow();
    });

    it('throws an error when power is zero or negative', () => {
        expect(() => new Projectile(45, DELTA, WEIGHT, DRAG, 0)).toThrow('Power must be greater than 0!');
        expect(() => new Projectile(45, DELTA, WEIGHT, DRAG, -100)).toThrow('Power must be greater than 0!');
    });

});

describe('Projectile — calculateInitialVelocity()', () => {

    it('at 0°: all speed is horizontal (vx = 75, vy ≈ 0)', () => {
        const p = createProjectile(0);
        const [vx, vy] = p.calculateInitialVelocity();

        expect(vx).toBeCloseTo(INITIAL_SPEED, 5);
        expect(vy).toBeCloseTo(0, 5);
    });

    it('at 90°: all speed is vertical (vx ≈ 0, vy = 75)', () => {
        const p = createProjectile(90);
        const [vx, vy] = p.calculateInitialVelocity();

        expect(vx).toBeCloseTo(0, 5);
        expect(vy).toBeCloseTo(INITIAL_SPEED, 5);
    });

    it('at 45°: vx and vy are equal (symmetric split)', () => {
        const p = createProjectile(45);
        const [vx, vy] = p.calculateInitialVelocity();

        expect(vx).toBeCloseTo(vy, 10);
    });

    it('at 45°: the hypotenuse of vx and vy equals the initial speed', () => {
        const p = createProjectile(45);
        const [vx, vy] = p.calculateInitialVelocity();
        const hypotenuse = Math.hypot(vx, vy);

        expect(hypotenuse).toBeCloseTo(INITIAL_SPEED, 5);
    });

    it('at 30°: the hypotenuse of vx and vy equals the initial speed', () => {
        const p = createProjectile(30);
        const [vx, vy] = p.calculateInitialVelocity();
        const hypotenuse = Math.hypot(vx, vy);

        expect(hypotenuse).toBeCloseTo(INITIAL_SPEED, 5);
    });

    it('at 60°: vy is greater than vx (steeper angle)', () => {
        const p = createProjectile(60);
        const [vx, vy] = p.calculateInitialVelocity();

        expect(vy).toBeGreaterThan(vx);
    });

    it('at 30°: vx is greater than vy (shallower angle)', () => {
        const p = createProjectile(30);
        const [vx, vy] = p.calculateInitialVelocity();

        expect(vx).toBeGreaterThan(vy);
    });

});

describe('Projectile — calculateCurrentPosition()', () => {

    it('from [0, 0] with velocity [75, 0] after 1 second: position is [75, 0]', () => {
        const p = createProjectile(0, 0);

        const [x, y] = p.calculateCurrentPosition(1);

        expect(x).toBeCloseTo(75, 5);
        expect(y).toBeCloseTo(0, 5);
    });

    it('position updates cumulatively over multiple steps', () => {
        const p = createProjectile(0, 0);

        p.calculateCurrentPosition(1); // x = 75
        const [x, y] = p.calculateCurrentPosition(1); // x = 150

        expect(x).toBeCloseTo(150, 5);
        expect(y).toBeCloseTo(0, 5);
    });

    it('at 45° after a small time step: both x and y increase', () => {
        const p = createProjectile(45, 0);

        const [x, y] = p.calculateCurrentPosition(0.1);

        expect(x).toBeGreaterThan(0);
        expect(y).toBeGreaterThan(0);
    });

    it('at 90° after a time step: x stays near 0, y increases', () => {
        const p = createProjectile(90, 0);

        const [x, y] = p.calculateCurrentPosition(0.1);

        expect(x).toBeCloseTo(0, 3);
        expect(y).toBeGreaterThan(0);
    });

    it('returns the same tuple stored in getPosition()', () => {
        const p = createProjectile(45, 0);

        const returned = p.calculateCurrentPosition(0.5);
        const stored   = p.getPositoin();

        expect(returned[0]).toBe(stored[0]);
        expect(returned[1]).toBe(stored[1]);
    });

});

describe('Projectile — calculateDragForce()', () => {

    it('returns 0 drag when drag coefficient is 0', () => {
        const p = createProjectile(45, 0);
        const drag = p.calculateDragForce(0);

        expect(drag).toBe(0);
    });

    it('drag increases when drag coefficient increases (same speed)', () => {
        const p1 = createProjectile(45, 0);
        const drag1 = p1.calculateDragForce(0.1);

        const p2 = createProjectile(45, 0);
        const drag2 = p2.calculateDragForce(0.5);

        expect(drag2).toBeGreaterThan(drag1);
    });

    it('drag is proportional to speed squared (quadratic drag law)', () => {
        const p = createProjectile(45, 0);
        const drag = p.calculateDragForce(0.1);

        expect(drag).toBeCloseTo(0.1 * INITIAL_SPEED * INITIAL_SPEED, 5);
    });

    it('drag is always a non-negative number', () => {
        const p = createProjectile(45, 0);
        const drag = p.calculateDragForce(0.2);

        expect(drag).toBeGreaterThanOrEqual(0);
    });

});

describe('Projectile — Getter Methods', () => {

    it('getTrajectory() returns the trajectory passed to the constructor', () => {
        const p = createProjectile(45);
        expect(p.getTrajectory()).toBe(45);
    });

    it('getPower() returns the power passed to the constructor', () => {
        const p = createProjectile(45);
        expect(p.getPower()).toBe(POWER);
    });

    it('getWeight() returns 27 (the fixed shell weight in kg)', () => {
        const p = createProjectile(45);
        expect(p.getWeight()).toBe(27);
    });

    it('getPosition() starts at [0, 0] when deltaTime is 0', () => {
        const p = createProjectile(45, 0);
        const [x, y] = p.getPositoin();

        expect(x).toBe(0);
        expect(y).toBe(0);
    });

});
