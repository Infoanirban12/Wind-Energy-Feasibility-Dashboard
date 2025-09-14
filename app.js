// Application data
const windData = {
  historical_data: [
    {"date": "2023-01-01", "wind_speed": 6.5, "power_output": 285, "capacity_factor": 0.14},
    {"date": "2023-06-15", "wind_speed": 7.8, "power_output": 458, "capacity_factor": 0.23},
    {"date": "2024-01-01", "wind_speed": 8.2, "power_output": 521, "capacity_factor": 0.26},
    {"date": "2024-06-15", "wind_speed": 7.1, "power_output": 367, "capacity_factor": 0.18},
    {"date": "2024-12-31", "wind_speed": 6.9, "power_output": 341, "capacity_factor": 0.17}
  ],
  forecast_data: [
    {"date": "2025-01-01", "wind_speed": 7.2, "power_output": 378, "capacity_factor": 0.19},
    {"date": "2025-01-15", "wind_speed": 8.1, "power_output": 507, "capacity_factor": 0.25},
    {"date": "2025-01-30", "wind_speed": 7.8, "power_output": 458, "capacity_factor": 0.23}
  ],
  sites: [
    {
      "name": "Site A - Coastal Plains",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "elevation": 71,
      "avg_wind_speed": 8.2,
      "capacity_factor": 0.28,
      "estimated_annual_energy": 4920,
      "site_suitability": "Excellent",
      "distance_to_grid": 5.2,
      "environmental_constraints": "Low",
      "development_cost": 2.1,
      "annual_revenue": 590400,
      "payback_period": 3.6
    },
    {
      "name": "Site B - Hills",
      "latitude": 36.7783,
      "longitude": -119.4179,
      "elevation": 450,
      "avg_wind_speed": 7.1,
      "capacity_factor": 0.22,
      "estimated_annual_energy": 3856,
      "site_suitability": "Good",
      "distance_to_grid": 12.8,
      "environmental_constraints": "Medium",
      "development_cost": 2.8,
      "annual_revenue": 462720,
      "payback_period": 6.0
    },
    {
      "name": "Site C - Mountain Ridge",
      "latitude": 39.7392,
      "longitude": -104.9903,
      "elevation": 1609,
      "avg_wind_speed": 9.5,
      "capacity_factor": 0.35,
      "estimated_annual_energy": 6132,
      "site_suitability": "Excellent",
      "distance_to_grid": 18.5,
      "environmental_constraints": "High",
      "development_cost": 3.4,
      "annual_revenue": 735840,
      "payback_period": 4.6
    },
    {
      "name": "Site D - Prairie",
      "latitude": 41.8781,
      "longitude": -87.6298,
      "elevation": 182,
      "avg_wind_speed": 6.8,
      "capacity_factor": 0.19,
      "estimated_annual_energy": 3328,
      "site_suitability": "Fair",
      "distance_to_grid": 8.1,
      "environmental_constraints": "Low",
      "development_cost": 2.3,
      "annual_revenue": 399360,
      "payback_period": 5.8
    }
  ],
  model_performance: {
    "wind_speed_r2": 0.160,
    "wind_speed_rmse": 1.42,
    "power_output_r2": 0.079,
    "power_output_rmse": 352.8
  }
};

// Chart colors based on design system
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances to prevent memory leaks
let chartInstances = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Wind Energy Dashboard...');
    initializeTabs();
    updateCurrentTime();
    initializeOverviewTab();
    initializeSiteAnalysisTab();
    updateLastUpdated();
    
    // Set up periodic updates
    setInterval(updateCurrentTime, 1000);
    setInterval(updateCurrentWindSpeed, 30000);
});

// Tab functionality - Fixed version
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    console.log('Found tab buttons:', tabButtons.length);
    console.log('Found tab contents:', tabContents.length);

    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = this.getAttribute('data-tab');
            console.log('Tab clicked:', targetTab);
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Find and activate the corresponding content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Activated content for:', targetTab);
                
                // Initialize charts for the specific tab after a delay
                setTimeout(() => {
                    initializeTabSpecificContent(targetTab);
                }, 150);
            } else {
                console.error('Content not found for tab:', targetTab);
            }
        });
    });
}

