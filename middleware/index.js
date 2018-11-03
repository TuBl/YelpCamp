var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
var middlewareObj = {};


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
       Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err || !foundComment){
              req.flash("error", "Sorry comment doesn't exist");
              res.redirect("back");
          }else{
              //You can't use == or === because the req.param.id is a String while the foundCampground.author.id is a mongoose obj, use .equal method!!
              if(foundComment.author.id.equals(req.user._id)){
                req.comment = foundComment;  
                next();
              }else{
                  //if logged in but not the owner, display error
                  req.flash("error", "You dont have permission to do that!");
                  res.redirect("back");
              }
          } 
       });       
    }else{
        //takes user back to where they came from (previous page)
        //if not logged in, display error then redirect back
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
  
}



middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
       Campground.findById(req.params.id, function(err, foundCampground){
          if(err || !foundCampground){
              //most likelyt would never see this :'(
              req.flash("error", "Campground not found.. try again!");
              res.redirect("back");
          }else{
              //You can't use == or === because the req.param.id is a String while the foundCampground.author.id is a mongoose obj, use .equal method!!
              if(foundCampground.author.id.equals(req.user._id)){
                req.campground = foundCampground;  
                next();
              }else{
                  req.flash("error", "You dont have permission to do that!");   
                  res.redirect("back");
              }
          } 
       });       
    }else{
        //if user is not authenticated
        //display error message
        req.flash("error", "You need to be logged in to do that");
        //takes user back to where they came from (previous page)
        res.redirect("back");
    }
    
    
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that" );
    res.redirect("/login");
}




module.exports = middlewareObj;