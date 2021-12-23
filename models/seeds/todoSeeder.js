const mongoose = require('mongoose')
const Todo = require('../todo') // 載入 todo model
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })//Todo:之前我們在todo.js建立了一個叫 Todo 的 model 物件，model有很多可以用方法
  }
  console.log('done')
})