// Base Configuration for Charts
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#64748B';
Chart.defaults.scale.grid.color = 'rgba(226, 232, 240, 0.5)';

// Hero Mockup Chart
const ctxHero = document.getElementById('heroMockupChart').getContext('2d');
new Chart(ctxHero, {
    type: 'line',
    data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
        datasets: [{
            label: 'Conversion Rate',
            data: [2.1, 2.8, 2.5, 3.2, 3.8, 4.2],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { display: false },
            y: { display: false, min: 0 }
        }
    }
});

// Tab Switching Logic
function openSim(evt, simId) {
    const tabContents = document.getElementsByClassName('sim-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
        tabContents[i].classList.remove('active');
    }

    const tabBtns = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove('active');
    }

    document.getElementById(simId).style.display = 'block';
    setTimeout(() => {
        document.getElementById(simId).classList.add('active');
    }, 10);
    evt.currentTarget.classList.add('active');
}

// -------------------------------------------------------------
// Simulation 1: Social Media Campaign Performance
// -------------------------------------------------------------
const s1Budget = document.getElementById('s1-budget');
const s1Duration = document.getElementById('s1-duration');
const s1Platform = document.getElementById('s1-platform');

const formatNumber = (num) => num.toLocaleString('en-US');
const formatCurrency = (num) => '$' + num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

