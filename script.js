var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var snake = [];
var box = 32;
snake[0] = {
    x: 9 * box,
    y: 10 * box
};
var score = 0;
const ground = new Image();
ground.src = "./snake.png";
const food = new Image();
food.src = "./food.png";
// var name = prompt('gi');



var foodPosition = {
    x: Math.floor(Math.random() * 17 + 1) * 32,
    y: Math.floor(Math.random() * 15 + 3) * 32
};


var dir;
document.addEventListener("keydown", (event) => {
    if (event.keyCode == 37 && dir != "right")
        dir = "left";
    else if (event.keyCode == 38 && dir != "down")
        dir = "up";
    else if (event.keyCode == 39 && dir != "left")
        dir = "right";
    else if (event.keyCode == 40 && dir != "up")
        dir = "down";
});

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game);
            restart();


        }
    }
}

function working() {

    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(food, foodPosition.x, foodPosition.y, 32, 32);
    if (snake[0].x >= 32 && snake[0].x <= box * 17 && snake[0].y >= 3 * box && snake[0].y <= box * 17) {
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i == 0 ? "red" : "green";
            ctx.fillRect(snake[i].x, snake[i].y, 32, 32);
        }
    } else {
        clearInterval(game);
        restart();

        // return;
    }

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * 2.5, box * 1.7);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // if (snakeX < box * 1 || snakeX > box * 17 ||
    //     snakeY < 3 * box || snakeY > box * 17) {
    //     clearInterval(game);

    // }

    if (snakeX == foodPosition.x && snakeY == foodPosition.y) {
        score++;
        foodPosition = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box,
        };
    } else
        snake.pop();

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    eatTail(newHead, snake);

    snake.unshift(newHead);



}
var over = document.getElementById('over');

function restart() {

    over.style.display = "block";


}
document.getElementById("button").addEventListener('click', (e) => {

    reset();
});

function reset() {
    snake = [];
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    score = 0;
    dir = undefined;
    // console.log('hi');
    over.style.display = "none";
    game = setInterval(working, 150);

}

var game = setInterval(working, 150);