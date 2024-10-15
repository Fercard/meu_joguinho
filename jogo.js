// Carregar as imagens
const dinoImage = new Image();
dinoImage.src = 'pngsRobo.png';  // Certifique-se de que o nome do arquivo da imagem está correto
dinoImage.onload = function() {
    console.log("Imagem do robô carregada");
};

const obstacleImage = new Image();
obstacleImage.src = 'pngsArvore-.png';  // Nome da imagem do obstáculo
obstacleImage.onload = function() {
    console.log("Imagem da árvore carregada");
};

const villainImage = new Image();
villainImage.src = 'grinchGrinch.png';  // Certifique-se de que o nome da imagem está correto
villainImage.onload = function() {
    console.log("Imagem do vilão carregada");
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dino = { x: 50, y: 150, width: 20, height: 20, dy: 0, gravity: 0.5, jumpPower: -8, isJumping: false };
let villain = { x: 500, y: 150, width: 50, height: 50 };  // Vilão fixo à frente do robô
let obstacles = [];
let gameOver = false;
let score = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            restartGame();
        } else if (!dino.isJumping) {
            dino.dy = dino.jumpPower;
            dino.isJumping = true;
        }
    }
});

function createObstacle() {
    obstacles.push({ x: 600, y: 150, width: 20, height: 20 });
}

function restartGame() {
    dino = { x: 50, y: 150, width: 20, height: 20, dy: 0, gravity: 0.5, jumpPower: -8, isJumping: false };
    villain = { x: 500, y: 150, width: 50, height: 50 };  // Reiniciar o vilão também
    obstacles = [];
    gameOver = false;
    score = 0;
    update();
}

function update() {
    if (!gameOver) {
        dino.dy += dino.gravity;
        dino.y += dino.dy;
        if (dino.y > 150) {
            dino.y = 150;
            dino.dy = 0;
            dino.isJumping = false;
        }

        obstacles.forEach(obstacle => obstacle.x -= 5);
        if (obstacles.length > 0 && obstacles[0].x < -20) {
            obstacles.shift();
            score++;
        }

        obstacles.forEach(obstacle => {
            if (dino.x < obstacle.x + obstacle.width && dino.x + dino.width > obstacle.x && dino.y < obstacle.y + obstacle.height && dino.height + dino.y > obstacle.y) {
                gameOver = true;
            }
        });

        if (Math.random() < 0.01) createObstacle();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fixar a posição do vilão à frente do robô
        villain.x = dino.x + 150;  // O vilão permanece sempre 150 pixels à frente do robô
        ctx.drawImage(villainImage, villain.x, villain.y, villain.width, villain.height);

        // Desenhar o robô
        ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

        // Desenhar os obstáculos
        obstacles.forEach(obstacle => {
            ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 20);

        requestAnimationFrame(update);
    } else {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);

        ctx.font = '20px Arial';
        ctx.fillText('Pressione Espaço para Reiniciar', canvas.width / 2 - 140, canvas.height / 2 + 40);
    }
}

update();

