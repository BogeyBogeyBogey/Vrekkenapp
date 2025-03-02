// index.js
const appHTML = `
  <header>
    <img src="./logo.jpg" alt="Vrolijke Vrekken Logo" onerror="this.style.display='none';">
  </header>
  <div class="tutorial-icon" id="tutorial-icon"></div>
  <div class="tutorial-overlay" id="tutorial-overlay"></div>
  <div class="tutorial-popup" id="tutorial-popup">
    <span class="close-btn" onclick="closeTutorial()"></span>
    <p id="tutorial-text"></p>
    <button class="next-btn" id="next-btn" onclick="nextTutorialStep()">Volgende</button>
  </div>
  <div class="container">
    <div class="card" id="income-section">
      <h2>Gezinsinkomsten</h2>
      <div id="income-inputs"></div>
      <div class="total-amount" id="total-income">Totaal inkomsten: € 0,00</div>
      <button class="small-btn" id="add-income-btn" onclick="addIncomeCategory()">Voeg extra inkomst toe</button>
    </div>
    <div class="card" id="expenses-section">
      <h2>Gezinsuitgaven</h2>
      <div id="expense-inputs"></div>
      <div class="total-amount" id="total-expenses">Totaal uitgaven: € 0,00</div>
      <button class="small-btn" onclick="addExpenseCategory()">Voeg extra uitgave toe</button>
    </div>
    <div class="card" id="balance-section">
      <h2>Maandbalans</h2>
      <div class="total-amount" id="balance-amount">Eindsaldo: € 0,00</div>
    </div>
    <div class="card" id="investment-simulation">
      <h2>Beleggingssimulatie</h2>
      <div class="input-group">
        <label>Maandelijks bedrag (€)</label>
        <input type="number" id="monthly-amount" readonly>
      </div>
      <div class="input-group">
        <label>Startbedrag (€)</label>
        <input type="number" id="start-amount" placeholder="0" oninput="updateSimulation()">
      </div>
      <div class="input-group">
        <label>Looptijd (jaren)</label>
        <select id="duration" onchange="updateSimulation()"></select>
      </div>
      <div class="input-group">
        <label>Rendement (%)</label>
        <input type="number" id="return-rate" step="0.1" value="7" oninput="updateSimulation()">
      </div>
      <div class="result">
        <span id="total-result">Resultaat: € 0,00</span>
        <span id="profit" class="profit">Winst: € 0,00</span>
      </div>
      <div id="grafiek-container">
        <canvas id="investment-graph"></canvas>
      </div>
    </div>
  </div>
  <div class="error-message" id="error-message" style="display: none;">
    Er is een probleem met het laden van de app. Controleer of 'index.js' en 'logo.jpg' correct zijn geüpload.
  </div>
`;

// Plak hier de rest van je JavaScript uit je originele HTML (ongeschonden)
let incomeCategories = ["Loon", "Maaltijdcheques", "Kindergeld", "Vakantiegeld (Totaal gedeeld door 12)", "Eindejaarspremie (Totaal gedeeld door 12)", "Alimentatie", "Huurinkomsten"];
let expenseCategories = ["Huur/Hypotheek", "Boodschappen", "Elektriciteit", "Water", "Verwarming", "Telecom", "Vervoer", "Leningen", "Streaming", "Kleren", "Horeca", "Hobby's", "Huisdieren", "Belastingen", "Verzekeringen"];
let chart;
const tutorialSteps = [ /* jouw volledige tutorialSteps-array uit de originele code */ ];
let currentStep = 0;
let isTutorialActive = false;

// Alle functies (startTutorial, updateBudget, enz.) uit je originele code hier toevoegen
function startTutorial() { /* ... */ }
function showTutorialStep() { /* ... */ }
function nextTutorialStep() { /* ... */ }
function closeTutorial() { /* ... */ }
function formatAmount(amount) { /* ... */ }
function updateBudget() { /* ... */ }
function updateSimulation() { /* ... */ }
function addIncomeCategory() { /* ... */ }
function addExpenseCategory() { /* ... */ }
function updateIncomeInputs() { /* ... */ }
function updateExpenseInputs() { /* ... */ }

function initializeApp() {
  const wrapper = document.getElementById("appwrapper-vrolijke-vrekken");
  if (!wrapper) return;

  wrapper.classList.add("vrolijke-vrekken-app");
  wrapper.innerHTML = appHTML;

  updateIncomeInputs();
  updateExpenseInputs();
  updateBudget();

  const durationSelect = document.getElementById("duration");
  for (let i = 1; i <= 50; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = `${i} jaar`;
    if (i === 20) option.selected = true;
    durationSelect.appendChild(option);
  }

  if (localStorage.getItem("tutorialCompleted") !== "true") {
    startTutorial();
  } else {
    document.getElementById("tutorial-icon").style.display = "block";
  }

  document.getElementById("tutorial-icon").addEventListener("click", startTutorial);

  if (typeof Chart === "undefined") {
    console.error("Chart.js kon niet worden geladen.");
    document.getElementById("error-message").style.display = "block";
  }
}

initializeApp();

export { initializeApp };
