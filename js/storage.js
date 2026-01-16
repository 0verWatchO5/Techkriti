/**
 * ========================================
 * BizPulse - Storage Management Utility
 * Handles localStorage operations for all data
 * ======================================== */

class StorageManager {
  constructor() {
    this.PREFIX = 'bizpulse_';
    this.KEYS = {
      EXPENSES: 'expenses',
      INVENTORY: 'inventory',
      SALES: 'sales',
      SETTINGS: 'settings'
    };
    this.initializeStorage();
  }

  /**
   * Initialize storage with default data if empty
   */
  initializeStorage() {
    if (!this.get(this.KEYS.EXPENSES)) {
      this.set(this.KEYS.EXPENSES, this.getDefaultExpenses());
    }
    if (!this.get(this.KEYS.INVENTORY)) {
      this.set(this.KEYS.INVENTORY, this.getDefaultInventory());
    }
    if (!this.get(this.KEYS.SALES)) {
      this.set(this.KEYS.SALES, this.getDefaultSales());
    }
    if (!this.get(this.KEYS.SETTINGS)) {
      this.set(this.KEYS.SETTINGS, this.getDefaultSettings());
    }
  }

  /**
   * Get default expenses data
   */
  getDefaultExpenses() {
    return [
      {
        id: 1,
        category: 'Rent',
        amount: 5000,
        date: '2025-01-01',
        description: 'Monthly office rent',
        status: 'paid'
      },
      {
        id: 2,
        category: 'Utilities',
        amount: 800,
        date: '2025-01-05',
        description: 'Electricity and water',
        status: 'paid'
      },
      {
        id: 3,
        category: 'Salaries',
        amount: 15000,
        date: '2025-01-10',
        description: 'Employee salaries',
        status: 'paid'
      },
      {
        id: 4,
        category: 'Marketing',
        amount: 2000,
        date: '2025-01-12',
        description: 'Social media advertising',
        status: 'pending'
      },
      {
        id: 5,
        category: 'Supplies',
        amount: 500,
        date: '2025-01-08',
        description: 'Office supplies',
        status: 'paid'
      }
    ];
  }

  /**
   * Get default inventory data
   */
  getDefaultInventory() {
    return [
      {
        id: 1,
        name: 'Laptop Pro 15"',
        sku: 'LP001',
        category: 'Electronics',
        quantity: 8,
        minStock: 5,
        unitCost: 800,
        unitPrice: 1200,
        lastRestock: '2025-01-10'
      },
      {
        id: 2,
        name: 'Wireless Mouse',
        sku: 'WM001',
        category: 'Accessories',
        quantity: 45,
        minStock: 20,
        unitCost: 15,
        unitPrice: 35,
        lastRestock: '2025-01-08'
      },
      {
        id: 3,
        name: 'USB-C Cable',
        sku: 'UC001',
        category: 'Cables',
        quantity: 120,
        minStock: 50,
        unitCost: 2,
        unitPrice: 8,
        lastRestock: '2025-01-05'
      },
      {
        id: 4,
        name: 'Mechanical Keyboard',
        sku: 'MK001',
        category: 'Accessories',
        quantity: 3,
        minStock: 10,
        unitCost: 60,
        unitPrice: 120,
        lastRestock: '2024-12-20'
      },
      {
        id: 5,
        name: 'Monitor 27"',
        sku: 'MN001',
        category: 'Electronics',
        quantity: 12,
        minStock: 5,
        unitCost: 300,
        unitPrice: 500,
        lastRestock: '2025-01-02'
      }
    ];
  }

