let exercises = [];
let currentExercise = 0;
let isRest = false;
let timerInterval;

// Charger les exercices depuis le JSON
fetch('exercises.json')
  .then(res => res.json())
  .then(data => {
    exercises = data;
    displayTodaySession();
    generateCalendar();
  });

// Afficher la séance du jour
function displayTodaySession() {
  const container = document.getElementById('session-exercises');
  container.innerHTML = '';
  exercises.forEach((ex, i) => {
    const div = document.createElement('div');
    div.textContent = `${ex.name} - ${ex.reps} reps - ${ex.duration}s`;
    container.appendChild(div);
  });
}

// Timer global pour la séance
document.getElementById('start-btn').addEventListener('click', () => {
  startExercise(currentExercise);
});

function startExercise(index) {
  if (index >= exercises.length) {
    alert("Séance terminée !");
    return;
  }

  let duration = isRest ? exercises[index].rest : exercises[index].duration;
  document.getElementById('timer').textContent = duration;

  timerInterval = setInterval(() => {
    duration--;
    document.getElementById('timer').textContent = duration;
    if (duration <= 0) {
      clearInterval(timerInterval);
      isRest = !isRest;
      if (!isRest) currentExercise++;
      startExercise(currentExercise);
    }
  }, 1000);
}

// Calendrier simple
function generateCalendar() {
  const cal = document.getElementById('calendar');
  const today = new Date().getDate();
  for(let i=1;i<=30;i++){
    const day = document.createElement('div');
    day.textContent = i;
    if(i === today) day.classList.add('today');
    cal.appendChild(day);
  }
}

