window.onload = function() {
    "use strict";

    var timer_done = false;

    var player_2_conc   = 0;
    var player_2_mellow = 0;
    var player_2_atk    = false;

    var player_1_conc   = 0;
    var player_1_mellow = 0;
    var player_1_atk    = false;

    var total_player_1_conc   = 0;
    var total_player_2_conc   = 0;
    var total_player_1_mellow = 0;
    var total_player_2_mellow = 0;

    var message_count = 0;

    // ---

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function drawRectangle(sliderRectangle, context) {
        context.beginPath();
        context.rect(sliderRectangle.x, sliderRectangle.y, sliderRectangle.width, sliderRectangle.height);
        context.fillStyle = '#033649';
        context.fill();
        context.lineWidth = sliderRectangle.borderWidth;
        context.strokeStyle = '#031634';
        context.stroke();
    }

    // {x, y, radius, start ∠, end ∠, anticlockwise_bool}
    function drawCircle(myCircle, ctxt) {
        ctxt.beginPath();
        ctxt.arc(myCircle.x, myCircle.y, myCircle.radius, myCircle.startAngle, myCircle.endAngle, myCircle.antiClockwise);
        ctxt.fillStyle = myCircle.color;
        ctxt.closePath();
        ctxt.fill();
    }

    function displayFinalScores () {
        context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

        circPlayer1Conc.radius   = Math.floor(total_player_1_conc / message_count);
        circPlayer2Conc.radius   = Math.floor(total_player_2_conc / message_count);
        circPlayer1Mellow.radius = Math.floor(total_player_1_mellow / message_count) + circPlayer1Conc.radius;
        circPlayer2Mellow.radius = Math.floor(total_player_2_mellow / message_count) + circPlayer2Conc.radius;

        // decide winner
        let player_1_total = circPlayer1Conc.radius + circPlayer1Mellow.radius;
        let player_2_total = circPlayer2Conc.radius + circPlayer2Mellow.radius;

        if (player_1_total > player_2_total) {
            drawCircle(circPlayer1Mellow, context);
            drawCircle(circPlayer1Conc, context);
            $('h1').text("player 1 wins");
        } else if (player_1_total < player_2_total) {
            drawCircle(circPlayer2Mellow, context);
            drawCircle(circPlayer2Conc, context);
            $('h1').text("player 2 wins");
        } else {
            console.log("ERROR: No winner"); // don't trust a tie at this point
        }

    };

    function updateCanvas (canvas, context, startTime) {

        let debugging = true;
        if (debugging == false) {
            $.getJSON('http://starecontest-46160.onmodulus.net/stareContest/game', function (data) {

                message_count = message_count + 1;

                // reset global (scoff) variables w/ each new message
                player_1_conc   = Math.floor(data['player1']['con']);
                player_1_mellow = Math.floor(data['player1']['mel']);
                player_1_atk    = data['player1']['atk'];

                player_2_conc   = Math.floor(data['player2']['con']);
                player_2_mellow = Math.floor(data['player2']['mel']);
                player_2_atk    = data['player2']['atk'];

                total_player_1_conc   = total_player_1_conc + player_1_conc;
                total_player_2_conc   = total_player_2_conc + player_2_conc;
                total_player_1_mellow = total_player_1_mellow + player_1_mellow;
                total_player_2_mellow = total_player_2_mellow + player_2_mellow;
            })
        } else {

            // create sample data
            let data = {
                "player1" : {
                    "con": Math.floor(Math.random() * 100),
                    "mel": Math.floor(Math.random() * 100),
                    "atk": (Math.floor(Math.random() * 6) == 1),
                },
                "player2" : {
                    "con": Math.floor(Math.random() * 100),
                    "mel": Math.floor(Math.random() * 100),
                    "atk": (Math.floor(Math.random() * 6) == 1),
                }
            };

            message_count = message_count + 1;

            // reset global (scoff) variables w/ each new message
            player_1_conc   = Math.floor(data['player1']['con']);
            player_1_mellow = Math.floor(data['player1']['mel']);
            player_1_atk    = data['player1']['atk'];

            player_2_conc   = Math.floor(data['player2']['con']);
            player_2_mellow = Math.floor(data['player2']['mel']);
            player_2_atk    = data['player2']['atk'];

            total_player_1_conc   = total_player_1_conc + player_1_conc;
            total_player_2_conc   = total_player_2_conc + player_2_conc;
            total_player_1_mellow = total_player_1_mellow + player_1_mellow;
            total_player_2_mellow = total_player_2_mellow + player_2_mellow;

        }

        context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

        circPlayer1Conc.radius = player_1_conc;
        circPlayer2Conc.radius = player_2_conc;
        circPlayer1Mellow.radius = player_1_mellow + circPlayer1Conc.radius;
        circPlayer2Mellow.radius = player_2_mellow + circPlayer2Conc.radius;

        drawCircle(circPlayer1Mellow, context)
        drawCircle(circPlayer2Mellow, context)
        drawCircle(circPlayer1Conc, context)
        drawCircle(circPlayer2Conc, context)

        // request new frame
        requestAnimFrame(function() {
            if (timer_done == false) {
                setTimeout(function () {
                    updateCanvas(canvas, context, startTime);
                }, 300);
            } else {
                displayFinalScores();
            }
        });
    };

    function animateTimeBar(sliderRectangle, canvas, context, startTime) {
        // update
        var time = (new Date()).getTime() - startTime;

        var linearSpeed = 20;
        // pixels / second
        var newX = linearSpeed * time / 1000;

        if (newX < canvas.width - sliderRectangle.width - sliderRectangle.borderWidth / 2) {
            sliderRectangle.x = newX;
        } else {
            timer_done = true;
        }

        drawRectangle(sliderRectangle, context);

        // request new frame
        requestAnimFrame(function() {
            animateTimeBar(sliderRectangle, canvas, context, startTime);
        });
    }

    // find the canvas(s)
    var canvas         = document.getElementById('myCanvas');
    var timelineCanvas = document.getElementById('timelineCanvas');

    // access the 2d context (think of it as the brush)
    var context         = canvas.getContext('2d');
    var timelineContext = timelineCanvas.getContext('2d');

    // changing brush color
    context.fillStyle = '#79BD9A';

    // (x, y, radius, start ∠, end ∠, antiClockwise)

    // changing brush color
    context.fillStyle = '#79BD9A';

    var circPlayer1Mellow = {
        x: 200,
        y: 200,
        radius: 100,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        antiClockwise: false,
        color: "#79BD9A"
    };

    var circPlayer2Mellow = {
        x: 600,
        y: 200,
        radius: 100,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        antiClockwise: false,
        color: "#79BD9A"
    };

    // changing brush color
    context.fillStyle = '#0B486B';

    var circPlayer1Conc = {
        x: 200,
        y: 200,
        radius: 50,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        antiClockwise: false,
        color: "#0B486B"
    };

    var circPlayer2Conc = {
        x: 600,
        y: 200,
        radius: 50,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        antiClockwise: false,
        color: "#0B486B"
    };

    drawCircle(circPlayer1Mellow, context);
    drawCircle(circPlayer2Mellow, context);
    drawCircle(circPlayer1Conc, context);
    drawCircle(circPlayer2Conc, context);

    var sliderRectangle = {
        x: 0,
        y: 0,
        width: 33,
        height: 75,
        borderWidth: 5
    };

    drawRectangle(sliderRectangle, timelineContext);

    setTimeout(function() {
        var startTime = (new Date()).getTime();
        animateTimeBar(sliderRectangle, timelineCanvas, timelineContext, startTime);
        updateCanvas(canvas, context, startTime);
    }, 500); // delay before starting animation
};
