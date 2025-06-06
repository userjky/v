import Login from "@/views/Login/components/Login.vue";
import Index from "@/views/Login/index.vue"
import Register from "@/views/Login/components/Register.vue";

export default [
    {
        path:'/login',
        component: Index,
        children:[
            {
                path:'',
                component: Login
            },
            {
                path:'register',
                component: Register
            }
        ]
    }
]