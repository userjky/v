<script setup>
import { ref, reactive, watchEffect, onMounted } from "vue";
import { getAllProducts, getProductsByUserId, getProductsByDefectLevel } from "@/apis/detection.js";
import { generateReport } from "@/apis/report.js";

const page = ref(1);
const pageSize = ref(10);

const userIdQuery = ref("");
const defectLevelQuery = ref("");

const products = ref([]);
const total = ref(0);

const loading = ref(false);

// 记录当前查询类型，默认是查询所有
const queryType = ref("all");

// 分页查询
async function fetchProducts() {
  loading.value = true;
  try {
    let res;
    if (queryType.value === "userId") {
      if (!userIdQuery.value.trim()) {
        alert("请输入工号进行查询");
        loading.value = false;
        return;
      }
      res = await getProductsByUserId(userIdQuery.value.trim(), page.value, pageSize.value);
    } else if (queryType.value === "defectLevel") {
      if (!defectLevelQuery.value || isNaN(defectLevelQuery.value)) {
        alert("请输入正确的缺陷等级");
        loading.value = false;
        return;
      }
      res = await getProductsByDefectLevel(Number(defectLevelQuery.value), page.value, pageSize.value);
    } else {
      // all
      res = await getAllProducts(page.value, pageSize.value);
    }
    products.value = res.data.data || [];
    total.value = res.data.total || 0;
  } catch (e) {
    alert("查询失败，请稍后重试");
  } finally {
    loading.value = false;
  }
}

//点击生成报告
function onGenerateReport(item) {
  generateReport(item)
    .then((res) => {
      if (res === true || res.data === true) {
        alert(`序列号 ${item.serialNumber} 报告生成成功`);
      } else {
        alert("生成失败");
      }
    })
    .catch(() => {
      alert("生成请求出错");
    });
}

// 点击工号查询按钮
function onUserIdSearch() {
  queryType.value = "userId";
  page.value = 1;
  fetchProducts();
}

// 点击缺陷等级查询按钮
function onDefectLevelSearch() {
  queryType.value = "defectLevel";
  page.value = 1;
  fetchProducts();
}

// 重置查询，显示全部
function onReset() {
  queryType.value = "all";
  userIdQuery.value = "";
  defectLevelQuery.value = "";
  page.value = 1;
  fetchProducts();
}

// 监听页码变化，触发请求
watchEffect(() => {
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="insertContainer">
  <div class="detectionList">
    <div class="filterRow">
      <div>
        <label>工号查询：</label>
        <input v-model="userIdQuery" type="text" placeholder="请输入工号"style="width: 15em;" />
        <button @click="onUserIdSearch">查询</button>
      </div>
      <div>
        <label>缺陷等级查询：</label>
        <input v-model.number="defectLevelQuery"type="number"min="1"placeholder="请输入缺陷等级"style="width: 15em;"/>
        <button @click="onDefectLevelSearch">查询</button>
      </div>
      <div>
        <button @click="onReset">重置</button>
      </div>
    </div>

    <table class="productTable">
      <thead>
        <tr>
          <th>序列号</th>
          <th>正面图片</th>
          <th>背面图片</th>
          <th>工号</th>
          <th>缺陷等级</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.serialNumber">
          <td>{{ item.serialNumber }}</td>
          <td><img :src="item.frontImage" alt="正面" class="img-thumb" /></td>
          <td><img :src="item.backImage" alt="背面" class="img-thumb" /></td>
          <td>{{ item.userId }}</td>
          <td>{{ item.defectLevel }}</td>
          <td><button @click="onGenerateReport(item)">生成报告</button></td>
        </tr>
        <tr v-if="products.length === 0">
          <td colspan="5" style="text-align:center;">暂无数据</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="page === 1" @click="page--">上一页</button>
      <span>第 {{ page }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页</span>
      <button :disabled="page >= Math.ceil(total / pageSize)" @click="page++">下一页</button>
    </div>
  </div>
  </div>
</template>

<style scoped>
.insertContainer {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.filterRow {
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.filterRow > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

input[type="text"],
input[type="number"] {
  width: 120px;
  padding: 5px 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 8px 20px;
  font-size: 14px;
  background-color: royalblue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1a4dbb;
}

button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  word-wrap: break-word;
}

.img-thumb {
  max-width: 150px;
  max-height: 120px;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 14px;
}

</style>