  /**
   * Get default sales data
   */
  getDefaultSales() {
    return [
      {
        id: 1,
        productId: 1,
        productName: 'Laptop Pro 15"',
        quantity: 2,
        unitPrice: 1200,
        totalAmount: 2400,
        date: '2025-01-14',
        customer: 'Acme Corp',
        status: 'completed'
      },
      {
        id: 2,
        productId: 2,
        productName: 'Wireless Mouse',
        quantity: 5,
        unitPrice: 35,
        totalAmount: 175,
        date: '2025-01-13',
        customer: 'Tech Solutions',
        status: 'completed'
      },
      {
        id: 3,
        productId: 3,
        productName: 'USB-C Cable',
        quantity: 20,
        unitPrice: 8,
        totalAmount: 160,
        date: '2025-01-12',
        customer: 'Global Traders',
        status: 'completed'
      },
      {
        id: 4,
        productId: 5,
        productName: 'Monitor 27"',
        quantity: 1,
        unitPrice: 500,
        totalAmount: 500,
        date: '2025-01-11',
        customer: 'Design Studio',
        status: 'completed'
      },
      {
        id: 5,
        productId: 1,
        productName: 'Laptop Pro 15"',
        quantity: 1,
        unitPrice: 1200,
        totalAmount: 1200,
        date: '2025-01-15',
        customer: 'StartUp Inc',
        status: 'pending'
      }
    ];
  }

  /**
   * Get default settings
   */
  getDefaultSettings() {
    return {
      theme: 'light',
      currency: 'INR',
      companyName: 'BizPulse',
      companyEmail: 'contact@bizpulse.com'
    };
  }

  /**
   * Store data to localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  /**
   * Retrieve data from localStorage
   */
  get(key) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  /**
   * Clear all BizPulse data from localStorage
   */
  clear() {
    Object.values(this.KEYS).forEach(key => {
      this.remove(key);
    });
  }

  // ========== EXPENSE METHODS ==========

  /**
   * Get all expenses
   */
  getExpenses() {
    return this.get(this.KEYS.EXPENSES) || [];
  }

  /**
   * Add new expense
   */
  addExpense(expense) {
    const expenses = this.getExpenses();
    const newExpense = {
      id: Math.max(...expenses.map(e => e.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      ...expense
    };
    expenses.push(newExpense);
    this.set(this.KEYS.EXPENSES, expenses);
    return newExpense;
  }

  /**
   * Update expense
   */
  updateExpense(id, updates) {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      this.set(this.KEYS.EXPENSES, expenses);
      return expenses[index];
    }
    return null;
  }

  /**
   * Delete expense
   */
  deleteExpense(id) {
    const expenses = this.getExpenses().filter(e => e.id !== id);
    this.set(this.KEYS.EXPENSES, expenses);
    return true;
  }

  /**
   * Get expenses by category
   */
  getExpensesByCategory(category) {
    return this.getExpenses().filter(e => e.category === category);
  }

  /**
   * Get expense categories
   */
  getExpenseCategories() {
    const expenses = this.getExpenses();
    return [...new Set(expenses.map(e => e.category))];
  }

  /**
   * Calculate total expenses
   */
  calculateTotalExpenses() {
    return this.getExpenses().reduce((sum, e) => sum + e.amount, 0);
  }

  // ========== INVENTORY METHODS ==========

  /**
   * Get all inventory items
   */
  getInventory() {
    return this.get(this.KEYS.INVENTORY) || [];
  }

  /**
   * Add new inventory item
   */
  addInventoryItem(item) {
    const inventory = this.getInventory();
    const newItem = {
      id: Math.max(...inventory.map(i => i.id), 0) + 1,
      lastRestock: new Date().toISOString().split('T')[0],
      ...item
    };
    inventory.push(newItem);
    this.set(this.KEYS.INVENTORY, inventory);
    return newItem;
  }

  /**
   * Update inventory item
   */
  updateInventoryItem(id, updates) {
    const inventory = this.getInventory();
    const index = inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      inventory[index] = { ...inventory[index], ...updates };
      this.set(this.KEYS.INVENTORY, inventory);
      return inventory[index];
    }
    return null;
  }

  /**
   * Delete inventory item
   */
  deleteInventoryItem(id) {
    const inventory = this.getInventory().filter(i => i.id !== id);
    this.set(this.KEYS.INVENTORY, inventory);
    return true;
  }

