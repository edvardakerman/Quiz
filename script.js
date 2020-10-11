document.addEventListener("DOMContentLoaded", function (e) {

    class Game {
        constructor() {
            this.questions = []; // array for questions
            this.answers = []; // array for answers
            this.correctAns = []; // array for correct answers
            this.userScore = []; // array for the score from every question
            this.score = 0; // players total score
            this.playerName = ""
            this.current = -1 // index of all arrays increasing for every question, 
        }

        newFetch() {    
            fetch("https://quizapi.io/api/v1/questions?apiKey=SawnJ0MEaaHtOKZvRZg34NbsYvox9mKQbMvubfVo&category=devops&limit=10")
                .then(response => response.json())
                .then(data => {
                    for (let i = 0; i <= 9; i++) {
                        this.questions.push(data[i].question) // fill arrays with newdata
                        this.answers.push(data[i].answers)
                        this.correctAns.push(data[i].correct_answers)
                    }
                })
        }

        printQuestion(current) { // print question and number of question
            document.getElementById("lblQuestion").innerHTML = (current + 1) + ". " + this.questions[current]
        }

        printAnswers(current) { // print all answers, key = answer_a (a-f), hide checkbox when null
            for (var key in this.answers[current]) {
                document.getElementById("lbl_" + key).innerHTML = this.answers[current][key]
                document.getElementById("check_" + key + "_correct").checked = false;

                if (this.answers[current][key] == null) {
                    document.getElementById("check_" + key + "_correct").hidden = true;
                }
                else {
                    document.getElementById("check_" + key + "_correct").hidden = false;
                }
            }
        }

        checkAns(current) { // check if correct, key = answer_a_correct (a-f), if any wrong box is checked return 0
            let correct = this.correctAns[current];
            for (var key in correct) {
                let check = document.getElementById("check_" + key);
                if (check.checked != (correct[key] == "true")) {
                    return 0;
                }
            }
            return 1;
        }

        calcScore(value) { // fills array with returned value from checkAns() and adds it to one total score.
            this.userScore.push(value)
            this.score = this.userScore.reduce((acc, currValue) => {
                return acc + currValue;
            });
        }

        newScoreLabel() { // creates a new label for every finshed quiz
            var newRow = document.createElement("LABEL");
            newRow.innerHTML = game.playerName + ", your new score is : " + game.score + " / 10";
            const lineBreak = document.createElement('br');
            document.body.appendChild(newRow);
            newRow.appendChild(lineBreak);
        }

        reset() { //resets all class variables before starting new quiz
            this.questions = [];
            this.answers = [];
            this.correctAns = [];
            this.userScore = [];
            this.current = 0;
        }
    }

    let game = new Game()
    game.newFetch()

    document.getElementById("nameinput").addEventListener("change", function (e) {
        game.playerName = document.getElementById("nameinput").value
        game.current++;
        game.printQuestion(game.current)
        game.printAnswers(game.current)
        document.getElementById("nextQuestion").hidden = false
        document.getElementById("nameinput").remove()
        document.getElementById("start").remove()
    })

    document.getElementById("nextQuestion").addEventListener("click", function (e) {
        if (game.current >= 0) {
            game.calcScore(game.checkAns(game.current))
        };
        game.current++;
        if (game.current == 9) {
            document.getElementById("checkTotal").hidden = false
            document.getElementById("nextQuestion").hidden = true
        }
        game.printQuestion(game.current)
        game.printAnswers(game.current)
    })

    document.getElementById("checkTotal").addEventListener("click", function (e) {
        game.calcScore(game.checkAns(game.current))
        document.getElementById("checkTotal").hidden = true
        document.getElementById("restart").hidden = false
        game.reset()
        game.newFetch()
        game.newScoreLabel()
    })

    document.getElementById("restart").addEventListener("click", function (e) {
        game.printQuestion(game.current)
        game.printAnswers(game.current)
        document.getElementById("nextQuestion").hidden = false
        document.getElementById("restart").hidden = true
    });
});