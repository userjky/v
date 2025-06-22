import request from "@/utils/http.js";

const token = () => JSON.parse(localStorage.getItem("user") || "{}").token || "";

export const generateReport = (item) => {
  return request({
    url: "/report/add",
    method: "POST",
    data: {
      content: "PCB缺陷检测报告",
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "), 
      frontDefectImg: item.frontImage,
      backDefectImg: item.backImage,
      serialNumber: item.serialNumber
    }
  });
};


// 仅前端测试时使用
export const getAllReports = (page = 1, pageSize = 10) => {
  const total = 23;
  const reports = Array.from({ length: total }, (_, i) => ({
    reportId: i + 1,
    content: `报告内容概要${i + 1}`,
    createdAt: `2025-06-${(i % 30) + 1} 10:00:00`,
    frontDefectImg: "/image.png",
    backDefectImg: "/image.png",
    serialNumber: `product-${(i % 10) + 1}`
  }));

  const start = (page - 1) * pageSize;
  const paginated = reports.slice(start, start + pageSize);

  return Promise.resolve({
    data: {
      data: paginated,
      total
    }
  });
};



// export const getAllReports = (page = 1, pageSize = 10) => {
//   return request({
//     url: "/report/page",
//     method: "GET",
//     headers: { Authorization: token() },
//     params: { page, pageSize }
//   });
// };

export const getReportById = (reportId) => {
  return request({
    url: `/report/${reportId}`,
    method: "GET",
    headers: { Authorization: token() }
  });
};

export const getReportsBySerial = (serialNumber, page = 1, pageSize = 10) => {
  return request({
    url: "/report/by-serial",
    method: "GET",
    headers: { Authorization: token() },
    params: { serialNumber, page, pageSize }
  });
};


// //仅前端测试时使用
// export const updateReportContent = (reportId, content) => {
//   return Promise.resolve({ data: true });
// };

export const updateReportContent = (reportId, content) => {
  return request({
    url: "/report/change",
    method: "PUT",
    headers: {
      Authorization: token(),
      "Content-Type": "application/json"
    },
    data: {
      reportId,
      content
    }
  });
};


// 导出报告为 CSV
export const exportReports = (reportIds) => {
  const payload = JSON.stringify(reportIds);
  console.log("导出请求 reportIds:", reportIds);
  console.log("导出请求 JSON.stringify 后内容:", payload);

  return fetch("/report/export", {
    method: "POST",
    headers: {
      Authorization: token(),
      "Content-Type": "application/json" // 建议加上，明示是 JSON
    },
    body: payload
  }).then(res => {
    console.log("fetch 返回响应对象:", res);
    if (!res.ok) {
      throw new Error(`导出失败，状态码：${res.status}`);
    }
    return res.blob();
  });
};


export const deleteReports = (reportIds) => {
  return request({
    url: "/report/by-reportId",
    method: "DELETE",
    headers: {
      Authorization: token(),
      "Content-Type": "application/json"
    },
    data: reportIds
  });
};
