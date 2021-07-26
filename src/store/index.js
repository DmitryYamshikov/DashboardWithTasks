import { createStore } from 'vuex'
import tasks from './tasks'
import board from './board'
import taskpage from "@/store/taskpage";
export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    tasks,
    board,
    taskpage
  }
})
