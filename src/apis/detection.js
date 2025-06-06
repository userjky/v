import request from "@/utils/http.js";

const BASE_URL  = '/detection'

export const insertProductData = (formData) => {
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  return request({
    url: '/detection/insert-image',
    method: 'POST',
    headers: {
      'Authorization': user.token || ''
    },
    data: formData
  });
};


// //仅前端测试时使用
// export const getAllProducts = (page = 1, pageSize = 10) => {
//   const total = 25;
//   const products = Array.from({ length: total }, (_, i) => ({
//     serialNumber: `SN-${i + 1}`,
//     frontImage: `/Background.png`,
//     backImage: `/Background.png`,
//     userId: `user-${(i % 5) + 1}`,
//     defectLevel: (i % 3) + 1
//   }));

//   const start = (page - 1) * pageSize;
//   const paginated = products.slice(start, start + pageSize);

//   return Promise.resolve({
//     data: {
//       data: paginated,
//       total
//     }
//   });
// };


export const getAllProducts = (page = 1, pageSize = 10) => {
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  return request({
    url: `${BASE_URL}/all`,
    method: "GET",
    headers: { Authorization: user.token || "" },
    params: { page, pageSize },
  });
};


export const getProductsByUserId = (userId, page = 1, pageSize = 10) => {
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  return request({
    url: `${BASE_URL}/by-user`,
    method: "GET",
    headers: { Authorization: user.token || "" },
    params: { userId, page, pageSize },
  });
};

export const getProductsByDefectLevel = (defectLevel, page = 1, pageSize = 10) => {
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  return request({
    url: `${BASE_URL}/by-defectlevel`,
    method: "GET",
    headers: { Authorization: user.token || "" },
    params: { defectLevel, page, pageSize },
  });
};


export const updateDefectLevel = (data) => {
    return request({
        url: `${BASE_URL}/update`,
        method: 'POST',
        data
    })
}

export const findProductBySerialNumber = (serialNumber) => {
    return request({
        url: `${BASE_URL}/findProduct/${serialNumber}`,
        method: 'GET'
    })
}

export const findSerialNumberByUserId = (userId) => {
    return request({
        url: `${BASE_URL}/findByUserId/${userId}`,
        method: 'GET'
    })
}