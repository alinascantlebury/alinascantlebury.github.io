let table;
let values = [];
let chartTop = 80;
let chartBottom = 420;
let chartLeft = 200;
let chartRight = 240;

function preload() {
  table = loadTable('cars-data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(600, 500);
  
  let numberOfRows = table.getRowCount();
  
  for (let i = 0; i < numberOfRows; i++) {
    let v = table.getNum(i, "horsepower");
    if (!isNaN(v)) {
      values.push(v);
    }
  }
  
  values = sort(values);
}

function draw() {
  background(255);
  
  stroke(0);
  strokeWeight(1);
  line(chartLeft, chartTop, chartLeft, chartBottom);
  
  let l = values.length;
  
  let median;
  if (l % 2 == 0) {
    median = (values[l / 2 - 1] + values[l / 2]) / 2;
  } else {
    median = values[int(l / 2)];
  }
  
  let half = int(l / 2);
  let Q1;
  if (half % 2 == 0) {
    Q1 = (values[half / 2 - 1] + values[half / 2]) / 2;
  } else {
    Q1 = values[int(half / 2)];
  }
  
  let upperS = half;
  if (l % 2 != 0) {
    upperS = upperS + 1;
  }
  let upperLen = l - upperS;
  let Q3;
  if (upperLen % 2 == 0) {
    Q3 = (values[upperS + upperLen / 2 - 1] + values[upperS + upperLen / 2]) / 2;
  } else {
    Q3 = values[upperS + int(upperLen / 2)];
  }
  
  let iqr = Q3 - Q1;
  let lowerLim = Q1 - 1.5 * iqr;
  let upperLim = Q3 + 1.5 * iqr;
  
  let min = values[0];
  let max = values[l - 1];
  
  for (let i = 0; i < l; i++) {
    if (values[i] >= lowerLim) {
      min = values[i];
      break;
    }
  }
  
  for (let i = l - 1; i >= 0; i--) {
    if (values[i] <= upperLim) {
      max = values[i];
      break;
    }
  }
  
  let outliers = [];
  for (let i = 0; i < l; i++) {
    if (values[i] < lowerLim || values[i] > upperLim) {
      outliers.push(values[i]);
    }
  }
  
  let maxScale = values[l - 1];
  
  stroke(220);
  strokeWeight(0.5);
  for (let k = 0; k <= 5; k++) {
    let val = (maxScale / 5) * k;
    let y = map(val, 0, maxScale, chartBottom, chartTop);
    line(chartLeft, y, chartRight + 100, y);
  }
  
  fill(0);
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(11);
  for (let k = 0; k <= 5; k++) {
    let val = (maxScale / 5) * k;
    let y = map(val, 0, maxScale, chartBottom, chartTop);
    stroke(0);
    strokeWeight(1);
    line(chartLeft - 5, y, chartLeft, y);
    noStroke();
    text(nf(val, 0, 1), chartLeft - 10, y);
  }
  
  let minY = map(min, 0, maxScale, chartBottom, chartTop);
  let Q1Y = map(Q1, 0, maxScale, chartBottom, chartTop);
  let medianY = map(median, 0, maxScale, chartBottom, chartTop);
  let Q3Y = map(Q3, 0, maxScale, chartBottom, chartTop);
  let maxY = map(max, 0, maxScale, chartBottom, chartTop);
  let bCenter = chartLeft + (chartRight - chartLeft) / 2;
  
  stroke(60);
  strokeWeight(1.5);
  line(bCenter, minY, bCenter, Q1Y);
  line(bCenter, Q3Y, bCenter, maxY);
  line(chartLeft + 5, minY, chartRight - 5, minY);
  line(chartLeft + 5, maxY, chartRight - 5, maxY);
  
  fill(135, 170, 210);
  stroke(60);
  strokeWeight(1.5);
  rect(chartLeft, Q3Y, chartRight - chartLeft, Q1Y - Q3Y);
  
  stroke(60);
  strokeWeight(2.5);
  line(chartLeft, medianY, chartRight, medianY);
  
  let hoveredOutlier = null;
  fill(220, 80, 80);
  noStroke();
  for (let outlier of outliers) {
    let outlierY = map(outlier, 0, maxScale, chartBottom, chartTop);
    let d = dist(mouseX, mouseY, bCenter, outlierY);
    if (d < 8) {
      hoveredOutlier = outlier;
      fill(180, 40, 40);
      circle(bCenter, outlierY, 10);
    } else {
      fill(220, 80, 80);
      circle(bCenter, outlierY, 8);
    }
  }
  
  if (outliers.length > 0) {
    fill(220, 80, 80);
    circle(100, 35, 8);
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(11);
    text("Outliers", 110, 35);
  }
  
  let hoveredElement = null;
  if (mouseX >= chartLeft && mouseX <= chartRight) {
    if (abs(mouseY - minY) < 8) hoveredElement = {label: "Min", value: min};
    else if (abs(mouseY - Q1Y) < 8) hoveredElement = {label: "Q1", value: Q1};
    else if (abs(mouseY - medianY) < 8) hoveredElement = {label: "Median", value: median};
    else if (abs(mouseY - Q3Y) < 8) hoveredElement = {label: "Q3", value: Q3};
    else if (abs(mouseY - maxY) < 8) hoveredElement = {label: "Max", value: max};
  }
  
  if (hoveredOutlier) {
    hoveredElement = {label: "Outlier", value: hoveredOutlier};
  }
  
  if (hoveredElement) {
    fill(255, 255, 240);
    stroke(0);
    strokeWeight(1);
    let tooltipWidth = 120;
    let tooltipHeight = 35;
    let tooltipX = mouseX + 15;
    let tooltipY = mouseY - 20;
    
    if (tooltipX + tooltipWidth > width) tooltipX = mouseX - tooltipWidth - 15;
    if (tooltipY < 0) tooltipY = mouseY + 15;
    
    rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
    
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(11);
    text(`${hoveredElement.label}: ${nf(hoveredElement.value, 0, 1)}`, tooltipX + 8, tooltipY + 10);
  }
  
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text("Box Plot of Horsepower", 300, 30);
  textStyle(NORMAL);
  
  textSize(13);
  fill(0);
  textAlign(CENTER);
  push();
  translate(25, (chartTop + chartBottom) / 2);
  rotate(-PI / 2);
  text("Horsepower", 0, 0);
  pop();
}