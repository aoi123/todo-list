// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
const PORT = process.env.PORT || 3000 //給預設值3000避免undefined
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/todo-list'//給預設本地端的資料庫連線值

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const Todo = require('./models/todo') // 載入 Todo model

//設定樣板引擎
const exphbs = require('express-handlebars');

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))//建立名為hbs的樣板引擎，並傳入exphbs與相關參數
app.set('view engine', 'hbs')//啟用樣板引擎hbs

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
//db.on()：在這裡用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生
//語法的意思是「只要有觸發 error 就印出 error 訊息」。
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
//db.once() - 針對「連線成功」的 open 情況，我們也註冊了一個事件監聽器
//相對於「錯誤」，連線成功只會發生一次，所以這裡特地使用 once，由 once 設定的監聽器是一次性的，一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongodb connected!')
})


///引用 body-parser
const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
  .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
  .then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
  .catch(error => console.error(error)) // 錯誤處理
})

// 設定 port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

//設定新增頁面路由
app.get('/todos/new', (req, res) => {
    return res.render('new')
  })

//POST(CRUD 裡的 Create)
app.post('/todos', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

//新增details路由
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

//新增edit路由
app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id //擷取網頁上的id
  return Todo.findById(id)//用id找特定TODO
    .lean()
    .then((todo) => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

//EDIT 可和create的語法相互比較
app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id//拿id
  const name = req.body.name//拿name
  return Todo.findById(id)//用id找出特定todo
    .then(todo => {
      todo.name = name//if查詢成功，就將todo的名字改為修改後的資料
      return todo.save()//針對這一筆資料進行儲存，而非向create一樣操作整份資料
      //(因為搭配的資料操作是 Todo.findById，這個方法只會返回一筆資料，所以後面需要接 todo.save())
    })
    .then(()=> res.redirect(`/todos/${id}`))//if儲存成功，則導回該筆資料首頁
    .catch(error => console.log(error))
})

