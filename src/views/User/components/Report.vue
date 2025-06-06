<script setup>
import { ref, onMounted } from "vue";
import {
  getAllReports,
  getReportById,
  getReportsBySerial,
  updateReportContent,
  exportReports 
} from "@/apis/report.js";

const reports = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const reportIdQuery = ref("");
const serialQuery = ref("");

const queryType = ref("all");

// 当前正在编辑的 reportId
const editingReportId = ref(null);
const newContent = ref("");

const fetchReports = async () => {
  if (queryType.value === "id") {
    if (!reportIdQuery.value) return alert("请输入报告ID");
    const res = await getReportById(reportIdQuery.value);
    reports.value = [res.data];
    total.value = 1;
  } else if (queryType.value === "serial") {
    if (!serialQuery.value) return alert("请输入序列号");
    const res = await getReportsBySerial(serialQuery.value, page.value, pageSize.value);
    reports.value = res.data.data;
    total.value = res.data.total;
  } else {
    const res = await getAllReports(page.value, pageSize.value);
    reports.value = res.data.data;
    total.value = res.data.total;
  }
};

function onQueryById() {
  queryType.value = "id";
  page.value = 1;
  fetchReports();
}

function onQueryBySerial() {
  queryType.value = "serial";
  page.value = 1;
  fetchReports();
}

function onReset() {
  queryType.value = "all";
  reportIdQuery.value = "";
  serialQuery.value = "";
  page.value = 1;
  fetchReports();
}

function goPrev() {
  if (page.value > 1) {
    page.value--;
    fetchReports();
  }
}

function goNext() {
  const maxPage = Math.ceil(total.value / pageSize.value);
  if (page.value < maxPage) {
    page.value++;
    fetchReports();
  }
}
// 点击修改按钮
function onEdit(report) {
  editingReportId.value = report.reportId;
  newContent.value = report.content;
}
// 提交修改
async function onSubmitEdit(report) {
  const res = await updateReportContent(report.reportId, newContent.value);
  if (res.data === true) {
    report.content = newContent.value;
    editingReportId.value = null;
    alert("修改成功");
  } else {
    alert("修改失败");
  }
}

const onExport = async (reportId) => {
  try {
    const blob = await exportReports([reportId]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${reportId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("导出失败");
  }
};

onMounted(() => {
  fetchReports();
});
</script>

<template>
  
  <div class="insertContainer">
  <div class="reportContainer">
    <div class="filterRow">
      <div>
        <label>报告ID：</label>
        <input v-model="reportIdQuery" type="number" placeholder="请输入报告ID" />
        <button @click="onQueryById">查询</button>
      </div>
      <div>
        <label>序列号：</label>
        <input v-model="serialQuery" type="text" placeholder="请输入产品序列号" />
        <button @click="onQueryBySerial">查询</button>
      </div>
      <div>
        <button @click="onReset">重置</button>
      </div>
    </div>

    <table>
  <thead>
    <tr>
      <th>报告ID</th>
      <th>内容</th>
      <th>创建时间</th>
      <th>正面图</th>
      <th>背面图</th>
      <th>产品序列号</th>
      <th>修改</th>
      <th>导出</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="report in reports" :key="report.reportId">
      <td>
        {{ report.reportId }}
      </td>
      <td>
        <div v-if="editingReportId === report.reportId">
          <input v-model="newContent" style="width: 10em;" />
        </div>
        <div v-else>{{ report.content }}</div>
      </td>
      <td>{{ report.createdAt }}</td>
      <td><img :src="report.frontDefectImg" class="img-thumb" /></td>
      <td><img :src="report.backDefectImg" class="img-thumb" /></td>
      <td>{{ report.serialNumber }}</td>
      <td>
        <div v-if="editingReportId === report.reportId">
          <button @click="onSubmitEdit(report)">确认</button>
        </div>
        <div v-else>
          <button @click="onEdit(report)">修改</button>
        </div>
      </td>
      <td> <button @click="onExport(report.reportId)">导出</button></td>
    </tr>
  </tbody>
</table>


    <div class="pagination">
      <button :disabled="page === 1" @click="goPrev">上一页</button>
      <span>第 {{ page }} 页 / 共 {{ Math.ceil(total / pageSize) }} 页</span>
      <button :disabled="page >= Math.ceil(total / pageSize)" @click="goNext">下一页</button>
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

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 20px;
  font-size: 14px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  word-wrap: break-word;
  vertical-align: middle;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.img-thumb {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

input[type="text"],
input[type="number"] {
  width: 15em;
  padding: 4px;
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
</style>

