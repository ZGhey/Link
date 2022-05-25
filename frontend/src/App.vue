<template>
  <div id="app">
    <a-layout id="components-layout-basic">
      <a-layout-header>
        <Head />
      </a-layout-header>
      <!-- <a-layout>
        <a-layout-sider
          width="450"
          :style="{ overflow: 'auto', height: '100vh' }"
        >
          <History />
        </a-layout-sider>
        <a-layout-content>
          <Game />
        </a-layout-content>
      </a-layout> -->
    </a-layout>
  </div>
</template>

<style>
#app {
  height: 100vh;
  background-size: 100% 100%;
}
#components-layout-basic {
  height: 100vh;
  background-size: 100% 100%;
  background-image: linear-gradient(#a4a4a9, #94b3c5);
}
#components-layout-basic .ant-layout-header,
#components-layout-basic .ant-layout-footer {
  background-image: linear-gradient(#095da9, #a4a4a9);
  color: #fff;
}
#components-layout-basic .ant-layout-footer {
  /*line-height: 1.5;*/
}
#components-layout-basic .ant-layout-sider {
  background-image: linear-gradient(#a4a4a9, #94b3c5);
  color: #fff;
}
#components-layout-basic .ant-layout-content {
  background-image: linear-gradient(#f3f3fb, #a9d7f1);
  height: 100vh;
  min-height: 120px;
}
#components-layout-basic > .ant-layout:last-child {
  margin: 0;
}
</style>

<script>
import getConfig from "./config";
import Head from "./components/Head.vue";
// import Game from "./components/Game.vue";
// import History from "./components/History.vue";

const nearConfig = getConfig(process.env.NODE_ENV || "development");
console.log(
  `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
);
window.networkId = nearConfig.networkId;

export default {
  created() {
    document.title = "Link";
  },
  name: "App",
  components: {
    Head,
    // Game,
    // History,
  },

  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn();
    },
  },
};
</script>

