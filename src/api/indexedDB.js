const DB_NAME = 'store'
const STORAGE_NAME = 'tasks'
const DB_VERSION = 1
let DB
export default {
	async getDb () {
		return new Promise((resolve, reject) => {
			if (DB) {
				return resolve(DB)
			}
			const request = window.indexedDB.open(DB_NAME, DB_VERSION)
			request.onerror = e => {
				console.log('Error opening db', e)
				// eslint-disable-next-line prefer-promise-reject-errors
				reject('Error')
			}
			request.onsuccess = e => {
				DB = e.target.result
				resolve(DB)
			}
			request.onupgradeneeded = e => {
				let db = e.target.result
				db.createObjectStore(STORAGE_NAME,{ autoIncrement: true, keyPath: 'id' })
			}
		})
	},
	async deletetask (task) {
		const db = await this.getDb()
		return new Promise(resolve => {
			const trans = db.transaction([STORAGE_NAME], 'readwrite')
			trans.oncomplete = () => {
				resolve()
			}
			const store = trans.objectStore(STORAGE_NAME)
			store.delete(task.id)
		})
	},
	async gettasks () {
		let db = await this.getDb()
		return new Promise(resolve => {
			let trans = db.transaction([STORAGE_NAME], 'readonly')
			trans.oncomplete = () => {
				resolve(tasks)
			}
			const store = trans.objectStore(STORAGE_NAME)
			const tasks = []
			store.openCursor().onsuccess = e => {
				const cursor = e.target.result
				if (cursor) {
					tasks.push(cursor.value)
					cursor.continue()
				}
			}
		})
	},
	async saveTask (task) {
		let db = await this.getDb()
		return new Promise(resolve => {
			let trans = db.transaction([STORAGE_NAME], 'readwrite')
			trans.oncomplete = () => {
				resolve()
			}
			let store = trans.objectStore(STORAGE_NAME)
			store.put(task)
		})
	},
}
