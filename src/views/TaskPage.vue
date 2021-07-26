<template>
  <h1>Редактирование задачи</h1>
  <form class="form">
    <div class="form__row">
      <label>
        <span>Название</span>
        <input type="text" :value="oneTask.name" @input="setTaskParam({param:'name', value:$event.target.value})">
      </label>
    </div>
    <div class="form__row">
      <label>
        <span>Описание</span>
        <textarea :value="oneTask.description" @input="setTaskParam({param:'description', value:$event.target.value})"></textarea>
      </label>
    </div>
    <div class="form__row">
      <label>
        <span>Автор</span>
        <input type="text" :value="oneTask.author" @input="setTaskParam({param:'author', value:$event.target.value})">
      </label>
    </div>
    <div class="form__row">
      <div>
        Текущий статус: {{oneTask.status}}
      </div>
    </div>
    <div class="form__row">
      <div>Создана: {{oneTask.dateCreate}}</div>
    </div>
    <div class="form__row" v-if="oneTask.dateStart">
      <div>Начало выполнения: {{oneTask.dateStartVision}}</div>
    </div>
    <div class="form__row" v-if="oneTask.dateComplete">
      <div>Завершено: {{oneTask.dateCompleteVision}}</div>
    </div>
    <div class="form__row" v-if="oneTask.duration">
      <div>Затрачено времени: {{oneTask.duration}}</div>
    </div>
    <div class="error" v-if="valid">запоните все поля</div>
    <div class="form__row form__row_btns">
      <button class="btn" @click="saveChanges($event, oneTask)" :disabled="valid">Сохранить</button>
      <button class="btn" @click="getComplete($event)" v-if="oneTask.dateStart&&!oneTask.dateComplete">Завершить</button>
      <button class="btn btn_green" @click="getStart($event)" v-if="!oneTask.dateStart">Начать</button>
      <button class="btn btn_red" @click="deleteTask($event, oneTask)">Удалить</button>
    </div>
  </form>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import iDB from "@/api/indexedDB";
import router from "@/router";
import dateFormat from "@/api/dateFormat";
export default {
  name: "TaskPage",
  computed: {
    ...mapGetters('taskpage',['oneTask']),
    calcDuration(){
      let time = Math.ceil(this.oneTask.duration/6000)
      return `${time} мин`
    },
    valid(){
      return !(this.oneTask.name && this.oneTask.description && this.oneTask.author);
    }

  },
  methods: {
    ...mapActions('taskpage',['getTask', 'setTaskParam']),
    getStart(e){
      e.preventDefault();
      let date = new Date();
      let dateVision = dateFormat(date);
      this.setTaskParam({value: dateVision, param:'dateStartVision'})
      this.setTaskParam({value: date, param:'dateStart'})
      this.setTaskParam({value:'inWork', param:'status'})
      console.log(Date.parse(this.oneTask.dateStart))
    },
    getComplete(e) {
      e.preventDefault();
      let date = new Date();
      let dateVision = dateFormat(date);
      this.setTaskParam({value: dateVision, param:'dateCompleteVision'})
      this.setTaskParam({value: date, param:'dateComplete'})
      this.setTaskParam({value:'complete', param:'status'})
      let duration = (Date.parse(this.oneTask.dateComplete) - Date.parse(this.oneTask.dateStart))/60000
      let durationMin = `${Math.ceil(duration)} мин`
      this.setTaskParam({value:durationMin, param:'duration'})
    },
    async deleteTask(e, task) {
      e.preventDefault();
      await this.$store.dispatch('taskpage/deleteTaskFromDb', { task })
      await this.$store.dispatch('tasks/getTasks')
      await router.push({name:'Board'})
    },
    async saveChanges(e, task){
      e.preventDefault();
      if(this.oneTask.name && this.oneTask.description && this.oneTask.author){
        let obj = JSON.parse(JSON.stringify(task))
        await iDB.saveTask(obj);
        await this.$store.dispatch('tasks/getTasks');
        await router.push({name:'Board'});
      }
    },
    calcTime(){
      if (this.oneTask.dateStart && !this.oneTask.dateComplete) {
        let time;
        let now = new Date()
        time = Date.parse(now.toString()) - Date.parse(this.oneTask.dateStart)
        time= `${Math.ceil(time/60000)} мин`
        this.setTaskParam({value:time, param:'duration'})
      }
    }
  },
  created(){

  },
  mounted() {
    this.getTask(this.$route.params.id)
    this.calcTime();
    setInterval(()=>this.calcTime(), 10000)
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 20px;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 400px;
  &__row {
     margin-bottom: 15px;
  }
  label {
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
  }
  span {
    margin-bottom: 10px;
  }
  input[type='text'] {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid grey;
  }
  textarea {
    padding: 10px;
    resize: none;
    height: 150px;
    border-radius: 5px;
  }
}
.error {
  color:red;
}
</style>
