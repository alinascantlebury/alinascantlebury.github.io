let table;
let values = [];
let bins = 20;
let margin = 70;
let counts = [];
let binSize;
let minVal, maxVal;

function preload() {
  table = loadTable("cars-data.csv", "csv", "header");
}

function setup() {
  createCanvas(700, 500);

  for (let r = 0; r < table.getRowCount(); r++) {
    let val = table.getNum(r, "city_mpg");
    if (!isNaN(val)) values.push(val);
  }

  // Calculate bin 
  minVal = min(values);
  maxVal = max(values);
  binSize = (maxVal - minVal) / bins;
  counts = new Array(bins).fill(0);

  for (let v of values) {
    let index = floor((v - minVal) / binSize);
    index = constrain(index, 0, bins - 1);
    counts[index]++;
  }
}

function draw() {
  background(255);

  let maxCount = max(counts);
  let chartWidth = width - 2 * margin;
  let chartHeight = height - 2 * margin;
  let barWidth = chartWidth / bins;

  stroke(200, 200, 200, 77);
  strokeWeight(1);
  
  // Horizontal grid lines
  let gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    let y = margin + (chartHeight / gridLines) * i;
    line(margin, y, width - margin, y);
  }
  
  // Vertical grid lines
  for (let i = 0; i <= bins; i++) {
    let x = margin + (chartWidth / bins) * i;
    line(x, margin, x, height - margin);
  }

  // Axes
  stroke(0);
  strokeWeight(1);
  line(margin, height - margin, width - margin, height - margin); 
  line(margin, margin, margin, height - margin); 

  // (Frequency)
  fill(0);
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(12);
  for (let i = 0; i <= gridLines; i++) {
    let y = height - margin - (chartHeight / gridLines) * i;
    let freqValue = round((maxCount / gridLines) * i);
    text(freqValue, margin - 10, y);
  }

  //  City MPG)
  textAlign(CENTER, TOP);
  let xTicks = 5;
  for (let i = 0; i <= xTicks; i++) {
    let x = margin + (chartWidth / xTicks) * i;
    let mpgValue = round(minVal + ((maxVal - minVal) / xTicks) * i);
    text(mpgValue, x, height - margin + 10);
  }

  // mouse
  let hoveredBar = -1;
  if (mouseX >= margin && mouseX <= width - margin &&
      mouseY >= margin && mouseY <= height - margin) {
    hoveredBar = floor((mouseX - margin) / barWidth);
    hoveredBar = constrain(hoveredBar, 0, bins - 1);
  }

  //  bars
  noStroke();
  for (let i = 0; i < bins; i++) {
    let h = map(counts[i], 0, maxCount, 0, chartHeight);
    
    // hovered bar
    if (i === hoveredBar) {
      fill(70, 120, 200); 
    } else {
      fill(100, 149, 237);
    }
    
    rect(
      margin + i * barWidth,
      height - margin - h,
      barWidth - 2,
      h
    );
  }

  if (hoveredBar !== -1) {
    let rangeStart = (minVal + hoveredBar * binSize).toFixed(1);
    let rangeEnd = (minVal + (hoveredBar + 1) * binSize).toFixed(1);
    let count = counts[hoveredBar];
    
    fill(255, 255, 240);
    stroke(0);
    strokeWeight(1);
    let tooltipWidth = 140;
    let tooltipHeight = 50;
    let tooltipX = mouseX + 15;
    let tooltipY = mouseY - 25;
    
    if (tooltipX + tooltipWidth > width) tooltipX = mouseX - tooltipWidth - 15;
    if (tooltipY < 0) tooltipY = mouseY + 15;
    
    rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
    
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);
    text(`Range: ${rangeStart} - ${rangeEnd}`, tooltipX + 8, tooltipY + 8);
    text(`Frequency: ${count}`, tooltipX + 8, tooltipY + 28);
  }

  fill(0);
  noStroke();
  textSize(14);
  textAlign(CENTER);
  text("City MPG", width / 2, height - 20);

  push();
  translate(20, height / 2);
  rotate(-HALF_PI);
  text("Frequency", 0, 0);
  pop();
  
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER);
  text("Histogram of City MPG", width / 2, 30);
  textStyle(NORMAL);
}