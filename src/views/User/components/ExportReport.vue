<script setup>
import { ref, onMounted } from "vue";
import { getAllExportRecords, getExportByUserId, getExportByReportId } from "@/apis/exportReport.js";

const exportList = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const userId = ref("");
const reportId = ref("");

const currentMode = ref("all");
const loading = ref(false);

// 通用超时封装
async function withTimeout(promise, timeout = 3000) {
  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error("请求超时，请稍后重试")), timeout);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

const fetchAll = async () => {
  loading.value = true;
  try {
    const res = await withTimeout(getAllExportRecords(page.value, pageSize.value));
    exportList.value = res.data.data;
    total.value = res.data.total;
    currentMode.value = "all";
  } catch (e) {
    alert(e.message || "加载失败");
  } finally {
    loading.value = false;
  }
};

const searchByUserId = async () => {
  if (!userId.value) return;
  loading.value = true;
  page.value = 1;
  try {
    const res = await withTimeout(getExportByUserId(userId.value, page.value, pageSize.value));
    exportList.value = res.data.data;
    total.value = res.data.total;
    currentMode.value = "user";
  } catch (e) {
    alert(e.message || "查询失败");
  } finally {
    loading.value = false;
  }
};

const searchByReportId = async () => {
  if (!reportId.value) return;
  loading.value = true;
  page.value = 1;
  try {
    const res = await withTimeout(getExportByReportId(reportId.value, page.value, pageSize.value));
    exportList.value = res.data.data;
    total.value = res.data.total;
    currentMode.value = "report";
  } catch (e) {
    alert(e.message || "查询失败");
  } finally {
    loading.value = false;
  }
};

const onReset = () => {
  userId.value = "";
  reportId.value = "";
  page.value = 1;
  fetchAll();
};

const fetchByMode = () => {
  if (currentMode.value === "user") {
    searchByUserId();
  } else if (currentMode.value === "report") {
    searchByReportId();
  } else {
    fetchAll();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchByMode();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (page.value * pageSize.value < total.value) {
    page.value++;
    fetchByMode();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  fetchAll();
});
</script>


<template>
  <div class="rightMain">
  <div class="insertContainer">
    <div class="filterRow">
      <div>
        <input v-model="userId" placeholder="按用户ID查询" />
        <button @click="searchByUserId">查询</button>
      </div>
      <div>
        <input v-model="reportId" placeholder="按报告ID查询" />
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
        <tr v-if="exportList.length === 0">
          <td colspan="4">暂无数据</td>
        </tr>
        <tr v-for="item in exportList" :key="item.exportId">
          <td>{{ item.exportId }}</td>
          <td>{{ item.reportId }}</td>
          <td>{{ item.userId }}</td>
          <td>{{ new Date(item.exportedAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="page === 1" @click="prevPage">上一页</button>
      <span>第 {{ page }} 页</span>
      <button :disabled="page * pageSize >= total" @click="nextPage">下一页</button>
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
