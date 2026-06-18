// ===== API Client =====
const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Nếu không OK, throw error
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Lỗi máy chủ');
      }

      // Nếu token hết hạn (401 sau khi đã login thành công), đăng xuất
      if (response.status === 401) {
        this.clearToken();
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ===== Auth =====
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // ===== Users =====
  async getUsers(page = 1, limit = 10, search = '') {
    let url = `/users?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.request(url);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updateUserStatus(userId) {
    return this.request(`/users/${userId}/status`, {
      method: 'PATCH',
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ===== Departments =====
  async getDepartments() {
    return this.request('/departments');
  }

  async createDepartment(data) {
    return this.request('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(deptId, data) {
    return this.request(`/departments/${deptId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(deptId) {
    return this.request(`/departments/${deptId}`, {
      method: 'DELETE',
    });
  }

  // ===== Courses =====
  async getCourses() {
    return this.request('/courses');
  }

  async createCourse(data) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(courseId, data) {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(courseId) {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  // ===== Classes =====
  async getClasses() {
    return this.request('/classes');
  }

  async getClassById(classId) {
    return this.request(`/classes/${classId}`);
  }

  async createClass(data) {
    return this.request('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(classId, data) {
    return this.request(`/classes/${classId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClass(classId) {
    return this.request(`/classes/${classId}`, {
      method: 'DELETE',
    });
  }

  // ===== Enrollments =====
  async enrollStudent(classId) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ classId }),
    });
  }

  async getEnrollments(classId) {
    return this.request(`/enrollments?classId=${classId}`);
  }

  async updateGrade(enrollmentId, midtermGrade, finalGrade) {
    return this.request(`/enrollments/${enrollmentId}/grade`, {
      method: 'PUT',
      body: JSON.stringify({ midtermGrade, finalGrade }),
    });
  }

  async cancelEnrollment(classId) {
    return this.request(`/enrollments/cancel`, {
      method: 'DELETE',
      body: JSON.stringify({ classId }),
    });
  }

  // ===== Dashboard Stats =====
  async getAdminStats() {
    return this.request('/dashboard/admin-stats');
  }

  async getTeacherStats() {
    return this.request('/dashboard/teacher-stats');
  }

  async getStudentStats() {
    return this.request('/dashboard/student-stats');
  }
}

// Global API client instance
const apiClient = new ApiClient();
