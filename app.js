import express from 'express';
import bodyParser from 'body-parser';
import { getDate, getDay } from './date.js';
import mongoose from 'mongoose';
import _ from 'lodash';

const app = express()
const port = 3000
const day = getDate();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema = {
    name: String
}
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist"
})

const item2 = new Item({
    name: "Hit the + button to add new item"
})
const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemSchema]
}
const List = mongoose.model("List", listSchema);

app.get('/', (req, res) => {

    Item.find({})
        .then((foundItems) => {
            if(foundItems.length == 0){
                Item.insertMany(defaultItems)
                  .then(() => {
                    console.log("Successfully saved default items to DB.");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                res.redirect("/");
            }else{
                res.render('list', { listTitle: day ,  newListItems: foundItems});
            }
         })
        .catch((err) => {
             console.log(err);
        });

})

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName,
    })
    if(listName === day ){
        item.save();
        res.redirect("/")
    }else{
        List.findOne({name: listName})
        .then((foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })

    }
   
})

app.post("/delete", function(req, res) {
    const checkedItemId= req.body.checkbox;
    const listName = req.body.listName;
    if(listName === day){
        Item.findByIdAndRemove(checkedItemId)
        .then(() => {
            console.log("Successfully deleted checked item");
            res.redirect("/")
          })
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        .then((foundList) => {
                res.redirect("/" + listName);
          })
    }
})
app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    if (customListName === "favicon.ico") return;
    List.findOne({name: customListName })
        .then((foundList) => {
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                   items: defaultItems
               })

               list.save()
               res.redirect("/" + customListName)
            }else{
                //Show an existing list
                res.render('list', { listTitle: foundList.name ,  newListItems: foundList.items});

            }

             
        })
        .catch((err) => {
            console.log(err);
        });
        
   
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})