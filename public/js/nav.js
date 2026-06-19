// public/js/nav.js
// Dùng CHUNG cho Admin / Teacher / Student - không quan tâm có 3 hay 5 mục,
// không quan tâm sidebar đang nằm trái (desktop) hay dưới (mobile, xem bottom-tab-bar.css).
//
// Mỗi dashboard tự định nghĩa window.onNavigate(page) để show/hide section + load data riêng.
// File này CHỈ làm 2 việc: bắt click trên .sidebar-menu, và tô class "active" đúng mục.

(function () {
  function getPageFromLink(link) {
    // Dùng classList (mảng class riêng lẻ) thay vì className.split('-')
    // để không bị lẫn với class "active" đứng sau (menu-dashboard active -> "dashboard active" nếu split thô)
    const cls = Array.from(link.classList).find((c) => c.startsWith('menu-'));
    return cls ? cls.replace('menu-', '') : null;
  }

  function setActiveLink(page) {
    document.querySelectorAll('.sidebar-menu a').forEach((a) => a.classList.remove('active'));
    const activeLink = document.querySelector('.menu-' + page);
    if (activeLink) activeLink.classList.add('active');
  }

  function navigateTo(page) {
    setActiveLink(page);
    if (typeof window.onNavigate === 'function') {
      window.onNavigate(page);
    }
  }

  function initSidebarNav() {
    document.querySelectorAll('.sidebar-menu a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = getPageFromLink(link);
        if (page) navigateTo(page);
      });
    });
  }

  // Cho phép gọi điều hướng từ code khác nếu cần (ví dụ link nội bộ, breadcrumb...)
  window.SidebarNav = { navigateTo };

  initSidebarNav();
})();