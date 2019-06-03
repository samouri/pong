const canvasHeight = 600
const canvasWidth = 800
const paddleHeight = 35
const paddleWidth = 10

// Initialized after page is ready.
let canvas

/** @type {CanvasRenderingContext2D} */

let ctx

const state = {
  leftPlayer: { x: 10, y: canvasHeight / 2 },
  rightPlayer: { x: canvasWidth - (10 + paddleWidth), y: canvasHeight / 2 },
  pressedKeys: new Set(),
  ball: { x: canvasWidth / 2, y: canvasHeight / 2, directionX: "left", directionY: "up" },
}

function init() {
  canvas = document.getElementById("game")
  canvas.setAttribute("height", canvasHeight)
  canvas.setAttribute("width", canvasWidth)
  ctx = canvas.getContext("2d")

  // register input handlers
  window.addEventListener("keydown", event => state.pressedKeys.add(event.code))
  window.addEventListener("keyup", event => state.pressedKeys.delete(event.code))

  // register the gameloop
  setInterval(update, 16)
}

function moveBall(x, y) {
  if (state.ball.x >= canvasWidth - 5) {
    state.ball.directionX = "left"
  } else if (state.ball.x <= 5) {
    state.ball.directionX = "right"
  }

  if (state.ball.directionX === "left") {
    state.ball.x -= 10
  } else if (state.ball.directionX === "right") {
    state.ball.x += 10
  }

  if (state.ball.y <= 5) {
    state.ball.directionY = "down"
  } else if (state.ball.y >= canvasHeight - 5) {
    state.ball.directionY = "up"
  }

  if (state.ball.directionY === "up") {
    state.ball.y -= 10
  } else if (state.ball.directionY === "down") {
    state.ball.y += 10
  }
}

/**
 * In general, all games have something called "the game loop".
 * The game loop is something that runs on an interval, in the simplest versions it runs 60 times per second has does these things:
 *
 * 1. Get user inputs.
 * 2. Update all the entities in the game (calculate player movements, collsions, score etc).
 * 3. Render the screen again.
 */
function update() {
  // 2. Update the entitites
  if (state.pressedKeys.has("ArrowUp")) {
    state.rightPlayer.y = Math.max(0, state.rightPlayer.y - 5)
  } else if (state.pressedKeys.has("ArrowDown")) {
    state.rightPlayer.y = Math.min(canvasHeight - paddleHeight, state.rightPlayer.y + 5)
  }

  if (state.pressedKeys.has("KeyW")) {
    state.leftPlayer.y -= 5
  } else if (state.pressedKeys.has("KeyS")) {
    state.leftPlayer.y += 5
  }
  moveBall()

  // 3. Draw all the things
  drawBackground()
  drawPaddle(state.leftPlayer)
  drawPaddle(state.rightPlayer)
  drawBall()
}

function drawPaddle({ x, y }) {
  ctx.save()
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(x, y, paddleWidth, paddleHeight)
  ctx.restore()
}

function drawBackground() {
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  drawDottedLine()
  drawScore(0, 0)
}

function drawDottedLine() {
  ctx.save()
  ctx.strokeStyle = "#FFFFFF"
  ctx.beginPath()
  ctx.setLineDash([10, 10])
  ctx.moveTo(canvasWidth / 2, 5)
  ctx.lineTo(canvasWidth / 2, canvasHeight)
  ctx.stroke()
  ctx.restore()
}

function drawBall() {
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = "#00FFFF"
  ctx.fillStyle = "#00FFFF"
  ctx.arc(state.ball.x, state.ball.y, 5, 0, 360)
  ctx.stroke()
  ctx.fill()
  ctx.restore()
}

function drawScore(leftScore = 0, rightScore = 0) {
  ctx.save()
  ctx.fillStyle = "white"
  const padding = 50
  const fontSize = 40
  ctx.font = `${fontSize}px Helvetica`
  ctx.fillText(leftScore, canvasWidth / 2 - padding - fontSize / 2, 40)
  ctx.fillText(rightScore, canvasWidth / 2 + padding, 40)
  ctx.restore()
}

window.addEventListener("DOMContentLoaded", init)
