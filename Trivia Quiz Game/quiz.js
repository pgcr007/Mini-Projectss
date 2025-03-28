const startscreen = document.getElementById("start-screen");
const quizscreen = document.getElementById("quiz-screen");
const endscreen = document.getElementById("end-screen");
const startbtn = document.getElementById("start-btn");
const nextbtn = document.getElementById("next-btn");
const restartbtn = document.getElementById("restart-btn");
const categoryselect = document.getElementById("category");
const questionelement = document.getElementById("question");
const choiceselement = document.getElementById("choices");
const scoreelement = document.getElementById("score");
const timerelement = document.getElementById("timer");
const currentquestionelement = document.getElementById("current-qus");
const finalscore = document.getElementById("final-score");
const loader = document.getElementById("loader");

let question = [];
let currentquestionindex = 0;
let score = 0;
let timer;
let timerleft = 30;

startbtn.addEventListener("click", startquiz);
nextbtn.addEventListener("click", nextquestion);
restartbtn.addEventListener("click", resetquiz);

async function startquiz()
{
    startscreen.classList.add('hidden');
    loader.classList.remove('hidden');

    const category = categoryselect.value;
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`);
    const data = await response.json();
    questions = data.results.map(q => ({
        question: q.question,
        correct: q.correct_answer,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
    }));
    
    loader.classList.add('hidden');
    quizscreen.classList.remove('hidden');
    currentquestionindex = 0;
    score = 0;
    scoreelement.textContent=score;
    loadquestion();
    starttimer();
}

function loadquestion()
{
    const currentquestion = questions[currentquestionindex];
    questionelement.innerHTML = currentquestion.question;
    currentquestionelement.textContent= currentquestionindex +1;
    choiceselement.innerHTML = ``;

    currentquestion.answers.forEach(answer => {
        const button = document.createElement(`button`);
        button.innerHTML = answer;
        button.addEventListener("click", () => checkanswer(answer, currentquestion.correct));
        choiceselement.appendChild(button);
    });

}

function checkanswer(selected, correct)
{
    clearInterval(timer);
    const buttons = choiceselement.getElementsByTagName("button");
    for(let button of buttons)
    {
        button.disabled=true;
        if(button.innerHTML === correct) 
        {
            button.classList.add("correct");
        }
        if(button.innerHTML === selected && selected !== correct)
        {
            button.classList.add("wrong");
        }
    }

    if(selected === correct) score++;
    scoreelement.textContent = score;
    nextbtn.classList.remove('hidden');

}

function nextquestion()
{
    currentquestionindex++;
    if(currentquestionindex < question.length) 
    {
        loadquestion();
        nextbtn.classList.add("hidden");
        timerleft =30;
        timerelement.textContent = timerleft;
        starttimer();
    }
    else
    {
        showresults();
    }
}

function starttimer()
{
    timer = setInterval(() => {
        timerleft--;
        timerelement.textContent= timerleft;
        if(timerleft <= 0)
        {
            clearInterval(timer);
            nextquestion();
        }
    }, 1000);
}

function showresults()
{
    quizscreen.classList.add("hidden");
    endscreen.classList.remove("hidden");
    finalscore.textContent= `${score}/${questions.length}`;
}

function resetquiz()
{
    endscreen.classList.add("hidden");
    startscreen.classList.remove("hidden");
}