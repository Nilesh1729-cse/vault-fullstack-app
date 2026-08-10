(function () {
  if (!API.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  const alertEl = document.querySelector('[data-alert]');
  const welcomeName = document.getElementById('welcome-name');
  const logoutBtn = document.getElementById('logout-btn');

  function setField(name, value) {
    const el = document.querySelector(`[data-field="${name}"]`);
    if (el) el.textContent = value ?? '—';
  }

  function formatDate(value) {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return value;
    }
  }

  async function loadProfile() {
    try {
      const { user } = await API.me();
      welcomeName.textContent = `, ${user.name}`;
      setField('name', user.name);
      setField('email', user.email);
      setField('role', user.role);
      setField('created_at', formatDate(user.created_at));
    } catch (err) {
      if (err.status === 401) {
        API.clearToken();
        window.location.href = 'index.html';
        return;
      }
      UI.showAlert(alertEl, err.message || 'Could not load your profile.', 'error');
    }
  }

  logoutBtn.addEventListener('click', () => {
    API.clearToken();
    window.location.href = 'index.html';
  });

  loadProfile();
})();
