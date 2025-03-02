// index.js
// Zorg dat deze module in de embedcode wordt geladen
document.addEventListener("DOMContentLoaded", () => {
  // Zoek de container waarin de tool moet verschijnen
  const container = document.getElementById("appwrapper-vrolijke-vreven");
  if (!container) {
    console.error("Container #appwrapper-vrolijke-vreven niet gevonden.");
    return;
  }
  
  // Injecteer de HTML-structuur van de tool in de container
  container.innerHTML = `
    <header>
      <img src="logo.jpg" alt="Vrolijke Vreven Logo" onerror="this.style.display='none';">
    </header>
    <div class="tutorial-icon" id="tutorial-icon">❓</div>
    <div class="tutorial-overlay" id="tutorial-overlay"></div>
    <div class="tutorial-popup" id="tutorial-popup">
      <span class="close-btn" onclick="closeTutorial()">✖</span>
      <p id="tutorial-text"></p>
      <button class="next-btn" id="next-btn" onclick="nextTutorialStep()">Volgende</button>
    </div>
    <div class="container">
      <!-- Gezinsinkomsten -->
      <div class="card" id="income-section">
        <h2>Gezinsinkomsten</h2>
        <div id="income-inputs"></div>
        <div class="total-amount" id="total-income">Totaal inkomsten: € 0,00</div>
        <button class="small-btn" id="add-income-btn" onclick="addIncomeCategory()">Voeg extra inkomst toe</button>
      </div>
      <!-- Gezinsuitgaven -->
      <div class="card" id="expenses-section">
        <h2>Gezinsuitgaven</h2>
        <div id="expense-inputs"></div>
        <div class="total-amount" id="total-expenses">Totaal uitgaven: € 0,00</div>
        <button class="small-btn" onclick="addExpenseCategory()">Voeg extra uitgave toe</button>
      </div>
      <!-- Maandbalans -->
      <div class="card" id="balance-section">
        <h2>Maandbalans</h2>
        <div class="total-amount" id="balance-amount">Eindsaldo: € 0,00</div>
      </div>
      <!-- Beleggingssimulatie -->
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
      Er is een probleem met het laden van de app. Controleer of "logo.jpg" correct is geüpload.
    </div>
  `;
  
  // Alle functies en variabelen van de tool (JS-functionaliteit)
  
  let incomeCategories = [
    "Loon",
    "Maaltijdcheques",
    "Kindergeld",
    "Vakantiegeld (Totaal gedeeld door 12)",
    "Eindejaarspremie (Totaal gedeeld door 12)",
    "Alimentatie",
    "Huurinkomsten"
  ];
  let expenseCategories = [
    "Huur/Hypotheek",
    "Boodschappen",
    "Elektriciteit",
    "Water",
    "Verwarming",
    "Telecom",
    "Vervoer",
    "Leningen",
    "Streaming",
    "Kleren",
    "Horeca",
    "Hobby's",
    "Huisdieren",
    "Belastingen",
    "Verzekeringen"
  ];
  let chart;
  
  const tutorialSteps = [
    {
      element: "income-inputs",
      targetField: "Loon",
      text: "Welkom bij de Vrolijke Vreven-app. Laten we je helpen besparen en beleggen. In deze sectie vul je jouw maandelijkse inkomsten in, zoals je loon en maaltijdcheques.",
      offset: 85,
      forceBelow: true
    },
    {
      element: "income-inputs",
      targetField: "Eindejaarspremie (Totaal gedeeld door 12)",
      text: "Inkomsten die je maar één keer per jaar hebt, deel je door 12. Dit helpt je je budget onder controle te houden.",
      offset: -175,
      forceBelow: true
    },
    {
      element: "income-section",
      targetField: "add-income-btn",
      text: "Heb je een inkomstenbron die niet in de lijst staat? Voeg hier zelf toe.",
      offset: 25,
      forceBelow: true,
      extraPadding: true
    },
    {
      element: "expense-inputs",
      targetField: "Huur/Hypotheek",
      text: "Vul hier je uitgaven in, zoals huur en boodschappen. Deel jaarlijkse kosten ook hier door 12.",
      forceBelow: true
    },
    {
      element: "balance-section",
      targetField: "balance-amount",
      text: "Het bedrag dat je overhoudt om te sparen of om mee te beleggen.",
      forceBelow: true
    },
    {
      element: "investment-simulation",
      targetField: "monthly-amount",
      text: "Reken hier uit hoeveel je eindsaldo kan opbrengen als je het maandelijks belegt. Voor dit voorbeeld gebruiken we 100 euro.",
      forceBelow: true
    },
    {
      element: "investment-simulation",
      targetField: "start-amount",
      text: "Vul eventueel een extra startbedrag in om te beleggen. Voor dit voorbeeld gebruiken we 1.000 euro.",
      forceBelow: true,
      extraPadding: true
    },
    {
      element: "investment-simulation",
      targetField: "duration",
      text: "Kies zelf gedurende hoeveel jaren je maandelijks wil beleggen. Voor dit voorbeeld gebruiken we een looptijd van 20 jaar.",
      forceBelow: true
    },
    {
      element: "investment-simulation",
      targetField: "return-rate",
      text: "Bepaal zelf je verwachte gemiddelde jaarlijkse rendement. Voor dit voorbeeld gebruiken we 7%.",
      forceBelow: true,
      extraPadding: true
    },
    {
      element: "investment-simulation",
      targetField: "grafiek-container",
      text: "Bekijk hier hoe je belegging op termijn groeit. Hoe langer je belegt, hoe hoger het effect van rente op rente. <strong>Daar worden vreven vrolijk van!</strong>",
      forceAbove: true,
      buttonText: "Klaar",
      offset: 60
    }
  ];
  
  let currentStep = 0;
  let isTutorialActive = false;
  
  function startTutorial() {
    currentStep = 0;
    isTutorialActive = true;
    localStorage.setItem("tutorialCompleted", "false");
    setTutorialValues();
    showTutorialStep();
  }
  
  function setTutorialValues() {
    document.getElementById("monthly-amount").value = 100;
    document.getElementById("start-amount").value = 1000;
    document.getElementById("duration").value = 20;
    document.getElementById("return-rate").value = 7;
    updateSimulation();
  }
  
  function showTutorialStep() {
    const overlay = document.getElementById("tutorial-overlay");
    const popup = document.getElementById("tutorial-popup");
    const text = document.getElementById("tutorial-text");
    const nextBtn = document.getElementById("next-btn");
  
    if (currentStep < tutorialSteps.length) {
      const step = tutorialSteps[currentStep];
      const extraOffset = step.offset || 15;
  
      popup.classList.remove("extra-padding", "no-line");
      if (step.extraPadding) {
        popup.classList.add("extra-padding");
      }
  
      nextBtn.textContent = step.buttonText || "Volgende";
      text.innerHTML = step.text;
  
      let targetElement;
      if (step.targetField === "add-income-btn") {
        targetElement = document.getElementById("add-income-btn");
      } else if (step.targetField === "monthly-amount") {
        targetElement = document.getElementById("monthly-amount");
      } else if (step.targetField === "start-amount") {
        targetElement = document.getElementById("start-amount");
      } else if (step.targetField === "duration") {
        targetElement = document.getElementById("duration");
      } else if (step.targetField === "return-rate") {
        targetElement = document.getElementById("return-rate");
      } else if (step.targetField === "grafiek-container") {
        targetElement = document.getElementById("grafiek-container");
      } else if (step.targetField === "balance-amount") {
        targetElement = document.getElementById("balance-amount");
      } else {
        const label = document.querySelector(`#${step.element} label`);
        if (label && label.textContent.includes(step.targetField)) {
          targetElement = label.parentElement.querySelector("input");
        } else {
          targetElement = document.getElementById(step.element);
        }
      }
  
      overlay.style.display = "block";
      popup.style.display = "block";
  
      setTimeout(() => {
        const rect = targetElement.getBoundingClientRect();
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        let popupTop;
        let placement;
  
        if (step.forceAbove) {
          popupTop = rect.top + window.scrollY - popupHeight - extraOffset;
          placement = "above";
        } else if (step.forceBelow) {
          popupTop = rect.bottom + window.scrollY + extraOffset;
          placement = "below";
        } else {
          const spaceAbove = rect.top;
          const spaceBelow = window.innerHeight - rect.bottom;
          if (spaceAbove >= popupHeight + extraOffset) {
            popupTop = rect.top + window.scrollY - popupHeight - extraOffset;
            placement = "above";
          } else if (spaceBelow >= popupHeight + extraOffset) {
            popupTop = rect.bottom + window.scrollY + extraOffset;
            placement = "below";
          } else {
            popupTop = rect.top + window.scrollY + (rect.height / 2) - (popupHeight / 2);
            placement = (spaceBelow >= spaceAbove) ? "below" : "above";
          }
        }
  
        let popupLeft = rect.left + window.scrollX + (rect.width / 2) - (popupWidth / 2);
        if (popupLeft < 10) popupLeft = 10;
        if (popupLeft + popupWidth > window.innerWidth - 10) {
          popupLeft = window.innerWidth - popupWidth - 10;
        }
  
        popup.style.top = popupTop + "px";
        popup.style.left = popupLeft + "px";
  
        if (placement === "above") {
          popup.classList.remove("below");
          popup.classList.add("above");
        } else {
          popup.classList.remove("above");
          popup.classList.add("below");
        }
      }, 100);
  
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      nextBtn.style.display = "block";
    } else {
      closeTutorial();
    }
  }
  
  function nextTutorialStep() {
    currentStep++;
    if (currentStep < tutorialSteps.length) {
      let nextTargetElement;
      const nextStep = tutorialSteps[currentStep];
  
      if (nextStep.targetField === "add-income-btn") {
        nextTargetElement = document.getElementById("add-income-btn");
      } else if (nextStep.targetField === "monthly-amount") {
        nextTargetElement = document.getElementById("monthly-amount");
      } else if (nextStep.targetField === "start-amount") {
        nextTargetElement = document.getElementById("start-amount");
      } else if (nextStep.targetField === "duration") {
        nextTargetElement = document.getElementById("duration");
      } else if (nextStep.targetField === "return-rate") {
        nextTargetElement = document.getElementById("return-rate");
      } else if (nextStep.targetField === "grafiek-container") {
        nextTargetElement = document.getElementById("grafiek-container");
      } else if (nextStep.targetField === "balance-amount") {
        nextTargetElement = document.getElementById("balance-amount");
      } else {
        const label = document.querySelector(`#${nextStep.element} label`);
        if (label && label.textContent.includes(nextStep.targetField)) {
          nextTargetElement = label.parentElement.querySelector("input");
        } else {
          nextTargetElement = document.getElementById(nextStep.element);
        }
      }
  
      nextTargetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(showTutorialStep, 500);
    } else {
      closeTutorial();
    }
  }
  
  function closeTutorial() {
    const overlay = document.getElementById("tutorial-overlay");
    const popup = document.getElementById("tutorial-popup");
    const tutorialIcon = document.getElementById("tutorial-icon");
  
    overlay.style.display = "none";
    popup.style.display = "none";
    tutorialIcon.style.display = "block";
  
    localStorage.setItem("tutorialCompleted", "true");
    isTutorialActive = false;
  
    // Reset startbedrag en maandelijks bedrag op 0
    document.getElementById("start-amount").value = 0;
    document.getElementById("monthly-amount").value = 0;
  
    updateBudget();
  }
  
  function formatAmount(amount) {
    let [integer, decimal] = amount.toFixed(2).split(".");
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `€ ${integer},${decimal}`;
  }
  
  function updateBudget() {
    let totalIncome = 0;
    document.querySelectorAll(".income-input").forEach(input => {
      totalIncome += parseFloat(input.value) || 0;
    });
    document.getElementById("total-income").textContent = `Totaal inkomsten: ${formatAmount(totalIncome)}`;
  
    let totalExpenses = 0;
    document.querySelectorAll(".expense-input").forEach(input => {
      totalExpenses += parseFloat(input.value) || 0;
    });
    document.getElementById("total-expenses").textContent = `Totaal uitgaven: ${formatAmount(totalExpenses)}`;
  
    const monthlyAmount = isTutorialActive ? 100 : totalIncome - totalExpenses;
    document.getElementById("monthly-amount").value = monthlyAmount.toFixed(2);
    document.getElementById("balance-amount").textContent = `Eindsaldo: ${formatAmount(monthlyAmount)}`;
    updateSimulation();
  }
  
  function updateSimulation() {
    const monthlyAmount = parseFloat(document.getElementById("monthly-amount").value) || 0;
    const startAmount = parseFloat(document.getElementById("start-amount").value) || 0;
    const duration = parseInt(document.getElementById("duration").value) || 0;
    const returnRate = parseFloat(document.getElementById("return-rate").value) || 0;
  
    if (isNaN(duration) || duration <= 0) {
      if (chart) chart.destroy();
      const ctx = document.getElementById("investment-graph").getContext("2d");
      chart = new Chart(ctx, {
        type: "line",
        data: { labels: [], datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Bedrag (€)" },
              ticks: { callback: value => formatAmount(value) }
            },
            x: { title: { display: true, text: "Jaar" } }
          }
        }
      });
      document.getElementById("total-result").textContent = `Resultaat: ${formatAmount(0)}`;
      document.getElementById("profit").textContent = `Winst: ${formatAmount(0)}`;
      return;
    }
  
    const monthlyRate = returnRate / 100 / 12;
    const months = duration * 12;
    let futureValue = startAmount;
    let totalInvested = startAmount;
  
    const labels = [];
    const investedData = [];
    const totalData = [];
  
    for (let month = 0; month <= months; month++) {
      if (month % 12 === 0) {
        labels.push(2025 + month / 12);
        investedData.push(totalInvested);
        totalData.push(futureValue);
      }
      if (month < months) {
        futureValue = futureValue * (1 + monthlyRate) + monthlyAmount;
        totalInvested += monthlyAmount;
      }
    }
  
    if (chart) chart.destroy();
    const ctx = document.getElementById("investment-graph").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Geïnvesteerd",
            data: investedData,
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.1
          },
          {
            label: "Totaal",
            data: totalData,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Bedrag (€)" },
            ticks: { callback: value => formatAmount(value) }
          },
          x: { title: { display: true, text: "Jaar" } }
        }
      }
    });
  
    const totalResult = totalData[totalData.length - 1];
    const profit = totalResult - totalInvested;
    document.getElementById("total-result").textContent = `Resultaat: ${formatAmount(totalResult)}`;
    document.getElementById("profit").textContent = `Winst: ${formatAmount(profit)}`;
  }
  
  function addIncomeCategory() {
    const incomeValues = {};
    document.querySelectorAll(".income-input").forEach(input => {
      const label = input.parentElement.querySelector("label").textContent.replace(" (€)", "");
      incomeValues[label] = input.value;
    });
  
    const categoryName = prompt("Voer de naam van de nieuwe inkomenscategorie in:");
    if (categoryName) {
      incomeCategories.push(categoryName);
      updateIncomeInputs();
  
      document.querySelectorAll(".income-input").forEach(input => {
        const label = input.parentElement.querySelector("label").textContent.replace(" (€)", "");
        if (incomeValues[label]) {
          input.value = incomeValues[label];
        }
      });
  
      updateBudget();
    }
  }
  
  function addExpenseCategory() {
    const expenseValues = {};
    document.querySelectorAll(".expense-input").forEach(input => {
      const label = input.parentElement.querySelector("label").textContent.replace(" (€)", "");
      expenseValues[label] = input.value;
    });
  
    const categoryName = prompt("Voer de naam van de nieuwe uitgavencategorie in:");
    if (categoryName) {
      expenseCategories.push(categoryName);
      updateExpenseInputs();
  
      document.querySelectorAll(".expense-input").forEach(input => {
        const label = input.parentElement.querySelector("label").textContent.replace(" (€)", "");
        if (expenseValues[label]) {
          input.value = expenseValues[label];
        }
      });
  
      updateBudget();
    }
  }
  
  function updateIncomeInputs() {
    const incomeInputs = document.getElementById("income-inputs");
    incomeInputs.innerHTML = "";
    incomeCategories.forEach(category => {
      const div = document.createElement("div");
      div.className = "input-group income";
      div.innerHTML = `
        <label>${category} (€)</label>
        <input type="number" class="income-input" placeholder="0" oninput="updateBudget()">
      `;
      incomeInputs.appendChild(div);
    });
  }
  
  function updateExpenseInputs() {
    const expenseInputs = document.getElementById("expense-inputs");
    expenseInputs.innerHTML = "";
    expenseCategories.forEach(category => {
      const div = document.createElement("div");
      div.className = "input-group expense";
      div.innerHTML = `
        <label>${category} (€)</label>
        <input type="number" class="expense-input" placeholder="0" oninput="updateBudget()">
      `;
      expenseInputs.appendChild(div);
    });
  }
  
  // Vul de dropdown voor looptijd (1 tot 50 jaar, standaard 20 jaar)
  const durationSelect = document.getElementById("duration");
  for (let i = 1; i <= 50; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = `${i} jaar`;
    if (i === 20) option.selected = true;
    durationSelect.appendChild(option);
  }
  
  // Start de tool: als de tutorial nog niet voltooid is, start deze
  if (localStorage.getItem("tutorialCompleted") !== "true") {
    startTutorial();
  } else {
    document.getElementById("tutorial-icon").style.display = "block";
  }
  
  document.getElementById("tutorial-icon").addEventListener("click", startTutorial);
  
  // Controleer of Chart.js beschikbaar is
  if (typeof Chart === "undefined") {
    console.error("Chart.js kon niet worden geladen. Controleer de CDN-link of voeg Chart.js lokaal toe.");
    document.getElementById("error-message").style.display = "block";
  }
});
