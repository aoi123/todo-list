const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({//建立schema
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  }
})
module.exports = mongoose.model('Todo', todoSchema)
//匯出的時候我們把這份 schema 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了！