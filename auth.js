(function(window) {
	const STORAGE_KEY = 'ql_user';

	function getUser() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch (e) {
			return null;
		}
	}

	function setUser(user) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	}

	function isAuthenticated() {
		return !!getUser();
	}

	function requireAuth(redirectTo) {
		if (!isAuthenticated()) {
			window.location.href = redirectTo || 'login.html';
			return false;
		}
		return true;
	}

	function login(userName) {
		const name = String(userName || '').trim();
		if (!name) return false;
		setUser({ name, ts: Date.now() });
		return true;
	}

	function logout() {
		localStorage.removeItem(STORAGE_KEY);
	}

	window.QLAuth = { getUser, setUser, isAuthenticated, requireAuth, login, logout };
})(window);