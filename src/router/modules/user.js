import Index from "@/views/User/index.vue";
import PersonalMessage from "@/views/User/components/PersonalMessage.vue";
import DetectionList from "@/views/User/components/DetectionList.vue";
import Insert from "@/views/User/components/Insert.vue";
import Report from "@/views/User/components/Report.vue";
import exportReport from "@/views/User/components/exportReport.vue";
import Detection2 from "@/views/User/components/Detection2.vue";
export default [
    {
        path: '/',
        component: Index,
        children:[
            {
                path:'',
                component:PersonalMessage
            },
            {
                path: 'detection',
                component:DetectionList
            },
            {
                path: 'insert',
                component: Insert
            },
            {
                path: 'report',
                component: Report
            },
              {
                path: 'exportReport',
                component: exportReport
            },
            {
                path: 'detection2',
                component: Detection2
            }
        ]
    }
]