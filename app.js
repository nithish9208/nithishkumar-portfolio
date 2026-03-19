// Base Configuration for Charts
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
Chart.defaults.color = '#64748B';
Chart.defaults.scale.grid.color = 'rgba(226, 232, 240, 0.4)';

// Hero Mockup Chart
const ctxHero = document.getElementById('heroMockupChart').getContext('2d');
if (ctxHero) {
    new Chart(ctxHero, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Accuracy',
                data: [96.5, 97.2, 98.1, 98.5, 99.0, 99.2],
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.05)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#1e40af'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false, min: 95, max: 100 } }
        }
    });
}

// Global Modal State
let activeStream = null;
let modalChartObj = null;

// Simulation Data Configuration
const simulations = {
    sales: {
        type: 'bar',
        indexAxis: 'y',
        title: "Sales Strategy Impact Simulation",
        desc: "Analyzing Actual vs. Target performance across regional benchmarks...",
        steps: ["SQL Query: Sales Variance Output...", "Mapping Regional Deltas...", "Normalizing Performance Index...", "Rendering Executive Dashboard..."],
        kpis: [
            { label: 'Achievement', value: 104, suffix: '%' },
            { label: 'Revenue Pipeline', value: 92, suffix: 'M' },
            { label: 'Growth Delta', value: 15, suffix: '%' }
        ],
        chartData: {
            labels: ['North', 'South', 'East', 'West'],
            datasets: [
                { label: 'Actual', data: [85, 92, 78, 95], color: '#1e40af' },
                { label: 'Target', data: [80, 85, 82, 90], color: '#94a3b8' }
            ]
        }
    },
    attendance: {
        type: 'radar',
        title: "Workforce Efficiency Simulation",
        desc: "Multivariate analysis of department-wise operational performance...",
        steps: ["HRIS Extraction: Completed...", "Calculating Efficiency Ratios...", "Cross-referencing Output Quality...", "Mapping Performance Radials..."],
        kpis: [
            { label: 'Resource Util.', value: 88, suffix: '%' },
            { label: 'Fatigue Index', value: 12, suffix: '%' },
            { label: 'Quality Score', value: 99.1, suffix: '%' }
        ],
        chartData: {
            labels: ['Attendance', 'Quality', 'Punctuality', 'Output', 'Overtime', 'Training'],
            datasets: [
                { label: 'IT Systems', data: [95, 98, 92, 94, 20, 90], color: 'rgba(30, 64, 175, 0.7)' },
                { label: 'Operational', data: [88, 90, 85, 82, 60, 75], color: 'rgba(16, 185, 129, 0.7)' }
            ]
        }
    },
    operational: {
        type: 'doughnut',
        title: "MIS Automation Simulation",
        desc: "Evaluating data pipeline health and manual efforts reduction...",
        steps: ["Script: Python Cleanup Engine...", "Validating 5k+ Records...", "Analyzing Automation Bottlenecks...", "Generating ROI Distribution..."],
        kpis: [
            { label: 'Time Saved', value: 32, suffix: 'h/wk' },
            { label: 'Data Accuracy', value: 99.8, suffix: '%' },
            { label: 'Manual Load', value: 4.2, suffix: '%' }
        ],
        chartData: {
            labels: ['Automated', 'Manual Check', 'Sync Delay', 'Validation'],
            datasets: [
                { data: [75, 15, 6, 4], colors: ['#1e40af', '#3b82f6', '#94a3b8', '#cbd5e1'] }
            ]
        }
    }
};

// Helper: Animated Counter
async function animateCounter(element, target, suffix = "") {
    let current = 0;
    const duration = 1500;
    const intervalTime = 30;
    const stepVal = target / (duration / intervalTime);
    
    return new Promise(resolve => {
        const interval = setInterval(() => {
            current += stepVal;
            if (current >= target) {
                element.innerText = target + suffix;
                clearInterval(interval);
                resolve();
            } else {
                element.innerText = current.toFixed(target % 1 === 0 ? 0 : 1) + suffix;
            }
        }, intervalTime);
    });
}

