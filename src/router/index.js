import login from "@/router/modules/login.js";
import user from "@/router/modules/user.js";
import {createRouter, createWebHistory} from "vue-router";


const routers = [
    ...login,
    ...user
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routers
})

export default router

// 路由前置守卫，用来检查路由是否匹配
// router.beforeEach((to, from, next) => {
//     console.log('Navigating to:', to.fullPath);  // 打印目标路径
//     next();  // 必须调用 next() 以继续导航
// });