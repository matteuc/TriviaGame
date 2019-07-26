var numCorrect, numIncorrect;
var timerRunning = false;
var timerId;
var time = 0;

var questions = [];
var questionIndex = 0;

function displayQuestion(question) {
    //Display question picture
    $("#questionPicture").attr("background-image", `url:${question.image}`);
    $("#question").text(question.text);
    // Clear question choice div
    $("#questionChoices").empty();
    // Render question choices
    for (choice of question.choices) {
        var newChoice = $("<div class='questionChoice'>");
        choice.isAnswer ? newChoice.attr("id", "answer") : '';
        newChoice.text(choice.text);
        newChoice.appendTo("#questionChoices");
    }
    startTimer(question.duration);

}
// Find answer element with id="answer" and change styling (to green) 
function showAnswer(question) {
    $("#answer").addClass();
}

// Updates game stats
function updateStats(isCorrect) {
    isCorrect ? numCorrect++ : numIncorrect++;
}

// Reset and then start a timer on the page with the specified duration
function startTimer(duration) {
    time = duration;
    if (!timerRunning) {
        timerId = setInterval(decrement, 1000);
        timerRunning = true;
    }

}

// Pause the timer on the page
function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerId);
        timerRunning = false;
    }
}

function decrement() {
    time--;
    var formattedTime = timeConverter(time);
    $("#timer").text(formattedTime);

    if (time === 0) {
        pauseTimer();
        // show correct answer and move to next question
        showAnswer();
    }

}

function timeConverter(t) {

    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes === 0) {
        minutes = "00";
    } else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

// Restart game, reset stats
function restartGame() {
    numCorrect = 0;
    numIncorrect = 0;
    questionIndex = 0;
    //
}

function endQuestion(isCorrect) {

    if (isCorrect) {

    } else {
        // highlight user choice in RED
        // highlight correct choice in GREEN
        showAnswer();
    }

    updateStats(isCorrect);

    if (questionIndex < questions.length) {
        nextQuestion();
    }
}

function nextQuestion() {
    displayQuestion(question[++questionIndex]);
}

$(document).ready(function () {
    $(function () {
        var API = "https://api.myjson.com/bins/1fgobl";
        //RETRIEVE JSON DATA FROM API
        $.getJSON(API,
            function (q) {
                questions = q;
            })

    });

    $("#startButton").on("click", function () {
        //Shrink Logo
        $("#gameLogo").animate({
            width: "25%"
        });

        //Hide start button 
        $("#startButton").css("display", "none");
        //Show game display
        $("#gameDisplay").css("display", "block");

        displayQuestion(questions[questionIndex]);
    })

    $(".questionChoice").on("click", function () {
        pauseTimer();
        endQuestion(($(this).attr("id") === "answer"));
    })
})