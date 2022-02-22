const upload = require("../middleware/upload");
const Recent = require('../models/recent.model.js');
const Category = require('../models/category.model.js');
const Task = require('../models/task.model.js');
const Favorite = require('../models/favorite.model.js');
const User=require('../../models/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const _ = require('underscore');
const date = require('date-and-time')
const createFavorite = async (req, res) => {
console.log("61f0dec971670423bc10fbfa === ",)

if(!req.params.taskId) {
        return res.status(400).send({
            message: "Tasks name can not be empty"
        })
}
if(!req.body.userid) {
        return res.status(400).send({
            message: "userid can not be empty"
        })
}
if(!req.body.isFavorite) {
        return res.status(400).send({
            message: "isFavorite can not be empty"
        })
}



     var isgetFavorite="";
 if(req.body.isFavorite==1){
            isgetFavorite=true;
     }
 if(req.body.isFavorite==0){
        isgetFavorite=false;
     }
     var favorite = new Favorite({
        taskId:req.params.taskId,
        userid:req.body.userid
    });
let tsid=ObjectId(req.params.taskId);
console.log("req.params.taskId  ", tsid)

await Favorite.findOne({taskId: tsid},  function(err, favdata) {
   
      //console.log("??bbb?? ", typeof favdata) 
      // console.log("??err>>>>?? ",( err) )
if( favdata!=null){
  console.log("nn>>>>>n>>> ",favdata)
    Task.updateOne({_id: (req.params.taskId)},{$set:{"isFavorite":isgetFavorite}}).then(fddd => {
      
        if(!fddd) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.taskId
            });
        }
      res.send({"status":200,"message":"successfull000y..","data":isgetFavorite});
        /*res.send(
            {
                "status":200,
                "message":"favorite successfully",
                "data":taskupdate
           }
    );*/
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.taskId
        });

    });


//console.log("favdata ",favdata)
}else{
 console.log("nnnmmmmmmmmmmmmm/> ",favdata)
  favorite.save()
    .then(data => {

            Task.updateOne({_id: req.params.taskId},{$set:{"isFavorite":isgetFavorite}}).then(note => {
        //console.log("nnn ",note)
        if(!note) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.taskId
            });
        }
        res.send({"status":200,"message":"successfully","data":favorite});
        /*res.send(
            {
                "status":200,
                "message":"favorite successfully",
                "data":taskupdate
           }
    );*/
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.taskId
        });

    });



        
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the recents."
        });
    });
}
 
})

};

// Retrieve and return all tasks from the database.
const getAllFavorite = async (req, res) => {

if(!req.params.userid) {
        return res.status(400).send({
            message: "userid can not be empty"
        })
}


   
let ugr=req.params.userid;

console.log("ugr ",ugr)

const result1 = await Task.aggregate([
     /* {
                $match: { userid: ObjectId(ugr) }

                  // $match: {"task.$_id":ugr } favorites
         },*/
      {$lookup:{ from: 'favorites', localField:'_id', 
        foreignField:'taskId',pipeline: [
           { $match: { userid: ObjectId(ugr) } }
         ],as:'AllfavoriteData'}},
        {$lookup:{ from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
        {$lookup:{ from: 'subtasks', localField:'_id', 
        foreignField:'assignId',as:'subtasks'}},
        {$lookup:{ from: 'recents', localField:'_id', 
        foreignField:'taskId',as:'history'}},
        { $sort: { created_at : -1 } }
]).exec();




const result2 = await Recent.aggregate([
      {$lookup:{ from: 'tasks', localField:'taskId', 
        foreignField:'_id',as:'rcccc'}}
]).exec();


if(result1.length>0){
      const usersByLikes = result1.map(item => {
      //  console.log(new Date().toISOString().split('T')[0] +" ccc>>> " + new Date(item.assignDate).toISOString().split('T')[0])
        //result1

        if(new Date().toISOString().split('T')[0] > new Date(item.assignDate).toISOString().split('T')[0]){

              item.date= new Date(item.assignDate).toISOString().split('T')[0];
              item.changeDate= "later";
         }

          if(new Date().toISOString().split('T')[0] == new Date(item.assignDate).toISOString().split('T')[0]){

              item.date= new Date(item.assignDate).toISOString().split('T')[0];
              item.changeDate= "today";
          }
           if(new Date().toISOString().split('T')[0] < new Date(item.assignDate).toISOString().split('T')[0]){
              item.date= new Date(item.assignDate).toISOString().split('T')[0];
              item.changeDate= "upcomming";
          }
    return item;
})

var orderedByMonths = _.groupBy(usersByLikes,  function(element) {
console.log("date :: ",element.date)
                          return  element.changeDate;
                      });
          
var orderedByYears =  _.groupBy(orderedByMonths,  function(month) {
                         return  month[0].date.substring(0,10);
                      });
orderedByMonths.recentHistory=result2;  
const reverseObj = (obj) => {
  let newObj = {}

  Object.keys(orderedByYears)
    .sort()
    .reverse()
    .forEach((key) => {
      console.log(key)
      newObj[key] = orderedByMonths[key]
    })

  return newObj  
}


 res.send({"status":200,"result":orderedByMonths});
}else{
  res.send({"status":200,"result":[]}); 
}


};


const deleteFavorite = (req, res) => {
Favorite.updateOne({_id: req.params.favId},{$set:{"isDeleteFavoriteStatus":false}}).then(task => {
/*Task.findByIdAndRemove(req.params.taskId)
    .then(task => {*/
        if(!task) {
            return res.status(404).send({
                message: "Favorite not found with id " + req.params.favId
            });
        }
        res.send({message: "Favorite deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Favorite not found with id " + req.params.favId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Favorite with id " + req.params.favId
        });
    });
    
};
/*
// Find a single Task with a TaskId
const geOneSubTask = (req, res) => {
Subtask.findById(req.params.subtaskId)
    .then(subtask => {
        if(!subtask) {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });            
        }
        res.send(subtask);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving task with id " + req.params.subtaskId
        });
    });
};*/

// Delete a task with the specified taskId in the request
/*const deleteSubTask = (req, res) => {

Subtask.findByIdAndRemove(req.params.subtaskId)
    .then(subtask => {
        if(!subtask) {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });
        }
        res.send({message: "task deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });                
        }
        return res.status(500).send({
            message: "Could not delete task with id " + req.params.subtaskId
        });
    });
    
};*/

//Favorite

module.exports = {
  createFavorite: createFavorite,
   getAllFavorite: getAllFavorite,
    deleteFavorite: deleteFavorite
};