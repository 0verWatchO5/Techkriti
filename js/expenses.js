/**
 * ========================================
 * BizPulse - Expenses Page
 * Expense management functionality
 * ======================================== */

let editingExpenseId = null;

document.addEventListener('DOMContentLoaded', function() {
  initExpensesPage();
});

/**
 * Initialize expenses page
 */
function initExpensesPage() {
  setupUI();
  loadExpenses();
  setupEventListeners();
}

/**
 * Setup UI elements
 */
function setupUI() {
  setupThemeToggle();
  setupSidebarToggle();
  setDefaultDate();
  populateFilterDropdowns();
  updateSummaryCards();
  updateCharts();
}

/**
 * Set default date to today
 */
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('dateInput');
  if (dateInput) {
    dateInput.value = today;
  }
}

/**
 * Populate filter dropdowns
 */
function populateFilterDropdowns() {
  const categories = storage.getExpenseCategories();
  const categoryFilter = document.getElementById('categoryFilter');
  const categoryInput = document.getElementById('categoryInput');

  categories.forEach(category => {
    if (categoryFilter) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  });
}

/**
 * Update summary cards
 */
function updateSummaryCards() {
  const expenses = storage.getExpenses();
  const totalExpenses = storage.calculateTotalExpenses();
  const monthlyExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);
  
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  document.getElementById('totalExpensesAmount').textContent = formatCurrency(totalExpenses);
  document.getElementById('monthlyExpensesAmount').textContent = formatCurrency(monthlyExpenses);
  document.getElementById('pendingExpensesCount').textContent = pendingExpenses;
  document.getElementById('avgExpenseAmount').textContent = formatCurrency(avgExpense);
}

/**
 * Update charts
 */
function updateCharts() {
  updateExpenseCategoryChart();
  updateMonthlyExpenseChart();
}

/**
 * Update expense category chart
 */
function updateExpenseCategoryChart() {
  const expensesByCategory = storage.getExpensesByCategories();
  const labels = Object.keys(expensesByCategory);
  const data = Object.values(expensesByCategory);

  if (labels.length === 0) return;

  chartManager.createPieChart(
    'expenseCategoryChart',
    labels,
    data
  );
}

/**
 * Update monthly expense chart
 */
function updateMonthlyExpenseChart() {
  const expenses = storage.getExpenses();
  const months = {};

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months[monthKey] = (months[monthKey] || 0) + expense.amount;
  });

  const sortedMonths = Object.keys(months).sort();
  const last6Months = sortedMonths.slice(-6);
  const labels = last6Months.map(month => {
    const [year, monthNum] = month.split('-');
    return new Date(year, monthNum - 1).toLocaleString('en-US', { month: 'short' });
  });
  const data = last6Months.map(month => months[month]);

  chartManager.createLineChart(
    'monthlyExpenseChart',
    'Monthly Expenses',
    data,
    labels
  );
}

/**
 * Load and display expenses
 */
function loadExpenses() {
  const expenses = storage.getExpenses();
  displayExpenses(expenses);
}

/**
 * Display expenses in table
 */
function displayExpenses(expenses) {
  const tableBody = document.getElementById('expensesTableBody');
  const expensesCount = document.getElementById('expensesCount');

  if (expenses.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #9ca3af;">
          No expenses found. Add your first expense to get started.
        </td>
      </tr>
    `;
    expensesCount.textContent = '0 expenses';
    return;
  }

  tableBody.innerHTML = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(expense => `
      <tr>
        <td><strong>${new Date(expense.date).toLocaleDateString()}</strong></td>
        <td>${expense.category}</td>
        <td>${expense.description || '-'}</td>
        <td><strong>${formatCurrency(expense.amount)}</strong></td>
        <td>
          <span class="badge ${expense.status === 'paid' ? 'badge-success' : 'badge-warning'}">
            ${expense.status}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn table-edit-btn" onclick="editExpense(${expense.id})" title="Edit">✏️</button>
            <button class="table-action-btn table-delete-btn" onclick="deleteExpense(${expense.id})" title="Delete">🗑️</button>
          </div>
        </td>
      </tr>
    `)
    .join('');

  expensesCount.textContent = `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Modal buttons
  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const expenseForm = document.getElementById('expenseForm');

  addExpenseBtn.addEventListener('click', () => openModal());
  modalClose.addEventListener('click', () => closeModal());
  cancelBtn.addEventListener('click', () => closeModal());
  expenseForm.addEventListener('submit', handleSubmit);

  // Filters
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);

  // Close modal when clicking outside
  document.getElementById('expenseModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}

/**
 * Open modal
 */
function openModal() {
  editingExpenseId = null;
  document.getElementById('modalTitle').textContent = 'Add New Expense';
  document.getElementById('expenseForm').reset();
  setDefaultDate();
  document.getElementById('expenseModal').classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
  document.getElementById('expenseModal').classList.remove('active');
  editingExpenseId = null;
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
  e.preventDefault();

  const category = document.getElementById('categoryInput').value;
  const amount = parseFloat(document.getElementById('amountInput').value);
  const date = document.getElementById('dateInput').value;
  const description = document.getElementById('descriptionInput').value;
  const status = document.getElementById('statusInput').value;

  if (!category || !amount || !date) {
    alert('Please fill in all required fields');
    return;
  }

  if (editingExpenseId) {
    // Update existing expense
    storage.updateExpense(editingExpenseId, {
      category,
      amount,
      date,
      description,
      status
    });
  } else {
    // Add new expense
    storage.addExpense({
      category,
      amount,
      date,
      description,
      status
    });
  }

  closeModal();
  loadExpenses();
  updateSummaryCards();
  updateCharts();
  populateFilterDropdowns();
}

/**
 * Edit expense
 */
function editExpense(id) {
  const expense = storage.getExpenses().find(e => e.id === id);
  if (!expense) return;

  editingExpenseId = id;
  document.getElementById('modalTitle').textContent = 'Edit Expense';
  document.getElementById('categoryInput').value = expense.category;
  document.getElementById('amountInput').value = expense.amount;
  document.getElementById('dateInput').value = expense.date;
  document.getElementById('descriptionInput').value = expense.description || '';
  document.getElementById('statusInput').value = expense.status;

  document.getElementById('expenseModal').classList.add('active');
}

/**
 * Delete expense
 */
function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    storage.deleteExpense(id);
    loadExpenses();
    updateSummaryCards();
    updateCharts();
  }
}

/**
 * Apply filters
 */
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const categoryValue = document.getElementById('categoryFilter').value;
  const statusValue = document.getElementById('statusFilter').value;

  let expenses = storage.getExpenses();

  expenses = expenses.filter(expense => {
    const matchesSearch = !searchValue || 
      expense.category.toLowerCase().includes(searchValue) ||
      expense.description.toLowerCase().includes(searchValue);
    
    const matchesCategory = !categoryValue || expense.category === categoryValue;
    const matchesStatus = !statusValue || expense.status === statusValue;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  displayExpenses(expenses);
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