// Initialize content for specific tabs
function initializeTabSpecificContent(tabName) {
    console.log('Initializing content for tab:', tabName);
    
    switch(tabName) {
        case 'overview':
            // Already initialized on page load
            break;
        case 'site-analysis':
            initializeSiteRankingChart();
            break;
        case 'forecasting':
            initializeWindForecastChart();
            initializePowerForecastChart();
            break;
        case 'economic-analysis':
            initializeDevelopmentCostsChart();
            initializeROIAnalysisChart();
            initializeRevenueProjectionsChart();
            setupEconomicControls();
            break;
    }
}

// Time updates
function updateCurrentTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
    };
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function updateLastUpdated() {
    const now = new Date();
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function updateCurrentWindSpeed() {
    const currentSpeed = 7.2 + (Math.random() - 0.5) * 2;
    const speedElement = document.getElementById('currentWindSpeed');
    if (speedElement) {
        speedElement.textContent = currentSpeed.toFixed(1);
    }
}

// Chart helper function to destroy existing chart
function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        delete chartInstances[chartId];
    }
}

// Overview Tab Initialization
function initializeOverviewTab() {
    initializePowerCurveChart();
    initializeMonthlyTrendsChart();
    setupOverviewExportButtons();
}

function setupOverviewExportButtons() {
    // Add event listeners to overview export buttons
    const exportButtons = document.querySelectorAll('#overview .btn--outline');
    exportButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (index === 0) {
                // Export power curve data
                exportChartData('Power Curve Data', windData.historical_data);
            } else if (index === 1) {
                // Export monthly trends data
                exportChartData('Monthly Trends Data', generateMonthlyData());
            }
            
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = 'Exported!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    });
}

function exportChartData(filename, data) {
    const csvContent = "data:text/csv;charset=utf-8," + JSON.stringify(data, null, 2);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename.replace(/\s+/g, '_').toLowerCase() + ".json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const windSpeeds = [6.8, 7.2, 7.8, 8.1, 8.5, 9.2, 9.8, 9.5, 8.9, 8.2, 7.5, 6.9];
    return months.map((month, index) => ({
        month: month,
        wind_speed: windSpeeds[index],
        capacity_factor: Math.min(0.45, Math.max(0.1, (windSpeeds[index] - 3) * 0.08))
    }));
}

function initializePowerCurveChart() {
    const canvas = document.getElementById('powerCurveChart');
    if (!canvas) return;
    
    destroyChart('powerCurveChart');
    const ctx = canvas.getContext('2d');
    
    const powerCurveData = [];
    for (let speed = 0; speed <= 25; speed += 0.5) {
        let power = 0;
        if (speed >= 3 && speed <= 25) {
            if (speed <= 12) {
                power = Math.pow(speed - 3, 3) * 5;
            } else if (speed <= 20) {
                power = 2000;
            } else {
                power = Math.max(0, 2000 - (speed - 20) * 400);
            }
        }
        powerCurveData.push({ x: speed, y: Math.max(0, power) });
    }
    
    chartInstances['powerCurveChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Theoretical Power Curve',
                data: powerCurveData,
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                fill: true,
                tension: 0.4
            }, {
                label: 'Historical Data Points',
                data: windData.historical_data.map(d => ({
                    x: d.wind_speed,
                    y: d.power_output
                })),
                borderColor: chartColors[2],
                backgroundColor: chartColors[2],
                type: 'scatter',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Wind Turbine Power Curve'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'
                    },
                    min: 0,
                    max: 25
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power Output (kW)'
                    },
                    min: 0
                }
            }
        }
    });
}

function initializeMonthlyTrendsChart() {
    const canvas = document.getElementById('monthlyTrendsChart');
    if (!canvas) return;
    
    destroyChart('monthlyTrendsChart');
    const ctx = canvas.getContext('2d');
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const windSpeeds = [6.8, 7.2, 7.8, 8.1, 8.5, 9.2, 9.8, 9.5, 8.9, 8.2, 7.5, 6.9];
    const capacityFactors = windSpeeds.map(speed => Math.min(0.45, Math.max(0.1, (speed - 3) * 0.08)));
    
    chartInstances['monthlyTrendsChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Average Wind Speed (m/s)',
                data: windSpeeds,
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                yAxisID: 'y'
            }, {
                label: 'Capacity Factor',
                data: capacityFactors,
                borderColor: chartColors[1],
                backgroundColor: chartColors[1] + '20',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Performance Trends (2024)'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Capacity Factor'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    max: 0.5
                }
            }
        }
    });
}

