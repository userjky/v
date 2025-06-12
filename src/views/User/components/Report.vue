<script setup>
import { ref, onMounted } from "vue";
import {
  getAllReports,
  getReportById,
  getReportsBySerial,
  updateReportContent,
  exportReports,
  deleteReports 
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
  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error("查询超时，请稍后重试"));
    }, 3000); // 3 秒后触发超时
  });

  try {
    let fetchPromise;

    if (queryType.value === "id") {
      if (!reportIdQuery.value) return alert("请输入报告ID");
      fetchPromise = getReportById(reportIdQuery.value).then(res => {
        reports.value = [res.data];
        total.value = 1;
      });
    } else if (queryType.value === "serial") {
      if (!serialQuery.value) return alert("请输入序列号");
      fetchPromise = getReportsBySerial(serialQuery.value, page.value, pageSize.value).then(res => {
        reports.value = res.data.data;
        total.value = res.data.total;
      });
    } else {
      fetchPromise = getAllReports(page.value, pageSize.value).then(res => {
        reports.value = res.data.data;
        total.value = res.data.total;
      });
    }

    await Promise.race([fetchPromise, timeoutPromise]); // 竞速超时机制
  } catch (e) {
    alert(e.message || "查询失败，请稍后重试");
  } finally {
    clearTimeout(timeoutHandle); // 如果成功获取数据则取消超时提示
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goPrev() {
  if (page.value > 1) {
    page.value--;
    fetchReports();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

const onDelete = async (reportId) => {
  if (!confirm(`确认删除报告ID ${reportId} 吗？`)) return;
  try {
    const res = await deleteReports([reportId]);
    alert("删除成功");
    fetchReports();
  } catch (e) {
    alert("删除失败：" + (e.response?.data || e.message));
  }
};


// 提交修改
async function onSubmitEdit(report) {
  try {
    const res = await updateReportContent(report.reportId, newContent.value);
    if (res.data === true) {
      report.content = newContent.value;
      editingReportId.value = null;
      alert("修改成功");
    } else {
      alert("修改失败，页面即将刷新");
      location.reload();
    }
  } catch (e) {
    alert("修改异常：" + (e.response?.data || e.message) + "，页面即将刷新");
    location.reload();
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
   <div class="rightMain">
  <div class="insertContainer">
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

  <table class="report-table">
  <thead>
    <tr>
      <th colspan="2">产品</th>
      <th class="action-header">操作</th>
    </tr>
  </thead>
  <tbody>
    <template v-for="report in reports" :key="report.reportId">
      <tr>
        <td colspan="2">
          <div>报告ID：{{ report.reportId }}</div>
          <div>创建时间：{{ report.createdAt }}</div>
          <div>产品序列号：{{ report.serialNumber }}</div>
        </td>
       <td :rowspan="3" class="action-column">
  <div v-if="editingReportId === report.reportId" class="button-group">
    <button @click="onSubmitEdit(report)">确认</button>
  </div>
  <div v-else class="button-group">
    <button @click="onEdit(report)">修改</button>
  </div>
  <div class="button-group">
    <button @click="onExport(report.reportId)" class="yellow-button">导出</button>
  </div>
  <div class="button-group">
    <button @click="onDelete(report.reportId)" class="red-button">删除</button>
  </div>
</td>
      </tr>

      <tr>
        <td><div>正面图：<img :src="report.frontDefectImg" class="img-thumb" /></div></td>
        <td><div>背面图：<img :src="report.backDefectImg" class="img-thumb" /></div></td>
      </tr>

      <tr>
        <td colspan="2">
          <div>内容：</div>
          <div v-if="editingReportId === report.reportId">
            <input v-model="newContent" style="width: 100%;" />
          </div>
          <div v-else>{{ report.content }}</div>
        </td>
      </tr>
    </template>
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

.report-table {
  margin: 0 auto;
  width: 1000px;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: 20px;
  font-size: 14px;
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
  padding: 8px 16px;
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
.yellow-button {
  background-color: #f1c40f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.yellow-button:hover {
  background-color: #d4ac0d;
}

.filterRow {
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
   justify-content: center;
}

.filterRow > div {
  display: flex;
  align-items: center;
  gap: 8px;
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

