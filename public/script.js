const socket = io();

const questions = [
    {
        q: "Столица Германии?",
        answers: [
            { text: "Берлин", correct: true },
            { text: "Мюнхен", correct: false },
            { text: "Кёльн", correct: false }
        ]
    },
    {
        q: "HTML — это?",
        answers: [
            { text: "Язык разметки", correct: true },
            { text: "Язык программирования", correct: false }
        ]
    }
];

let current = 0;
let time = 10;
let timer;

const login = document.getElementById("login");
const game = document.getElementById("game");
const leaderboard = document.getElementById("leaderboard");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const leadersEl = document.getElementById("leaders");

function join() {
    const nick = document.getElementById("nickname").value;
    if (!nick) return;
    socket.emit("join", nick);
    login.classList.add("hidden");
    game.classList.remove("hidden");
    showQuestion();
}

function showQuestion() {
    if (!questions[current]) {
        game.classList.add("hidden");
        leaderboard.classList.remove("hidden");
        return;
    }

    time = 10;
    timerEl.textContent = time;
    questionEl.textContent = questions[current].q;
    answersEl.innerHTML = "";

    questions[current].answers.forEach(a => {
        const btn = document.createElement("button");
        btn.textContent = a.text;
        btn.onclick = () => {
            socket.emit("answer", a.correct);
            current++;
            clearInterval(timer);
            showQuestion();
        };
        answersEl.appendChild(btn);
    });

    timer = setInterval(() => {
        time--;
        timerEl.textContent = time;
        if (time === 0) {
            clearInterval(timer);
            current++;
            showQuestion();
        }
    }, 1000);
}

socket.on("players", players => {
    leadersEl.innerHTML = "";
    Object.values(players)
        .sort((a,b)=>b.score-a.score)
        .forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name}: ${p.score}`;
            leadersEl.appendChild(li);
        });
});
