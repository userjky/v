import request from "@/utils/http.js";

const token = () => JSON.parse(localStorage.getItem("user") || "{}").token || "";

// 获取分页导出记录
export const getAllExportRecords = (page = 1, pageSize = 10) => {
  return fetch(`/exportReport/page?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: token()
    }
  }).then(res => res.json());
};

// 查询某管理员导出的报告记录
export const getExportByUserId = (userId, page = 1, pageSize = 10) => {
  return fetch(`/exportReport/by-userId?userId=${userId}&page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: token()
    }
  }).then(res => res.json());
};

// 查询某报告被导出的记录
export const getExportByReportId = (reportId, page = 1, pageSize = 10) => {
  return fetch(`/exportReport/by-reportId?reportId=${reportId}&page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: token()
    }
  }).then(res => res.json());
};
