<script setup>
import { ref, onMounted } from "vue";
import { getAllExportRecords, getExportByUserId, getExportByReportId } from "@/apis/exportReport.js";

const exportList = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const userId = ref("");
const reportId = ref("");

const fetchAll = async () => {
  const res = await getAllExportRecords(page.value, pageSize.value);
  exportList.value = res.data;
  total.value = res.total;
};

const searchByUserId = async () => {
  if (!userId.value) return;
  const res = await getExportByUserId(userId.value, page.value, pageSize.value);
  exportList.value = res.data;
  total.value = res.total;
};

const searchByReportId = async () => {
  if (!reportId.value) return;
  const res = await getExportByReportId(reportId.value, page.value, pageSize.value);
  exportList.value = res.data;
  total.value = res.total;
};

const onReset = () => {
  userId.value = "";
  reportId.value = "";
  page.value = 1;
  fetchAll();
};

onMounted(() => {
  fetchAll();
});
</script>

<template>
  <div class="insertContainer">
    <div class="filterRow">
      <div>
        <input v-model="userId" placeholder="按用户ID查询">
        <button @click="searchByUserId">查询</button>
      </div>
      <div>
        <input v-model="reportId" placeholder="按报告ID查询">
        <button @click="searchByReportId">查询</button>
      </div>
      <div>
        <button @click="onReset">重置</button>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>导出ID</th>
          <th>报告ID</th>
          <th>管理员ID</th>
          <th>导出时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in exportList" :key="item.exportId">
          <td>{{ item.exportId }}</td>
          <td>{{ item.reportId }}</td>
          <td>{{ item.userId }}</td>
          <td>{{ item.exportedAt }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="page === 1" @click="page-- && fetchAll()">上一页</button>
      <span>第 {{ page }} 页</span>
      <button :disabled="page * pageSize >= total" @click="page++ && fetchAll()">下一页</button>
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
  width: 15em;
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
