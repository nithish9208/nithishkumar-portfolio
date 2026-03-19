document.addEventListener('DOMContentLoaded', () => {
    initMarketDashboard();
    initCurrencyDashboard();
    initRiskDashboard();
    initSalesDashboard();
});

// --- 1. Market Performance Dashboard (CoinCap API) ---
async function initMarketDashboard() {
    const priceEl = document.getElementById('btc-price');
    const volumeEl = document.getElementById('btc-volume');
    const insightEl = document.getElementById('market-insight');
    const canvas = document.getElementById('marketChart');
    const ctx = canvas.getContext('2d');

    try {
        // Fetch Current Data
        const responseList = await fetch('https://api.coincap.io/v2/assets/bitcoin');
        const dataList = await responseList.json();
        const asset = dataList.data;

        priceEl.innerText = `$${parseFloat(asset.priceUsd).toFixed(2)}`;
        volumeEl.innerText = `$${(parseFloat(asset.volumeUsd24Hr) / 1000000000).toFixed(2)}B`;

        // Fetch History for Trend Line
        const historyResp = await fetch('https://api.coincap.io/v2/assets/bitcoin/history?interval=d1');
        const historyData = await historyResp.json();
        const prices = historyData.data.slice(-30).map(d => parseFloat(d.priceUsd)); // Last 30 days

        // Business Insight
        const trend = prices[prices.length - 1] > prices[0] ? 'Upward' : 'Downward';
        const change = ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2);
        insightEl.innerHTML = `Bitcoin shows a <strong>${change}% ${trend}</strong> trend over 30 days. Volume indicates ${asset.volumeUsd24Hr > 1000000000 ? 'high' : 'moderate'} liquidity.`;

        // Draw Chart
        drawTrendLine(ctx, prices, trend === 'Upward' ? '#1dd1a1' : '#ff6b6b');

    } catch (error) {
        console.error("Market API Error:", error);
        priceEl.innerText = "API Error";
        insightEl.innerText = "Data unavailable. Showing simulated trend.";
        // Fallback simulation
        drawTrendLine(ctx, [40000, 41000, 39000, 42000, 43000, 45000], '#1dd1a1');
    }
}

function drawTrendLine(ctx, data, color) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const stepX = width / (data.length - 1);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    data.forEach((val, index) => {
        const x = index * stepX;
        // Normalize Y (flip coordinate system)
        const y = height - ((val - min) / range) * (height * 0.8) - (height * 0.1);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

// --- 2. Currency Analysis Dashboard (Frankfurter API) ---
async function initCurrencyDashboard() {
    const usdEl = document.getElementById('usd-inr');
    const eurEl = document.getElementById('eur-inr');
    const insightEl = document.getElementById('currency-insight');
    const canvas = document.getElementById('currencyChart');
    const ctx = canvas.getContext('2d');

    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR,EUR');
        const data = await response.json();

        // Note: API gives 1 USD -> INR. Calculating EUR -> INR requires fetching EUR base or deriving.
        // Let's fetch EUR base as well for accuracy or just use the USD relation.
        // Actually, let's just fetch USD base: 1 USD = X INR, 1 USD = Y EUR. 
        // 1 EUR = X/Y INR.

        const usdToInr = data.rates.INR;
        const usdToEur = data.rates.EUR;
        const eurToInr = usdToInr / usdToEur;

        usdEl.innerText = `₹${usdToInr.toFixed(2)}`;
        eurEl.innerText = `₹${eurToInr.toFixed(2)}`;

        insightEl.innerHTML = `USD/INR is <strong>${usdToInr.toFixed(2)}</strong>. Stronger USD impacts import costs.`;

        // Draw Comparative Bar Chart
        drawBarChart(ctx, [usdToInr, eurToInr], ['USD', 'EUR']);

    } catch (e) {
        usdEl.innerText = "--";
        insightEl.innerText = "Currency Service Unavailable";
    }
}

function drawBarChart(ctx, values, labels) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...values) * 1.2;
    const barWidth = width / values.length / 2;

    values.forEach((val, i) => {
        const h = (val / max) * height;
        const x = (i * (width / values.length)) + (width / values.length - barWidth) / 2;
        const y = height - h;

        ctx.fillStyle = '#0a192f';
        ctx.fillRect(x, y, barWidth, h);

        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.fillText(labels[i], x + 10, height - 5);
        ctx.fillText(val.toFixed(2), x + 5, y - 5);
    });
}

