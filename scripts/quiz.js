
function test(questionsFile){
fetch(`jsons/${questionsFile}.json`)
.then( document.getElementById('main').innerHTML = `
<h2 class="test-title">Fetching Questions</h2>
    <div id="card" class="card bg-dark border-5  overflow-y-auto" style="width: 75%; max-width:500px; min-width: 130px; min-height:200px;">
        <div class="card-body w-100">
          <h5 id="qtitle" class="card-title text-light">It's will not take a long</h5>
          <p id="qtxt" class="card-text text-light">Be ready for the test while prepering</p>
        </div>
        <div class="loading list-group m-1 border-0" style="background: transparent;">
          <img class="loadingCircle" src="images/loading.svg"></img>
        </div>
        <div class="card-body cb">
          <button id="startBtn" class="btn btn-success disabled">Loading...</button>
        </div>
      </div>`)
    .then(responsive => responsive.json())
    .then(result => {
        document.getElementById('main').innerHTML = `
        <h2 class="test-title">${result.title} Test</h2>
            <div id="card" class="card bg-dark border-5" style="width: 75%; max-width:500px; min-width: 130px; max-height:200vh;">
                <div class="card-body w-100">
                  <h5 id="qtitle" class="card- title text-light">Let's start</h5>
                  <p id="qtxt" class="card-text text-light">This test is just to assess your level and for fun, it is not official and has no certificate.</p>
                </div>
                <div class="choices list-group m-1 border-0" style="background: transparent;">
                  <div class="choice btn btn-light p-2 pt-2 pb-2 disabled">a) <span id="choice1">Choices will be shown here</span></div>
                  <div class="choice btn btn-light p-2 pt-2 pb-2 disabled">b) <span id="choice2"></span></div>
                  <div class="choice btn btn-light p-2 pt-2 pb-2 disabled">c) <span id="choice3"></span></div>
                </div>
                <div class="card-body cb">
                <button id="confirmBtn" class="btn btn-primary m-1 d-none">Confirm and next</button>
                <button id="startBtn" class="btn btn-success">Start</button>
                </div>
              </div>`;
        const choices = Array.from(document.getElementsByClassName('choice'));
        const confirmBtn = document.getElementById('confirmBtn');
        const startBtn = document.getElementById('startBtn');
        const title = document.getElementById('qtitle');
        const text = document.getElementById('qtxt');
        const choice1 = document.getElementById('choice1');
        const choice2 = document.getElementById('choice2');
        const choice3 = document.getElementById('choice3');

        startBtn.onclick = () => {
            // put the values of the json file in an array
            let allQuestions = Object.values(result.q);
            let testTitle = result.title;
            // shuffle the questions after fetching it from json file
            shuffle(allQuestions);
            let questions = [];
            for(let index = 0; index <= 9; index++){
              questions.push(allQuestions[index])
            }
            questions = [questions[0], questions[1], questions[2], questions[3], questions[4], questions[5], questions[6], questions[7], questions[8], questions[9]]
            //start the test
            startTest(questions, testTitle, choices, confirmBtn, title, text, choice1, choice2, choice3);
            // hide the "start" button and show the "confirm and next" button
            startBtn.classList.add('d-none');
            confirmBtn.classList.remove('d-none');
            confirmBtn.classList.add('disabled');
            // load question 1
            loadQuestion(0, questions, title, text, choices, choice1, choice2, choice3)
        }
    }).catch((error) => {
        document.getElementById('main').innerHTML = `
<h2 class="test-title">Something went wrong</h2>
    <div id="card" class="card bg-dark border-5  overflow-y-auto" style="width: 75%; max-width:500px; min-width: 130px; min-height:200px;">
        <div class="card-body w-100">
          <h5 id="qtitle" class="card-title text-light">Failed to fetch data</h5>
          <p id="qtxt" class="card-text text-light">Check the network</p>
        </div>
        <div class="loading list-group m-1 border-0" style="background: transparent;">
          <img src="images/Error.svg" class="errorIcon"></img>
        </div>
        <div class="card-body cb">
          <button id="startBtn" class="btn btn-success disabled">!</button>
        </div>
      </div>`
    });

function startTest(questions, testTitle, choices, confirmBtn, title, text, choice1, choice2, choice3) {
    let currentQuestion = 1;
    let answer = '';
    let points = 0;
    let fullPoints = 0;
    let answers = [];
    let corrects = [];
    
    let details = '';
    for (let choice of choices) {
        choice.classList.remove('disabled');
        choice.onclick = (e) => {
            confirmBtn.classList.remove('disabled');
            for (let c of choices) {
                c.classList.add('btn-light');
                c.classList.remove('btn-primary');
                e.target.classList.remove('btn-light');
                e.target.classList.add('btn-primary');
                answer = e.target.textContent.slice(3);
            }
            confirmBtn.classList.remove('disabled');
        }
    }
    // confirm the answer and show the next question
    confirmBtn.onclick = () => {
        choices[2].classList.remove('disabled');
        confirmBtn.classList.add('disabled');
        fullPoints += questions[currentQuestion - 1].points;
        answers.push(answer);
        for (let c of choices) {
            c.classList.add('btn-light');
            c.classList.remove('btn-primary');
        }
        if (answer === questions[currentQuestion - 1].answer) { // check if the answer is correct so increase the points
            points += questions[currentQuestion - 1].points;
            corrects.push(true);
        } else { corrects.push(false) }

        currentQuestion++; // save the number of test
        if (currentQuestion <= questions.length) {
            // load the next question
            loadQuestion(currentQuestion - 1, questions, title, text, choices, choice1, choice2, choice3)
        } else {
            // finish the test
            let currentQuestion = 0;
            let percentage = points / fullPoints * 100;
            percentage = percentage.toFixed(1).toString().padStart(4, '0');
            title.textContent = `You have finished the test`;
            text.textContent = `Your percentage : ${percentage}%`;
            for (let c of choices) {
                c.classList.add('disabled');
                c.textContent = '';
            }
            for(let n of questions){
                let color = '';
                currentQuestion++;
                if(corrects[currentQuestion - 1] === true){
                    color = 'success';
                    details += `
                    <div class="alert alert-${color}">
                    <h5 class="">Question ${currentQuestion} (+${n.points}points)</h5>
                    <p class="">${n.question}</p>
                       <p class="">✔ ${answers[currentQuestion - 1]}</p>
                       </div>
                       `
                }
                else{
                    color = 'danger';
                    details += `
                       <div class="alert alert-${color}">
                       <h5 class="">Question ${currentQuestion} (${n.points}points)</h5>
                       <p class="">${n.question}</p>
                       <p class="">❌ ${answers[currentQuestion - 1]}</p>
                       <p class="">✔ ${n.answer}</p>
                       </div>
                       `
                }
            }
            ShowResultCard(percentage, details, testTitle);
        }
    }

}

function loadQuestion(cur, questions, title, text, choices, choice1, choice2, choice3) {
    title.textContent = `Question ${cur + 1}`;
    text.textContent = questions[cur].question;
    choice1.textContent = questions[cur].choices[0];
    choice2.textContent = questions[cur].choices[1];
    if (questions[cur].choices[2] !== null) {
        choice3.textContent = questions[cur].choices[2]
    } else {
        choices[2].classList.add('disabled');
        choice3.textContent = '';
    }
}

function ShowResultCard(percentage, details, testTitle) {
    document.getElementById('main').innerHTML = `
    <h2 class="test-title">${testTitle} Test Result</h2>
    <div id="card" class="card bg-dark border-5" style="width: 75%; min-width: 130px; max-height: 75%;">
        <div class="card-body w-100">
          <h5 class="card-title text-light">You have finished the test</h5>
          <p class="card-text text-light">Your percentage  ${percentage}%</p>
        </div>
        <div class="choices list-group overflow-auto h-100 border-0 p-1">
        ${details}
        </div>
        <div class="card-body cb">
        <form method="get" action="#tests">
        <button id="okBtn" class="btn btn-primary" type="submit">OK</button>
        </form>
        </div>
      </div>`;
}

// shuflle the elements of an array
function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const random = Math.floor(Math.random()*(i + 1));
        [array[random], array[i]] = [array[i], array[random]];
    }
}
}
