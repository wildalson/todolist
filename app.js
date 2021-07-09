require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
// const ejsLint = require("ejs-lint");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const personalDate = require(__dirname+ "/date.js");

mongoose.set('useFindAndModify', false);


mongoose.connect(process.env.MONGO_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true }, function()
{
	console.log("succesfully conneced to mongodb atlas");
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const itemSchema = new mongoose.Schema({name:String});
const Item = mongoose.model("Item", itemSchema);

// const workSchema = new mongoose.Schema({name:String});
// const WorkItem = mongoose.model("WorkItem", workSchema);

// const listSchema = new mongoose.Schema({name: String, listType: [listSchema]});
// const List = mongoose.model("List", listSchema);
const listSchema = {
	name: String,
	items: [itemSchema]
};
const List = mongoose.model("List", listSchema);
const listItems = [];

const item1 = new Item({name: "Eat breakfast"});
const item2 =  new Item({name: "Get a project done"});
const item3 = new Item({name: "Sleep early"});
var defaultItems = [item1, item2, item3];
// var defaultItems = [{name: "Calculate amortization"}, {name: "Wake up early"}, {name:"Finish this course in 2 weeks"}];
var workList = [];
app.get("/", function(req, res)
{
	console.log("111");
	let day = personalDate.getDate();
	Item.find({}, function(err, foundItems)
	{
		
		if(foundItems.length === 0)
		{
			
			Item.insertMany(defaultItems,function(err)
			{
				if(err) throw err;
				else
				{
					console.log("successfully added the default items into the database");
				}
			});
			res.redirect("/");
		}
		else{
			res.render("list", {headingTitle:"ToDoList",noToday:day, newItemAdded: foundItems});
		}
		
	});
});





app.post("/", function(req, res)
{
	const whichPage = req.body.list;
	let userItem = req.body.newItem;
	const newItem = new Item({
		name: userItem
	})
	if(whichPage === "ToDoList")
	{
		newItem.save();
		res.redirect("/");
	}
	else{
		List.findOne({name:whichPage}, function(err, foundList)
		{
			
			foundList.items.push(newItem);
			foundList.save();
			res.redirect("/"+whichPage);
		});
	}
});

app.post("/delete", function(req,res)
{
	const checkboxId = req.body.checkbox;
	const whichPage = req.body.page;

	console.log(whichPage);
	if(whichPage === "ToDoList")
	{
		console.log("true");
		Item.deleteOne({_id:checkboxId}, function(err)
		{
			if (err) throw err;
			else{
				console.log("succesfully deleted the id");
				res.redirect("/");
			}
		});
	}
	else{
		List.findOneAndUpdate({name: whichPage}, {$pull:{items:{_id:checkboxId}}}, function(err, foundLists)
		{
			if(!err)
			{
				res.redirect("/"+whichPage);
			}
		});
	}
});	

app.get("/:setPage", function(req,res)
{  
	let day =  personalDate.getDate();
	const customList = _.capitalize(req.params.setPage); 
	const list = new List({
		name: customList,
		items: defaultItems
	});
	List.findOne({name: customList},function(err, foundList)
	{
		
		if(!foundList)
		{
			const list = new List({
				name: customList,
				items: defaultItems
			});
			list.save(function(err)
			{
				if(err) throw err;
				else{
					console.log("succesfully saved");
					// res.redirect("/"+customList);
					res.redirect("/"+customList);
				}
			});
		}else{
			res.render("list", {headingTitle:foundList.name,noToday:day, newItemAdded:foundList.items });	
		}
	});
	
});
app.get("/about", function(req, res)
{
	let day = personalDate.getDate();
	res.render("about", {noToday:day, headingTitle:"about page"});
});
app.listen(3000, function()
{
	console.log("app running on port 3000");
});







