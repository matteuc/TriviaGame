var numCorrect, numIncorrect, numMissed;
var timerRunning = false;
var timerId;
var time = 0;

var questions = [];
var questionIndex = 0;

var correctSounds = ["./assets/sounds/jake-peralta-chills-literal-chills.mp3", "./assets/sounds/brooklyn-99-bingpot.mp3", "./assets/sounds/cowabunga.mp3", "./assets/sounds/hot-damn.mp3", "./assets/sounds/yas-queen", "./assets/sounds/ive-never-been-happier.mp3"];
var incorrectSounds = ["./assets/sounds/holt-incredible-pain.mp3", "./assets/sounds/dirtbag.mp3", "./assets/sounds/everything-is-garbage.mp3", "./assets/sounds/holt-incredible-pain.mp3", "./assets/sounds/is-everything-ok.mp3", "./assets/sounds/painnnn.mp3", "./assets/sounds/terry-jeffords-why.mp3"];

function randomSound(isCorrect) {
    var tmpSound;

    function randomIndex(arrayLength) {
        return Math.floor(Math.random() * arrayLength);
    }

    if (isCorrect) {
        tmpSound = new Audio(correctSounds[randomIndex(correctSounds.length)]);
    } else {
        tmpSound = new Audio(incorrectSounds[randomIndex(incorrectSounds.length)]);
    }

    tmpSound.play();

}

function displayQuestion(question) {
    //Display question picture
    $("#questionPicture").css("background-image", `url(${question.image})`);
    $("#question").text(question.text);
    // Clear question choice div
    $("#questionChoices").empty();
    // Render question choices
    for (choice of question.choices) {
        var newChoice = $("<div class='questionChoice activeChoice'>");
        choice.isAnswer ? newChoice.attr("id", "answer") : '';
        newChoice.text(choice.text);
        newChoice.appendTo("#questionChoices");
    }
    startTimer(question.duration);

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

function updateMessage(result) {
    var gameMessage = $("#gameMessage");
    if (result === "correct") {
        gameMessage.text("Correct");
        gameMessage.css({
            "color": "rgb(75, 192, 75)",
            "border": "5px solid rgb(75, 192, 75)"

        });

    } else if (result === "incorrect") {
        gameMessage.text("Incorrect");
        gameMessage.css({
            "color": "rgb(250, 82, 82)",
            "border": "5px solid rgb(250, 82, 82)",
        });

    } else if (result === "missed") {
        gameMessage.text("Missed");
        gameMessage.css({
            "color": "rgb(250, 240, 107)",
            "border": "5px solid rgb(250, 240, 107)",
        });

    }

}

function emptyMessage() {
    var gameMessage = $("#gameMessage");
    gameMessage.empty();
    gameMessage.css({
        "border": "0px solid white"

    });
}

function showAnswer() {
    $("#answer").addClass("correct");
}

function decrement() {
    time--;
    var formattedTime = timeConverter(time);
    $("#timer").text(formattedTime);

    if (time === 0) {
        pauseTimer();
        $(".questionChoice").removeClass("activeChoice");
        updateMessage("missed");
        // show correct answer and move to next question
        showAnswer();
        // play incorrect sound
        randomSound(false);
        questionIndex++;

        nextQuestion();


        // increment number of missed questions counter
        numMissed++;
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
function newGame() {
    numCorrect = 0;
    numIncorrect = 0;
    numMissed = 0;
    questionIndex = 0;
    displayQuestion(questions[questionIndex]);
}

function endGame() {
    //hide question and show end game message
    setTimeout(function () {
        $("#gameDisplay").empty();
    }, 3000);
    console.log("The game has ended");

    // show game stats
    // show restart button
}

function nextQuestion() {
    if (questionIndex < questions.length) {
        setTimeout(function () {
            emptyMessage();
            displayQuestion(questions[questionIndex]);
        }, 2500);

    } else {
        endGame();
    }
}

function endQuestion(questionChoice) {
    var isCorrect = (questionChoice.attr("id") === "answer");
    randomSound(isCorrect);
    $(".questionChoice").removeClass("activeChoice");
    if (isCorrect) {
        showAnswer();
        updateMessage("correct");

    } else {
        // highlight user choice in RED
        questionChoice.addClass("incorrect");
        // highlight correct choice in GREEN
        showAnswer();
        updateMessage("incorrect");

    }

    updateStats(isCorrect);
    questionIndex++;

    nextQuestion();
}



$(document).ready(function () {
    $(function () {
        var API = "https://api.myjson.com/bins/n2dxh";
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
        newGame();
    });

    $(document.body).on("click", ".activeChoice", function () {
        pauseTimer();
        endQuestion($(this));
    });

    $(document.body).on("click", "#restartButton", function () {
        newGame();
    });
})