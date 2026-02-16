let table;
let values = [];
let positions = []; 
let chartTop = 80;
let chartBottom = 420;
let chartLeft = 150;
let chartRight = 250;

function preload() {
  table = loadTable('cars-data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(400, 500);
  let numberOfRows = table.getRowCount();
  
  for (let i = 0; i < numberOfRows; i++) {
    let v = table.getNum(i, "highway_mpg");
    if (!isNaN(v)) {
      values.push(v);
    }
  }
}

function draw() {
  background(255);
  
  stroke(0);
  strokeWeight(1);
  line(chartLeft, chartTop, chartLeft, chartBottom); 
  
  let max = Math.max(...values);
  let min = Math.min(...values);
  
  stroke(220);
  strokeWeight(0.5);
  for (let k = 0; k <= 5; k++) {
    let val = min + ((max - min) / 5) * k;
    let y = map(val, min, max, chartBottom, chartTop);
    line(chartLeft, y, chartRight + 50, y);
  }
  
  // y-axes
  fill(0);
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(11);
  for (let k = 0; k <= 5; k++) {
    let val = min + ((max - min) / 5) * k;
    let y = map(val, min, max, chartBottom, chartTop);
    stroke(0);
    strokeWeight(1);
    line(chartLeft - 5, y, chartLeft, y);
    noStroke();
    text(nf(val, 0, 1), chartLeft - 10, y);
  }
  
  positions = [];
  
  let hoveredIndex = -1;
  let hoveredValue = null;
  
  // Draw chart points
  for (let i = 0; i < values.length; i++) {
    let y = map(values[i], min, max, chartBottom, chartTop);
    
    // jitter positions
    randomSeed(i * 1000);
    let x = chartLeft + (chartRight - chartLeft) / 2 + random(-35, 35);
    
    positions.push({x: x, y: y, value: values[i]});
    
    let d = dist(mouseX, mouseY, x, y);
    if (d < 6) {
      hoveredIndex = i;
      hoveredValue = values[i];
    }
    
    if (hoveredIndex === i) {
      fill(70, 120, 200); 
      stroke(0);
      strokeWeight(1.5);
      circle(x, y, 8);
    } else {
      fill(100, 149, 237, 127); 
      noStroke();
      circle(x, y, 5);
    }
  }
  
  if (hoveredIndex !== -1 && hoveredValue !== null) {
    fill(255, 255, 240);
    stroke(0);
    strokeWeight(1);
    let tooltipWidth = 120;
    let tooltipHeight = 35;
    let tooltipX = mouseX + 15;
    let tooltipY = mouseY - 20;
    
    if (tooltipX + tooltipWidth > width) tooltipX = mouseX - tooltipWidth - 15;
    if (tooltipY < 0) tooltipY = mouseY + 15;
    if (tooltipY + tooltipHeight > height) tooltipY = mouseY - tooltipHeight - 15;
    
    rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
    
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);
    text(`Highway MPG: ${nf(hoveredValue, 0, 1)}`, tooltipX + 8, tooltipY + 10);
  }
  
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text("Strip Plot of Highway MPG", 200, 30);
  textStyle(NORMAL);
  
  textSize(13);
  fill(0);
  textAlign(CENTER);
  push();
  translate(25, (chartTop + chartBottom) / 2);
  rotate(-PI / 2);
  text("Highway MPG", 0, 0);
  pop();
}