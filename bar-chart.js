let table;
let freq = {};
let numbers = [];
let counts = [];

const margin = { top: 40, right: 30, bottom: 60, left: 60 };
const w = 1200;
const h = 750;
let hoveredBar = -1;

function preload() {
  table = loadTable("numbers_for_tableau.csv", "csv", "header");
}

function setup() {
  createCanvas(w, h);
  textFont("Arial");
  textSize(12);

  for (let r = 0; r < table.getRowCount(); r++) {
    const n = int(table.getString(r, "Number"));
    if (!freq[n]) freq[n] = 0;
    freq[n]++;
  }

  numbers = Object.keys(freq).map(n => int(n));
  numbers.sort((a, b) => a - b);
  counts = numbers.map(n => freq[n]);
}

function draw() {
  background(245);
  const chartW = w - margin.left - margin.right;
  const chartH = h - margin.top - margin.bottom;
  const maxVal = max(counts);
  const minVal = min(counts);
  const minIndex = counts.indexOf(minVal);

  stroke(0);
  strokeWeight(2);
  line(margin.left, margin.top, margin.left, margin.top + chartH);
  line(margin.left, margin.top + chartH, margin.left + chartW, margin.top + chartH);

  strokeWeight(1);
  const ticks = 5;
  for (let i = 0; i <= ticks; i++) {
    const val = (maxVal / ticks) * i;
    const y = margin.top + chartH - (val / maxVal) * chartH;
    stroke(0);
    line(margin.left - 5, y, margin.left, y);
    stroke(220);
    line(margin.left, y, margin.left + chartW, y);
    noStroke();
    fill(20);
    textAlign(RIGHT, CENTER);
    text(int(val), margin.left - 8, y);
  }

  const barW = chartW / numbers.length;
  const padding = barW * 0.1;
  hoveredBar = -1;

  for (let i = 0; i < numbers.length; i++) {
    const barH = (counts[i] / maxVal) * chartH;
    const x = margin.left + i * barW + padding / 2;
    const y = margin.top + chartH - barH;
    let isHovered = mouseX >= x && mouseX <= x + barW - padding &&
                    mouseY >= y && mouseY <= margin.top + chartH;
    
    if (isHovered) {
      hoveredBar = i;
      fill(220, 100, 180);
    } else {
      fill(160, 120, 200);
    }
    noStroke();
    rect(x, y, barW - padding, barH);
  }

  const minBarH = (minVal / maxVal) * chartH;
  const minX = margin.left + minIndex * barW + barW / 2;
  const minY = margin.top + chartH - minBarH;
  
  stroke(255, 0, 0);
  strokeWeight(2);
  line(minX, minY - 5, minX, minY - 40);
  
  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text("Lowest value", minX, minY - 42);

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 5 === 0) {
      const x = margin.left + i * barW + barW / 2;
      text(numbers[i], x, margin.top + chartH + 8);
    }
  }

  textAlign(CENTER, TOP);
  textSize(16);
  text("Frequency of Winning Lottery Numbers", w / 2, 10);
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text("Winning Number", w / 2, h - 10);

  push();
  translate(15, h / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, TOP);
  text("Frequency", 0, 0);
  pop();

  if (hoveredBar >= 0) {
    drawTooltip(hoveredBar);
  }
}

function drawTooltip(index) {
  const num = numbers[index];
  const count = counts[index];
  const total = counts.reduce((a, b) => a + b, 0);
  const percentage = ((count / total) * 100).toFixed(1);
  const lines = [
    `Number: ${num}`,
    `Frequency: ${count}`,
    `Percentage: ${percentage}%`
  ];
  const tooltipW = 160;
  const tooltipH = 70;
  const padding = 10;
  let tooltipX = mouseX + 15;
  let tooltipY = mouseY - tooltipH - 10;
  if (tooltipX + tooltipW > width) tooltipX = mouseX - tooltipW - 15;
  if (tooltipY < 0) tooltipY = mouseY + 15;
  
  fill(255);
  stroke(100);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipW, tooltipH, 8);
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], tooltipX + padding, tooltipY + padding + i * 20);
  }
}