// ===== Auth Utilities =====

class Auth {
  static isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getRole() {
    const user = this.getUser();
    return user?.Role || null;
  }

  static hasRole(role) {
    return this.getRole() === role;
  }

  static isAdmin() {
    return this.hasRole('Admin');
  }

  static isTeacher() {
    return this.hasRole('Teacher');
  }

  static isStudent() {
    return this.hasRole('Student');
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  static async login(username, password) {
    try {
      const response = await apiClient.login(username, password);
      
      apiClient.setToken(response.token);
      this.setUser({
        UserId: response.data.UserId,
        Username: response.data.Username,
        FullName: response.data.FullName,
        Email: response.data.Email,
        Role: response.data.Role,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static checkAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
    }
  }

  static redirectToDashboard() {
    const role = this.getRole();
    if (role === 'Admin') {
      window.location.href = '/app/views/admin/dashboard.html';
    } else if (role === 'Teacher') {
      window.location.href = '/app/views/teacher/dashboard.html';
    } else if (role === 'Student') {
      window.location.href = '/app/views/student/dashboard.html';
    }
  }
}

// ===== UI Utilities =====

class UI {
  static showAlert(message, type = 'success') {
    const alertEl = document.querySelector('.alert');
    if (!alertEl) {
      const container = document.querySelector('main') || document.body;
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} show`;
      alert.textContent = message;
      container.insertBefore(alert, container.firstChild);
      
      setTimeout(() => alert.remove(), 5000);
    } else {
      alertEl.className = `alert alert-${type} show`;
      alertEl.textContent = message;
      
      setTimeout(() => alertEl.classList.remove('show'), 5000);
    }
  }

  static showLoading() {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'flex';
  }

  static hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
  }

  static setNavbarUser(user) {
    const userNameEl = document.querySelector('.navbar-user-name');
    const userRoleEl = document.querySelector('.navbar-user-role');
    
    if (userNameEl) userNameEl.textContent = user.FullName;
    if (userRoleEl) userRoleEl.textContent = `(${user.Role})`;
  }

  static setActiveMenu(selector) {
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.sidebar-menu a[href="${selector}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  static formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  }
}

// ===== Table Utilities =====

class TableUtil {
  static createRow(item, columns) {
    const tr = document.createElement('tr');
    
    columns.forEach(col => {
      const td = document.createElement('td');
      
      if (col.render) {
        td.innerHTML = col.render(item);
      } else {
        td.textContent = item[col.field];
      }
      
      tr.appendChild(td);
    });
    
    return tr;
  }

  static renderTable(containerId, data, columns) {
    const tbody = document.querySelector(`#${containerId} tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (data.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="${columns.length}" class="text-center text-muted">Không có dữ liệu</td>`;
      tbody.appendChild(tr);
      return;
    }

    data.forEach(item => {
      const row = this.createRow(item, columns);
      tbody.appendChild(row);
    });
  }

  static renderPagination(totalPages, currentPage, onPageChange) {
    const paginationEl = document.querySelector('.pagination');
    if (!paginationEl) return;

    paginationEl.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Trước';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    };
    paginationEl.appendChild(prevBtn);

    // Page numbers
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'active' : '';
      btn.onclick = () => onPageChange(i);
      paginationEl.appendChild(btn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Sau →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1);
    };
    paginationEl.appendChild(nextBtn);
  }
}

// ===== Form Utilities =====

class FormUtil {
  static getFormData(formSelector) {
    const form = document.querySelector(formSelector);
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  static setFormData(formSelector, data) {
    const form = document.querySelector(formSelector);
    
    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = data[key];
      }
    });
  }

  static resetForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (form) form.reset();
  }

  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  }

  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
  }
}

// ===== Debounce utility =====
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// ===== Format status badge =====
function getStatusBadge(status) {
  const badgeClass = status === 'Open' ? 'badge-success' : 
                     status === 'Closed' ? 'badge-danger' : 'badge-warning';
  return `<span class="badge ${badgeClass}">${status}</span>`;
}

function getGradeBadge(grade) {
  if (grade === null || grade === undefined) return '<span class="badge badge-warning">Chưa có</span>';
  if (grade >= 4) return `<span class="badge badge-success">${grade}/10</span>`;
  return `<span class="badge badge-danger">${grade}/10</span>`;
}
