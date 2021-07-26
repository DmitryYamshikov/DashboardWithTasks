import iDB from "@/api/indexedDB";
export default {
	namespaced: true,
	state: {
		oneTask:[]
	},
	getters: {
		oneTask: state=>state.oneTask
	},
	mutations: {
		setTask(state, oneTask) {
			state.oneTask = oneTask
		},
		setTaskParam(state, {value, param}) {
			state.oneTask[param] = value
		}
	},
	actions: {
		async getTask ({commit}, key) {
			const tasks = await iDB.gettasks()
			const filterTasks = await tasks.filter((item)=>{
				return item.id === +key;
			})
			commit('setTask', filterTasks[0])
		},
		deleteTaskFromDb ({commit}, {task}) {
			return iDB.deletetask(task)
		},
		setTaskParam({commit}, {value, param}) {
			commit('setTaskParam', {param, value})
		}
	}
}
