// styles.js
function applyStyles() {
  const styleSheet = document.createElement("style");
  document.head.appendChild(styleSheet);
  const styles = `
    #vrolijke-vrekken-tool * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    #vrolijke-vrekken-tool {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #f0f4f8, #e0e7ff);
      color: #2d3748;
      line-height: 1.6;
      padding: 20px;
      position: relative;
    }

    #vrolijke-vrekken-tool header {
      text-align: center;
      padding: 20px;
      background: transparent;
      margin-bottom: 20px;
    }

    #vrolijke-vrekken-tool header img {
      max-width: 250px;
      height: auto;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-radius: 15px;
    }

    #vrolijke-vrekken-tool .container {
      max-width: 600px;
      margin: 0 auto;
    }

    #vrolijke-vrekken-tool .card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    #vrolijke-vrekken-tool .card h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #1e3a8a;
    }

    #vrolijke-vrekken-tool .input-group {
      margin-bottom: 15px;
      position: relative;
    }

    #vrolijke-vrekken-tool .input-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 5px;
      color: #4a5568;
    }

    #vrolijke-vrekken-tool .input-group input,
    #vrolijke-vrekken-tool .input-group select {
      width: 100%;
      padding: 12px;
      padding-left: 30px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    #vrolijke-vrekken-tool .input-group input:focus,
    #vrolijke-vrekken-tool .input-group select:focus {
      border-color: #3b82f6;
      outline: none;
    }

    #vrolijke-vrekken-tool .input-group input[readonly] {
      background: #f7fafc;
      color: #718096;
    }

    #vrolijke-vrekken-tool .input-group.income::before {
      content: '+';
      position: absolute;
      left: 10px;
      top: 38px;
      color: #10b981;
      font-weight: bold;
      font-size: 1.2rem;
    }

    #vrolijke-vrekken-tool .input-group.expense::before {
      content: '−';
      position: absolute;
      left: 10px;
      top: 38px;
      color: #ef4444;
      font-weight: bold;
      font-size: 1.2rem;
    }

    #vrolijke-vrekken-tool button {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      width: 100%;
    }

    #vrolijke-vrekken-tool button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    #vrolijke-vrekken-tool button.small-btn {
      padding: 10px;
      font-size: 0.9rem;
      width: auto;
      display: inline-block;
      margin-top: 10px;
    }

    #vrolijke-vrekken-tool .total-amount {
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    #vrolijke-vrekken-tool #grafiek-container {
      width: 100%;
      height: 300px;
      margin-top: 20px;
      position: relative;
    }

    #vrolijke-vrekken-tool #investment-graph {
      width: 100% !important;
      height: 100% !important;
    }

    #vrolijke-vrekken-tool .result {
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
      margin-top: 15px;
    }

    #vrolijke-vrekken-tool .result .profit {
      color: #10b981;
    }

    #vrolijke-vrekken-tool .error-message {
      color: #ef4444;
      font-size: 1rem;
      text-align: center;
      margin-top: 20px;
    }

    #vrolijke-vrekken-tool .tutorial-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
    }

    #vrolijke-vrekken-tool .tutorial-popup {
      position: absolute;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 300px;
      z-index: 1001;
      display: none;
    }

    #vrolijke-vrekken-tool .tutorial-popup.extra-padding {
      padding-top: 30px;
    }

    #vrolijke-vrekken-tool .tutorial-popup p {
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    #vrolijke-vrekken-tool .tutorial-popup .close-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-size: 1.2rem;
      color: #ef4444;
    }

    #vrolijke-vrekken-tool .tutorial-popup .next-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    #vrolijke-vrekken-tool .tutorial-popup.below::before {
      content: "";
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid white;
    }

    #vrolijke-vrekken-tool .tutorial-popup.above::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
     ICAg

border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid white;
    }

    #vrolijke-vrekken-tool .tutorial-popup.no-line.below::before,
    #vrolijke-vrekken-tool .tutorial-popup.no-line.above::after {
      border-color: white;
    }

    #vrolijke-vrekken-tool .tutorial-icon {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1002;
      cursor: pointer;
      font-size: 1.5rem;
      color: #2563eb;
      display: none;
    }

    @media (max-width: 480px) {
      #vrolijke-vrekken-tool header img {
        max-width: 150px;
      }
      #vrolijke-vrekken-tool .card h2 {
        font-size: 1.3rem;
      }
      #vrolijke-vrekken-tool .input-group input,
      #vrolijke-vrekken-tool .input-group select {
        font-size: 0.9rem;
      }
      #vrolijke-vrekken-tool button {
        font-size: 0.9rem;
      }
      #vrolijke-vrekken-tool button.small-btn {
        font-size: 0.8rem;
        padding: 8px;
      }
      #vrolijke-vrekken-tool .total-amount {
        font-size: 0.9rem;
      }
      #vrolijke-vrekken-tool .input-group.income::before,
      #vrolijke-vrekken-tool .input-group.expense::before {
        top: 35px;
      }
      #vrolijke-vrekken-tool #grafiek-container {
        height: 250px;
      }
    }
  `;
  styleSheet.textContent = styles;
}

document.addEventListener("DOMContentLoaded", applyStyles);
