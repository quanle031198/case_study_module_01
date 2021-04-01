// cài đặt canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1051;
canvas.height = 500;

let score = 0;
let gameFrame = 0; // khung hình
ctx.font = '50px sans-serif';
let cloudSpeed = 1;
gameOver = false;

// Tương tác chuột

let canvasPosition = canvas.getBoundingClientRect(); //cung cấp mọi thông số của canvas
console.log(canvasPosition);
//Khởi tạo object theo object literals vị trí xuất hiện ban đầu
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,

}

canvas.addEventListener('mousedown', function (event) {

    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

    // console.log(event.x,event.y);
    // console.log(canvasPosition.left,canvasPosition.top);
    // console.log(mouse.x,mouse.y);
});


//player

const playerLeft = new Image();
playerLeft.src = 'img/dragon_go_left.png';
const playerRight = new Image();
playerRight.src = 'img/dragon_go_right.png';

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height * 3;
        this.radius = 50;
        this.angle = 0; //xoay nhân vật theo hướng chuột
        this.spriteWidth = 498;
        this.spriteHeigth = 327;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);//trả về số đo góc 
        this.angle = theta

        if (mouse.x != this.x) {
            this.x -= dx / 30;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 30;
        }
    }
    draw() {

        ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y,this.radius,0,Math.PI * 2);
        // ctx.fill();

        ctx.save(); //đẩy trạng thái hiện tại lên trên stack.
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle)
        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, 0, 0, this.spriteWidth - 100, this.spriteHeigth + 183, -50, -50, this.spriteWidth / 5, this.spriteHeigth / 3);
        } else {
            ctx.drawImage(playerRight, 0, 0, this.spriteWidth - 100, this.spriteHeigth + 183, -50, -50, this.spriteWidth / 5, this.spriteHeigth / 3);
        }
        ctx.restore(); //hiện trạng thái trên cùng trên stack, khôi phục bối cảnh tới trạng thái đó

    }
}
const player = new Player();

// rocket launch superpower
const rocketImg = new Image();
rocketImg.src = 'img/rocket.png';

class rocket {
    constructor() {
        this.x = canvas.width + 200;
        this.y = Math.random() * canvas.height;
        this.radius = 30;
        this.speed = 5 ;
        this.frame = 0;
    }

    draw() {
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y,this.radius,0,Math.PI * 2);
        // ctx.fill();
        ctx.drawImage(rocketImg, this.x - 60, this.y - 60, this.radius *4, this.radius * 4)
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;

        }
        // va chạm với player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy); // tính khoảng cách va chạm theo pytago
        if (distance < this.radius + player.radius) {
            handleGameOver();
        }
    }
}
const rocket1 = new rocket();
function handleRocket() {
    rocket1.draw();
    rocket1.update();
}

function handleGameOver() {
    ctx.fillStyle = '#66FFFF';
    ctx.fillText('GAME OVER ', 300, 230);
    ctx.fillStyle = 'black';
    gameOver = true;

}

//Máy bay chiến đấu
const helicoptersArray = [];

const heliImage = new Image();
heliImage.src = 'img/heli_2.png';


class Helicopter {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 2 + 1;
        this.distance;
        
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';

    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);

    }
    draw() {

        ctx.drawImage(heliImage, this.x - 80, this.y - 50, this.radius * 3, this.radius * 2)
    }
}

const heliBoom1 = document.createElement('audio');
heliBoom1.src = 'sound/explode.wav';
const heliBoom2 = document.createElement('audio');
heliBoom2.src = 'sound/rumble.flac'

function handleHelicoters() {
    if (gameFrame % 50 == 0) {
        helicoptersArray.push(new Helicopter());

    }

    for (let i = 0; i < helicoptersArray.length; i++) {
        helicoptersArray[i].draw();
        helicoptersArray[i].update();



        if (helicoptersArray[i].distance < helicoptersArray[i].radius + player.radius) {

            if (!helicoptersArray[i].counted) {
                if (helicoptersArray[i].sound === 'sound1') {
                    heliBoom1.play();
                } else {
                    heliBoom2.play();
                }
                score++;
                helicoptersArray.splice(i, 1);
               i--;

            }


        }

    }
}

// Background lặp lại
const background = new Image();
background.src = 'img/cloud_02.png';

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground() {
    BG.x1 -= cloudSpeed;
    if (BG.x1 < -BG.width) BG.x1 = BG.width;
    BG.x2 -= cloudSpeed;
    if (BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width / 2, BG.height / 2);
    ctx.drawImage(background, BG.x2, BG.y, BG.width / 2, BG.height / 2);
}


// animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleHelicoters();
    handleRocket();
    player.update();
    player.draw();
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;

    if (!gameOver) { requestAnimationFrame(animate) };
}
animate()