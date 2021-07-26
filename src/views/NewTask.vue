<template>
  <h1>Создание задачи</h1>
  <form class="form">
    <div class="form__row">
      <label>
        <span>Название*</span>
        <input type="text" v-model="newTask.name" required>
      </label>
    </div>
    <div class="form__row">
      <label>
        <span>Описание*</span>
        <textarea v-model="newTask.description" required></textarea>
      </label>
    </div>
    <div class="form__row">
      <label>
        <span>Автор*</span>
        <input type="text" v-model="newTask.author" required>
      </label>
    </div>
    <div class="error" v-if="valid">Заполните все поля</div>
    <button class="btn" :disabled='valid' @click="addTask($event)">Создать задачу</button>
  </form>
</template>

<script>
import {mapActions} from 'vuex';
import router from "@/router";
import dateFormat from "@/api/dateFormat";
export default {
  name: "NewTask",
  data: ()=>({
    newTask: {
      name:null,
      description: null,
      author: null,
      dateStart:'',
      dateCreate: '',
      dateComplete:'',
      dateStartVision:'',
      dateCreateVision: '',
      dateCompleteVision:'',
      duration:'',
      status:'create',
    }
  }),
  methods: {
    ...mapActions('tasks',['addTaskToDb','getTasks']),

    async addTask (e) {
      e.preventDefault();
      if (this.newTask.name && this.newTask.description && this.newTask.author) {
        const date = new Date();
        this.newTask.dateCreate = dateFormat(date);
        const task = JSON.parse(JSON.stringify(this.newTask));
        await this.addTaskToDb({ task });
        await this.getTasks();
        await router.push({name:'Board'})
      }
    }
  },
  computed: {
    valid(){
      return !(this.newTask.name && this.newTask.description && this.newTask.author);
    }
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
  }
</style>
