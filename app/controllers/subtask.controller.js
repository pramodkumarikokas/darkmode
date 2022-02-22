const upload = require("../middleware/subtask_upload");
const Task = require('../models/task.model.js');
const Category = require('../models/category.model.js');
const Subtask = require('../models/subtask.model.js');
const Recent = require('../models/recent.model.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const _ = require('underscore');
const date = require('date-and-time')
const User=require('../../models/User');
const createSubTask = async (req, res) => {
try {
await upload(req, res);

if(!req.params.taskId) {
        return res.status(400).send({
            message: "taskId name can not be empty"
        });
    }
     if(!req.body.sub_name) {
        return res.status(400).send({
            message: "subTasks name can not be empty"
        });
    }
    if(!req.body.userId) {
        return res.status(400).send({
            message: "userId  can not be empty"
        });
    }
    if(!req.body.sub_assignDate) {
        return res.status(400).send({
            message: "sub assignDate name can not be empty"
        });
    }

 var sub_assignId="";
  if(req.body.sub_assignId) {
       sub_assignId=req.body.sub_assignId;
    }else{
      sub_assignId=[];
    }
var sub_latlong_location="";
    if(req.body.sub_latlong_location) {
       sub_latlong_location=req.body.sub_latlong_location;
    }else{
      sub_latlong_location=[];
    }


 if (req.files.length > 0) {
     var subtask = new Subtask({
        taskId:req.params.taskId,
        subtask_images:req.files,
        sub_assignId:sub_assignId,
        sub_latlong_location:sub_latlong_location,
        sub_notes: req.body.sub_notes || "", 
        sub_name: req.body.sub_name || "", 
        sub_assignDate:req.body.sub_assignDate
    });
}else{

 var subtask = new Subtask({
        taskId:req.params.taskId,
        sub_assignId:sub_assignId,
        sub_latlong_location:sub_location,
        sub_notes: req.body.sub_notes || "", 
        sub_name: req.body.sub_name || "", 
        sub_assignDate:req.body.sub_assignDate
    });
}
 await subtask.save()
    .then(data => {
        res.send({"status":200,"message":"successfully","data":subtask});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Sub tasks."
        });
    });
  } catch (error) {
    console.log(error);
     return res.send({"status":401,"error":error});
if (req.files.length > 0) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send({"status":401,message:"Too many files to upload."});
    }
    return res.send({"status":401,message:`Error when trying upload many files: ${error}`});
}
  }

};


// Update a note identified by the noteId in the request
const updateSubTask = async (req, res) => {

try {
await upload(req, res);

if(!req.params.subtaskId) {
        return res.status(400).send({
            message: "subtaskId name can not be empty"
        });
    }
var sub_taskobj={};
 if(req.body.sub_notes) {
       sub_taskobj.sub_notes= req.body.sub_notes;
    }
  
    if(req.body.sub_name) {
       sub_taskobj.sub_name= req.body.sub_name;
    }
    if(!req.body.sub_assignDate) {
        sub_taskobj.sub_assignDate=req.body.sub_assignDate;
    }
    if (req.files.length > 0) {
        sub_taskobj.subtask_images=req.files;
    }

  if(req.body.sub_assignId) {
       sub_taskobj.sub_assignId= req.body.sub_assignId;
    }

    if(req.body.sub_latlong_location) {
       sub_location.sub_latlong_location=req.body.sub_latlong_location;
    }
    Subtask.updateOne({_id: req.params.subtaskId},{$set:sub_taskobj}).then(subtask => {
        //console.log("nnn ",note)
        if(!subtask) {
            return res.status(404).send({
                message: "Sub Task not found with id " + req.params.subtaskId
            });
        }
        res.send(
            {
                "status":200,
                "message":"updated successfully",
                "data":sub_taskobj
           }
    );
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Sub Task not found with id " + req.params.subtaskId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.subtaskId
        });
    });
} catch (error) {
    console.log(error);
     return res.send({"status":401,"error":error});
if (req.files.length > 0) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send({"status":401,message:"Too many files to upload."});
    }
    return res.send({"status":401,message:`Error when trying upload many files: ${error}`});
}
  }

};


// Retrieve and return all tasks from the database.
const getAllSubTask = async (req, res) => {
 

const result1 = await Task.aggregate([
    
      {$lookup:
        { from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
     {$lookup:{ from: 'users', localField:'userId', 
        foreignField:'_id',as:'user'}},
        {$lookup:
          { from: 'subtasks', localField:'_id', 
        foreignField:'taskId',pipeline: [
            { $match: { isDeleteSubtaskStatus: false } }
         ],as:'subtasks'}
      },
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

// Find a single Task with a TaskId
const geOneSubTask = (req, res) => {
Subtask.find({_id:req.params.subtaskId,isDeleteSubtaskStatus: false})
    .then(subtask => {
        if(!subtask) {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });            
        }
      if(subtask.length>0) { 
 res.send({"status":200,"result":subtask});
}else{
  res.send({"status":200,"result":[]}); 
}
       // res.send(subtask);
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
};

// Delete a task with the specified taskId in the request
const deleteSubTask = (req, res) => {

Subtask.updateOne({_id: req.params.subtaskId},{$set:{"isDeleteSubtaskStatus":true}}).then(task => {
/*Task.findByIdAndRemove(req.params.taskId)
    .then(task => {                */
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });
        }
        res.send({message: "subtask deleted successfully!"});
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
    
};


// Retrieve and return all tasks from the database.
const getStatusSubTask = async (req, res) => {
  
  if(!req.body.sub_taskId) {
        return res.status(400).send({
            message: "sub Task Id can not be empty"
        });
    }
var sub_taskobj={};
      sub_taskobj.sub_getting_started=false;
    if(req.body.sub_getting_started==1){
       sub_taskobj.sub_getting_started=true; 
    }
    sub_taskobj.sub_in_progress=false;
    if(req.body.sub_in_progress==1){
       sub_taskobj.sub_in_progress=true; 
    }
  sub_taskobj.sub_incomplete=false;
    if(req.body.sub_incomplete==1){
       sub_taskobj.sub_incomplete=true; 
    }

sub_taskobj.sub_wont_abble_to_perform=false;
    if(req.body.sub_wont_abble_to_perform==1){
       sub_taskobj.sub_wont_abble_to_perform=true; 
    }

//console.log("sub_taskobj ",sub_taskobj)
 await Subtask.updateOne({_id: req.body.sub_taskId},{$set:sub_taskobj}).then(note => {
        if(!note) {
            return res.status(404).send({
                message: "subTask not found with id " + req.body.sub_taskId
            });
        }
            }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "subTask not found with id " + req.body.sub_taskId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.body.sub_taskId
        });
    });  

const result1 = await Task.aggregate([
    /*
{
                   $match: { isDeleteTaskStatus: true }
                },
                */
      {$lookup:{ from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
        {$lookup:{ from: 'users', localField:'userId', 
        foreignField:'_id',as:'user'}},
        {$lookup:
          { from: 'subtasks', localField:'_id', 
        foreignField:'taskId',pipeline: [
            { $match: { isDeleteSubtaskStatus: false } }
         ],as:'subtasks'}
      },
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


module.exports = {
  createSubTask: createSubTask,
   updateSubTask: updateSubTask,
   getAllSubTask: getAllSubTask,
   geOneSubTask: geOneSubTask,
   getStatusSubTask: getStatusSubTask,
    deleteSubTask: deleteSubTask
};