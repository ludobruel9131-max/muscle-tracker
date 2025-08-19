let exercices = [];
let currentExercise = 0;
let timer, globalSeconds = 0;
let isRest = false;
let totalCalories = 0;

const userWeight = document.getElementById("userWeight");
const userName = document.getElementById("userName");
const startBtn = document.getElementById("startBtn");
const currentExerciseDiv = document.getElementById("currentExercise");
const timerDiv = document.getElementById("timer");
const globalTimerDiv = document.getElementById("globalTimer");

const startSound = new Audio('start.mp3');
const endSound = new Audio('end.mp3');

async function loadExercices() {
  const res = await fetch('exercices.json');
  exercices = await res.json();
}

function updateTimerDisplay(seconds, element) {
  const m = String(Math.floor(seconds / 60)).padStart(2,'0');
  const s = String(seconds % 60).padStart(2,'0');
  element.textContent = `${m}:${s}`;
}

function calculateCalories(exercice, weight) {
  const met = isRest ? 1.5 : 8;
  return Math.round(met * weight * (exercice / 60));
}

function startGlobalTimer() {
  setInterval(()=>{
    globalSeconds++;
    updateTimerDisplay(globalSeconds, globalTimerDiv);
  },1000);
}

function nextStep() {
  if(currentExercise >= exercices.length) {
    clearInterval(timer);
    alert("Séance terminée ! Total calories brûlées : "+totalCalories);
    drawChart();
    return;
  }

  const exo = exercices[currentExercise];
  const duration = isRest ? exo.repos : exo.effort;
  updateTimerDisplay(duration, timerDiv);

  // changer couleur
  timerDiv.className = isRest ? 'rest' : 'effort';
  if(!isRest) startSound.play();
  if(isRest) endSound.play();

  let seconds = duration;
  timer = setInterval(() => {
    seconds--;
    updateTimerDisplay(seconds, timerDiv);
    if(seconds <=0) {
      clearInterval(timer);
      if(!isRest) totalCalories += calculateCalories(exo.effort, Number(userWeight.value || 70));
      isRest = !isRest;
      if(isRest === false) currentExercise++;
      nextStep();
    }
  },1000);

  currentExerciseDiv.textContent = isRest ? `Repos : ${exo.nom}` : `Exercice : ${exo.nom} (${exo.reps} reps)`;
}

startBtn.addEventListener('click', ()=>{
  if(!userName.value || !userWeight.value) {
    alert("Merci de remplir le profil");
    return;
  }
  currentExercise = 0;
  isRest = false;
  totalCalories = 0;
  globalSeconds = 0;
  startGlobalTimer();
  nextStep();
});

// Chart.js progression
function drawChart() {
  const ctx = document.getElementById('calorieChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: exercices.map(e=>e.nom),
      datasets: [{
        label: 'Calories brûlées',
        data: exercices.map(e=>calculateCalories(e.effort, Number(userWeight.value))),
        backgroundColor: 'rgba(40, 167, 69, 0.7)'
      }]
    },
    options: {
      scales: { y: { beginAtZero:true } }
    }
  });
}

loadExercices();
