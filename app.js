let profile = {username:'', weight:70, level:'beginner'};
let exercises = [];
let workoutPlan = [];
let timerInterval, timerSeconds = 0;

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
  if(saved){
    profile = JSON.parse(saved);
    document.getElementById('username').value = profile.username;
    document.getElementById('weight').value = profile.weight;
    document.getElementById('level').value = profile.level;
  }
}

function generateWorkout(){
  workoutPlan = exercises.filter(e => e.level===profile.level).slice(0,5);
  renderWorkout();
}

function renderWorkout(){
  const list = document.getElementById('exercise-list');
  list.innerHTML = '';
  workoutPlan.forEach(ex=>{
    const card = document.createElement('div');
    card.classList.add('exercise-card');
    card.innerHTML = `<h3>${ex.name}</h3><p>Muscle: ${ex.muscle}</p><p>Calories/min: ${ex.calories}</p>`;
    list.appendChild(card);
  });
}

function startTimer(){
  timerSeconds=0;
  document.getElementById('timer-label').innerText='En cours';
  timerInterval=setInterval(()=>{
    timerSeconds++;
    let display=Math.floor(timerSeconds/60).toString().padStart(2,'0')+':'+(timerSeconds%60).toString().padStart(2,'0');
    document.getElementById('timer-value').innerText=display;
  },1000);
}

function renderCalendar(){
  const cal=document.getElementById('calendar');
  cal.innerHTML='';
  const today=new Date();
  for(let i=1;i<=30;i++){
    const day=document.createElement('div');
    day.classList.add('calendar-day');
    if(i===today.getDate()) day.classList.add('today');
    day.innerText=i;
    cal.appendChild(day);
  }
}

function renderChart(){
  const ctx=document.getElementById('progressChart').getContext('2d');
  new Chart(ctx,{type:'line',data:{labels:['Semaine1','Semaine2','Semaine3','Semaine4'],datasets:[{label:'Calories brûlées',data:[50,120,180,250],borderColor:'#ff7e5f',fill:false}]}});
}

document.getElementById('saveProfile').addEventListener('click',saveProfile);
document.getElementById('startTimer').addEventListener('click',startTimer);

loadExercises().then(()=>{
  loadProfile();
  generateWorkout();
  renderCalendar();
  renderChart();
});
