import request from "@/utils/http.js";

const BASE_URL = "/exportReport";
const user = JSON.parse(localStorage.getItem("user") || '{}');
const token = () =>
  JSON.parse(localStorage.getItem("user") || "{}").token || "";

// 分页获取所有导出记录
export const getAllExportRecords = (page = 1, pageSize = 10) => {
  return request({
    url: `${BASE_URL}/page`,
    method: "GET",
    headers: { Authorization: token() },
    params: { page, pageSize }
  }).then(res => res.data);
};

// // 仅前端测试时使用
// export const getAllExportRecords = (page = 1, pageSize = 10) => {
//   const total = 25;
//   const size = pageSize;
//   const records = Array.from({ length: total }, (_, i) => ({
//     exportId: i + 1,
//     reportId: (i % 5) + 1,
//     userId: `1000000000${(i % 3) + 1}`,
//     exportedAt: new Date(Date.now() - i * 3600 * 1000)

//   }));

//   const start = (page - 1) * pageSize;
//   const paginated = records.slice(start, start + pageSize);

//   return Promise.resolve({
//     data: {
//       total,
//       data: paginated,
//       size,
//       page
//     }
//   });
// };

// 正式：获取某用户导出的记录（分页）
export const getExportByUserId = (userId, page = 1, pageSize = 10) => {
  return request({
    url: `${BASE_URL}/by-userId`,
    method: "GET",
    headers: { Authorization: token() },
    params: { userId, page, pageSize }
  }).then(res => res.data);
};

// 正式：获取某报告被导出的记录（分页）
export const getExportByReportId = (reportId, page = 1, pageSize = 10) => {
  return request({
    url: `${BASE_URL}/by-reportId`,
    method: "GET",
    headers: { Authorization: token() },
    params: { reportId, page, pageSize }
  }).then(res => res.data);
};

