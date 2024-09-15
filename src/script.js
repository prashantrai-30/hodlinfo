let timer = 60;
function updateTimer() {
  document.getElementById("timer").innerText = timer;
  timer = timer > 0 ? timer - 1 : 60;
}
setInterval(updateTimer, 1000);

async function fetchTickers() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/tickers/gettickers");
    const tickers = await response.json();
    const tableBody = document.getElementById("ticker-body");
    tableBody.innerHTML = "";

    var cryptoSelect = document.getElementById("crypto");
    var currencySelect = document.getElementById("currency");

    function getSelectedCrypto() {
      return cryptoSelect.value;
    }

    function getSelectedCurrency() {
      return currencySelect.value;
    }

    function getbestpricesearch() {
      return `${getSelectedCrypto()}/${getSelectedCurrency()}`;
    }

    cryptoSelect.addEventListener("change", fetchTickers);
    currencySelect.addEventListener("change", fetchTickers);

    document.getElementById("buyButton").textContent = `Buy ${getSelectedCrypto()}`;


    let bestPrice = 0;
    let relevantTickersCount = 0;
    const bestpricesearch = getbestpricesearch();

    tickers.forEach((ticker, index) => {
      if (ticker.name === bestpricesearch) {
        bestPrice += parseFloat(ticker.last);
        relevantTickersCount++;
        console.log(
          `Updated bestPrice for ${bestpricesearch}: ${bestPrice}`
        );
      }

      const difference = (
        ((ticker.buy - ticker.last) / ticker.last) *
        100
      ).toFixed(2);
      const savings = (ticker.buy - ticker.last).toFixed(2);
      const arrow = savings > 0 ? "&#9650;" : "&#9660;";

      const row = `
  <tr>
    <td>${index + 1}</td>
    <td class="platform-name">${ticker.name}</td>
    <td>₹ ${parseFloat(ticker.last).toLocaleString("en-IN")}</td>
    <td>₹ ${parseFloat(ticker.buy).toLocaleString(
      "en-IN"
    )} / ₹ ${parseFloat(ticker.sell).toLocaleString("en-IN")}</td>
    <td style="color: ${
      difference > 0 ? "#3dc6c1" : "#f44336"
    }">${difference}%</td>
    <td style="color: ${savings > 0 ? "#3dc6c1" : "#f44336"}">
      ${arrow} ₹ ${Math.abs(savings).toLocaleString("en-IN")}
    </td>
  </tr>
`;
      tableBody.innerHTML += row;
    });

    const averageBestPrice =
      relevantTickersCount > 0 ? bestPrice / relevantTickersCount : 0;
    document.getElementById("best-price").innerText = averageBestPrice
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    document.querySelector(
      ".best-price-value"
    ).innerHTML = `₹<span id="best-price">${
      document.getElementById("best-price").innerText
    }</span>`;
    document.querySelector(
      ".best-price div:last-child"
    ).textContent = `Average ${getSelectedCrypto()}/${getSelectedCurrency()} net price including commission`;
  } catch (error) {
    console.error("Error fetching tickers:", error);
  }
}

fetchTickers();

setInterval(fetchTickers, 60 * 1000);