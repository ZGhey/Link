<template>
  <div>
    <a-divider orientation="left"> 猜数字游戏 </a-divider>
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      style="margin: 20px"
    >
      <a-col :span="4">
        <p class="height-100">投注区间</p>
      </a-col>
      <a-col :span="8">
        <p class="height-120">
          <a-input-group compact>
            <a-input
              style="width: 100px; text-align: center"
              disabled
              value="1"
              placeholder="Minimum"
            />
            <a-input
              style="
                width: 30px;
                border-left: 0;
                pointer-events: none;
                backgroundcolor: #fff;
              "
              placeholder="~"
              disabled
            />
            <a-input-number
              v-model="inputValue"
              style="width: 100px; text-align: center; border-left: 0"
              placeholder="Maximum"
              :max="rangeMax"
              :min="rangeMin"
              @change="onChange"
            />
          </a-input-group>
        </p>
        <p class="height-50">
          <a-slider
            v-model="inputValue"
            :min="rangeMin"
            :max="rangeMax"
            style="width: 230px"
            @change="onChange"
          />
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-80 description">区间越大，赔率越大</p>
      </a-col>
    </a-row>
    <a-divider dashed style="width: 80px"> </a-divider>
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      style="margin: 20px"
    >
      <a-col :span="4">
        <p class="height-100">投注数字</p>
      </a-col>
      <a-col :span="8">
        <p class="height-120">
          <a-input-number
            :min="1"
            :max="inputNumberMax"
            style="width: 230px"
            :placeholder="inputNumberPlaceholder"
            v-model="inputNumber"
          />
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-80 description">输入区间内的一个数字</p>
      </a-col>
    </a-row>
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      style="margin: 20px"
    >
      <a-col :span="4">
        <p class="height-100">投注金额</p>
      </a-col>
      <a-col :span="8">
        <p class="height-120">
          <a-input-number
            :min="rangeAmountMin"
            :max="rangeAmountMax"
            :step="0.01"
            style="width: 230px"
            placeholder="0.01 ~ 1"
            v-model="amount"
          />
        </p>
      </a-col>
      <a-col :span="4">
        <p class="height-80 description">金额范围 0.01 ~ 1</p>
      </a-col>
    </a-row>
    <a-row
      type="flex"
      justify="space-around"
      align="middle"
      style="margin: 20px"
    >
      <a-col :span="16">
        <a-button
          type="primary"
          size="large"
          :loading="loading"
          @click="guess_number()"
          block
        >
          发起交易
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import {
  formatNearAmount,
  parseNearAmount,
} from "near-api-js/lib/utils/format";

export default {
  name: "Game",
  data() {
    return {
      inputValue: 100,
      rangeMin: 2,
      rangeMax: 100,
      inputNumberMax: 100,
      inputNumber: null,
      inputNumberPlaceholder: "请输入 1  ~  100",
      loading: false,
      amount: 0.01,
      rangeAmountMin: 0.01,
      rangeAmountMax: 1,
    };
  },
  methods: {
    onChange(value) {
      this.inputNumberMax = value;
      this.inputNumberPlaceholder = "请输入 1  ~  " + value;
    },
    async guess_number() {
      this.loading = true;
      console.log(this.inputNumber, this.inputNumberMax);
      if (this.inputNumber < 1 || this.inputNumber > this.inputNumberMax) {
        this.loading = false;
        return this.$message.error("请输入有效的数字");
      }

      const deposit = parseNearAmount(this.amount + "");
      await window.walletConnection.account().functionCall(
        window.nearConfig.contractName,
        "guess_number",
        {
          number: this.inputNumber,
          maximum: this.inputNumberMax,
        },
        window.nearConfig.GAS,
        deposit
      );
    },
  },
};
</script>
<style scoped>
.description {
  color: #4775a9;
}
</style>

