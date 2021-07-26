<template>
<!--  <a  class="btn" @click="addTask">+ Новая задача</a>-->
  <router-link :to="{name:'NewTask'}" class="btn">+ Новая задача</router-link>
  <div class='board' >
    <div class="column"
         v-for="(col, i) in column"
         :key="i"
         @drop="onDrop($event, i)"
         @dragover.prevent
         @dragenter.prevent
    >
      <h3>{{col.title}}</h3>
      <ul>
        <li v-for="(task, i) in col.task"
            :key="i"
            @dragstart="onDragStart($event, task)"
            class="draggable"
            draggable="true">
          <div class="close" @click="deleteTask(task)">X</div>
          <div class="date">{{task.dateCreate}}</div>
          <router-link :to="{name:'TaskPage', params:{id:task.id}}"><h4>{{task.name}}</h4></router-link>
          <p>{{task.description}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import iDB from "@/api/indexedDB";
export default {
  computed:{
    ...mapGetters('board',['column']),
    ...mapGetters('tasks',['tasks']),
  },
  methods: {
    ...mapActions('tasks',['getTasks', 'deleteTaskFromDb', ]),
    ...mapActions('board',['clearColumnTask',"addTask"]),

    //получаем перетаскиваемый Drag and Drop объект
    async onDragStart(e, item) {
      e.dataTransfer.dropEffect='move'
      e.dataTransfer.effectAllowed = 'move';
      await e.dataTransfer.setData('itemId', item.id)
    },

    // Место где отпустили перетаскиваемы объект
    async onDrop(e, col){
      let itemId = e.dataTransfer.getData('itemId')
      let item =  this.tasks.filter(x=>x.id=== +itemId);
      item[0].status = col;
      await iDB.saveTask(JSON.parse(JSON.stringify(item[0])));
      await this.$store.dispatch('tasks/getTasks');
    },

    //удаляем задачу при нажатии на крестик
    async deleteTask(task) {
      await this.$store.dispatch('tasks/deleteTaskFromDb', { task })
      await this.getTasks()
      this.clearColumnTask();
      this.tasks.forEach(item=>{
        this.addTask({value:item, column:item.status})
      })
    }
  },
  created() {

    this.getTasks()
  },
  mounted() {
    //распределяем задачи по колонкам
    setTimeout(()=>{
      this.clearColumnTask();
      this.tasks.forEach(item=>{
        this.addTask({value:item, column:item.status})
      })
    }, 300)
  },
  beforeUpdate() {
    setTimeout(()=>{
      this.clearColumnTask();
      this.tasks.forEach(item=>{
        this.addTask({value:item, column:item.status})
      })
    }, 300)
  }

}
</script>

<style lang="scss" scoped>
.board {
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.column{
  margin: 15px;
  padding: 15px;
  width: 33.33%;
  border: 1px solid black;
  box-sizing: border-box;
  min-height: 208px;
}
ul {
  margin:0;
  padding: 0;
  list-style-type: none;
  li {
    position: relative;
    background-color: #fff;
    cursor: grab;
    border: 1px solid black;
    padding: 10px;
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.date {
  font-size: 12px;
  line-height: 12px;
  color: rgba(0,0,0, .3);
  position: absolute;
  top: 8px;
  right: 30px;
}
.close {
  position: absolute;
  top: 6px;
  right: 7px;
  z-index: 1;
  cursor:pointer;
  &:hover{
    color: red;
  }
}
</style>
