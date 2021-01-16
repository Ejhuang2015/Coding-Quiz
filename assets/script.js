$(document).ready(function() {

// Variables 
    const classStartButton = document.querySelector(".startButtonStyle");
    const headerTitle = document.querySelector(".headerTitle");
    const timerBar = document.querySelector(".timerBar");
    const subTitle = document.querySelector(".subTitle");
    const subText = document.querySelector(".subText");
    const scoreButton = document.querySelector(".scoreButton");
    const clearButton = document.querySelector(".clearButton");
    const ansOne = document.querySelector(".ansOne");
    const ansTwo = document.querySelector(".ansTwo");
    const ansThree = document.querySelector(".ansThree");
    const ansFour = document.querySelector(".ansFour");

    var countDownTimer = 6;
    var timer = countDownTimer;
    var finished = false;
    var userScores = [];
    
// Quiz Question and Answer Array
    var quizSet = [
        {
            answer:1,
            question:"In CSS, what is a pseudo-class?",
            answerOne:"A technique to set a style when an element changes state",
            answerTwo:"A blueprint of the style sheet",
            answerThree:"An ID",
            answerFour:"A class that is commented out",
        },
        
        {
            answer:3,
            question:"In relation to Javascript, what is scope?",
            answerOne:"The path that the code is read through",
            answerTwo:"A specific variable",
            answerThree:"The accessibilty of functions and variables within an application",
            answerFour:"A function that cuts off the ends of a string, returning the middle.",
        },

        {
            answer:3,
            question:"What is coercion?",
            answerOne:"Allowing the user to repeat variable names",
            answerTwo:"The autofill features",
            answerThree:"The engine changing a varible's type to perform an operation",
            answerFour:"A backdoor to a program",
        },

        {
            answer:2,
            question:"What does HTML and CSS stand for?",
            answerOne:"Hypertext Making Language and Cascading Symbol Sheets",
            answerTwo:"Hypertext Markup Language and Cascading Style Sheets",
            answerThree:"Hyphentext Markup Language and Cascaded Style Sheets",
            answerFour:"Hyphentext Making Language and Cascaded Symbol Sheets",
        },
    ]
    var currentSet = -1;


// Event Handlers

    // Click the Start Quiz button to hide the start screen and display the game screen.
    $(classStartButton).on("click", function(){
        $("#startScreen").hide();
        $(".scoreButtonPanel").hide();
        $("#gameScreen").show();
        
        gameStart();
    });

    // Click the scoreboard button and bypass to the scoreboard screen.
    $(scoreButton).on("click", function(){
        finished = true;
        renderScoreList();
        viewScores();
    });

    // Check which card the user picked and if it matches the answer value of the current question set
    $(".userPick").on("click", function() {
        var chosenCard = $(this).attr("value");

        if (parseInt(chosenCard) === quizSet[currentSet].answer){
            $(subText).text("Correct!")
                .addClass("correct")
                .removeClass("incorrect");
            nextQuestion();
        }
        else {
            $(subText).text("Incorrect!")
                .addClass("incorrect")
                .removeClass("correct");
            timer = timer - 5;
            nextQuestion();
        }
    });

    // Check and save user and score upon submit
    $("#nameSubmit").on("click", function() {
        checkUserLength();
    });

    $(clearButton).on("click", function(){
        localStorage.clear();
        document.querySelector(".scoreList").innerHTML = "";
    });

// Functions

    // Start game function
    function gameStart() {
        timerStart();
        nextQuestion();
    }

    // Timer function
    function timerStart() {    
        $(headerTitle).text(timer + " seconds remaining"); 
   
        var timeInterval = setInterval(function () {
            if (finished === true) {
                clearInterval(timeInterval);
                gameOver();
                return
            }
            
            if (timer > 1) {
                $(headerTitle).text(timer + " seconds remaining");
                timer--;
            }
            else if (timer === 1) {
                $(headerTitle).text(timer + " second remaining");
                timer--;
            } 
            else {
                clearInterval(timeInterval);
                gameOver();
            }
            
            updateTimerBar();
        }, 1000);
    }

    function updateTimerBar() {
        console.log("Called>");
        var timerBarProgress = (timer/countDownTimer) * 100;
        timerBar.setAttribute("style", "width:" + timerBarProgress + "%;");
    }

    // Display the next set of questions
    function nextQuestion() {
        currentSet++;

        if (currentSet > quizSet.length -1) {
            finished = true;
        }
        else {
            $(subTitle).text(quizSet[currentSet].question);
            $(ansOne).text(quizSet[currentSet].answerOne);
            $(ansTwo).text(quizSet[currentSet].answerTwo);
            $(ansThree).text(quizSet[currentSet].answerThree);
            $(ansFour).text(quizSet[currentSet].answerFour);
        }
    }

    // Game over Function 
    function gameOver() {
        $("#gameScreen").hide();
        $("#entryScreen").show();
        $(headerTitle).text("Game Over");
        $(subTitle).text("Your score is: " + timer);
        $(subText).text("");
    }

    // Check if user entry is 4 characters or less
    function checkUserLength() {
        var userNameCheck = document.getElementById("userInitials").value.trim();
        if (userNameCheck.length > 4 || userNameCheck.length <= 0){
            $(subText).text("Please enter only 4 characters or less!")
                .addClass("incorrect")
                .removeClass("correct");
        }
        else {
            renderScoreList();
            saveUserScore(userNameCheck);
            viewScores();
        }
    }

    // Populate Score Array from Storage
    function renderScoreList () {
        var storedUserScore = JSON.parse(localStorage.getItem("userScores"));
        if (!storedUserScore){
            return;
        }
        else{
            storedUserScore.forEach((item) =>{
                userScores.unshift(item);
            });
        }
    }

    // Save score into Array and Storage
    function saveUserScore(approvedName) {
        var upperedName = approvedName.toUpperCase();
        var userAndScore = {
            user:upperedName,
            score:timer
        }
        userScores.unshift(userAndScore);
        userScores.forEach((item, index) => {
            if (index === 0) {
                console.log("Running?");
                $(".scoreList").append("<p class='scoreListItem newestScore'>" + item.user + ": " + item.score + "</p>")
            }
            else {
                console.log("howmany>");
                $(".scoreList").append("<p class='scoreListItem'>" + item.user + ": " + item.score + "</p>")
            }
        });
        localStorage.setItem("userScores", JSON.stringify(userScores));
    }

    function viewScores() {
        $("#startScreen").hide();
        $("#gameScreen").hide();
        $("#entryScreen").hide();
        $(".scoreButtonPanel").hide();
        $(".clearButtonPanel").show();
        $("#scoreScreen").show();
        $(headerTitle).text("Past Scores");
        $(subTitle).text("Refresh to play again!");
        $(subText).text("Aim for a higher score!")
            .removeClass("incorrect","correct");
    }
}); //End of Script

// Add moving timer graphic in the title bar. Title bar is timer.