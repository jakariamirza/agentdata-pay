const form = document.querySelector("#agent-form");
const queryInput = document.querySelector("#query");
const runButton = document.querySelector("#run-button");
const layout = document.querySelector("#result-layout");
const title = document.querySelector("#result-title");
const insights = document.querySelector("#insights");
const dataView = document.querySelector("#data-view");
const steps = document.querySelector("#steps");
const receiptAmount = document.querySelector("#receipt-amount");
const receiptMode = document.querySelector("#receipt-mode");
const modePill = document.querySelector("#mode-pill");

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-IN");

async function loadHealth() {
  const response = await fetch("/api/health");
  const health = await response.json();
  modePill.textContent =
    health.paymentMode === "live" ? "Live nanopayments" : "Demo payments";
}

function renderData(result) {
  if (Array.isArray(result.listings)) {
    dataView.innerHTML = `
      <table>
        <thead><tr><th>Property</th><th>Type</th><th>Area</th><th>Price</th><th>₹ / sq ft</th></tr></thead>
        <tbody>
          ${result.listings.map((item) => `
            <tr>
              <td><strong>${item.project}</strong><br><span>${item.locality}</span></td>
              <td>${item.bedrooms} BR ${item.propertyType}</td>
              <td>${number.format(item.areaSqFt)} sq ft</td>
              <td>${money.format(item.priceInr)}</td>
              <td>${money.format(item.pricePerSqFt)}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
    return;
  }

  const metrics = [
    ["Sample listings", result.listingCount],
    ["Median ₹ / sq ft", money.format(result.medianPricePerSqFt)],
    ["Average price", money.format(result.averagePriceInr)],
    ["Potential opportunities", result.opportunityCount],
  ];
  dataView.innerHTML = `<div class="metric-grid">${metrics
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("")}</div>`;
}

function render(payload) {
  title.textContent = payload.decision.label;
  insights.innerHTML = payload.insights
    .map((item) => `<div class="insight">${item}</div>`)
    .join("");
  steps.innerHTML = payload.steps
    .map(
      (step) =>
        `<div class="step"><span class="step-dot"></span><span>${step.label}</span></div>`,
    )
    .join("");
  receiptAmount.textContent = `${payload.payment.amount} ${payload.payment.currency}`;
  receiptMode.textContent =
    payload.payment.mode === "live" ? "Gateway verified" : "Simulation";
  renderData(payload.result);
  layout.hidden = false;
  layout.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function runAgent(query) {
  runButton.disabled = true;
  runButton.querySelector("span").textContent = "Agent working…";
  try {
    const response = await fetch("/api/agent/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Agent request failed.");
    render(payload);
  } catch (error) {
    alert(error.message);
  } finally {
    runButton.disabled = false;
    runButton.querySelector("span").textContent = "Run agent";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runAgent(queryInput.value.trim());
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    queryInput.value = button.dataset.query;
    queryInput.focus();
  });
});

loadHealth();
