import './style.css'
import { Projectile } from './classes/Projectile.ts'

const WIDTH = 50;
const HEIGHT = 20;
const GRID_SCALE = 15; // meters per character (passed to Projectile constructor)
const PHYSICS_DELTA = 0.05;
const FRAME_DELAY_MS = 20;

const fireBtn = document.querySelector<HTMLButtonElement>('#fire-btn')!;
const angleInput = document.querySelector<HTMLInputElement>('#angle')!;
const weightInput = document.querySelector<HTMLInputElement>('#weight')!;
const dragInput = document.querySelector<HTMLInputElement>('#drag-coefficient')!;
const powerInput = document.querySelector<HTMLInputElement>('#power')!;
const display = document.querySelector<HTMLPreElement>('#trajectory-display')!;

function createEmptyGrid(): string[][] {
    const grid: string[][] = [];
    for (let y = 0; y < HEIGHT; y++) {
        grid.push(new Array(WIDTH).fill(' '));
    }
    return grid;
}

function renderGrid(grid: string[][]): void {
    const rows = grid.map((row) => '|' + row.join('') + '|');
    const ground = '+' + '-'.repeat(WIDTH) + '+';
    display.textContent = rows.join('\n') + '\n' + ground;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let isAnimating = false;

async function fireProjectile(): Promise<void> {
    if (isAnimating) return;

    const angle = Number(angleInput.value);
    const weight = Number(weightInput.value);
    const dragCoefficient = Number(dragInput.value);
    const power = Number(powerInput.value);

    if (angle < 0 || angle > 90) {
        display.textContent = 'Angle must be between 0 and 90 degrees.';
        return;
    }
    if (weight <= 0) {
        display.textContent = 'Weight must be greater than 0 kg.';
        return;
    }
    if (dragCoefficient < 0) {
        display.textContent = 'Drag coefficient cannot be negative.';
        return;
    }
    if (power <= 0) {
        display.textContent = 'Power must be greater than 0 N.';
        return;
    }

    isAnimating = true;
    fireBtn.disabled = true;
    fireBtn.textContent = 'In flight...';

    const grid = createEmptyGrid();
    const shot = new Projectile(angle, PHYSICS_DELTA, weight, dragCoefficient, power, GRID_SCALE);

    shot.drawToGrid(grid, WIDTH, HEIGHT, '*');
    shot.drawToGrid(grid, WIDTH, HEIGHT, '@');
    renderGrid(grid);

    while (shot.getPositoin()[1] >= 0) {
        await sleep(FRAME_DELAY_MS);

        shot.updatePhysics(dragCoefficient, PHYSICS_DELTA);
        shot.drawToGrid(grid, WIDTH, HEIGHT, '*');
        shot.drawToGrid(grid, WIDTH, HEIGHT, '@');
        renderGrid(grid);
    }

    fireBtn.disabled = false;
    fireBtn.textContent = 'Fire!';
    isAnimating = false;
}

fireBtn.addEventListener('click', () => {
    void fireProjectile();
});

display.textContent = `Ready. Grid: ${WIDTH * GRID_SCALE}m wide × ${HEIGHT * GRID_SCALE}m tall.\nPress Fire! to launch.`;