// Site Analysis Tab Initialization
function initializeSiteAnalysisTab() {
    populateSiteTable();
    initializeSiteMap();
    setupSiteControls();
}

function populateSiteTable() {
    const tbody = document.getElementById('siteTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    windData.sites.forEach(site => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${site.name}</strong></td>
            <td><span class="suitability-${site.site_suitability.toLowerCase()}">${site.site_suitability}</span></td>
            <td>${site.avg_wind_speed.toFixed(1)}</td>
            <td>${(site.capacity_factor * 100).toFixed(1)}</td>
            <td>${site.estimated_annual_energy.toLocaleString()}</td>
            <td>${site.distance_to_grid.toFixed(1)}</td>
            <td><span class="environmental-${site.environmental_constraints.toLowerCase()}">${site.environmental_constraints}</span></td>
            <td>$${site.annual_revenue.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

function initializeSiteRankingChart() {
    const canvas = document.getElementById('siteRankingChart');
    if (!canvas) {
        console.warn('Site ranking chart canvas not found');
        return;
    }
    
    destroyChart('siteRankingChart');
    const ctx = canvas.getContext('2d');
    
    const sites = windData.sites.map(site => ({
        name: site.name.split(' - ')[1] || site.name,
        capacity: site.capacity_factor * 100,
        revenue: site.annual_revenue / 1000
    }));
    
    chartInstances['siteRankingChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sites.map(s => s.name),
            datasets: [{
                label: 'Capacity Factor (%)',
                data: sites.map(s => s.capacity),
                backgroundColor: chartColors.slice(0, sites.length),
                yAxisID: 'y'
            }, {
                label: 'Annual Revenue ($000)',
                data: sites.map(s => s.revenue),
                type: 'line',
                borderColor: chartColors[2],
                backgroundColor: chartColors[2] + '40',
                yAxisID: 'y1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Site Performance Comparison'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Capacity Factor (%)'
                    },
                    max: 40
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Annual Revenue ($000)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

function initializeSiteMap() {
    const mapContainer = document.getElementById('siteMap');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = '';
    
    windData.sites.forEach((site, index) => {
        const marker = document.createElement('div');
        marker.className = `site-marker ${site.site_suitability.toLowerCase()}`;
        marker.title = `${site.name} - ${site.site_suitability}`;
        
        const x = ((site.longitude + 125) / 55) * 100;
        const y = ((45 - site.latitude) / 15) * 100;
        
        marker.style.left = Math.max(5, Math.min(95, x)) + '%';
        marker.style.top = Math.max(5, Math.min(95, y)) + '%';
        
        marker.addEventListener('click', () => {
            alert(`${site.name}\nCapacity Factor: ${(site.capacity_factor * 100).toFixed(1)}%\nAnnual Energy: ${site.estimated_annual_energy.toLocaleString()} MWh`);
        });
        
        mapContainer.appendChild(marker);
    });
}

function setupSiteControls() {
    const sortSelect = document.getElementById('sortSites');
    const exportBtn = document.getElementById('exportSiteData');
    
    if (sortSelect) {
        // Clear existing options and add proper ones
        sortSelect.innerHTML = `
            <option value="name">Sort by Name</option>
            <option value="suitability">Sort by Suitability</option>
            <option value="capacity">Sort by Capacity Factor</option>
            <option value="revenue">Sort by Revenue</option>
        `;
        
        sortSelect.addEventListener('change', function(e) {
            e.stopPropagation();
            sortSiteTable(e.target.value);
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            exportSiteData();
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Exported!';
            this.style.backgroundColor = '#10B981';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    }
}

function sortSiteTable(sortBy) {
    let sortedSites = [...windData.sites];
    
    switch(sortBy) {
        case 'suitability':
            const suitabilityOrder = { 'Excellent': 3, 'Good': 2, 'Fair': 1 };
            sortedSites.sort((a, b) => suitabilityOrder[b.site_suitability] - suitabilityOrder[a.site_suitability]);
            break;
        case 'capacity':
            sortedSites.sort((a, b) => b.capacity_factor - a.capacity_factor);
            break;
        case 'revenue':
            sortedSites.sort((a, b) => b.annual_revenue - a.annual_revenue);
            break;
        default:
            sortedSites.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    const tbody = document.getElementById('siteTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    sortedSites.forEach(site => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${site.name}</strong></td>
            <td><span class="suitability-${site.site_suitability.toLowerCase()}">${site.site_suitability}</span></td>
            <td>${site.avg_wind_speed.toFixed(1)}</td>
            <td>${(site.capacity_factor * 100).toFixed(1)}</td>
            <td>${site.estimated_annual_energy.toLocaleString()}</td>
            <td>${site.distance_to_grid.toFixed(1)}</td>
            <td><span class="environmental-${site.environmental_constraints.toLowerCase()}">${site.environmental_constraints}</span></td>
            <td>$${site.annual_revenue.toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Forecasting Tab Functions
function initializeWindForecastChart() {
    const canvas = document.getElementById('windForecastChart');
    if (!canvas) {
        console.warn('Wind forecast chart canvas not found');
        return;
    }
    
    destroyChart('windForecastChart');
    const ctx = canvas.getContext('2d');
    
    const historicalLabels = windData.historical_data.slice(-3).map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const forecastLabels = windData.forecast_data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    chartInstances['windForecastChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...historicalLabels, ...forecastLabels],
            datasets: [{
                label: 'Historical Wind Speed',
                data: [...windData.historical_data.slice(-3).map(d => d.wind_speed), null, null, null],
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                fill: false,
                tension: 0.4
            }, {
                label: 'Forecasted Wind Speed',
                data: [null, null, ...windData.forecast_data.map(d => d.wind_speed)],
                borderColor: chartColors[1],
                backgroundColor: chartColors[1] + '20',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Wind Speed Forecast vs Historical Data'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'
                    },
                    min: 0
                }
            }
        }
    });
}

function initializePowerForecastChart() {
    const canvas = document.getElementById('powerForecastChart');
    if (!canvas) {
        console.warn('Power forecast chart canvas not found');
        return;
    }
    
    destroyChart('powerForecastChart');
    const ctx = canvas.getContext('2d');
    
    const forecastLabels = windData.forecast_data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    chartInstances['powerForecastChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: forecastLabels,
            datasets: [{
                label: 'Predicted Power Output (kW)',
                data: windData.forecast_data.map(d => d.power_output),
                backgroundColor: chartColors.slice(0, 3),
                borderColor: chartColors.slice(0, 3),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Power Output Predictions'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Power Output (kW)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Economic Analysis Tab Functions
function initializeDevelopmentCostsChart() {
    const canvas = document.getElementById('developmentCostsChart');
    if (!canvas) {
        console.warn('Development costs chart canvas not found');
        return;
    }
    
    destroyChart('developmentCostsChart');
    const ctx = canvas.getContext('2d');
    
    chartInstances['developmentCostsChart'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: windData.sites.map(site => site.name.split(' - ')[1] || site.name),
            datasets: [{
                data: windData.sites.map(site => site.development_cost),
                backgroundColor: chartColors.slice(0, windData.sites.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Development Costs by Site (Million $)'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initializeROIAnalysisChart() {
    const canvas = document.getElementById('roiAnalysisChart');
    if (!canvas) {
        console.warn('ROI analysis chart canvas not found');
        return;
    }
    
    destroyChart('roiAnalysisChart');
    const ctx = canvas.getContext('2d');
    
    const roiData = windData.sites.map(site => ({
        name: site.name.split(' - ')[1] || site.name,
        roi: ((site.annual_revenue / 1000000) / site.development_cost) * 100,
        payback: site.payback_period
    }));
    
    chartInstances['roiAnalysisChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: roiData.map(d => d.name),
            datasets: [{
                label: 'ROI (%)',
                data: roiData.map(d => d.roi),
                backgroundColor: chartColors[0],
                yAxisID: 'y'
            }, {
                label: 'Payback Period (Years)',
                data: roiData.map(d => d.payback),
                type: 'line',
                borderColor: chartColors[2],
                backgroundColor: chartColors[2],
                yAxisID: 'y1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'ROI and Payback Period Analysis'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'ROI (%)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Payback Period (Years)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

function initializeRevenueProjectionsChart() {
    const canvas = document.getElementById('revenueProjectionsChart');
    if (!canvas) {
        console.warn('Revenue projections chart canvas not found');
        return;
    }
    
    destroyChart('revenueProjectionsChart');
    const ctx = canvas.getContext('2d');
    
    const years = Array.from({length: 10}, (_, i) => 2025 + i);
    const siteProjections = windData.sites.map(site => ({
        name: site.name.split(' - ')[1] || site.name,
        projections: years.map(year => {
            const degradation = Math.pow(0.995, year - 2025);
            return site.annual_revenue * degradation / 1000000;
        })
    }));
    
    chartInstances['revenueProjectionsChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: siteProjections.map((site, index) => ({
                label: site.name,
                data: site.projections,
                borderColor: chartColors[index],
                backgroundColor: chartColors[index] + '20',
                fill: false,
                tension: 0.4
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '10-Year Revenue Projections (Million $)'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Annual Revenue (Million $)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function setupEconomicControls() {
    const generateReportBtn = document.getElementById('generateReport');
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            generateEconomicReport();
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Report Generated!';
            this.style.backgroundColor = '#10B981';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 3000);
        });
    }
}

// Export and Report Functions
function exportSiteData() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Site Name,Suitability,Wind Speed (m/s),Capacity Factor (%),Annual Energy (MWh),Distance to Grid (km),Environmental Constraints,Annual Revenue ($)\n"
        + windData.sites.map(site => 
            `"${site.name}","${site.site_suitability}",${site.avg_wind_speed},${(site.capacity_factor * 100).toFixed(1)},${site.estimated_annual_energy},${site.distance_to_grid},"${site.environmental_constraints}",${site.annual_revenue}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wind_energy_site_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateEconomicReport() {
    const totalInvestment = windData.sites.reduce((sum, site) => sum + site.development_cost, 0);
    const totalRevenue = windData.sites.reduce((sum, site) => sum + site.annual_revenue, 0);
    const bestSite = windData.sites.reduce((best, site) => 
        (site.annual_revenue / site.development_cost) > (best.annual_revenue / best.development_cost) ? site : best
    );
    
    const reportContent = `Wind Energy Feasibility Analysis Report
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
Total Sites Assessed: ${windData.sites.length}
Total Investment Required: $${totalInvestment.toFixed(1)}M
Expected Annual Revenue: $${(totalRevenue / 1000000).toFixed(2)}M
Best ROI Site: ${bestSite.name} (${((bestSite.annual_revenue / 1000000) / bestSite.development_cost * 100).toFixed(1)}%)

SITE DETAILS
============
${windData.sites.map(site => `
${site.name}:
- Suitability: ${site.site_suitability}
- Average Wind Speed: ${site.avg_wind_speed} m/s
- Capacity Factor: ${(site.capacity_factor * 100).toFixed(1)}%
- Annual Energy Production: ${site.estimated_annual_energy.toLocaleString()} MWh
- Development Cost: $${site.development_cost}M
- Annual Revenue: $${site.annual_revenue.toLocaleString()}
- Payback Period: ${site.payback_period} years
- Distance to Grid: ${site.distance_to_grid} km
- Environmental Constraints: ${site.environmental_constraints}
`).join('\n')}

MODEL PERFORMANCE
=================
Wind Speed Prediction R²: ${windData.model_performance.wind_speed_r2}
Wind Speed RMSE: ${windData.model_performance.wind_speed_rmse} m/s
Power Output R²: ${windData.model_performance.power_output_r2}
Power Output RMSE: ${windData.model_performance.power_output_rmse} kW

RECOMMENDATIONS
===============
1. Prioritize ${bestSite.name} for immediate development due to highest ROI
2. Consider environmental mitigation strategies for high-constraint sites
3. Evaluate grid infrastructure improvements for remote sites
4. Monitor forecast accuracy and update models quarterly`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wind_energy_feasibility_report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}