const s1ChartCtx = document.getElementById('chartSim1').getContext('2d');
let s1Chart = new Chart(s1ChartCtx, {
    type: 'bar',
    data: {
        labels: ['Impressions (k)', 'Clicks', 'Conversions'],
        datasets: [{
            label: 'Projected Metrics',
            data: [0, 0, 0],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    }
});

function updateSim1() {
    const budget = parseFloat(s1Budget.value);
    const duration = parseFloat(s1Duration.value);
    const platform = s1Platform.value;

    document.getElementById('s1-budget-val').innerText = budget;
    document.getElementById('s1-duration-val').innerText = duration;

    // Platform base metrics
    let cpm, ctr, convRate;
    if (platform === 'instagram') {
        cpm = 8.5; ctr = 0.025; convRate = 0.045;
        document.getElementById('s1-insight').innerText = "Instagram tends to offer lower CPC but highly variable conversion rates depending on visual creative quality. Current budget scaling looks healthy.";
    } else if (platform === 'facebook') {
        cpm = 11.2; ctr = 0.032; convRate = 0.06;
        document.getElementById('s1-insight').innerText = "Facebook provides steady reach with slightly higher costs. It usually yields consistent conversion rates for broad audiences.";
    } else { // linkedin
        cpm = 25.0; ctr = 0.015; convRate = 0.08;
        document.getElementById('s1-insight').innerText = "LinkedIn has premium CPMs but significantly higher B2B conversion quality. Expect lower volume but higher value conversions.";
    }

    // Calculations
    const impressions = (budget / cpm) * 1000;
    const clicks = impressions * ctr;
    const cpc = budget / clicks;
    const conversions = clicks * convRate;
    
    // Assume average customer value is $150
    const aov = 150;
    const revenue = conversions * aov;
    const roi = ((revenue - budget) / budget) * 100;

    // Update DOM
    document.getElementById('s1-imp').innerText = impressions > 1000000 ? (impressions/1000000).toFixed(1) + 'M' : (impressions/1000).toFixed(1) + 'k';
    document.getElementById('s1-clicks').innerText = formatNumber(Math.round(clicks));
    document.getElementById('s1-ctr').innerText = (ctr * 100).toFixed(1) + '%';
    document.getElementById('s1-cpc').innerText = formatCurrency(cpc);
    document.getElementById('s1-conv').innerText = formatNumber(Math.round(conversions));
    document.getElementById('s1-roi').innerText = (roi > 0 ? '+' : '') + Math.round(roi) + '%';
    
    // Update Chart
    s1Chart.data.datasets[0].data = [impressions/1000, clicks, conversions];
    s1Chart.update();
}

s1Budget.addEventListener('input', updateSim1);
s1Duration.addEventListener('input', updateSim1);
s1Platform.addEventListener('change', updateSim1);

// Initialize Sim 1
updateSim1();

// -------------------------------------------------------------
// Simulation 2: Content Engagement
// -------------------------------------------------------------
const s2Type = document.getElementById('s2-type');
const s2ChartCtx = document.getElementById('chartSim2').getContext('2d');

let s2Chart = new Chart(s2ChartCtx, {
    type: 'doughnut',
    data: {
        labels: ['Likes', 'Comments', 'Shares', 'Saves'],
        datasets: [{
            data: [65, 10, 15, 10],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
            borderWidth: 0,
            cutout: '70%'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' }
        }
    }
});

function updateSim2() {
    const type = s2Type.value;
    
    let reach, er, likes, com, dist, insight;

    switch(type) {
        case 'reel':
            reach = '32.5k'; er = '6.2%'; likes = '1,420'; com = '115';
            dist = [70, 5, 20, 5];
            insight = "Reels generate massive algorithmic reach and shareability, leading to high sheer volume of likes and shares, but minimal saves.";
            break;
        case 'image':
            reach = '8.4k'; er = '3.5%'; likes = '412'; com = '28';
            dist = [85, 8, 2, 5];
            insight = "Static images have stable but lower reach. They function well for quick updates but don't drive deep engagement or algorithm pushed discovery.";
            break;
        case 'carousel':
            reach = '15.2k'; er = '7.8%'; likes = '890'; com = '64';
            dist = [55, 15, 10, 20];
            insight = "Carousels dominate in Engagement Rate and Saves. The educational format forces longer dwell time which the algorithm favors heavily.";
            break;
        default: // all
            reach = '14.2k'; er = '4.8%'; likes = '680'; com = '42';
            dist = [65, 10, 15, 10];
            insight = "Across all types, engagement peaks during late afternoon. Carousels drive the highest save rate, while Reels dominate raw reach.";
            break;
    }

    document.getElementById('s2-reach').innerText = reach;
    document.getElementById('s2-er').innerText = er;
    document.getElementById('s2-likes').innerText = likes;
    document.getElementById('s2-com').innerText = com;
    document.getElementById('s2-insight').innerText = insight;

    s2Chart.data.datasets[0].data = dist;
    s2Chart.update();
}

s2Type.addEventListener('change', updateSim2);
updateSim2();

// -------------------------------------------------------------
// Simulation 3: Website Traffic Insights
// -------------------------------------------------------------
const s3Channel = document.getElementById('s3-channel');
const s3ChartCtx = document.getElementById('chartSim3').getContext('2d');

let s3Chart = new Chart(s3ChartCtx, {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Sessions',
            data: [12000, 13500, 11800, 14800],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function updateSim3() {
    const channel = s3Channel.value;
    
    let users, sess, br, cr, insight, chartData;

    switch(channel) {
        case 'organic':
            users = '18,400'; sess = '22,100'; br = '38.2%'; cr = '3.5%';
            insight = "Organic traffic shows high intent with the lowest bounce rate. Content ranking improvements in Week 4 showed a clear session spike.";
            chartData = [4500, 4800, 4600, 8200];
            break;
        case 'paid':
            users = '12,500'; sess = '14,200'; br = '52.1%'; cr = '4.1%';
            insight = "Paid ads drive immediate volume and strong conversion rates, though bounce rates are higher due to colder audience targeting.";
            chartData = [3100, 4500, 3200, 3400];
            break;
        case 'social':
            users = '8,200'; sess = '9,100'; br = '65.4%'; cr = '1.2%';
            insight = "Social traffic is highly volatile and correlates with posting schedule. Conversion is lower, acting mostly as top-of-funnel awareness.";
            chartData = [1200, 2800, 1500, 3600];
            break;
        case 'referral':
            users = '2,100'; sess = '2,500'; br = '41.2%'; cr = '5.8%';
            insight = "Referral traffic volume is low but conversion quality is exceptional. Backlink from industry blog in Week 2 drove sustainable traffic.";
            chartData = [400, 900, 600, 600];
            break;
        case 'direct':
            users = '4,000'; sess = '4,200'; br = '45.0%'; cr = '2.1%';
            insight = "Direct traffic remains steady, reflecting baseline brand awareness and returning visitors bypassing search engines.";
            chartData = [1000, 1050, 1100, 1050];
            break;
        default: // all
            users = '45,200'; sess = '52,100'; br = '42.5%'; cr = '2.8%';
            insight = "Overall traffic trends positive. Combining Paid's conversion strength with Organic's volume retention creates a balanced acquisition portfolio.";
            chartData = [10200, 14050, 11000, 16850];
            break;
    }

    document.getElementById('s3-users').innerText = users;
    document.getElementById('s3-sess').innerText = sess;
    document.getElementById('s3-br').innerText = br;
    document.getElementById('s3-cr').innerText = cr;
    document.getElementById('s3-insight').innerText = insight;

    s3Chart.data.datasets[0].data = chartData;
    s3Chart.update();
}

s3Channel.addEventListener('change', updateSim3);
updateSim3();

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
