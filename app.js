let exercices = [];
let indexExercice = 0;
let timerInterval;
let tempsRestant = 0;
let enPause = true;
let caloriesTotales = 0;

// Charger les exercices selon le niveau
document.getElementById("chargerExos").addEventListener("click", async () => {
  const niveau = document.getElementById("niveau").value;
  const response = await fetch('exercices.json');
  const data = await response.json();
  exercices = data.filter(ex => ex.niveau === niveau);
  
  if(exercices.length === 0) {
    alert("Aucun exercice pour ce niveau !");
    return;
  }

  indexExercice = 0;
  caloriesTotales = 0;
  document.getElementById("seance").classList.remove("hidden");
  afficherExercice();
});

// Affichage de l'exercice courant
function afficherExercice() {
  const ex = exercices[indexExercice];
  document.getElementById("exerciceCourant").textContent = `${ex.nom} - ${ex.repetitions} reps`;
  tempsRestant = ex.effortSec;
  enPause = false;
  document.getElementById("etat").textContent = "Effort";
  updateTimerDisplay();
}

// Démarrer / Pause
document.getElementById("startStop").addEventListener("click", () => {
  if(timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    timerInterval = setInterval(timerTick, 1000);
  }
});

function timerTick() {
  tempsRestant--;
  updateTimerDisplay();
  if(tempsRestant <= 0) {
    const ex = exercices[indexExercice];
    if(enPause) {
      // Fin de la pause → exercice suivant
      indexExercice++;
      if(indexExercice >= exercices.length) {
        clearInterval(timerInterval);
        alert("Séance terminée ! Calories brûlées: " + caloriesTotales);
        return;
      }
      afficherExercice();
    } else {
      // Fin d'effort → pause
      caloriesTotales += ex.calories;
      tempsRestant = ex.reposSec;
      enPause = true;
      document.getElementById("etat").textContent = "Repos";
    }
  }
}

// Mettre à jour le timer visuel
function updateTimerDisplay() {
  const min = String(Math.floor(tempsRestant / 60)).padStart(2, '0');
  const sec = String(tempsRestant % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${min}:${sec}`;
  document.getElementById("calories").textContent = `Calories brûlées: ${caloriesTotales}`;
}

