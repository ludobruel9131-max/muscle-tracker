let profile = {
    username: '',
    weight: 70,
    level: 'beginner'
};

let exercises = [];
let workoutPlan = [];
let timerInterval;
let timerSeconds = 0;
let currentStep = 0;

async function loadExercises() {
    const res = await fetch('data/exercises.json');
    exercises = await res.json();
}

function saveProfile() {
    profile.username = document.getElementById('username').value;
    profile.weight = Number(document.getElementById('weight').value);
    profile.level = document.getElementById('level').value;
    localStorage.setItem('ludoProfile', JSON.stringify(profile));
    alert('Profil sauvegardé !');
    generateWorkout();
}

function loadProfile() {
    const saved = localStorage.getItem('ludoProfile');
    if (saved) {
        profile = JSON.parse(saved);
        document.getElementById('username').value = profile.username;
        document.getElementById('weight').value = profile.weight;
        document.getElementById('level').value = profile.level;
    }
}

function generateWorkout() {
    workoutPlan = exercises.filter(e => e.level === profile.level).slice(0,5);
    renderWorkout();
}

function renderWorkout() {
    const list = document.getElementById('exercise-list');
    list.innerHTML = '';
    workoutPlan.forEach((ex, idx) => {
        const card = document.createElement('div');
        card.classList.add('exercise-card');
        card.innerHTML = `<h3>${ex.name_fr}</h3>
                          <p>Muscle: ${ex.muscle}</p>
                          <p>Calories/min: ${ex.calories}</p>`;
        list.appendChild(card);
    });
}

function startTimer() {
    timerSeconds = 0;
    currentStep = 0;
    document.getElementById('timer-label').innerText = 'Effort';
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timerSeconds++;
    let display = Math.floor(timerSeconds / 60).toString().padStart(2,'0') + ':' + (timerSeconds % 60).toString().padStart(2,'0');
    document.getElementById('timer-value').innerText = display;
    // ici on peut ajouter la logique pause/effort selon exos
}

function renderCalendar() {
    const cal = document.getElementById('calendar');
    cal.innerHTML = '';
    const today = new Date();
    for (let i=1;i<=30;i++) {
        const day = document.createElement('div');
        day.classList.add('calendar-day');
        if (i === today.getDate()) day.classList.add('today');
        day.innerText = i;
        cal.appendChild(day);
    }
}

document.getElementById('saveProfile').addEventListener('click', saveProfile);
document.getElementById('startTimer').addEventListener('click', startTimer);

loadExercises().then(() => {
    loadProfile();
    generateWorkout();
    renderCalendar();
});
