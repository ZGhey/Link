<template>
  <div>
    <a-dropdown v-if="isSignedIn" style="float: right; margin: 20px">
      <a-menu slot="overlay" @click="handleLoginMenuClick">
        <a-menu-item key="logout"> Logout</a-menu-item>
      </a-menu>
      <a-button> {{ accountId }} <a-icon type="down" /> </a-button>
    </a-dropdown>
    <p v-else style="text-align: right">
      <a-button type="primary" v-on:click="login">Login</a-button>
    </p>
    <Notification
      v-show="notificationVisible"
      ref="notification"
      :networkId="networkId"
      :msg="'called method: set_greeting'"
      :contractId="contractId"
      :visible="false"
    />
  </div>
</template>

<script>
import { logout } from "../utils";
import { login } from "../utils";
import Notification from "./Notification.vue";

let id = 0;
export default {
  name: "Head",

  beforeMount() {},

  components: {
    Notification,
  },

  data: function () {
    return {
      notificationVisible: false,
      visible: false,
    };
  },

  computed: {
    isSignedIn() {
      return window.walletConnection
        ? window.walletConnection.isSignedIn()
        : false;
    },
    accountId() {
      return window.accountId;
    },
    contractId() {
      return window.contract ? window.contract.contractId : null;
    },
    networkId() {
      return window.networkId;
    },
  },
  beforeCreate() {},
  methods: {
    handleLoginMenuClick(action) {
      switch (action.key) {
        case "logout":
          logout();
          break;
      }
    },
    login() {
      console.log("calling utils.login");
      login();
    },
    logout: logout,
  },
};
</script>

