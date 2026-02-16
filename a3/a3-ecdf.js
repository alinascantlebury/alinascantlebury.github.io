let table;
let values = [];
let chartTop = 80;
let chartBottom = 420;
let chartLeft = 80;
let chartRight = 520;

function preload() {
  table = loadTable('cars-data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(600, 500);
  
  let numberOfRows = table.getRowCount();
  
  for (let i = 0; i < numberOfRows; i++) {
    let v = table.getNum(i, "city_mpg");
    if (!isNaN(v)) {
      values.push(v);
    }
  }
  
  values = sort(values);
}

function draw() {
  background(255);
  
  let minVal = values[0];
  let maxVal = values[values.length - 1];
  let chartWidth = chartRight - chartLeft;
  let chartHeight = chartBottom - chartTop;
  
  // Grid
  stroke(220);
  strokeWeight(0.5);
  for (let i = 0; i <= 5; i++) {
    let y = chartTop + (chartHeight / 5) * i;
    line(chartLeft, y, chartRight, y);
  }
  for (let i = 0; i <= 5; i++) {
    let x = chartLeft + (chartWidth / 5) * i;
    line(x, chartTop, x, chartBottom);
  }
  
  // Axes
  stroke(0);
  strokeWeight(1);
  line(chartLeft, chartTop, chartLeft, chartBottom);
  line(chartLeft, chartBottom, chartRight, chartBottom);
  
  // Y-axis labels
  fill(0);
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(11);
  for (let i = 0; i <= 5; i++) {
    let y = chartBottom - (chartHeight / 5) * i;
    let val = i / 5;
    stroke(0);
    strokeWeight(1);
    line(chartLeft - 5, y, chartLeft, y);
    noStroke();
    text(nf(val, 0, 2), chartLeft - 10, y);
  }
  
  // X-axis labels
  textAlign(CENTER, TOP);
  for (let i = 0; i <= 5; i++) {
    let x = chartLeft + (chartWidth / 5) * i;
    let val = minVal + ((maxVal - minVal) / 5) * i;
    stroke(0);
    strokeWeight(1);
    line(x, chartBottom, x, chartBottom + 5);
    noStroke();
    text(nf(val, 0, 1), x, chartBottom + 10);
  }
  
  // ECDF points
  let ecdfPoints = [];
  for (let i = 0; i < values.length; i++) {
    let x = map(values[i], minVal, maxVal, chartLeft, chartRight);
    let y = map((i + 1) / values.length, 0, 1, chartBottom, chartTop);
    ecdfPoints.push({x: x, y: y, mpg: values[i], proportion: (i + 1) / values.length});
  }
  
  // Find closest point to mouse
  let closestPoint = null;
  let minDist = Infinity;
  if (mouseX >= chartLeft && mouseX <= chartRight && mouseY >= chartTop && mouseY <= chartBottom) {
    for (let pt of ecdfPoints) {
      let d = dist(mouseX, mouseY, pt.x, pt.y);
      if (d < minDist) {
        minDist = d;
        closestPoint = pt;
      }
    }
    if (minDist > 20) closestPoint = null;
  }
  
  // Draw ECDF line
  stroke(100, 149, 237);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let pt of ecdfPoints) {
    vertex(pt.x, pt.y);
  }
  endShape();
  
  // Highlight closest point
  if (closestPoint) {
    fill(70, 120, 200);
    noStroke();
    circle(closestPoint.x, closestPoint.y, 8);
  }
  
  // Tooltip
  if (closestPoint) {
    fill(255, 255, 240);
    stroke(0);
    strokeWeight(1);
    let tooltipWidth = 150;
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
    text(`City MPG: ${nf(closestPoint.mpg, 0, 1)}`, tooltipX + 8, tooltipY + 8);
    text(`Proportion: ${nf(closestPoint.proportion, 0, 3)}`, tooltipX + 8, tooltipY + 28);
  }
  
  // Title
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text("ECDF of City MPG", 300, 30);
  textStyle(NORMAL);
  
  // X-axis label
  textSize(13);
  text("City MPG", 300, height - 20);
  
  // Y-axis label
  push();
  translate(20, 250);
  rotate(-PI / 2);
  text("Cumulative Proportion", 0, 0);
  pop();
}