var express = require("express");
var router  = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware"); //no need to specify index, because it is default aname for a file inside a dir

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var username = req.user.username;
    var userid = req.user._id;
    

    var newCampground = {name: name, price:price, image: image, description: desc};
    

    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            newlyCreated.author.id = userid;
            newlyCreated.author.username = username;
            newlyCreated.save();
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found!");
            res.redirect("back");
            
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//Edit ROUTE

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){


            res.render("campgrounds/edit", {campground: req.campground});
              

});


//Update route

router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    
    //find and update correct camp
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        
        if(err){
            
            res.redirect("/campgrounds");
        } else{
            //can also use req.params.id instead of updatedCampground._id
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
    
    //redirect to show of that camp
    
});

//DESTROY ROUTE!!

router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    
   Campground.findByIdAndRemove(req.params.id, function(err){
       
       if(err){
           res.redirect("/campgrounds");
       }else{
           
           res.redirect("/campgrounds");
       }
   }); 
});



module.exports = router;
