import request from "@/utils/http.js";


const BASE_URL = '/user'
export const login = ({ id, password }) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data: { id, password } 
  })
}



export const register = (data) => {
    return request({
        url: `${BASE_URL}/register`,
        method: 'POST',
        data
    })
}

//仅前端测试时使用
// export const getUserInfo = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         id: "20000000001",
//         name: "测试用户",
//         gender: true,
//         role: 1
//       })
//     }, 300)
//   })
// }




export const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return request({
    url: '/user/info',
    method: 'GET',
    headers: {
      Authorization: user?.token || ''
    }
  })
}

export const updatePassword = (oldPassword, newPassword) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return request({
    url: "/user/updatePassword",
    method: "POST",
    headers: {
      Authorization: user?.token || "",
      "Content-Type": "application/json"
    },
    data: {
      oldPassword,
      newPassword
    }
  });
};
