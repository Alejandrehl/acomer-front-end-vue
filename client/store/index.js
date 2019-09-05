import uuid from "uuid";
import api from "~/components/services/acomer-services";
import setAuthToken from "../utils/setAuthToken";
import adminApi from "~/components/services/acomer-admin-services";
import { qvoService } from "~/components/services/qvo-services";
export const strict = false;

import {
  SET_ALERT,
  REMOVE_ALERT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  CUSTOMER_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  GET_FEATURED_BRANCHES,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  RESETE_ORDER_CART,
  SET_BRANCH_DATA,
  SET_USER_POSITION,
  SET_MODAL_STATE,
  SET_FACEBOOK_USER,
  SEARCH,
  SET_SEARCHING,
  LOAD_BRANCHES
} from "./types";

export const state = () => ({
  user: null,
  user_client: {},
  isAuthenticated: null,
  token: localStorage.getItem("token"),
  fbToken: localStorage.getItem("auth._token.facebook"),
  error: null,
  alerts: [],
  featuredBranches: [],
  featuredBranch_first_image: null,
  cartTotal: 0,
  cartProducts: [],
  cartCount: 0,
  menuId: 0,
  showModalReserve: false,
  showModalOrder: false,
  userPosition: {
    accuracy: null,
    latitude: null,
    longitude: null
  },
  branchData: {
    branch_id: null,
    table_id: null,
    has_tables: null,
    latitude: null,
    longitude: null
  },
  modals: {
    call_waiter: false,
    authentication: false,
    order: false,
    reserve: false,
    reservation_detail: false,
    order_detail: false,
    loading_transaction: false
  },
  message: null,
  searching: false,
  searchQuery: "",
  allBranches: null,
  foundedBranches: null
});