  /**
   * Get low stock items (below minStock)
   */
  getLowStockItems() {
    return this.getInventory().filter(i => i.quantity < i.minStock);
  }

  /**
   * Calculate total inventory value
   */
  calculateInventoryValue() {
    return this.getInventory().reduce((sum, item) => {
      return sum + (item.quantity * item.unitCost);
    }, 0);
  }

  /**
   * Get inventory categories
   */
  getInventoryCategories() {
    const inventory = this.getInventory();
    return [...new Set(inventory.map(i => i.category))];
  }

  // ========== SALES METHODS ==========

  /**
   * Get all sales
   */
  getSales() {
    return this.get(this.KEYS.SALES) || [];
  }

  /**
   * Add new sale and deduct inventory
   */
  addSale(sale) {
    // Check if product exists and has sufficient quantity
    const product = this.getInventory().find(i => i.id === sale.productId);
    if (!product || product.quantity < sale.quantity) {
      return { error: 'Insufficient inventory' };
    }

    // Add sale
    const sales = this.getSales();
    const newSale = {
      id: Math.max(...sales.map(s => s.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      ...sale
    };
    sales.push(newSale);

    // Deduct from inventory
    this.updateInventoryItem(sale.productId, {
      quantity: product.quantity - sale.quantity
    });

    this.set(this.KEYS.SALES, sales);
    return newSale;
  }

  /**
   * Update sale
   */
  updateSale(id, updates) {
    const sales = this.getSales();
    const index = sales.findIndex(s => s.id === id);
    if (index !== -1) {
      sales[index] = { ...sales[index], ...updates };
      this.set(this.KEYS.SALES, sales);
      return sales[index];
    }
    return null;
  }

  /**
   * Delete sale
   */
  deleteSale(id) {
    const sales = this.getSales();
    const sale = sales.find(s => s.id === id);
    if (sale) {
      // Restore inventory
      const product = this.getInventory().find(i => i.id === sale.productId);
      if (product) {
        this.updateInventoryItem(sale.productId, {
          quantity: product.quantity + sale.quantity
        });
      }
    }
    const updatedSales = sales.filter(s => s.id !== id);
    this.set(this.KEYS.SALES, updatedSales);
    return true;
  }

  /**
   * Calculate total sales
   */
  calculateTotalSales() {
    return this.getSales().reduce((sum, s) => sum + s.totalAmount, 0);
  }

  /**
   * Get sales for current month
   */
  getSalesThisMonth() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return this.getSales().filter(s => {
      const saleDate = new Date(s.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
  }

  /**
   * Get sales by date range
   */
  getSalesByDateRange(startDate, endDate) {
    return this.getSales().filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  }

  // ========== ANALYTICS METHODS ==========

  /**
   * Calculate net profit
   */
  calculateNetProfit() {
    const revenue = this.calculateTotalSales();
    const expenses = this.calculateTotalExpenses();
    return revenue - expenses;
  }

  /**
   * Get profit margin
   */
  calculateProfitMargin() {
    const revenue = this.calculateTotalSales();
    if (revenue === 0) return 0;
    return (this.calculateNetProfit() / revenue) * 100;
  }

  /**
   * Get monthly data for chart
   */
  getMonthlySalesData() {
    const sales = this.getSales();
    const months = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + sale.totalAmount;
    });

    return months;
  }

  /**
   * Get expense data by category
   */
  getExpensesByCategories() {
    const expenses = this.getExpenses();
    const byCategory = {};
    
    expenses.forEach(expense => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });

    return byCategory;
  }

  /**
   * Get top products by sales
   */
  getTopProducts(limit = 5) {
    const sales = this.getSales();
    const productSales = {};
    
    sales.forEach(sale => {
      if (!productSales[sale.productName]) {
        productSales[sale.productName] = 0;
      }
      productSales[sale.productName] += sale.totalAmount;
    });

    return Object.entries(productSales)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }
}

// Create global storage instance
const storage = new StorageManager();
