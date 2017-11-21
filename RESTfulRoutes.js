//APP CONFIG -- MainDataset and SecondaryDataset link to mongoose models
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var MainDataset = require("./models/MainDataset");
var SecondaryDataset = require("./models/SecondaryDataset");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Landing Page
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX ROUTE
app.get("/data", function(req, res){
        MainDataset.find({}, function(err, foundData){
            if(err){
                console.log(err)
            } else {
                res.render("indexPage", {mainDataset: mainDataset});
            }
        });
});

//NEW ROUTE -- gets form for new data
app.get("/data/new", function(req, res){
   res.render("data/new"); 
});

//CREATEe -- creates new data from new route form
app.post("/data", function(req, res){
   //get data from form and add to campgrounds array
   var name = req.body.dataAttrOne;
   var image = req.body.=dataAttrTwo;
   var desc = req.body.dataAttrThree;
   var newData = {dataAttrOne: dataAttrOne, dataAttrTwo: dataAttrTwo, dataAttrThree: dataAttrThree};
   //create new data and save to mongoose database
   MainDataset.create(newData, function(err, newlyCreatedData){
       if(err){
           console.log(err);
       } else {
           //redirect back to index page
            res.redirect("/data");
       }
   });
});

//SHOW ROUTE - shows a single piece of data, designated by ID
app.get("/datas/:id", function(req, res){
    //find the data with provided ID and include secondary data via references
    mainDataset.findById(req.params.id).populate("secondaryDataset").exec(function(err, foundData){
        if(err){
            console.log(err)
        } else {
            console.log(foundData)
            res.render("data/show", {data: foundData});
        }
    });
})

// ===============
//  SECONDARY DATA ROUTES (e.g. comments referenced in blog posts)
// ===============

//NEW ROUTE -- new form to create secondary data
app.get("/data/:id/secondaryData/new", function(req, res){
    MainDataset.findById(req.params.id, function(err, foundData){
        if(err){
            console.log(err)
        } else {
               res.render("secondaryData/new", {data: foundData}); 
        }
    })
});
//CREATE TROUTE
app.post("/data/:id/secondaryData", function(req, res){
    //find data by id
    MainDataset.findById(req.params.id, function(err, foundData){
    	//handle error
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
        	//create new secondary data
            SecondaryDataset.create(req.body.secondaryData, function(err, newData){
                if(err){
                    console.log(err);
                } else {
                    data.secondary.push(newData);
                    data.save();
                    res.redirect("/data/" + data._id);
                }
            });
        }
    });
})
