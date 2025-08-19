let exercises = [];
let currentSession = [];
let sessionIndex = 0;
let timerInterval;
let caloriesBurned = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/exercises.json')
    .then(res => res.json())
    .then(data => {
        exercises = data;
        loadProfile();
        generateCalendar();
        generateSession();
        updateProgressChart();
    });

    document.getElementById('saveProfile').addEventListener('click', saveProfile);
    document.getElementById('startSession').addEventListener('click', startSession);
});

function loadProfile() {
    const name = localStorage.getItem('userName') || '';
    const level = localStorage.getItem('userLevel') || 'débutant';
    document.getElementById('userName').value = name;
    document.getElementById('userLevel').value = level;
}

function saveProfile() {
    const name = document.getElementById('userName').value;
    const level = document.getElementById('userLevel').value;
    localStorage.setItem('userName', name);
    localStorage.setItem('userLevel', level);
    alert('Profil enregistré !');
    generateSession();
}

function generateCalendar() {
    const calendar = document.getElementById('calendarGrid');
    calendar.innerHTML = '';
    const today = new Date().getDate();
    for(let i=1;i<=30;i++){
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        if(i===today) dayDiv.classList.add('today');
        calendar.appendChild(dayDiv);
    }
}

function generateSession() {
    const level = document.getElementById('userLevel').value;
    currentSession = exercises.filter(exo => exo.level===level).slice(0,5); // 5 exos
    displaySession();
}

function displaySession() {
    const info = document.getElementById('sessionInfo');
    info.innerHTML = currentSession.map((exo,i)=>`<p>${i+1}. ${exo.name} - ${exo.duration}s effort / ${exo.rest}s repos</p>`).join('');
}

function startSession() {
    if(sessionIndex>=currentSession.length) sessionIndex=0;
    runExercise();
}

function runExercise() {
    let exo = currentSession[sessionIndex];
    let phase = 'Effort';
    let time = exo.duration;
    document.getElementById('timerPhase').textContent = phase;
    document.getElementById('timerCountdown').textContent = formatTime(time);

    timerInterval = setInterval(()=>{
        time--;
        document.getElementById('timerCountdown').textContent = formatTime(time);
        if(time<=0){
            clearInterval(timerInterval);
            if(phase==='Effort'){
                phase='Repos';
                time=exo.rest;
                document.getElementById('timerPhase').textContent = phase;
                startSession(); // on passe au repos
                caloriesBurned += exo.calories;
                document.getElementById('totalCalories').textContent = caloriesBurned;
            } else {
                sessionIndex++;
                if(sessionIndex<currentSession.length){
                    runExercise();
                } else {
                    alert('Séance terminée !');
                    updateProgressChart();
                }
            }
        }
    },1000);
}

function formatTime(sec) {
    const m = Math.floor(sec/60);
    const s = sec%60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function updateProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
            datasets:[{
                label:'Calories brûlées',
                data:[100,150,200,120,180,90,0],
                borderColor:'rgba(75,108,183,1)',
                backgroundColor:'rgba(75,108,183,0.2)',
                tension:0.3
            }]
        },
        options:{
            responsive:true,
            plugins:{legend:{display:true}}
        }
    });
}
