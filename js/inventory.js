/**
 * ========================================
 * BizPulse - Inventory Page
 * Inventory management functionality
 * ======================================== */

let editingProductId = null;

document.addEventListener('DOMContentLoaded', function() {
  initInventoryPage();
});

/**
 * Initialize inventory page
 */
function initInventoryPage() {
  setupUI();
  loadInventory();
  setupEventListeners();
}

/**
 * Setup UI elements
 */
function setupUI() {
  setupThemeToggle();
  setupSidebarToggle();
  populateFilterDropdowns();
  updateSummaryCards();
  updateCharts();
  updateLowStockAlert();
}

/**
 * Populate filter dropdowns
 */
function populateFilterDropdowns() {
  const categories = storage.getInventoryCategories();
  const categoryFilter = document.getElementById('categoryFilter');

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/**
 * Update summary cards
 */
function updateSummaryCards() {
  const inventory = storage.getInventory();
  const inventoryValue = storage.calculateInventoryValue();
  const lowStockItems = storage.getLowStockItems();
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById('totalProducts').textContent = inventory.length;
  document.getElementById('inventoryTotal').textContent = formatCurrency(inventoryValue);
  document.getElementById('lowStockCount').textContent = lowStockItems.length;
  document.getElementById('totalUnits').textContent = totalUnits;
}

/**
 * Update charts
 */
function updateCharts() {
  updateInventoryCategoryChart();
  updateStockStatusChart();
}

/**
 * Update inventory category chart
 */
function updateInventoryCategoryChart() {
  const inventory = storage.getInventory();
  const byCategory = {};

  inventory.forEach(item => {
    const value = item.quantity * item.unitCost;
    byCategory[item.category] = (byCategory[item.category] || 0) + value;
  });

  const labels = Object.keys(byCategory);
  const data = Object.values(byCategory);

  if (labels.length === 0) return;

  chartManager.createPieChart(
    'inventoryCategoryChart',
    labels,
    data
  );
}

/**
 * Update stock status chart
 */
function updateStockStatusChart() {
  const inventory = storage.getInventory();
  const lowStock = inventory.filter(i => i.quantity < i.minStock).length;
  const normalStock = inventory.length - lowStock;

  chartManager.createPieChart(
    'stockStatusChart',
    ['Normal Stock', 'Low Stock'],
    [normalStock, lowStock]
  );
}

/**
 * Update low stock alert
 */
function updateLowStockAlert() {
  const lowStockItems = storage.getLowStockItems();
  const alertDiv = document.getElementById('lowStockAlert');
  const lowStockList = document.getElementById('lowStockList');

  if (lowStockItems.length > 0) {
    alertDiv.style.display = 'block';
    lowStockList.innerHTML = lowStockItems
      .map(item => `
        <div style="padding: 0.5rem; background: rgba(245, 158, 11, 0.1); border-radius: 0.375rem; margin-bottom: 0.5rem;">
          <strong>${item.name}</strong> - Current: ${item.quantity}, Minimum: ${item.minStock}
        </div>
      `)
      .join('');
  } else {
    alertDiv.style.display = 'none';
  }
}

/**
 * Load and display inventory
 */
function loadInventory() {
  const inventory = storage.getInventory();
  displayInventory(inventory);
}

/**
 * Display inventory in table
 */
function displayInventory(inventory) {
  const tableBody = document.getElementById('inventoryTableBody');
  const productsCount = document.getElementById('productsCount');

  if (inventory.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: #9ca3af;">
          No products found. Add your first product to get started.
        </td>
      </tr>
    `;
    productsCount.textContent = '0 products';
    return;
  }

  tableBody.innerHTML = inventory
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(item => {
      const isLowStock = item.quantity < item.minStock;
      return `
        <tr>
          <td><strong>${item.name}</strong></td>
          <td>${item.sku}</td>
          <td>${item.category}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.unitCost)}</td>
          <td>${formatCurrency(item.unitPrice)}</td>
          <td>
            <span class="badge ${isLowStock ? 'badge-danger' : 'badge-success'}">
              ${isLowStock ? 'Low Stock' : 'In Stock'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="table-action-btn table-edit-btn" onclick="editProduct(${item.id})" title="Edit">✏️</button>
              <button class="table-action-btn table-delete-btn" onclick="deleteProduct(${item.id})" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  productsCount.textContent = `${inventory.length} product${inventory.length !== 1 ? 's' : ''}`;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Modal buttons
  const addProductBtn = document.getElementById('addProductBtn');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const productForm = document.getElementById('productForm');

  addProductBtn.addEventListener('click', () => openModal());
  modalClose.addEventListener('click', () => closeModal());
  cancelBtn.addEventListener('click', () => closeModal());
  productForm.addEventListener('submit', handleSubmit);

  // Filters
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const stockFilter = document.getElementById('stockFilter');

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  stockFilter.addEventListener('change', applyFilters);

  // Close modal when clicking outside
  document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}

/**
 * Open modal
 */
function openModal() {
  editingProductId = null;
  document.getElementById('modalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productModal').classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  editingProductId = null;
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('nameInput').value;
  const sku = document.getElementById('skuInput').value;
  const category = document.getElementById('categoryInput').value;
  const cost = parseFloat(document.getElementById('costInput').value);
  const price = parseFloat(document.getElementById('priceInput').value);
  const quantity = parseInt(document.getElementById('quantityInput').value);
  const minStock = parseInt(document.getElementById('minStockInput').value);

  if (!name || !sku || !category || !cost || !price || quantity < 0 || minStock < 0) {
    alert('Please fill in all required fields');
    return;
  }

  if (editingProductId) {
    // Update existing product
    storage.updateInventoryItem(editingProductId, {
      name,
      sku,
      category,
      unitCost: cost,
      unitPrice: price,
      quantity,
      minStock
    });
  } else {
    // Add new product
    storage.addInventoryItem({
      name,
      sku,
      category,
      unitCost: cost,
      unitPrice: price,
      quantity,
      minStock
    });
  }

  closeModal();
  loadInventory();
  updateSummaryCards();
  updateCharts();
  updateLowStockAlert();
  populateFilterDropdowns();
}

/**
 * Edit product
 */
function editProduct(id) {
  const product = storage.getInventory().find(p => p.id === id);
  if (!product) return;

  editingProductId = id;
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('nameInput').value = product.name;
  document.getElementById('skuInput').value = product.sku;
  document.getElementById('categoryInput').value = product.category;
  document.getElementById('costInput').value = product.unitCost;
  document.getElementById('priceInput').value = product.unitPrice;
  document.getElementById('quantityInput').value = product.quantity;
  document.getElementById('minStockInput').value = product.minStock;

  document.getElementById('productModal').classList.add('active');
}

/**
 * Delete product
 */
function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    storage.deleteInventoryItem(id);
    loadInventory();
    updateSummaryCards();
    updateCharts();
    updateLowStockAlert();
  }
}

/**
 * Apply filters
 */
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const categoryValue = document.getElementById('categoryFilter').value;
  const stockValue = document.getElementById('stockFilter').value;

  let inventory = storage.getInventory();

  inventory = inventory.filter(item => {
    const matchesSearch = !searchValue || 
      item.name.toLowerCase().includes(searchValue) ||
      item.sku.toLowerCase().includes(searchValue);
    
    const matchesCategory = !categoryValue || item.category === categoryValue;
    
    let matchesStock = true;
    if (stockValue === 'low') {
      matchesStock = item.quantity < item.minStock;
    } else if (stockValue === 'normal') {
      matchesStock = item.quantity >= item.minStock;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  displayInventory(inventory);
}

/**
 * Format currency
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