// --- 3. Delivery Risk Monitor (Open-Meteo) ---
async function initRiskDashboard() {
    const speedEl = document.getElementById('wind-speed');
    const tempEl = document.getElementById('temp');
    const riskText = document.getElementById('risk-text');
    const riskFill = document.getElementById('risk-fill');
    const insightEl = document.getElementById('weather-insight');

    try {
        // Chennai Coordinates
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current_weather=true');
        const data = await res.json();
        const weather = data.current_weather;

        speedEl.innerText = `${weather.windspeed} km/h`;
        tempEl.innerText = `${weather.temperature} °C`;

        // Risk Logic
        let risk = 0; // 0-100
        let level = "Low";
        let color = "var(--risk-low)";

        if (weather.windspeed > 25) { risk += 50; }
        else if (weather.windspeed > 15) { risk += 20; }

        if (weather.weathercode > 50) { risk += 40; } // Rain codes

        if (risk > 60) {
            level = "High";
            color = "var(--risk-high)";
            insightEl.innerHTML = "High wind/rain detected. <strong>Delay non-essential deliveries.</strong>";
        } else if (risk > 30) {
            level = "Medium";
            color = "var(--risk-med)";
            insightEl.innerHTML = "Moderate conditions. <strong>Monitor route efficiency.</strong>";
        } else {
            level = "Low";
            color = "var(--risk-low)";
            insightEl.innerHTML = "Optimal conditions. <strong>Standard operations.</strong>";
        }

        riskText.innerText = level;
        riskText.style.color = color;
        riskFill.style.width = (risk || 5) + "%"; // Min 5% for visuals
        riskFill.style.backgroundColor = color;

    } catch (e) {
        speedEl.innerText = "N/A";
        insightEl.innerText = "Sensors offline.";
    }
}

// --- 4. Sales Data Analysis (Local Mock with Logic) ---
const salesData = [
    { product: "Laptop X1", region: "Chennai", revenue: 85000, cost: 70000 },
    { product: "Mouse W2", region: "Bangalore", revenue: 450, cost: 600 }, /* Loss Maker */
    { product: "Monitor A1", region: "Chennai", revenue: 15000, cost: 11000 },
    { product: "Keyboard K1", region: "Hyderabad", revenue: 1200, cost: 800 },
    { product: "Server Rack", region: "Delhi", revenue: 250000, cost: 210000 },
    { product: "Cable Pack", region: "Mumbai", revenue: 300, cost: 250 },
    { product: "Headset H5", region: "Chennai", revenue: 2500, cost: 2600 } /* Loss Maker */
];

function initSalesDashboard() {
    renderSalesTable(salesData);
}

function renderSalesTable(data) {
    const tbody = document.getElementById('sales-body');
    tbody.innerHTML = '';

    data.forEach(item => {
        const margin = ((item.revenue - item.cost) / item.revenue) * 100;
        const status = margin > 0 ? "Profit" : "Loss";
        const color = margin > 0 ? "green" : "red";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.region}</td>
            <td>₹${item.revenue.toLocaleString()}</td>
            <td>₹${item.cost.toLocaleString()}</td>
            <td style="color:${color}">${margin.toFixed(1)}%</td>
            <td style="font-weight:bold; color:${color}">${status}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterSales(type) {
    let filtered = salesData;
    if (type === 'loss') {
        filtered = salesData.filter(d => d.revenue < d.cost);
    } else if (type === 'high-margin') {
        filtered = salesData.filter(d => ((d.revenue - d.cost) / d.revenue) > 0.20);
    }
    renderSalesTable(filtered);
}
