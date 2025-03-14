let board
let boardWidth = 360
let boardHeight = 640
let context

let birdWidth = 34
let birdHeight = 24
let birdX = boardWidth / 8
let birdY = boardHeight / 2
let birdimg;

//bird
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipe
let pipeArray = []
let pipeWidth = 64
let pipeHeight = 512
let pipeX = boardWidth
let pipeY = 0
let topPipeimg
let bottomPipeimg

let velocityX = -2    // pipe velo
let velocityY = 0     //bird velo
let gravity = 0.4

let gameOver = false
let score=0

window.onload = () => {
    board = document.getElementById("board");
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext("2d")

    // context.fillStyle="green"
    // context.fillRect(bird.x,bird.y,bird.width,bird.height)

    birdimg = new Image()
    birdimg.src = "flappybird.png"
    birdimg.onload = () => {
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height)
    }
    topPipeimg = new Image()
    topPipeimg.src = "toppipe.png"
    bottomPipeimg = new Image()
    bottomPipeimg.src = "bottompipe.png"
    requestAnimationFrame(update)
    setInterval(placePipes, 1500)
    document.addEventListener("touchstart",moveBird)
    document.addEventListener('keydown', moveBird)
    document.addEventListener("mousedown", moveBird);
}


function update() {
    requestAnimationFrame(update)
    if (gameOver) {
        return
    }
    context.clearRect(0, 0, board.width, board.height)
    velocityY += gravity
    bird.y = Math.max(bird.y + velocityY, 0)
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height)
    if (bird.y>board.height){
        gameOver=true
    }
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
        if (!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5      // there are 2 pipes
            pipe.passed=true
        }
        if (detectCollison(bird, pipe)) {
            gameOver = true
        }
        while (pipeArray.length>0 && pipeArray[0].x<-pipeWidth) {        //clearing pipe array
            pipeArray.shift()
        }
    }
    // score
    context.fillStyle="white"
    context.font="45px sans-serif"
    context.fillText(score,5,45)
    if (gameOver){
        context.fillText("GAME OVER",boardWidth/7,board.height/2)
        context.fillText(`Your Score was:${score}`,0,board.height/2+45)
    }
}

function placePipes() {
    if (gameOver) {
        return
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2)
    let toppipe = {
        img: topPipeimg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    let openingSpace = board.height / 4
    pipeArray.push(toppipe)

    let bottomPipe = {
        img: bottomPipeimg,
        x: pipeX,
        y: randomPipeY + openingSpace + pipeHeight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe)
}

function moveBird(e) {
    if (e.type === "mousedown" || e.type === "touchstart" || e.code == "Space" || e.code == "ArrowUp") {
        velocityY = -6    //birds
    }
    if(gameOver){
        bird.y=birdY
        pipeArray=[]
        score=0
        gameOver=false
    }
}

function detectCollison(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
}