function closeModal() {
    document.getElementById('simulationModal').style.display = 'none';
    if (activeStream) clearInterval(activeStream);
    if (modalChartObj) modalChartObj.destroy();
}
window.closeModal = closeModal;

async function runSimulation(key) {
    const sim = simulations[key];
    if (!sim) return;

    const modal = document.getElementById('simulationModal');
    const bar = document.getElementById('simProgressBar');
    const stepText = document.getElementById('simStepText');
    const resultArea = document.getElementById('simResult');
    const kpiGrid = document.getElementById('modalKpis');
    
    // Reset Modal
    modal.style.display = 'flex';
    resultArea.style.display = 'none';
    bar.style.width = '0%';
    document.getElementById('simTitle').innerText = sim.title;
    document.getElementById('simDesc').innerText = sim.desc;
    if (activeStream) clearInterval(activeStream);
    if (modalChartObj) modalChartObj.destroy();

    // 1. Logic Processing
    for (let i = 0; i < sim.steps.length; i++) {
        stepText.innerText = `> ${sim.steps[i]}`;
        bar.style.width = ((i + 1) / sim.steps.length * 100) + '%';
        await new Promise(r => setTimeout(r, 600));
    }

    // 2. Data Initialization & Streaming
    stepText.innerText = "> STREAMING REAL-TIME PIPELINE DATA...";
    resultArea.style.display = 'block';
    
    const ctx = document.getElementById('modalChart').getContext('2d');
    
    const chartConfig = {
        type: sim.type,
        data: {
            labels: sim.chartData.labels,
            datasets: sim.chartData.datasets.map(ds => ({
                label: ds.label || '',
                data: ds.data.map(() => Math.random() * 100),
                backgroundColor: ds.colors || (ds.color ? ds.color : '#cbd5e1'),
                borderColor: sim.type === 'radar' ? ds.color : '#fff',
                borderWidth: 1,
                borderRadius: sim.type === 'bar' ? 6 : 0
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: sim.indexAxis || 'x',
            animation: { duration: 0 },
            plugins: { 
                legend: { 
                    display: sim.type !== 'bar', 
                    position: 'bottom',
                    labels: { boxWidth: 12, padding: 15, font: { size: 11 } }
                } 
            }
        }
    };

    if (sim.type === 'radar') {
        chartConfig.options.scales = {
            r: { angleLines: { display: true }, grid: { circular: true }, ticks: { display: false }, suggestMin: 0, suggestMax: 100 }
        };
    }

    modalChartObj = new Chart(ctx, chartConfig);

    // Fluctuation Loop
    const startTime = Date.now();
    await new Promise(resolve => {
        activeStream = setInterval(() => {
            if (Date.now() - startTime > 2000) {
                clearInterval(activeStream);
                resolve();
            } else {
                modalChartObj.data.datasets.forEach(ds => {
                    ds.data = ds.data.map(d => d * (0.8 + Math.random() * 0.4));
                });
                modalChartObj.update('none');
            }
        }, 120);
    });

    // 3. Render Final Insights
    stepText.innerText = "> VALIDATION SUCCESSFUL. PRESENTING FINAL ANALYSIS.";
    
    sim.chartData.datasets.forEach((ds, i) => {
        modalChartObj.data.datasets[i].data = ds.data;
        if (ds.color) {
            modalChartObj.data.datasets[i].backgroundColor = ds.color;
        }
    });
    
    modalChartObj.options.animation = { duration: 1000 };
    modalChartObj.update();

    // KPI Counters
    kpiGrid.innerHTML = sim.kpis.map(k => `
        <div class="kpi-card">
            <div class="m-lbl">${k.label}</div>
            <div class="m-val kpi-counter-val">0</div>
        </div>
    `).join('');

    const targetVals = document.querySelectorAll('.kpi-counter-val');
    const anims = sim.kpis.map((k, i) => animateCounter(targetVals[i], k.value, k.suffix));
    await Promise.all(anims);
}

// Exposure
window.runSimulation = runSimulation;
window.closeModal = closeModal;

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
