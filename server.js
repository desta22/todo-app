const express = require('express')
const mongodb = require('mongodb')
const favicon = require('serve-favicon')
const path = require('path')
const sanitizeHtml = require('sanitize-html')
const app = express()
const port = 3000
let db
const connectionString = 'mongodb+srv://todoAppUser:l4sw350Q2XZv9oAD@cluster0.2ye8h.mongodb.net/ToDoApp?retryWrites=true&w=majority'


app.use(favicon(path.join(__dirname, '/', 'edit.png')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    db = client.db()

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})

function passwordProtected (req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Simple to do app"')
    console.log(req.headers.authorization);
    if (req.headers.authorization == "Basic YWRtaW46c2VjcmV0") {
        next()
    } else {
        res.status(401).send('Authentication required')
    }
}

app.use(passwordProtected)

app.get('/', (req, res) => {

    db.collection('items').find().toArray(function (err, items) {

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    
    
        </head>
        <body>
        <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
            <form id="todo_form" action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                <input id="todo_input" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
                </div>
            </form>
            </div>
            
            <ul id="todo_list" class="list-group pb-5">
            </ul>
            
        </div>
        <script>
            let items = ${JSON.stringify(items)}
        </script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="browser.js"></script>
        </body>
        </html>
        `)
    })
})

app.post('/create-item', function (req, res) {
    let safeText = sanitizeHtml(req.body.text, { allowedTags: [], allowedAttributes: [] })
    db.collection('items').insertOne({ text: safeText }, function (err, info) {
        res.json(info.ops[0])
    })
})

app.post('/update-item', function (req, res) {
    let safeText = sanitizeHtml(req.body.text, { allowedTags: [], allowedAttributes: [] })
    db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectID(req.body.id) }, { $set: { text: safeText } }, function () {
        // res.send('Success from update')
        res.send('Success from update')
        // res.redirect('/')
    })
})
app.post('/delete-item', function (req, res) {
    db.collection('items').deleteOne({ _id: new mongodb.ObjectID(req.body.id) }, function () {
        // res.send('Success from update')
        res.send('Item deleted')
        // res.redirect('/')
    })
})

