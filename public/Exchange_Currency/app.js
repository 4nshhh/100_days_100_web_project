let chartInstance = null;
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const chartCanvas = document.getElementById("historyChart");
let historyChart;
const swapIcon = document.querySelector(".dropdown i");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
  updateFlag(evt.target);
  updateExchangeRate();
  loadHistoricalChart();
});
}
const loadHistoricalChart = async () => {
  try {
    const today = new Date();
    const pastDate = new Date();

    // Last 7 days
    pastDate.setDate(today.getDate() - 7);

    const endDate = today.toISOString().split("T")[0];
    const startDate = pastDate.toISOString().split("T")[0];

    const historyURL =
      `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurr.value}&to=${toCurr.value}`;

    const response = await fetch(historyURL);
    const data = await response.json();

    const labels = [];
    const values = [];

    for (let date in data.rates) {
      labels.push(date);
      values.push(data.rates[date][toCurr.value]);
    }

    // Remove old chart
    if (historyChart) {
      historyChart.destroy();
    }

    historyChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${fromCurr.value} to ${toCurr.value}`,
          data: values,
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        }],
      },
      options: {
        responsive: true,
      },
    });

  } catch (error) {
    console.error("Error loading chart:", error);
  }
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  const FALLBACK_API_URL = `${FALLBACK_URL}/${fromCurr.value.toLowerCase()}.json`;

  let response;
  try {
    response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate from primary API.");
    }
  } catch (error) {
    console.warn(error);
    try {
      response = await fetch(FALLBACK_API_URL);
      if (!response.ok) throw new Error("Failed to fetch exchange rate from fallback API.");
    } catch (error) {
      msg.innerText = "Error: Unable to fetch exchange rate.";
      console.error(error);
      return;
    }
  }

  let data = await response.json();
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  // Temporary sample (until API history is added)
renderChart(["Day1", "Day2", "Day3"], [1, 2, 3]);
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};
swapIcon.addEventListener("click", () => {
  let temp = fromCurr.value;

  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateExchangeRate();
  loadHistoricalChart();
});
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
  loadHistoricalChart();
});

window.addEventListener("load", () => {
  updateExchangeRate();
  loadHistoricalChart();
});
// ===============================
// 📊 HISTORICAL DATA PROCESSING
// ===============================

const formatHistoricalData = (data) => {
    let labels = [];
    let values = [];

    // Convert API object → chart arrays
    for (let date in data) {
        labels.push(date);
        values.push(data[date]);
    }

    return {
        labels: labels,
        values: values
    };
};
const renderChart = (labels, values) => {
    const ctx = document.getElementById("historyChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Exchange Rate History",
                data: values,
                borderWidth: 2,
                fill: false
            }]
        }
    });
};