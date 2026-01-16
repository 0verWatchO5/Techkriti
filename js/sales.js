/**
 * ========================================
 * BizPulse - Sales Page
 * Sales management functionality
 * ======================================== */

let editingSaleId = null;

document.addEventListener('DOMContentLoaded', function() {
  initSalesPage();
});

/**
 * Initialize sales page
 */
function initSalesPage() {
  setupUI();
  loadSales();
  setupEventListeners();
}

/**
 * Setup UI elements
 */
function setupUI() {
  setupThemeToggle();
  setupSidebarToggle();
  setDefaultDate();
  populateProductDropdown();
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
 * Populate product dropdown
 */
function populateProductDropdown() {
  const inventory = storage.getInventory();
  const productInput = document.getElementById('productInput');

  // Clear existing options except the first one
  while (productInput.options.length > 1) {
    productInput.remove(1);
  }

  inventory.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} (${product.quantity} in stock)`;
    productInput.appendChild(option);
  });
}

/**
 * Update product details when selected
 */
function updateProductDetails() {
  const productId = parseInt(document.getElementById('productInput').value);
  const product = storage.getInventory().find(p => p.id === productId);

  if (!product) {
    document.getElementById('productStock').textContent = '';
    document.getElementById('unitPriceInput').value = '';
    return;
  }

  document.getElementById('productStock').textContent = 
    `Available: ${product.quantity} units | Min Stock: ${product.minStock}`;
  document.getElementById('unitPriceInput').value = product.unitPrice;
  calculateTotal();
}

/**
 * Calculate total amount
 */
function calculateTotal() {
  const quantity = parseInt(document.getElementById('quantityInput').value) || 0;
  const unitPrice = parseFloat(document.getElementById('unitPriceInput').value) || 0;
  const total = quantity * unitPrice;
  document.getElementById('totalAmountInput').value = total.toFixed(2);
}

/**
 * Update summary cards
 */
function updateSummaryCards() {
  const sales = storage.getSales();
  const totalSales = storage.calculateTotalSales();
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlySales = sales
    .filter(s => {
      const saleDate = new Date(s.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    })
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const avgOrderValue = sales.length > 0 ? totalSales / sales.length : 0;

  document.getElementById('totalSalesAmount').textContent = formatCurrency(totalSales);
  document.getElementById('monthlySalesAmount').textContent = formatCurrency(monthlySales);
  document.getElementById('totalOrders').textContent = sales.length;
  document.getElementById('avgOrderValue').textContent = formatCurrency(avgOrderValue);
}

/**
 * Update charts
 */
function updateCharts() {
  updateSalesTrendChart();
  updateTopProductsChart();
}

/**
 * Update sales trend chart
 */
function updateSalesTrendChart() {
  const sales = storage.getSales();
  const months = {};

  sales.forEach(sale => {
    const date = new Date(sale.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months[monthKey] = (months[monthKey] || 0) + sale.totalAmount;
  });

  const sortedMonths = Object.keys(months).sort();
  const last6Months = sortedMonths.slice(-6);
  const labels = last6Months.map(month => {
    const [year, monthNum] = month.split('-');
    return new Date(year, monthNum - 1).toLocaleString('en-US', { month: 'short' });
  });
  const data = last6Months.map(month => months[month]);

  chartManager.createLineChart(
    'salesTrendChart',
    'Monthly Sales',
    data,
    labels
  );
}

/**
 * Update top products chart
 */
function updateTopProductsChart() {
  const topProducts = storage.getTopProducts(5);

  if (topProducts.length === 0) return;

  const labels = topProducts.map(p => p.name.substring(0, 15));
  const data = topProducts.map(p => p.amount);

  chartManager.createBarChart(
    'topProductsChart',
    'Sales Revenue',
    data,
    labels
  );
}

/**
 * Load and display sales
 */
function loadSales() {
  const sales = storage.getSales();
  displaySales(sales);
}

/**
 * Display sales in table
 */
function displaySales(sales) {
  const tableBody = document.getElementById('salesTableBody');
  const salesCount = document.getElementById('salesCount');

  if (sales.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: #9ca3af;">
          No sales found. Add your first sale to get started.
        </td>
      </tr>
    `;
    salesCount.textContent = '0 sales';
    return;
  }

  tableBody.innerHTML = sales
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(sale => `
      <tr>
        <td><strong>${new Date(sale.date).toLocaleDateString()}</strong></td>
        <td>${sale.productName.substring(0, 20)}</td>
        <td>${sale.customer}</td>
        <td>${sale.quantity}</td>
        <td><strong>${formatCurrency(sale.totalAmount)}</strong></td>
        <td>
          <span class="badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}">
            ${sale.status}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn table-edit-btn" onclick="editSale(${sale.id})" title="Edit">✏️</button>
            <button class="table-action-btn table-delete-btn" onclick="deleteSale(${sale.id})" title="Delete">🗑️</button>
          </div>
        </td>
      </tr>
    `)
    .join('');

  salesCount.textContent = `${sales.length} sale${sales.length !== 1 ? 's' : ''}`;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Modal buttons
  const addSaleBtn = document.getElementById('addSaleBtn');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const saleForm = document.getElementById('saleForm');

  addSaleBtn.addEventListener('click', () => openModal());
  modalClose.addEventListener('click', () => closeModal());
  cancelBtn.addEventListener('click', () => closeModal());
  saleForm.addEventListener('submit', handleSubmit);

  // Form inputs for calculations
  const quantityInput = document.getElementById('quantityInput');
  quantityInput.addEventListener('input', calculateTotal);

  // Filters
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const dateFilter = document.getElementById('dateFilter');

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  dateFilter.addEventListener('change', applyFilters);

  // Close modal when clicking outside
  document.getElementById('saleModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}

/**
 * Open modal
 */
function openModal() {
  editingSaleId = null;
  document.getElementById('modalTitle').textContent = 'Add New Sale';
  document.getElementById('saleForm').reset();
  setDefaultDate();
  populateProductDropdown();
  document.getElementById('saleModal').classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
  document.getElementById('saleModal').classList.remove('active');
  editingSaleId = null;
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
  e.preventDefault();

  const productId = parseInt(document.getElementById('productInput').value);
  const product = storage.getInventory().find(p => p.id === productId);
  const quantity = parseInt(document.getElementById('quantityInput').value);
  const totalAmount = parseFloat(document.getElementById('totalAmountInput').value);
  const customer = document.getElementById('customerInput').value;
  const date = document.getElementById('dateInput').value;
  const status = document.getElementById('statusInput').value;

  if (!productId || !quantity || !customer || !date) {
    alert('Please fill in all required fields');
    return;
  }

  if (!product) {
    alert('Selected product not found');
    return;
  }

  if (quantity > product.quantity) {
    alert(`Insufficient inventory! Only ${product.quantity} units available.`);
    return;
  }

  if (editingSaleId) {
    // Update existing sale
    const oldSale = storage.getSales().find(s => s.id === editingSaleId);
    
    // Restore old inventory
    if (oldSale) {
      const oldProduct = storage.getInventory().find(p => p.id === oldSale.productId);
      if (oldProduct) {
        storage.updateInventoryItem(oldSale.productId, {
          quantity: oldProduct.quantity + oldSale.quantity
        });
      }
    }

    // Deduct new quantity
    storage.updateInventoryItem(productId, {
      quantity: product.quantity - quantity + (oldSale ? oldSale.quantity : 0)
    });

    storage.updateSale(editingSaleId, {
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.unitPrice,
      totalAmount,
      customer,
      date,
      status
    });
  } else {
    // Add new sale
    const result = storage.addSale({
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.unitPrice,
      totalAmount,
      customer,
      date,
      status
    });

    if (result.error) {
      alert(result.error);
      return;
    }
  }

  closeModal();
  loadSales();
  updateSummaryCards();
  updateCharts();
}

/**
 * Edit sale
 */
function editSale(id) {
  const sale = storage.getSales().find(s => s.id === id);
  if (!sale) return;

  editingSaleId = id;
  document.getElementById('modalTitle').textContent = 'Edit Sale';
  document.getElementById('productInput').value = sale.productId;
  document.getElementById('quantityInput').value = sale.quantity;
  document.getElementById('unitPriceInput').value = sale.unitPrice;
  document.getElementById('totalAmountInput').value = sale.totalAmount;
  document.getElementById('customerInput').value = sale.customer;
  document.getElementById('dateInput').value = sale.date;
  document.getElementById('statusInput').value = sale.status;
  updateProductDetails();

  document.getElementById('saleModal').classList.add('active');
}

/**
 * Delete sale
 */
function deleteSale(id) {
  if (confirm('Are you sure you want to delete this sale?')) {
    storage.deleteSale(id);
    loadSales();
    updateSummaryCards();
    updateCharts();
  }
}

/**
 * Apply filters
 */
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const statusValue = document.getElementById('statusFilter').value;
  const dateValue = document.getElementById('dateFilter').value;

  let sales = storage.getSales();

  sales = sales.filter(sale => {
    const matchesSearch = !searchValue || 
      sale.productName.toLowerCase().includes(searchValue) ||
      sale.customer.toLowerCase().includes(searchValue);
    
    const matchesStatus = !statusValue || sale.status === statusValue;
    const matchesDate = !dateValue || sale.date === dateValue;

    return matchesSearch && matchesStatus && matchesDate;
  });

  displaySales(sales);
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
