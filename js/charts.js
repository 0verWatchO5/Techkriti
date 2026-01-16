/**
 * ========================================
 * BizPulse - Charts Management Utility
 * Handles Chart.js initialization and updates
 * ======================================== */

class ChartManager {
  constructor() {
    this.charts = {};
  }

  /**
   * Create a line chart
   */
  createLineChart(canvasId, label, data, labels, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        }
      }
    };

    const chartOptions = { ...defaultOptions, ...options };

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }
        ]
      },
      options: chartOptions
    });

    return this.charts[canvasId];
  }

  /**
   * Create a pie chart
   */
  createPieChart(canvasId, labels, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const colors = [
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--warning').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--success').trim(),
      '#8b5cf6',
      '#06b6d4',
      '#f97316'
    ];

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    const chartOptions = { ...defaultOptions, ...options };

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim(),
            borderWidth: 3
          }
        ]
      },
      options: chartOptions
    });

    return this.charts[canvasId];
  }

  /**
   * Create a bar chart
   */
  createBarChart(canvasId, label, data, labels, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
          },
          grid: {
            display: false
          }
        }
      }
    };

    const chartOptions = { ...defaultOptions, ...options };

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
            borderWidth: 1,
            borderRadius: 5
          }
        ]
      },
      options: chartOptions
    });

    return this.charts[canvasId];
  }

  /**
   * Create a multi-line chart
   */
  createMultiLineChart(canvasId, datasets, labels, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    const colors = [
      '#2563eb',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4'
    ];

    const chartDatasets = datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }));

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        }
      }
    };

    const chartOptions = { ...defaultOptions, ...options };

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: chartDatasets
      },
      options: chartOptions
    });

    return this.charts[canvasId];
  }

  /**
   * Update chart data
   */
  updateChart(canvasId, data, labels = null) {
    const chart = this.charts[canvasId];
    if (!chart) return null;

    if (chart.data.datasets[0]) {
      chart.data.datasets[0].data = data;
    }

    if (labels) {
      chart.data.labels = labels;
    }

    chart.update();
    return chart;
  }

  /**
   * Destroy a chart
   */
  destroyChart(canvasId) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
      delete this.charts[canvasId];
      return true;
    }
    return false;
  }

  /**
   * Destroy all charts
   */
  destroyAll() {
    Object.keys(this.charts).forEach(canvasId => {
      this.destroyChart(canvasId);
    });
  }

  /**
   * Format currency for display
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format percentage
   */
  formatPercentage(value) {
    return `${value.toFixed(2)}%`;
  }
}

// Create global chart manager instance
const chartManager = new ChartManager();
