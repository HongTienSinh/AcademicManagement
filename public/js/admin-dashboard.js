(function () {
  // ============ AUTH CHECK ============
  const user = Auth.getUser();
  if (!Auth.isAdmin()) {
    window.location.href = '/login';
    return;
  }
  UI.setNavbarUser(user);

  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      Auth.logout();
    }
  });

  // ============ MENU NAVIGATION ============
  // Bắt click + tô active đã chuyển sang nav.js (dùng chung Admin/Teacher/Student).
  // Ở đây chỉ định nghĩa việc show/hide section nào + load data gì cho từng "page" của Admin.
  function switchPage(page) {
    document.querySelectorAll('.section').forEach((s) => (s.style.display = 'none'));

    if (page === 'dashboard') {
      document.getElementById('dashboardSection').style.display = 'block';
      loadDashboardStats();
    } else if (page === 'users') {
      document.getElementById('usersSection').style.display = 'block';
      loadUsers();
    } else if (page === 'departments') {
      document.getElementById('departmentsSection').style.display = 'block';
      loadDepartments();
    } else if (page === 'courses') {
      document.getElementById('coursesSection').style.display = 'block';
      loadCourses();
    } else if (page === 'classes') {
      document.getElementById('classesSection').style.display = 'block';
      loadClasses();
    }
  }

  // nav.js gọi hàm này mỗi khi người dùng bấm 1 mục trong .sidebar-menu
  window.onNavigate = switchPage;

  // ============ DASHBOARD ============
  async function loadDashboardStats() {
    try {
      const res = await apiClient.getAdminStats();
      document.getElementById('totalUsers').textContent = res.data.totalUsers;
      document.getElementById('totalDepartments').textContent = res.data.totalDepartments;
      document.getElementById('totalCourses').textContent = res.data.totalCourses;
      document.getElementById('totalClasses').textContent = res.data.totalClasses;
    } catch (error) {
      UI.showAlert(error.message, 'danger');
    }
  }

  // ============ USERS ============
  let usersCache = [];
  let editingUserId = null;
  let currentUserPage = 1;
  let currentUserLimit = 10;
  let currentUserSearch = '';

  async function loadUsers() {
    try {
      const data = await apiClient.getUsers(currentUserPage, currentUserLimit, currentUserSearch);
      usersCache = data.data || [];

      const columns = [
        { field: 'Username' },
        { field: 'FullName' },
        { field: 'Email' },
        { field: 'RoleName' },
        {
          field: 'IsActive',
          render: (item) =>
            item.IsActive
              ? '<span class="badge badge-success">Hoạt Động</span>'
              : '<span class="badge badge-danger">Bị Khóa</span>',
        },
        {
          render: (item) => `
            <button class="btn btn-sm btn-secondary" onclick="editUser('${item.UserId}')">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${item.UserId}')">Xóa</button>
          `,
        },
      ];

      TableUtil.renderTable('usersTable', usersCache, columns);
      TableUtil.renderPagination(data.pagination.totalPages, data.pagination.currentPage, (page) => {
        currentUserPage = page;
        loadUsers();
      });
    } catch (error) {
      UI.showAlert(error.message, 'danger');
    }
  }

  document.getElementById('searchUsers').addEventListener(
    'keyup',
    debounce((e) => {
      currentUserSearch = e.target.value;
      currentUserPage = 1;
      loadUsers();
    }, 300)
  );

  function setUserFormEditMode(isEdit) {
    const form = document.getElementById('userForm');
    const usernameInput = form.querySelector('[name="username"]');
    const passwordGroup = form.querySelector('[name="password"]').closest('.form-group');
    usernameInput.disabled = isEdit;
    // sp_UpdateUser không hỗ trợ đổi Username/Password -> ẩn field password khi sửa
    passwordGroup.style.display = isEdit ? 'none' : 'block';
    form.querySelector('[name="password"]').required = !isEdit;
  }

  document.getElementById('createUserBtn').addEventListener('click', () => {
    editingUserId = null;
    document.getElementById('userForm').reset();
    document.getElementById('userModalTitle').textContent = 'Thêm Người Dùng';
    setUserFormEditMode(false);
    FormUtil.openModal('userModal');
  });

  window.editUser = function (id) {
    const item = usersCache.find((u) => u.UserId === id);
    if (!item) return;
    editingUserId = id;
    const form = document.getElementById('userForm');
    form.reset();
    form.querySelector('[name="username"]').value = item.Username;
    form.querySelector('[name="fullName"]').value = item.FullName;
    form.querySelector('[name="email"]').value = item.Email;
    form.querySelector('[name="roleId"]').value = item.RoleId || '';
    document.getElementById('userModalTitle').textContent = 'Sửa Người Dùng';
    setUserFormEditMode(true);
    FormUtil.openModal('userModal');
  };

  document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = FormUtil.getFormData('#userForm');

    try {
      if (editingUserId) {
        // ⚠️ Giả định updateUser dùng camelCase giống createUser (fullName, email, roleId).
        // Gửi mình user.controller.js nếu sai để chỉnh lại field name.
        await apiClient.updateUser(editingUserId, {
          fullName: formData.fullName,
          email: formData.email,
          roleId: parseInt(formData.roleId),
        });
        UI.showAlert('✓ Cập nhật người dùng thành công!', 'success');
      } else {
        await apiClient.createUser({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email,
          roleId: parseInt(formData.roleId),
        });
        UI.showAlert('✓ Tạo người dùng thành công!', 'success');
      }
      FormUtil.closeModal('userModal');
      loadUsers();
    } catch (error) {
      UI.showAlert('✗ ' + error.message, 'danger');
    }
  });

  window.deleteUser = function (id) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      apiClient
        .deleteUser(id)
        .then(() => {
          UI.showAlert('✓ Xóa thành công!', 'success');
          loadUsers();
        })
        .catch((e) => UI.showAlert('✗ ' + e.message, 'danger'));
    }
  };

  // ============ DEPARTMENTS ============
  let departmentsCache = [];
  let editingDeptId = null;

  async function loadDepartments() {
    try {
      const data = await apiClient.getDepartments();
      departmentsCache = data.data || [];

      const columns = [
        { field: 'DepartmentCode' },
        { field: 'DepartmentName' },
        {
          render: (item) => `
            <button class="btn btn-sm btn-secondary" onclick="editDept(${item.DepartmentId})">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDept(${item.DepartmentId})">Xóa</button>
          `,
        },
      ];

      TableUtil.renderTable('departmentsTable', departmentsCache, columns);
    } catch (error) {
      UI.showAlert(error.message, 'danger');
    }
  }

  document.getElementById('createDeptBtn').addEventListener('click', () => {
    editingDeptId = null;
    document.getElementById('deptForm').reset();
    document.getElementById('deptModalTitle').textContent = 'Thêm Khoa';
    FormUtil.openModal('deptModal');
  });

  window.editDept = function (id) {
    const item = departmentsCache.find((d) => d.DepartmentId === id);
    if (!item) return;
    editingDeptId = id;
    const form = document.getElementById('deptForm');
    form.reset();
    form.querySelector('[name="DepartmentCode"]').value = item.DepartmentCode;
    form.querySelector('[name="DepartmentName"]').value = item.DepartmentName;
    document.getElementById('deptModalTitle').textContent = 'Sửa Khoa';
    FormUtil.openModal('deptModal');
  };

  document.getElementById('deptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = FormUtil.getFormData('#deptForm');
    try {
      if (editingDeptId) {
        await apiClient.updateDepartment(editingDeptId, formData);
        UI.showAlert('✓ Cập nhật khoa thành công!', 'success');
      } else {
        await apiClient.createDepartment(formData);
        UI.showAlert('✓ Tạo khoa thành công!', 'success');
      }
      FormUtil.closeModal('deptModal');
      loadDepartments();
    } catch (error) {
      UI.showAlert('✗ ' + error.message, 'danger');
    }
  });

  window.deleteDept = function (id) {
    if (confirm('Bạn có chắc muốn xóa khoa này?')) {
      apiClient
        .deleteDepartment(id)
        .then(() => {
          UI.showAlert('✓ Xóa thành công!', 'success');
          loadDepartments();
        })
        .catch((e) => UI.showAlert('✗ ' + e.message, 'danger'));
    }
  };

  // ============ COURSES ============
  let coursesCache = [];
  let editingCourseId = null;

  async function populateCourseDepartmentSelect(selectedId) {
    const data = await apiClient.getDepartments();
    const list = data.data || [];
    const select = document.getElementById('courseDepartmentSelect');
    select.innerHTML =
      '<option value="">-- Chọn Khoa --</option>' +
      list
        .map(
          (d) =>
            `<option value="${d.DepartmentId}" ${String(d.DepartmentId) === String(selectedId) ? 'selected' : ''}>${d.DepartmentName}</option>`
        )
        .join('');
  }

  async function loadCourses() {
    try {
      const data = await apiClient.getCourses();
      coursesCache = data.data || [];

      const columns = [
        { field: 'CourseCode' },
        { field: 'CourseName' },
        { field: 'Credits' },
        { field: 'DepartmentName' },
        {
          render: (item) => `
            <button class="btn btn-sm btn-secondary" onclick="editCourse(${item.CourseId})">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCourse(${item.CourseId})">Xóa</button>
          `,
        },
      ];

      TableUtil.renderTable('coursesTable', coursesCache, columns);
    } catch (error) {
      UI.showAlert(error.message, 'danger');
    }
  }

  document.getElementById('createCourseBtn').addEventListener('click', async () => {
    editingCourseId = null;
    document.getElementById('courseForm').reset();
    document.getElementById('courseModalTitle').textContent = 'Thêm Môn Học';
    await populateCourseDepartmentSelect();
    FormUtil.openModal('courseModal');
  });

  window.editCourse = async function (id) {
    const item = coursesCache.find((c) => c.CourseId === id);
    if (!item) return;
    editingCourseId = id;
    const form = document.getElementById('courseForm');
    form.reset();
    form.querySelector('[name="CourseCode"]').value = item.CourseCode;
    form.querySelector('[name="CourseName"]').value = item.CourseName;
    form.querySelector('[name="Credits"]').value = item.Credits;
    await populateCourseDepartmentSelect(item.DepartmentId);
    document.getElementById('courseModalTitle').textContent = 'Sửa Môn Học';
    FormUtil.openModal('courseModal');
  };

  document.getElementById('courseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = FormUtil.getFormData('#courseForm');
    formData.Credits = parseInt(formData.Credits);
    formData.DepartmentId = parseInt(formData.DepartmentId);
    try {
      if (editingCourseId) {
        await apiClient.updateCourse(editingCourseId, formData);
        UI.showAlert('✓ Cập nhật môn học thành công!', 'success');
      } else {
        await apiClient.createCourse(formData);
        UI.showAlert('✓ Tạo môn học thành công!', 'success');
      }
      FormUtil.closeModal('courseModal');
      loadCourses();
    } catch (error) {
      UI.showAlert('✗ ' + error.message, 'danger');
    }
  });

  window.deleteCourse = function (id) {
    if (confirm('Bạn có chắc muốn xóa môn học này?')) {
      apiClient
        .deleteCourse(id)
        .then(() => {
          UI.showAlert('✓ Xóa thành công!', 'success');
          loadCourses();
        })
        .catch((e) => UI.showAlert('✗ ' + e.message, 'danger'));
    }
  };

  // ============ CLASSES ============
  // ⚠️ Giả định class.controller.js dùng PascalCase giống Course/Department
  // (ClassCode, CourseId, TeacherId, Semester, MaxStudents, Status), khớp tên
  // tham số trong sp_InsertClass/sp_UpdateClass. Gửi mình file đó nếu sai để chỉnh lại.
  let classesCache = [];
  let editingClassId = null;

  async function populateClassSelects(selectedCourseId, selectedTeacherId) {
    const [coursesData, usersData] = await Promise.all([
      apiClient.getCourses(),
      apiClient.getUsers(1, 100, ''),
    ]);
    const courseList = coursesData.data || [];
    const teacherList = (usersData.data || []).filter((u) => u.RoleName === 'Teacher' || u.RoleId === 2);

    const courseSelect = document.getElementById('classCourseSelect');
    courseSelect.innerHTML =
      '<option value="">-- Chọn Môn Học --</option>' +
      courseList
        .map(
          (c) =>
            `<option value="${c.CourseId}" ${String(c.CourseId) === String(selectedCourseId) ? 'selected' : ''}>${c.CourseCode} - ${c.CourseName}</option>`
        )
        .join('');

    const teacherSelect = document.getElementById('classTeacherSelect');
    teacherSelect.innerHTML =
      '<option value="">-- Chọn Giảng Viên --</option>' +
      teacherList
        .map(
          (t) =>
            `<option value="${t.UserId}" ${String(t.UserId) === String(selectedTeacherId) ? 'selected' : ''}>${t.FullName}</option>`
        )
        .join('');
  }

  async function loadClasses() {
    try {
      const data = await apiClient.getClasses();
      classesCache = data.data || [];

      const columns = [
        { field: 'ClassCode' },
        { field: 'CourseName' },
        { field: 'TeacherName' },
        { field: 'Semester' },
        { render: (item) => `${item.EnrolledCount || 0}/${item.MaxStudents || 0}` },
        { field: 'Status', render: (item) => getStatusBadge(item.Status) },
        {
          render: (item) => `
            <button class="btn btn-sm btn-secondary" onclick="editClass(${item.ClassId})">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteClass(${item.ClassId})">Xóa</button>
          `,
        },
      ];

      TableUtil.renderTable('classesTable', classesCache, columns);
    } catch (error) {
      UI.showAlert(error.message, 'danger');
    }
  }

  document.getElementById('createClassBtn').addEventListener('click', async () => {
    editingClassId = null;
    document.getElementById('classForm').reset();
    document.getElementById('classModalTitle').textContent = 'Mở Lớp Mới';
    await populateClassSelects();
    FormUtil.openModal('classModal');
  });

  window.editClass = async function (id) {
    const item = classesCache.find((c) => c.ClassId === id);
    if (!item) return;
    editingClassId = id;
    const form = document.getElementById('classForm');
    form.reset();
    form.querySelector('[name="ClassCode"]').value = item.ClassCode;
    form.querySelector('[name="Semester"]').value = item.Semester;
    form.querySelector('[name="MaxStudents"]').value = item.MaxStudents;
    form.querySelector('[name="Status"]').value = item.Status;
    // ⚠️ Cần API trả kèm CourseId/TeacherId thô bên cạnh CourseName/TeacherName
    await populateClassSelects(item.CourseId, item.TeacherId);
    document.getElementById('classModalTitle').textContent = 'Sửa Lớp Học';
    FormUtil.openModal('classModal');
  };

  document.getElementById('classForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = FormUtil.getFormData('#classForm');
    formData.CourseId = parseInt(formData.CourseId);
    formData.MaxStudents = parseInt(formData.MaxStudents);
    try {
      if (editingClassId) {
        await apiClient.updateClass(editingClassId, formData);
        UI.showAlert('✓ Cập nhật lớp học thành công!', 'success');
      } else {
        await apiClient.createClass(formData);
        UI.showAlert('✓ Mở lớp thành công!', 'success');
      }
      FormUtil.closeModal('classModal');
      loadClasses();
    } catch (error) {
      UI.showAlert('✗ ' + error.message, 'danger');
    }
  });

  window.deleteClass = function (id) {
    if (confirm('Bạn có chắc muốn xóa lớp học này?')) {
      apiClient
        .deleteClass(id)
        .then(() => {
          UI.showAlert('✓ Xóa thành công!', 'success');
          loadClasses();
        })
        .catch((e) => UI.showAlert('✗ ' + e.message, 'danger'));
    }
  };

  // Initial load - tab "Dashboard" đang active sẵn theo HTML, nên load đúng dashboard stats
  switchPage('dashboard');
})();