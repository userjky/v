<script setup>
import { ref, watchEffect, onMounted } from "vue";
import {
  getAllProducts,
  getProductsByUserId,
  getProductsByDefectLevel,
  deleteBySerialNumbers,
} from "@/apis/detection.js";
import { generateReport } from "@/apis/report.js";

const page = ref(1);
const pageSize = ref(10);
const defectLevelQuery = ref("");

const products = ref([]);
const total = ref(0);
const loading = ref(false);
const showImage = ref(false)
const currentImageUrl = ref("")


async function withTimeout(promise, timeout = 3000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("请求超时，请稍后重试")), timeout);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchProducts() {
  if (loading.value) return;
  loading.value = true;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const res = await withTimeout(getProductsByUserId(user.id,page.value, pageSize.value));
    products.value = res.data.data || [];
    total.value = res.data.total || 0;
  } catch (e) {
    alert(e.message || "查询失败，请稍后重试");
  } finally {
    loading.value = false;
  }
}

async function onDefectLevelSearch() {
  if (!defectLevelQuery.value || isNaN(defectLevelQuery.value)) {
    alert("请输入正确的缺陷等级");
    return;
  }
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await withTimeout(getProductsByDefectLevel(Number(defectLevelQuery.value), page.value, pageSize.value));
    products.value = res.data.data || [];
    total.value = res.data.total || 0;
  } catch (e) {
    alert(e.message || "查询失败，请稍后重试");
  } finally {
    loading.value = false;
  }
}
const enlargeImage = (url) => {
  currentImageUrl.value = url
  showImage.value = true
}

function onReset() {
  defectLevelQuery.value = "";
  page.value = 1;
  fetchProducts();
}

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

function onDelete(serialNumber) {
  if (!confirm(`确认删除序列号为 ${serialNumber} 的产品？`)) return;
  deleteBySerialNumbers([serialNumber])
    .then(() => {
      alert("删除成功");
      fetchProducts();
    })
    .catch((err) => {
      alert("删除失败：" + (err.response?.data || err.message));
    });
}

// 避免 watchEffect 重复请求
let firstLoad = true;
watchEffect(() => {
  if (firstLoad) {
    firstLoad = false;
    return;
  }
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
});
</script>


<template>
  <div class="rightMain">
  <div class="insertContainer">
    <div class="detectionList">
      <div class="filterRow">
        <div>
          <label>缺陷等级查询：</label>
          <input
            v-model.number="defectLevelQuery"
            type="number"
            min="1"
            placeholder="请输入缺陷等级"
            style="width: 15em;"
          />
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
            <th>生成报告</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.serialNumber">
            <td>{{ item.serialNumber }}</td>
            <td> <img :src="item.frontImage"alt="正面"class="img-thumb"@click="enlargeImage(item.frontImage)"/></td>
            <td><img :src="item.backImage"alt="背面"class="img-thumb"@click="enlargeImage(item.backImage)"/></td>

            <td>{{ item.userId }}</td>
            <td>{{ item.defectLevel }}</td>
            <td><button @click="onGenerateReport(item)" class="green-button">生成报告</button></td>
            <td><button @click="onDelete(item.serialNumber)" class="red-button">删除</button></td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="7" style="text-align:center;">暂无数据</td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button :disabled="page === 1" @click="page--">上一页</button>
        <span>第 {{ page }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页</span>
        <button :disabled="page >= Math.ceil(total / pageSize)" @click="page++">下一页</button>
      </div>
    </div>
    <div v-if="showImage" class="modal-overlay" @click="showImage = false">
  <img :src="currentImageUrl" class="modal-image" />
</div>

  </div>
  </div>
</template>

<style scoped>
.rightMain {
  flex: 1;        
   padding: 20px 50px 20px 350px;
  box-sizing: border-box;
  overflow-y: auto;
}
.insertContainer {
  width: 100%;          
  height: 100%;         
  padding: 20px 0 0 0;  
  box-sizing: border-box;
  overflow-y: auto;     
}


.filterRow {
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.filterRow > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: zoom-out;
}

.modal-image {
  max-width: 80%;
  max-height: 80%;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
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
.red-button {
  background-color: red;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.red-button:hover {
  background-color: darkred;
}
.green-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.green-button:hover {
  background-color: #1e8449;
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
  max-width: 130px;
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
