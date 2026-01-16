/**
 * ========================================
 * BizPulse - Analytics Page
 * Profit and analytics functionality
 * ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initAnalyticsPage();
});

/**
 * Initialize analytics page
 */
function initAnalyticsPage() {
  setupUI();
  updateFinancials();
  updateCharts();
  updateBreakdowns();
}

/**
 * Setup UI elements
 */
function setupUI() {
  setupThemeToggle();
  setupSidebarToggle();
}

/**
 * Update financial metrics
 */
function updateFinancials() {
  const totalRevenue = storage.calculateTotalSales();
  const totalExpenses = storage.calculateTotalExpenses();
  const netProfit = storage.calculateNetProfit();
  const profitMargin = storage.calculateProfitMargin();

  // Update KPI Cards
  document.getElementById('netProfit').textContent = formatCurrency(netProfit);
  document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('profitMargin').textContent = `${profitMargin.toFixed(1)}%`;

  // Update profit change indicator
  const profitChange = document.getElementById('profitChange');
  if (netProfit > 0) {
    profitChange.innerHTML = '<span style="color: #10b981; font-weight: 600;">↑ Healthy Business</span>';
  } else if (netProfit === 0) {
    profitChange.innerHTML = '<span style="color: #f59e0b; font-weight: 600;">→ Break Even</span>';
  } else {
    profitChange.innerHTML = '<span style="color: #ef4444; font-weight: 600;">↓ Loss Detected</span>';
  }

  // Update margin change indicator
  const marginChange = document.getElementById('marginChange');
  if (profitMargin > 30) {
    marginChange.textContent = 'Excellent';
    marginChange.style.color = '#10b981';
  } else if (profitMargin > 20) {
    marginChange.textContent = 'Good';
    marginChange.style.color = '#2563eb';
  } else if (profitMargin > 10) {
    marginChange.textContent = 'Fair';
    marginChange.style.color = '#f59e0b';
  } else {
    marginChange.textContent = 'Low';
    marginChange.style.color = '#ef4444';
  }

  // Update summary section
  document.getElementById('summaryRevenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('summaryExpenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('summaryProfit').textContent = formatCurrency(netProfit);
  document.getElementById('summaryMargin').textContent = `${profitMargin.toFixed(1)}%`;

  // Update KPI Grid
  updateKPIGrid(totalRevenue, totalExpenses, netProfit);

  // Update growth metrics
  updateGrowthMetrics();
}

/**
 * Update KPI Grid
 */
function updateKPIGrid(revenue, expenses, profit) {
  const sales = storage.getSales();
  const inventory = storage.getInventory();
  
  const totalUnits = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const inventoryValue = storage.calculateInventoryValue();
  const avgOrderValue = sales.length > 0 ? revenue / sales.length : 0;
  const lowStockItems = storage.getLowStockItems().length;

  const kpis = [
    { label: 'Total Orders', value: sales.length },
    { label: 'Average Order Value', value: formatCurrency(avgOrderValue) },
    { label: 'Total Products', value: inventory.length },
    { label: 'Total Units in Stock', value: totalUnits },
    { label: 'Inventory Value', value: formatCurrency(inventoryValue) },
    { label: 'Low Stock Items', value: lowStockItems, color: lowStockItems > 0 ? '#ef4444' : '#10b981' }
  ];

  const kpiGrid = document.getElementById('kpiGrid');
  kpiGrid.innerHTML = kpis.map(kpi => `
    <div class="stat-item">
      <div class="stat-value" style="${kpi.color ? `color: ${kpi.color}` : ''}">${kpi.value}</div>
      <div class="stat-label">${kpi.label}</div>
    </div>
  `).join('');
}

/**
 * Update growth metrics
 */
function updateGrowthMetrics() {
  const sales = storage.getSales();
  const expenses = storage.getExpenses();
  
  // Current month vs previous month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const currentMonthSales = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, s) => sum + s.totalAmount, 0);

  const prevMonthDate = new Date(currentYear, currentMonth - 1);
  const prevMonthSales = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear();
  }).reduce((sum, s) => sum + s.totalAmount, 0);

  const salesGrowth = prevMonthSales > 0 ? 
    ((currentMonthSales - prevMonthSales) / prevMonthSales * 100) : 0;

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, e) => sum + e.amount, 0);

  const prevMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);

  const expenseGrowth = prevMonthExpenses > 0 ? 
    ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses * 100) : 0;

  const growthMetrics = document.getElementById('growthMetrics');
  growthMetrics.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f3f4f6; border-radius: 0.75rem;">
      <div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Sales Growth (MoM)</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: ${salesGrowth >= 0 ? '#10b981' : '#ef4444'};">
          ${salesGrowth >= 0 ? '↑' : '↓'} ${Math.abs(salesGrowth).toFixed(1)}%
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.75rem; color: #9ca3af;">Previous: ${formatCurrency(prevMonthSales)}</div>
        <div style="font-size: 0.75rem; color: #9ca3af;">Current: ${formatCurrency(currentMonthSales)}</div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f3f4f6; border-radius: 0.75rem;">
      <div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Expense Trend (MoM)</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: ${expenseGrowth <= 0 ? '#10b981' : '#ef4444'};">
          ${expenseGrowth <= 0 ? '↓' : '↑'} ${Math.abs(expenseGrowth).toFixed(1)}%
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.75rem; color: #9ca3af;">Previous: ${formatCurrency(prevMonthExpenses)}</div>
        <div style="font-size: 0.75rem; color: #9ca3af;">Current: ${formatCurrency(currentMonthExpenses)}</div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f3f4f6; border-radius: 0.75rem;">
      <div>
        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Customer Count</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb;">
          ${new Set(storage.getSales().map(s => s.customer)).size}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.75rem; color: #9ca3af;">Unique Customers</div>
      </div>
    </div>
  `;
}

/**
 * Update charts
 */
function updateCharts() {
  updateRevenueExpenseChart();
  updateProfitTrendChart();
  updateRevenueSourceChart();
  updateExpenseCategoryChart();
}

/**
 * Update revenue vs expenses chart
 */
function updateRevenueExpenseChart() {
  const revenue = storage.calculateTotalSales();
  const expenses = storage.calculateTotalExpenses();

  chartManager.createBarChart(
    'revenueExpenseChart',
    'Amount',
    [revenue, expenses],
    ['Revenue', 'Expenses']
  );
}

/**
 * Update profit trend chart
 */
function updateProfitTrendChart() {
  const sales = storage.getSales();
  const expenses = storage.getExpenses();
  
  const profitByMonth = {};
  
  // Add sales data
  sales.forEach(sale => {
    const date = new Date(sale.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!profitByMonth[monthKey]) profitByMonth[monthKey] = { revenue: 0, expenses: 0 };
    profitByMonth[monthKey].revenue += sale.totalAmount;
  });

  // Add expenses data
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!profitByMonth[monthKey]) profitByMonth[monthKey] = { revenue: 0, expenses: 0 };
    profitByMonth[monthKey].expenses += expense.amount;
  });

  const sortedMonths = Object.keys(profitByMonth).sort();
  const last6Months = sortedMonths.slice(-6);
  
  const labels = last6Months.map(month => {
    const [year, monthNum] = month.split('-');
    return new Date(year, monthNum - 1).toLocaleString('en-US', { month: 'short' });
  });

  const profitData = last6Months.map(month => {
    const data = profitByMonth[month];
    return data.revenue - data.expenses;
  });

  chartManager.createLineChart(
    'profitTrendChart',
    'Monthly Profit',
    profitData,
    labels
  );
}

/**
 * Update revenue source chart
 */
function updateRevenueSourceChart() {
  const topProducts = storage.getTopProducts(5);

  if (topProducts.length === 0) {
    document.getElementById('revenueSourceChart').style.opacity = '0.5';
    return;
  }

  const labels = topProducts.map(p => p.name.substring(0, 15));
  const data = topProducts.map(p => p.amount);

  chartManager.createPieChart(
    'revenueSourceChart',
    labels,
    data
  );
}

/**
 * Update expense category chart
 */
function updateExpenseCategoryChart() {
  const expensesByCategory = storage.getExpensesByCategories();
  const labels = Object.keys(expensesByCategory);
  const data = Object.values(expensesByCategory);

  if (labels.length === 0) {
    document.getElementById('expenseCategoryChart').style.opacity = '0.5';
    return;
  }

  chartManager.createPieChart(
    'expenseCategoryChart',
    labels,
    data
  );
}

/**
 * Update breakdowns
 */
function updateBreakdowns() {
  updateTopProductsTable();
  updateTopExpensesTable();
}

/**
 * Update top products table
 */
function updateTopProductsTable() {
  const topProducts = storage.getTopProducts(5);
  const tbody = document.getElementById('topProductsBody');

  if (topProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; padding: 2rem; color: #9ca3af;">
          No sales data available
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = topProducts.map((product, index) => `
    <tr>
      <td><strong>${index + 1}. ${product.name}</strong></td>
      <td style="text-align: right;">${formatCurrency(product.amount)}</td>
    </tr>
  `).join('');
}

/**
 * Update top expenses table
 */
function updateTopExpensesTable() {
  const expensesByCategory = storage.getExpensesByCategories();
  const sorted = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tbody = document.getElementById('topExpensesBody');

  if (sorted.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; padding: 2rem; color: #9ca3af;">
          No expense data available
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sorted.map(([category, amount], index) => `
    <tr>
      <td><strong>${index + 1}. ${category}</strong></td>
      <td style="text-align: right;">${formatCurrency(amount)}</td>
    </tr>
  `).join('');
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
