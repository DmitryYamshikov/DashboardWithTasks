import iDB from "@/api/indexedDB";
export default {
	namespaced: true,
	state: {
		tasks:[]
	},
	getters: {
		tasks: state=>state.tasks
	},
	mutations: {
		setTasks(state, tasks) {
			state.tasks = tasks
		}
	},
	actions: {
		addTaskToDb ({commit}, {task}) {
			return iDB.saveTask(task)
		},
		async getTasks (store) {
			const tasks = await iDB.gettasks()
			store.commit('setTasks', tasks)
		},
		deleteTaskFromDb ({commit}, {task}) {
			return iDB.deletetask(task)
		}
	}
}
