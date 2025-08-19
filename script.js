let exercises = [];
let workoutIndex = 0;
let timer;
let isRest = false;
let totalSeconds = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Load exercises
    fetch("exercises.json")
        .then(res => res.json())
        .then(data => exercises = data);

    // Profile save
    document.getElementById("saveProfile").addEventListener("click", () => {
        alert("Profil sauvegardé !");
    });

    // Calendar
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayCellClassNames: (info) => {
            if(info.date.toDateString() === new Date().toDateString()){
                return ['today'];
            }
        },
    });
    calendar.render();

    // Start workout
    document.getElementById("startWorkout").addEventListener("click", startWorkout);

    // Progress chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Semaine 1","Semaine 2","Semaine 3","Semaine 4"],
            datasets: [{
                label: 'Calories brûlées',
                data: [200, 250, 300, 350],
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
            }]
        },
        options: { responsive: true }
    });
});

function startWorkout() {
    workoutIndex = 0;
    isRest = false;
    nextExercise();
}

function nextExercise() {
    if(workoutIndex >= exercises.length) {
        alert("Séance terminée !");
        document.getElementById("timer").innerText = "00:00";
        return;
    }
    const ex = exercises[workoutIndex];
    const duration = isRest ? ex.rest : ex.duration;
    document.getElementById("exercise-info").innerText = isRest ? "Repos" : ex.name;
    totalSeconds = duration;
    clearInterval(timer);
    timer = setInterval(() => {
        totalSeconds--;
        document.getElementById("timer").innerText = `${Math.floor(totalSeconds/60).toString().padStart(2,'0')}:${(totalSeconds%60).toString().padStart(2,'0')}`;
        if(totalSeconds <= 0) {
            clearInterval(timer);
            if(!isRest) {
                isRest = true;
            } else {
                isRest = false;
                workoutIndex++;
            }
            nextExercise();
        }
    }, 1000);
}
