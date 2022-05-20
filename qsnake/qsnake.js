/**
 * This js file represents the qsnake game
 */

const GRID_SIZE = 20;

class Snake {
    /**
     * Create a snake objects
     * @param {[[int, int], ...]} segments - a list of snake segments
     * @param {[int, int]} direction - the starting direction of the snake
     */
    constructor (segments, direction) {
        this.segments = segments;
        this.direction = direction;
        this.food = 0;  // If the snake has food, it will grow. This could technically be a bool since it can only ever be 0 or 1
    }

    /**
     * moves the snake according to its direction
     */
    move () {
        if (this.segments.length == 0)
            return;
        var old_head = this.segments[0];

        if (this.food > 0) {
            --this.food;
        } else {
            this.segments.pop();
        }

        var new_head = [
            old_head[0] + this.direction[0] * GRID_SIZE,
            old_head[1] + this.direction[1] * GRID_SIZE
        ];

        this.segments.unshift(new_head);
    }

    /**
     * Draws the snake to the canvas
     * @param {CanvasRenderingContext2D} ctx - the canvas context
     */
    draw (ctx) {
        ctx.fillStyle = 'lightblue';
        ctx.strokeStyle = 'darkblue';
        this.segments.forEach(function (segment){
            ctx.fillRect(...segment, GRID_SIZE, GRID_SIZE);
            ctx.strokeRect(...segment, GRID_SIZE, GRID_SIZE);
        })
    }

    is_self_colliding () {
        let segments = this.segments;
        return Array.from(segments.entries()).some(function (pair) {
            var i, segment = pair;
            return segments.slice(i + 1).includes(segment);
        });
    }

    out_of_bounds(width, height) {
        return this.segments.some(function (segment) {
            return !(
                0 <= segment[0] && segment[0] < width
             && 0 <= segment[1] && segment[1] < height
            );
        });
    }

    static create(starting_pos, starting_length, starting_direction) {
        var segments = [];
        var dir = starting_direction;
        var pos = starting_pos;

        for (var i = 0; i < starting_length; ++i) {
            segments.push(pos);
            pos = [pos[0] - dir[0] * GRID_SIZE, pos[1] - dir[1] * GRID_SIZE];
        }

        return new Snake(segments, dir);
    }
}

class QSnakeGame {
    constructor (width, height, bg_color, border_color) {
        this.width = width;
        this.height = height;
        this.bg_color = bg_color;
        this.border_color = border_color;
    }

    on_start () {
        this.snake = Snake.create([80, 80], 3, [1, 0]);
        document.addEventListener('keypress', (evt) => (this.on_keypress(evt)));
    }
    
    on_keypress (evt) {
        if (!this.snake) {
            return;
        }

        var char_code = evt.charCode || evt.which;
        var char_str = String.fromCharCode(char_code);
        var new_dir;
        var old_dir = this.snake.direction;

        if (char_str == 'w')
            new_dir = [0, -1];
        else if (char_str == 'a')
            new_dir = [-1, 0];
        else if (char_str == 's')
            new_dir = [0, 1];
        else if (char_str == 'd')
            new_dir = [1, 0];
        else
            new_dir = old_dir;

        if (new_dir[0] === -this.snake.direction[0] && new_dir[1] === -this.snake.direction[1]) {
            // trying to go backwards
        } else {
            this.snake.direction = new_dir;
        }
    }

    draw_board (ctx) {
        ctx.fillStyle = this.bg_color;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.strokeStyle = this.border_color;
        ctx.strokeRect(0, 0, this.width, this.height);
    }

    on_step (ctx) {
        this.snake.move();
        if (this.check_collisions())
            return;
        this.draw_board(ctx);
        this.snake.draw(ctx);
    }

    check_collisions () {
        return this.snake.is_self_colliding() || this.snake.out_of_bounds(this.width, this.height);
    }

    is_done() {

        return this.check_collisions();
    }


}

function game_loop (game, ctx) {
    game.on_step(ctx);
    if (game.is_done())
        return;
    setTimeout(() => game_loop(game, ctx), 50);
}

function do_game() {
    var canvas = document.getElementById('qsnake-canvas');
    
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        var game = new QSnakeGame(canvas.width, canvas.height, 'rgb(127, 127, 127)', 'rgb(0, 0, 0)');
        game.on_start();
        game_loop(game, ctx);
    }
}

function main () {
    do_game();
}

main();