export const mutations = {
  [SET_ALERT](state, { alert }) {
    return state.alerts.push(alert);
  },
  [REMOVE_ALERT](state) {
    return (state.alerts = []);
  },
  [LOGIN_SUCCESS](state, { payload }) {
    localStorage.setItem("token", payload.token);
  },
  [CUSTOMER_SUCCESS](state, { payload }) {
    state.user_client = payload;
  },
  [LOGIN_FAIL](state, { payload }) {
    localStorage.removeItem("token");
    state.token = null;
    state.isAuthenticated = false;
    state.error = payload;
  },
  [REGISTER_SUCCESS](state, { payload }) {
    localStorage.setItem("token", payload.token);
  },
  [REGISTER_FAIL](state, { payload }) {
    localStorage.removeItem("token");
    state.token = null;
    state.isAuthenticated = false;
    state.error = payload;
  },
  [USER_LOADED](state, { payload }) {
    state.user = payload;
    state.isAuthenticated = true;
  },
  [AUTH_ERROR](state, { payload }) {
    localStorage.removeItem("token");
    state.token = null;
    state.isAuthenticated = false;
    state.error = payload;
  },
  [LOGOUT](state) {
    localStorage.removeItem("token");
    localStorage.removeItem("auth._token.facebook");
    state.token = null;
    state.isAuthenticated = false;
    state.user = null;
    this.$toast.show("¡Hasta pronto!", {
      type: "warning",
      duration: 1500
    });
    this.$router.push("/");
  },
  [CLEAR_ERRORS](state) {
    return (state.error = null);
  },
  [GET_FEATURED_BRANCHES](state, payload) {
    state.featuredBranches = payload.data;
  },
  [ADD_PRODUCT](state, payload) {
    payload = payload.data;
    var cantidad = parseInt(payload.quantity);

    // Busca si el producto está en el carrito
    let found = state.cartProducts.find(
      product => product.id == payload.product.id
    );
    // Si ya está en el carrito
    if (found) {
      found.quantity += cantidad; // Aumenta la cantidad en "cantidad" del producto ya existente
    } else {
      state.cartProducts.push(payload.product);
      payload.product.quantity = cantidad;
    }

    // Aumenta la cantidad del carrito en "cantidad"
    state.cartCount += cantidad;
    // Aumenta el coste total del carrito
    state.cartTotal += payload.product.price * cantidad;
    if (payload.menu_id) {
      state.menuId = payload.menu_id;
    }
  },
  [REMOVE_PRODUCT](state, item) {
    item = item.data;
    // Busca la posición en el array del producto
    let index = state.cartProducts.indexOf(item);
    let product = state.cartProducts[index];

    // Si hay almenos 1 producto
    if (product.quantity > 1) {
      product.quantity--; // Reduce la cantidad del producto en 1
      state.cartTotal -= product.price; // Resta el precio del producto al coste total
      state.cartCount--; // Redice en 1 el número de elemntos en el carrito
    } else {
      state.cartProducts.splice(index, 1);
      state.cartTotal -= product.price; // Resta el precio del producto al coste total
      state.cartCount--; // Redice en 1 el número de elemntos en el carrito
    }
  },
  [RESETE_ORDER_CART](state) {
    state.cartTotal = 0;
    state.cartProducts = [];
    state.cartCount = 0;
    state.showModalOrder = false;
  },
  [SET_BRANCH_DATA](state, data) {
    var branch = data.data;
    if (branch.id) state.branchData.branch_id = branch.id;
    if (branch.by_tables == 0) state.branchData.has_tables = false;
    state.branchData.longitude = branch.leng;
    state.branchData.latitude = branch.lat;
  },

  [SET_USER_POSITION](state, payload) {
    state.userPosition.latitude = payload.data.latitude;
    state.userPosition.longitude = payload.data.longitude;
    state.userPosition.accuracy = payload.data.accuracy;
  },
  [SET_MODAL_STATE]: (state, { name, value }) => {
    state.modals[name] = value;
  },
  [SET_FACEBOOK_USER]: (state, payload) => {
    state.user = payload.data;
    state.isAuthenticated = true;
  },
  [SEARCH]: (state, payload) => {
    state.searching = true;
    state.searchQuery = payload.searchQuery;
    state.foundedBranches = state.allBranches.filter(branch => {
      const regex = new RegExp(`${payload.searchQuery}`, "gi");
      return (
        branch.name.match(regex) ||
        branch.street.match(regex) ||
        branch.branch_category.match(regex) ||
        branch.information.match(regex)
      );
    });
  },
  [SET_SEARCHING]: (state, payload) => {
    state.searching = payload.data;
    if (!state.searching) {
      state.foundedBranches = null;
    }
  },
  [LOAD_BRANCHES]: (state, payload) => {
    state.allBranches = payload.data;
  }
};

