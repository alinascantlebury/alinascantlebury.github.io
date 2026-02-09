let table;

let freq = {};
let numbers = [];

const margin = { top: 60, right: 120, bottom: 60, left: 80 };
const w = 1200;
const h = 600;

let hoveredCell = -1;

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
}

function draw() {
  background(245);
  
  const chartW = w - margin.left - margin.right;
  const chartH = h - margin.top - margin.bottom;
  
  const cols = 10; 
  const rows = Math.ceil(numbers.length / cols);
  
  const cellW = chartW / cols;
  const cellH = chartH / rows;
  
  let maxVal = 0;
  for (let num of numbers) {
    maxVal = max(maxVal, freq[num]);
  }
  
  hoveredCell = -1; 
  
  for (let i = 0; i < numbers.length; i++) {
    const num = numbers[i];
    const count = freq[num];
    const t = maxVal === 0 ? 0 : count / maxVal;
    
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    const x = margin.left + col * cellW;
    const y = margin.top + row * cellH;
    
    let isHovered = mouseX >= x && mouseX <= x + cellW &&
                    mouseY >= y && mouseY <= y + cellH;
    
    if (isHovered) {
      hoveredCell = i;
    }
    
    const col_color = lerpColor(
      color(255, 255, 255),
      color(200, 0, 0),
      t
    );
    
    fill(col_color);
    
    if (isHovered) {
      stroke(0);
      strokeWeight(4);
    } else {
      stroke(255);
      strokeWeight(2);
    }
    
    rect(x, y, cellW, cellH);
    
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text(num, x + cellW / 2, y + cellH / 2 - 8);
    
    textSize(11);
    fill(80);
    text(count, x + cellW / 2, y + cellH / 2 + 8);
  }
  
  //Title 
  fill(20);
  textAlign(CENTER, TOP);
  textSize(18);
  text("Lottery Number Frequency Heatmap", w / 2, 15);
  
  textSize(12);
  text("(Number shown with count below)", w / 2, 38);
  
  // Legend 
  drawLegend(maxVal);
  
  if (hoveredCell >= 0) {
    drawTooltip(hoveredCell, maxVal);
  }
}

function drawLegend(maxVal) {
  const legendX = w - margin.right + 20;
  const legendY = margin.top;
  const legendH = 200;
  const legendW = 20;
  
  for (let i = 0; i < legendH; i++) {
    const t = i / legendH;
    const col = lerpColor(
      color(200, 0, 0),
      color(255, 255, 255),
      t
    );
    stroke(col);
    line(legendX, legendY + i, legendX + legendW, legendY + i);
  }
  
  noFill();
  stroke(0);
  strokeWeight(1);
  rect(legendX, legendY, legendW, legendH);
  
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(10);
  text(int(maxVal), legendX + legendW + 5, legendY);
  textAlign(LEFT, BOTTOM);
  text("0", legendX + legendW + 5, legendY + legendH);
  
  textAlign(LEFT, CENTER);
  textSize(11);
  text("Frequency", legendX - 5, legendY - 20);
}

function drawTooltip(index, maxVal) {
  const num = numbers[index];
  const count = freq[num];
  const total = numbers.reduce((sum, n) => sum + freq[n], 0);
  const percentage = ((count / total) * 100).toFixed(1);
  
  // extra credit: Tooltip 
  const lines = [
    `Number: ${num}`,
    `Frequency: ${count}`,
    `Percentage: ${percentage}%`,
  ];
  
  const tooltipW = 180;
  const tooltipH = 90;
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