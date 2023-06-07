const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')

const app = express()
const port = 3000

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

app.get('/', (req, res) => {

    const day = date.getDate()
   
    res.render('list', { listTitle: day ,  newListItems: items});

})

app.post("/", function(req, res) {
    const item = req.body.newItem;
    console.log(req.body);
    if(req.body.list === "Work List"){
        workItems.push(item);
        res.redirect("/work")
    }else{
        items.push(item);
        res.redirect("/")
    }
})


app.get("/work", function(req, res) {
    res.render('list', { listTitle: "Work List" ,  newListItems: workItems});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})