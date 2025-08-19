let currentSection = 'dashboard';
let exercises = [];
let workoutIndex = 0;
let isRest = false;
let timerInterval;
let timeLeft = 0;

// Load exercises
fetch('exercises.json')
  .then(res => res.json())
  .then(data => { exercises = data; displayWorkout(); });

// Show/hide sections
function showSection(section) {
    document.getElementById(currentSection).classList.add('hidden');
    document.getElementById(section).classList.remove('hidden');
    currentSection = section;
}

// Display today's workout
function displayWorkout() {
    const container = document.getElementById('todayWorkout');
    container.innerHTML = exercises.map(e => `
        <div>
            <strong>${e.name}</strong> - ${e.reps} reps - ${e.duration}s effort / ${e.pause}s pause
        </div>
    `).join('');
}

// Timer functions
function startWorkout() {
    workoutIndex = 0;
    isRest = false;
    nextExercise();
}

function nextExercise() {
    if (workoutIndex >= exercises.length) {
        document.getElementById('timer').innerText = "Séance terminée!";
        clearInterval(timerInterval);
        return;
    }

    const ex = exercises[workoutIndex];
    timeLeft = isRest ? ex.pause : ex.duration;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (isRest) {
                workoutIndex++;
            }
            isRest = !isRest;
            nextExercise();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2,'0');
    const seconds = (timeLeft % 60).toString().padStart(2,'0');
    document.getElementById('timer').innerText = `${minutes}:${seconds}`;
}

// Calendar
function createCalendar() {
    const container = document.getElementById('calendarContainer');
    const today = new Date().getDate();
    for (let i = 1; i <= 30; i++) {
        const day = document.createElement('div');
        day.classList.add('calendar-day');
        if (i === today) day.classList.add('calendar-today');
        day.innerText = i;
        container.appendChild(day);
    }
}
createCalendar();

// Profile
function loadProfile() {
    const profile = { name: "John Doe", age: 25, weight: 70, height: 170, level: "Intermédiaire" };
    const container = document.getElementById('profileInfo');
    container.innerHTML = `
        Nom: ${profile.name}<br>
        Age: ${profile.age} ans<br>
        Poids: ${profile.weight} kg<br>
        Taille: ${profile.height} cm<br>
        Niveau: ${profile.level}
    `;
}
loadProfile();
