export const state = () => ({
  token: localStorage.getItem('key') || null,
  exp: localStorage.getItem('exp') || null,
  sidebar: false
})

export const getters = {
  loggedIn(state) {
    return state.token !== null
  },

  isExpired(state) {
    if (state.exp == null) {
      return false;
    }

    var date = new Date().getTime().toString();
    date = date.substring(0, date.length - 3);

    return state.exp <= parseInt(date)
  }
}

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },

  retrieveToken(state, token) {
      state.token = token;
      try {
        localStorage.setItem("key", token);
        localStorage.setItem("exp", require('jwt-decode')(token).exp);
      } catch {

      }
  },

  destroyToken(state) {
      state.token = null;
      state.exp = null;
      try {
          localStorage.removeItem("key");
          localStorage.removeItem("exp");
      } catch {

      }
  },
}
