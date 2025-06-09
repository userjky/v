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
    frontDefectImg: "/Background.png",
    backDefectImg: "/Background.png",
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

export const updateReportContent = (reportId, content) => {
  return Promise.resolve({ data: true });
};

// 导出报告为 CSV
export const exportReports = (reportIds) => {
  return fetch("/report/export", {
    method: "POST",
    headers: {
      Authorization: token()
    },
    body: JSON.stringify(reportIds)
  }).then(res => res.blob());
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
