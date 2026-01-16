/**
 * ========================================
 * BizPulse - Dashboard Page
 * Main dashboard initialization and updates
 * ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
});

/**
 * Initialize dashboard
 */
function initDashboard() {
  // Set up UI
  setupUI();
  
  // Load and display data
  updateKPICards();
  updateCharts();
  updateRecentActivity();
  updateLowStockAlert();
}

/**
 * Setup UI elements
 */
function setupUI() {
  // Display current date
  const dateDisplay = document.getElementById('dateDisplay');
  if (dateDisplay) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // Setup theme toggle
  setupThemeToggle();

  // Setup sidebar toggle for mobile
  setupSidebarToggle();
}

/**
 * Update KPI Cards with data
 */
function updateKPICards() {
  const totalRevenue = storage.calculateTotalSales();
  const totalExpenses = storage.calculateTotalExpenses();
  const netProfit = storage.calculateNetProfit();
  const inventoryValue = storage.calculateInventoryValue();
  const profitMargin = storage.calculateProfitMargin();

  // Update revenue card
  document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);

  // Update expenses card
  document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);

  // Update inventory card
  document.getElementById('inventoryValue').textContent = formatCurrency(inventoryValue);
  const lowStockItems = storage.getLowStockItems();
  document.getElementById('lowStockCount').textContent = lowStockItems.length;

  // Update profit card
  document.getElementById('netProfit').textContent = formatCurrency(netProfit);
  document.getElementById('profitMargin').textContent = formatPercentage(profitMargin);

  // Update stats grid
  updateStatsGrid();
}

/**
 * Update stats grid
 */
function updateStatsGrid() {
  const statsGrid = document.getElementById('statsGrid');
  const sales = storage.getSales();
  const inventory = storage.getInventory();
  const expenses = storage.getExpenses();

  const stats = [
    {
      label: 'Total Sales',
      value: sales.length
    },
    {
      label: 'Total Products',
      value: inventory.length
    },
    {
      label: 'Total Expenses',
      value: expenses.length
    },
    {
      label: 'Avg Order Value',
      value: sales.length > 0 ? formatCurrency(storage.calculateTotalSales() / sales.length) : '₹0'
    }
  ];

  statsGrid.innerHTML = stats.map(stat => `
    <div class="stat-item">
      <div class="stat-value">${typeof stat.value === 'string' ? stat.value : stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `).join('');
}

/**
 * Update all charts
 */
function updateCharts() {
  updateProfitChart();
  updateExpenseChart();
  updateProductsChart();
}

/**
 * Update profit trend chart
 */
function updateProfitChart() {
  const monthlySales = storage.getMonthlySalesData();
  const monthlyExpenses = storage.getExpensesByCategories();
  
  // Get last 6 months of data
  const months = [];
  const profitData = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push(date.toLocaleString('en-US', { month: 'short' }));
    
    const revenue = monthlySales[monthKey] || 0;
    const expenses = Object.values(monthlyExpenses).reduce((sum, val) => sum + val, 0) / 6; // Average
    profitData.push(revenue - expenses);
  }

  chartManager.createLineChart(
    'profitChart',
    'Monthly Profit',
    profitData,
    months
  );
}

/**
 * Update expense breakdown chart
 */
function updateExpenseChart() {
  const expensesByCategory = storage.getExpensesByCategories();
  const labels = Object.keys(expensesByCategory);
  const data = Object.values(expensesByCategory);

  if (labels.length === 0) {
    // Show placeholder if no data
    const ctx = document.getElementById('expenseChart');
    ctx.style.opacity = '0.5';
    return;
  }

  chartManager.createPieChart(
    'expenseChart',
    labels,
    data
  );
}

/**
 * Update top products chart
 */
function updateProductsChart() {
  const topProducts = storage.getTopProducts(5);
  
  if (topProducts.length === 0) {
    const ctx = document.getElementById('productsChart');
    ctx.style.opacity = '0.5';
    return;
  }

  const labels = topProducts.map(p => p.name.substring(0, 15));
  const data = topProducts.map(p => p.amount);

  chartManager.createBarChart(
    'productsChart',
    'Sales Amount',
    data,
    labels
  );
}

/**
 * Update recent activity tables
 */
function updateRecentActivity() {
  // Recent Expenses
  const expenses = storage.getExpenses().slice(-5).reverse();
  const expensesTable = document.getElementById('recentExpensesTable');
  
  expensesTable.innerHTML = expenses.map(expense => `
    <tr>
      <td><strong>${expense.category}</strong></td>
      <td>${formatCurrency(expense.amount)}</td>
      <td>
        <span class="badge ${expense.status === 'paid' ? 'badge-success' : 'badge-warning'}">
          ${expense.status}
        </span>
      </td>
    </tr>
  `).join('');

  // Recent Sales
  const sales = storage.getSales().slice(-5).reverse();
  const salesTable = document.getElementById('recentSalesTable');
  
  salesTable.innerHTML = sales.map(sale => `
    <tr>
      <td><strong>${sale.productName.substring(0, 20)}</strong></td>
      <td>${formatCurrency(sale.totalAmount)}</td>
      <td>
        <span class="badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}">
          ${sale.status}
        </span>
      </td>
    </tr>
  `).join('');
}

/**
 * Update low stock alert
 */
function updateLowStockAlert() {
  const lowStockItems = storage.getLowStockItems();
  const alertDiv = document.getElementById('lowStockAlert');
  
  if (lowStockItems.length > 0) {
    alertDiv.style.display = 'block';
  } else {
    alertDiv.style.display = 'none';
  }
}

/**
 * Format currency
 */
function formatCurrency(value) {
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
function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

/**
 * Setup theme toggle
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const isDarkMode = localStorage.getItem('bizpulse_darkMode') === 'true';
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.classList.add('active');
  }

  themeToggle.addEventListener('click', function() {
    const isActive = document.body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('active');
    localStorage.setItem('bizpulse_darkMode', isActive);
  });
}

/**
 * Setup sidebar toggle for mobile
 */
function setupSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.container');

  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    container.classList.toggle('collapsed-view');
  });
}
