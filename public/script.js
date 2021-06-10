const socket = io();
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var snake = [];
var box = 32;
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

var names = prompt("Enter your name");

if (names == "null" || names == null || names == "") {

    window.location.reload();
}
console.log(names);
socket.emit('name', names);

var score = 0;
const ground = new Image();
ground.src = "./snake.png";
const food = new Image();
food.src = "./food.png";

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
var gameStatus = true;

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game);
            gameStatus = false;
            socket.emit('end', names, score, gameStatus);




        }
    }
}



function working() {
    socket.emit('start', score, names);
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(food, foodPosition.x, foodPosition.y, 32, 32);
    if (snake[0].x >= 32 && snake[0].x <= box * 17 && snake[0].y >= 3 * box && snake[0].y <= box * 17) {
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i == 0 ? "red" : "green";
            ctx.fillRect(snake[i].x, snake[i].y, 32, 32);
        }
    } else {

        clearInterval(game);
        gameStatus = false;

        socket.emit('end', names, score, gameStatus);

    }


    let snakeX = snake[0].x;
    let snakeY = snake[0].y;



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

const players = document.getElementById('players');
const play1 = document.getElementById('play');

socket.on("make", (a) => {
    players.innerText = "";
    let h1 = document.createElement('h1');
    h1.innerText = "PLAYERS PLAYING THE GAME";
    let br = document.createElement('br');
    let hr = document.createElement('hr');
    players.append(h1);
    players.append(br);
    players.append(hr);
    for (let i = 0; i < a.length; i++) {
        let element = document.createElement('h1');
        element.innerText = `${i+1}.${a[i]}`;
        players.append(element);

    }
});
socket.on('checking', (a, status) => {

    if (a.length == status.length) {
        socket.emit('result');
    } else {
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText("PLEASE WAIT WHILE OTHERS ARE PLAYING", box * 2.5, box * 1.7);
    }
});
socket.on("results", (play) => {

    play1.style.display = "block";
    let nm = [];
    let sc = [];
    let n = play.length;
    for (let i = 0; i < play.length; i++) {
        sc[i] = play[i].name;
        nm[i] = play[i].score;
    }
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (nm[j] > nm[j + 1]) {
                swap(sc, j, j + 1);
                swap(nm, j, j + 1);

            }
        }

    }
    let h1 = document.createElement('h1');
    h1.innerText = "RESULTS";
    play1.append(h1);
    let br = document.createElement('br');
    let hr = document.createElement('hr');
    play1.append(br);
    play1.append(hr);
    let c = 1;
    for (let j = sc.length - 1; j >= 0; j--) {
        let element = document.createElement('h1');
        element.innerText = `${c}.${sc[j]} score:${nm[j]}`;
        play1.append(element);
        c++;
    }

});

function swap(arr, xp, yp) {
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}


var game = setInterval(working, 150);