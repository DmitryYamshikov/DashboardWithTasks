export default {
	namespaced: true,
	state: {
		column: {
			create: {
				title: 'Создано',
				task:[]
			},
			inWork:{
				title:'В работе',
				task:[]
			},
			complete:{
				title:'Завершена',
				task:[]
			}
		},
	},
	getters: {
		column: state=>state.column
	},
	mutations: {
		clearColumnTask(state) {
			for (let item in state.column) {
				state.column[item].task = []
			}
		},
		addTask(state, {value, column}) {
			state.column[column].task.push(value)
		}
	},
	actions: {
		clearColumnTask({commit}) {
			commit('clearColumnTask')
		},
		addTask({commit},{value, column}) {
			commit('addTask', {value,column})
		}
	}
}
