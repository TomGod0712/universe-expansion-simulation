// sketch.js

// Number of galaxies
const numGalaxies = 30;

// Arrays to hold galaxy positions
let galaxiesUniform = [];
let galaxiesUniaxial = [];

// Initial positions (will be set in setup)
let initialPositions = [];

// Growth rates
const growthRateUniform = 0.01;
const growthRateUniaxial = 0.01;

// Canvas dimensions
let canvasWidth;
let canvasHeight;

// Display limit
const displayLimit = 10;

// p5.js setup function
function setup() {
    // Determine canvas size based on window size for responsiveness
    canvasWidth = min(windowWidth / 2 - 40, 600);
    canvasHeight = 600;

    // Create two canvases side by side
    let uniformCanvas = createCanvas(canvasWidth, canvasHeight);
    uniformCanvas.parent('canvas-container');
    uniformCanvas.style('margin', '10px');

    // Initialize initial positions randomly within a circle of radius 5
    initializePositions();

    // Copy initial positions to both expansion types
    galaxiesUniform = initialPositions.map(pos => ({ x: pos.x, y: pos.y }));
    galaxiesUniaxial = initialPositions.map(pos => ({ x: pos.x, y: pos.y }));
}

function draw() {
    // Clear and draw the Uniform Expansion canvas
    clear();
    background(255);
    drawExpansion(galaxiesUniform, growthRateUniform, 'uniform');

    // Draw the Uniaxial Expansion in a separate canvas
    drawUniaxialExpansion();
}

function initializePositions() {
    initialPositions = [];

    // Seed for reproducibility
    randomSeed(0);

    for (let i = 0; i < numGalaxies; i++) {
        let angle = random(TWO_PI);
        let radius = random(0, 5);
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        initialPositions.push({ x: x, y: y });
    }

    // Manually set two galaxies to have the same x-coordinate
    // For example, set galaxy 0 and galaxy 1 to have x = 0
    initialPositions[0].x = 0.0;
    initialPositions[0].y = 3.0;   // Assign a y-coordinate
    initialPositions[1].x = 0.0;
    initialPositions[1].y = -3.0;  // Assign a different y-coordinate
}

function drawExpansion(galaxies, growthRate, type) {
    // Translate to center
    translate(width / 2, height / 2);

    // Scale to fit the display limit
    scale(width / (2 * displayLimit));

    // Draw grid
    stroke(200);
    strokeWeight(0.005);
    for (let i = -displayLimit; i <= displayLimit; i++) {
        line(i, -displayLimit, i, displayLimit);
        line(-displayLimit, i, displayLimit, i);
    }

    // Draw galaxies
    fill(0);
    noStroke();

    for (let i = 0; i < galaxies.length; i++) {
        let galaxy = galaxies[i];
        ellipse(galaxy.x, galaxy.y, 0.2, 0.2);
    }

    // Highlight the two special galaxies
    fill(0, 255, 0);
    for (let i = 0; i < 2; i++) {
        let galaxy = galaxies[i];
        ellipse(galaxy.x, galaxy.y, 0.4, 0.4);
    }

    // Scale positions for next frame
    for (let galaxy of galaxies) {
        galaxy.x *= (1 + growthRate);
        galaxy.y *= (1 + growthRate);
    }

    // Check if all galaxies have exceeded the display region
    let allExceeded = galaxies.every(g => dist(0, 0, g.x, g.y) > displayLimit);

    if (allExceeded) {
        resetPositions();
    }

    // Reset translation and scale
    resetMatrix();
}

function drawUniaxialExpansion() {
    // Create a separate graphics buffer for the uniaxial expansion
    let g = createGraphics(canvasWidth, canvasHeight);
    g.background(255);

    // Translate to center
    g.translate(g.width / 2, g.height / 2);

    // Scale to fit the display limit
    g.scale(g.width / (2 * displayLimit));

    // Draw grid
    g.stroke(200);
    g.strokeWeight(0.005);
    for (let i = -displayLimit; i <= displayLimit; i++) {
        g.line(i, -displayLimit, i, displayLimit);
        g.line(-displayLimit, i, displayLimit, i);
    }

    // Draw galaxies
    g.fill(255, 0, 0);
    g.noStroke();

    for (let i = 0; i < galaxiesUniaxial.length; i++) {
        let galaxy = galaxiesUniaxial[i];
        g.ellipse(galaxy.x, galaxy.y, 0.2, 0.2);
    }

    // Highlight the two special galaxies
    g.fill(0, 255, 0);
    for (let i = 0; i < 2; i++) {
        let galaxy = galaxiesUniaxial[i];
        g.ellipse(galaxy.x, galaxy.y, 0.4, 0.4);
    }

    // Scale positions for next frame (only x-axis)
    for (let galaxy of galaxiesUniaxial) {
        galaxy.x *= (1 + growthRateUniaxial);
    }

    // Check if all galaxies have exceeded the display region along x-axis
    let allExceeded = galaxiesUniaxial.every(g => abs(g.x) > displayLimit);

    if (allExceeded) {
        resetPositions();
    }

    // Draw the uniaxial expansion canvas
    image(g, 0, 0);
}

function resetPositions() {
    // Reset positions to initial
    galaxiesUniform = initialPositions.map(pos => ({ x: pos.x, y: pos.y }));
    galaxiesUniaxial = initialPositions.map(pos => ({ x: pos.x, y: pos.y }));
}

// Handle window resizing for responsiveness
function windowResized() {
    canvasWidth = min(windowWidth / 2 - 40, 600);
    canvasHeight = 600;
    resizeCanvas(canvasWidth, canvasHeight);
}