export const actions = {
  handleSetBranchData({ commit }, branch) {
    commit({ type: SET_BRANCH_DATA, data: branch });
  },

  async loadUser(context) {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const res = await api.get("/api/auth");
        context.commit({ type: USER_LOADED, payload: res.data });
        qvoService.userIsClient(res.data.email).then(function(response) {
          context.commit({ type: CUSTOMER_SUCCESS, payload: response.client });
        });
      } catch (err) {
        context.commit({ type: AUTH_ERROR, payload: err.message });
      }
    }
  },

  setAlert({ commit }, msg, timeout = 3000) {
    let id = uuid.v4();
    commit({ type: SET_ALERT, alert: { id, msg } });
    setTimeout(() => commit({ type: REMOVE_ALERT }), timeout);
  },

  async register(context, formData) {
    const config = {
      "Content-Type": "application/json"
    };

    try {
      const res = await api.post("/api/users/register", formData, config);
      context.commit({ type: REGISTER_SUCCESS, payload: res.data });

      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }

      try {
        const res = await api.get("/api/auth");
        context.commit({ type: USER_LOADED, payload: res.data });
        this.$toast.show("¡Te has registrado con éxito!", {
          type: "success",
          duration: 1500
        });
      } catch (err) {
        context.commit({ type: AUTH_ERROR, payload: err.message });
        this.$toast.show(err.message, {
          type: "warning",
          duration: 1500
        });
      }
    } catch (err) {
      context.commit({ type: REGISTER_FAIL, payload: err.response.data.msg });
      this.$toast.show(context.state.error, {
        type: "warning",
        duration: 1500
      });
      context.commit({ type: CLEAR_ERRORS });
    }
  },

  async login({ commit, state, dispatch }, formData) {
    const config = {
      "Content-Type": "application/json"
    };

    try {
      const res = await api.post("/api/auth", formData, config);
      commit({ type: LOGIN_SUCCESS, payload: res.data });

      qvoService
        .userIsClient(formData.email)
        .then(function(response) {
          commit({ type: CUSTOMER_SUCCESS, payload: response.client });
        })
        // Si no lo está devuelve un error
        .catch(function(response) {});

      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }

      try {
        const res = await api.get("/api/auth");
        commit({ type: USER_LOADED, payload: res.data });
        this.$toast.show("¡Sesión iniciada correctamente!", {
          type: "success",
          duration: 1500
        });
      } catch (err) {
        commit({ type: LOGIN_FAIL, payload: err.message });
        this.$toast.show(err.message, {
          type: "warning",
          duration: 1500
        });
      }
    } catch (err) {
      if (formData.type === "FACEBOOK_AUTH") {
        return dispatch(
          "register",
          (formData = {
            name: this.$auth.user.name,
            email: this.$auth.user.email,
            password: this.$auth.user.id,
            image: this.$auth.user.picture.data.url
          })
        );
      }

      commit({ type: LOGIN_FAIL, payload: err.response.data.msg });
      this.$toast.show(state.error, {
        type: "warning",
        duration: 1500
      });
      commit({ type: CLEAR_ERRORS });
    }
  },

  logout({ commit }) {
    commit({ type: LOGOUT });
  },

  clearErrors({ commit }) {
    commit({ type: CLEAR_ERRORS });
  },

  saveUserClient({ commit }, payload) {
    commit({ type: CUSTOMER_SUCCESS, payload: payload.client });
  },

  async getFeaturedBranches({ commit }) {
    try {
      const res = await api.get("/api/featuredbranches/");
      commit({ type: GET_FEATURED_BRANCHES, data: res.data });
    } catch (err) {
      let id = uuid.v4();
      commit({ type: SET_ALERT, alert: { id, msg: err.message } });
    }
  },

  handleAddProduct({ commit }, payload) {
    if (payload.quantity > 0) {
      this.$toast.show(payload.product.name + " se añadió al carrito 🛒", {
        type: "success",
        duration: 800
      });
      commit({ type: ADD_PRODUCT, data: payload });
    } else {
      this.$toast.show(
        "No puedes añadir cantidades menores a 1 a tu carrito 🛒",
        {
          type: "error",
          duration: 800
        }
      );
    }
  },

  handleRemoveProduct({ commit }, item) {
    this.$toast.show(item.name + " se elimno del carrito ❌", {
      type: "alert",
      duration: 800
    });
    commit({ type: REMOVE_PRODUCT, data: item });
  },

  // closeModal(state){
  //     if(this.state.showModalReserve){
  //         this.state.showModalReserve = false
  //     } else if(this.state.showModalOrder) {
  //         this.state.showModalOrder = false
  //     }
  // },
  emptyCart(state) {
    this.state.cartTotal = 0;
    this.state.cartProducts = [];
    this.state.cartCount = 0;
  },
  handleReseteCart({ commit }) {
    commit({ type: RESETE_ORDER_CART });
  },
  handleUserPoisition({ commit }) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        commit({
          type: SET_USER_POSITION,
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
        });
        resolve({
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
        });
      });
    });
  },

  toggle_modal_state: ({ commit }, { name, value }) => {
    commit(SET_MODAL_STATE, { name, value });
  },

  loadFbUser({ commit }, data) {
    commit({ type: SET_FACEBOOK_USER, data });
  },

  async uploadUserImage({ commit }, formData) {
    try {
      const res = await api.post("/api/users/image", formData);
      commit({ type: USER_LOADED, payload: res.data });
    } catch (err) {}
  },

  search({ commit }, string) {
    commit({ type: SEARCH, searchQuery: string });
  },

  setSearching({ commit }, value) {
    commit({ type: SET_SEARCHING, data: value });
  },

  async loadBranches({ commit }) {
    try {
      const res = await api.get("/api/branches");
      commit({ type: LOAD_BRANCHES, data: res.data });
    } catch (err) {}
  }
};
