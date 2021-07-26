import { createRouter, createWebHistory } from 'vue-router'
import NewTask from "@/views/NewTask";
import Board from "@/components/Board";
import TaskPage from "@/views/TaskPage";
const routes = [
  {
    path: '/',
    name: 'Board',
    component: Board
  },
  {
    path: '/NewTask',
    name: 'NewTask',
    component: NewTask
  },
  {
    path: '/:id',
    name: 'TaskPage',
    component: TaskPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
