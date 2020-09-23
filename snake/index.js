function Game() {

    const CONSTANTS = {
        SNAKE_FILL_STYLE: 'lightBlue',
        SNAKE_STROKE_STYLE: 'darkBlue',
        SNAKE_PART_SIZE: 10,
        SNAKE_MOVEMENT_SPEED: 10,
        SEED_FILL_STYLE: 'lightGreen',
        SEED_STROKE_STYLE: 'darkGreen',
        BOARD_FILL_STYLE: 'white',
        BOARD_STROKE_STYLE: 'black',
        BOARD_WIDTH: 600,
        BOARD_HEIGHT: 600,
    }

    const DIRECTION = {
        LEFT: 'left',
        UP: 'up',
        RIGHT: 'right',
        DOWN: 'down',
    }

    const KEY = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        A: 65,
        W: 87,
        D: 68,
        S: 83,
    }

    const gameBoard = document.getElementById('canvas');
    gameBoard.width = CONSTANTS.BOARD_WIDTH;
    gameBoard.height = CONSTANTS.BOARD_HEIGHT;
    const context = gameBoard.getContext('2d');

    let snake = [  {x: 200, y: 200},  {x: 190, y: 200},  {x: 180, y: 200},  {x: 170, y: 200},  {x: 160, y: 200},];
    let score = 0;
    let seed = {};
    let direction = DIRECTION.RIGHT;
    let state = true;

    const drawSnakePart = (part) => {
        context.fillStyle = CONSTANTS.SNAKE_FILL_STYLE;
        context.strokeStyle = CONSTANTS.SNAKE_STROKE_STYLE;
        context.fillRect(part.x, part.y, CONSTANTS.SNAKE_PART_SIZE, CONSTANTS.SNAKE_PART_SIZE);
        context.strokeRect(part.x, part.y, CONSTANTS.SNAKE_PART_SIZE, CONSTANTS.SNAKE_PART_SIZE);
    }

    const drawSnake = (snake) => {
        snake.forEach(part => drawSnakePart(part));
    }

    const changeDirection = (ev) => {
        switch (ev.keyCode) {
            case KEY.LEFT:
            case KEY.A:
                if (DIRECTION.RIGHT !== direction) {
                    direction = DIRECTION.LEFT;
                }
                break;
            case KEY.UP:
            case KEY.W:
                if (DIRECTION.DOWN !== direction) {
                    direction = DIRECTION.UP;
                }
                break;
            case KEY.RIGHT:
            case KEY.D:
                if (DIRECTION.LEFT !== direction) {
                    direction = DIRECTION.RIGHT;
                }
                break;
            case KEY.DOWN:
            case KEY.S:
                if (DIRECTION.UP !== direction) {
                    direction = DIRECTION.DOWN;
                }
                break;
        }
    }

    const moveSnake = (direction) => {
        if (!state) {
            return;
        }
        let head;
        switch (direction) {
            case DIRECTION.RIGHT:
                head = {x: snake[0].x + CONSTANTS.SNAKE_PART_SIZE, y: snake[0].y};
                break;
            case DIRECTION.LEFT:
                head = {x: snake[0].x - CONSTANTS.SNAKE_PART_SIZE, y: snake[0].y};
                break;
            case DIRECTION.UP:
                head = {x: snake[0].x, y: snake[0].y - CONSTANTS.SNAKE_PART_SIZE};
                break;
            case DIRECTION.DOWN:
                head = {x: snake[0].x, y: snake[0].y + CONSTANTS.SNAKE_PART_SIZE};
                break;
        }
        if (touchSeed(head, seed)) {
            score++;
            snake.push(growSnake(direction));
            seed = spawnSeed();
            console.log(score)
        }
        if (checkSnakeCollision(head)) {
            document.removeEventListener("keydown", changeDirection);
            state = false;
            return;
        }
        snake.unshift(head);
        snake.pop();
    }

    const checkSnakeCollision = (head) => {
        if (head.x >= CONSTANTS.BOARD_WIDTH || head.y >= CONSTANTS.BOARD_HEIGHT
            || head.x < 0 || head.y < 0) {
            return true;
        }
        return snake.some(item => item.x === head.x && item.y === head.y);
    }

    const growSnake = (direction) => {
        const tail = snake.slice(-1)[0];
        let growth;
        switch (direction) {
            case DIRECTION.RIGHT:
                growth = {x: tail.x + CONSTANTS.SNAKE_PART_SIZE, y: tail.y};
                break;
            case DIRECTION.LEFT:
                growth = {x: tail.x - CONSTANTS.SNAKE_PART_SIZE, y: tail.y};
                break;
            case DIRECTION.UP:
                growth = {x: tail.x, y: tail.y - CONSTANTS.SNAKE_PART_SIZE};
                break;
            case DIRECTION.DOWN:
                growth = {x: tail.x, y: tail.y + CONSTANTS.SNAKE_PART_SIZE};
                break;
        }
        return growth;
    }

    const spawnSeed = () => {
        const x = Math.round(Math.random() * CONSTANTS.BOARD_WIDTH / 10) * 10;
        const y = Math.round(Math.random() * CONSTANTS.BOARD_HEIGHT / 10) * 10;
        return {x, y}
    }

    const drawSeed = (seed) => {
        context.fillStyle = CONSTANTS.SEED_FILL_STYLE;
        context.strokestyle = CONSTANTS.SEED_STROKE_STYLE;
        context.fillRect(seed.x, seed.y, CONSTANTS.SNAKE_PART_SIZE, CONSTANTS.SNAKE_PART_SIZE);
        context.strokeRect(seed.x, seed.y, CONSTANTS.SNAKE_PART_SIZE, CONSTANTS.SNAKE_PART_SIZE);
    }

    const touchSeed = (head, seed) => {
        if (head.x === seed.x && head.y === seed.y) {
            return true;
        }
    }

    const clearCanvas = () => {
        context.fillStyle = CONSTANTS.BOARD_FILL_STYLE;
        context.strokestyle = CONSTANTS.BOARD_STROKE_STYLE;
        context.fillRect(0, 0, CONSTANTS.BOARD_WIDTH, CONSTANTS.BOARD_HEIGHT);
        context.strokeRect(0, 0, CONSTANTS.BOARD_WIDTH, CONSTANTS.BOARD_HEIGHT);
    }

    const gameRun = () => {
        clearCanvas();
        moveSnake(direction);
        drawSeed(seed);
        drawSnake(snake);
        setTimeout(gameRun, CONSTANTS.SNAKE_MOVEMENT_SPEED)
    }

    this.init = () => {
        gameRun();
        seed = spawnSeed();
        document.addEventListener("keydown", changeDirection)
    }

}

window.onload = () => {
    this.game = new Game();
    this.game.init();
}