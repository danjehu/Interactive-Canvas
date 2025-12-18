// script.js

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let circles = [];
let selectedCircle = null;
let offsetX, offsetY;
let isDragging = false;
const defaultRadius = 20;
const minRadius = 5;

// Check if point is inside circle
function isInsideCircle(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Redraw all circles
function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle === selectedCircle ? "red" : "#3498db";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  });
}

// Add or select circle
canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectedCircle = null;

  for (let i = circles.length - 1; i >= 0; i--) {
    if (isInsideCircle(x, y, circles[i])) {
      selectedCircle = circles[i];
      drawCircles();
      return;
    }
  }

  circles.push({ x, y, radius: defaultRadius });
  drawCircles();
});

// Start dragging
canvas.addEventListener("mousedown", function (e) {
  if (!selectedCircle) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isInsideCircle(x, y, selectedCircle)) {
    isDragging = true;
    offsetX = x - selectedCircle.x;
    offsetY = y - selectedCircle.y;
  }
});

// Dragging motion
canvas.addEventListener("mousemove", function (e) {
  if (!isDragging || !selectedCircle) return;

  const rect = canvas.getBoundingClientRect();
  selectedCircle.x = e.clientX - rect.left - offsetX;
  selectedCircle.y = e.clientY - rect.top - offsetY;

  drawCircles();
});

// Stop dragging
canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

// Delete circle with Delete key
document.addEventListener("keydown", function (e) {
  if (e.key === "Delete" && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    drawCircles();
  }
});

// Resize with scroll
canvas.addEventListener("wheel", function (e) {
  if (!selectedCircle) return;

  e.preventDefault();
  selectedCircle.radius += e.deltaY < 0 ? 2 : -2;

  if (selectedCircle.radius < minRadius) {
    selectedCircle.radius = minRadius;
  }

  drawCircles();
});
