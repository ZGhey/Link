<template>
  <div>
    <h3 :style="{ margin: '16px 20px' }">我的交易</h3>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ y: 800 }"
      size="small"
      :loading="history_loading"
    >
      <span slot="tags" slot-scope="tags">
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="tag.indexOf('中奖') > -1 ? 'red' : ''"
        >
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
    </a-table>
  </div>
</template>
<script>
import {
  formatNearAmount,
} from "near-api-js/lib/utils/format";
const columns = [
  {
    title: "时间",
    dataIndex: "created",
    width: 50,
  },
  {
    title: "投注区间",
    dataIndex: "range",
    width: 25,
  },
  {
    title: "投注金额",
    dataIndex: "deposit",
    width: 18,
  },
  {
    title: "投注号码",
    dataIndex: "number",
    width: 18,
  },
  {
    title: "开奖",
    dataIndex: "win_num",
    width: 30,
    scopedSlots: { customRender: "tags" },
  },
];
const data = [];

export default {
  name: "History",
  data() {
    return {
      data,
      columns,
      history_loading: false,
    };
  },
  mounted() {
    this.history_loading = true;
    window.contract
      .guess_history({
        account_id: window.accountId,
        size: 50,
        offset: 0,
      })
      .then((res) => {
        this.history_loading = false;
        if (res.Ok != null) {
          res.Ok.forEach((record, index) => {
            let tags = ["号码：" + record.win_num];
            if (record.number == record.win_num) {
              tags.push("中奖：" + formatNearAmount(record.reward));
            }
            this.data.push({
              key: index,
              range: "[1," + record.maximum + "]",
              number: record.number,
              /*created: record.created,*/
              created:
                new Date(record.created / 1000000)
                  .toLocaleDateString()
                  .replace(/\//g, "-") +
                " " +
                new Date(record.created / 1000000).toTimeString().substr(0, 8),
              deposit: formatNearAmount(record.deposit),
              win_num: tags,
            });
            console.log(record);
          });
        }
      });
  },
};
</script>
<style></style>

