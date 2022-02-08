const upload = require("../middleware/upload");
const backgUpload = require("../middleware/backg_upload");
const Task = require('../models/task.model.js');
const Category = require('../models/category.model.js');
const Subtask = require('../models/subtask.model.js');
const Recent = require('../models/recent.model.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const _ = require('underscore');
const date = require('date-and-time')
const createTask = async (req, res) => {
  try {

console.log("assignDatesssssssssss :: ")

    await upload(req, res);
//await backgUpload(req, res);
      console.log("req.files.length  ",req.files.length)
    if (req.files.length <= 0) {
      //return res.send({message: "You must select at least 1 file."});
    }


     if(!req.body.name) {
        return res.status(400).send({
            message: "Tasks name can not be empty"
        });
    }
    if(!req.body.catId) {
        return res.status(400).send({
            message: "category name can not be empty"
        });
    }
if(!req.body.userId) {
        return res.status(400).send({
            message: "user Id can not be empty"
        });
    }
      var assignId="";
     if(req.body.assignId) {
       assignId=[req.body.assignId];
    }else{
      assignId=[{"id":"61dde55ccfcadd23a1751111","type":"tbd"}];
    }
    var location="";
    if(req.body.location) {
       location=[req.body.location];
    }else{
        location=[{"latitude":"25.473034", "logitude":"81.878357"}];
    }


     var assignDate=new Date();
  if(req.body.assignDate) {
       assignDate= req.body.assignDate;

    }
    var startDate=new Date();
    if(req.body.startDate) {
       startDate= req.body.startDate;

    }
    console.log("req.files :: ",req.files)
       if (req.files.length > 0) {
      //  console.log("  00  >")
    var task = new Task({
        notes: req.body.notes || "", 
        name: req.body.name || "", 
        description: req.body.description,
        userId: req.body.userId,
        catId:req.body.catId,
        latlong_location:location,
        assignId:assignId,
        attachments:req.files,
        assignDate:assignDate,
        startDate:startDate
      
    });
}else{
     var task = new Task({
        notes: req.body.notes || "", 
        name: req.body.name || "", 
        description: req.body.description,
        catId:req.body.catId,
        userId: req.body.userId,
        latlong_location:location,
        assignId:assignId,
        assignDate:assignDate,
        startDate:startDate
       });
}
//console.log("task :: ",task)
 await task.save()
    .then(data => {
        res.send([data]);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the tasks."
        });
    });

  //  return res.send(`Files has been uploaded.`);
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
const updateTask = async (req, res) => {

 try {

    await upload(req, res);


var taskobj={};
 if(req.body.notes) {
       taskobj.notes= req.body.notes;
    }
    

    if(req.body.name) {
       taskobj.name= req.body.name;
    }
    if(!req.body.catId) {
        taskobj.catId=req.body.catId;
    }
   
     if(req.body.description) {
       taskobj.description= req.body.description;
    }
    
    //  var assignId="";
     if(req.body.assignId) {
       taskobj.assignId=[req.body.assignId];
    }
    //var location="";
    if(req.body.location) {
       taskobj.latlong_location=[req.body.location];
    }
     //var assignDate="";
  if(req.body.assignDate) {
      taskobj.assignDate= req.body.assignDate;
    }
     //var startDate=new Date();
    if(req.body.startDate) {
       taskobj.startDate= req.body.startDate;

    }
      const taskupdate = taskobj;
     // console.log("taskupdate ",taskupdate)
  
    //console.log("req.params.id ",req.params.taskId)
    // Find note and update it with the request body
    // findByIdAndUpdate(req.params.taskId, taskupdate, {new: true})
    Task.updateOne({_id: req.params.taskId},{$set:taskupdate}).then(note => {
        //console.log("nnn ",note)
        if(!note) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.taskId
            });
        }
        res.send(
            {
                "status":200,
                "message":"updated successfully",
                "data":taskupdate
           }
    );
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

} catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send({"status":401,message:"Too many files to upload."});
    }
    return res.send({"status":401,message:`Error when trying upload many files: ${error}`});
  }
};

// Retrieve and return all tasks from the database.
const getAllTask = async (req, res) => {

const result1 = await Task.aggregate([
{
                   $match: { status: true }
                },
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

// Retrieve and return all tasks from the database.
const getStatusTask = async (req, res) => {


  if(!req.body.taskStatus) {
        return res.status(400).send({
            message: "task status name can not be empty"
        });
    }
    let taskStatus=false;
    if(req.body.taskStatus==1){
      let taskStatus=true; 
    }

const result1 = await Task.aggregate([
{
                   $match: { status: true,incomplete: taskStatus }
                },
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

// Find a single Task with a TaskId
const geOneTask = (req, res) => {
 if(!req.params.taskId) {
        return res.status(400).send({
            message: "taskId name can not be empty"
        });
    }
Task.aggregate([
{
                   $match: { _id: ObjectId(req.params.taskId),status: true }
                },
      {$lookup:{ from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
        {$lookup:{ from: 'subtasks', localField:'_id', 
        foreignField:'assignId',as:'subtasks'}},
]).exec((err, result1)=>{
      if (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tasks."
        });
          console.log("error" ,err)
      }
if (result1.length>0) {
         res.send(result1);
         // console.log(result);
      
      }else{
   res.send({"status":200,"message":"no data found","result":[]});
}
      
});


};

// Delete a task with the specified taskId in the request


const deleteTask = (req, res) => {
Task.updateOne({_id: req.params.taskId},{$set:{"isDeleteTaskStatus":false}}).then(task => {
/*Task.findByIdAndRemove(req.params.taskId)
    .then(task => {*/
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });
        }
        res.send({message: "task deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Could not delete task with id " + req.params.taskId
        });
    });
    
};

// Retrieve and return all tasks from the database.
const getAllFilter = async (req, res) => {


if(!req.body.searchText) {

return res.status(400).send({
            message: "search Text can not be empty"
        });
}
let srch={};
 if(req.body.cat_id) {
     srch.catId= ObjectId(req.body.cat_id); 
    }

      let searchText=req.body.searchText;
        srch.name= new RegExp(searchText, "i");
     
    
    //console.log("srch== ",srch)
    let regex = new RegExp(searchText,'i');
const result1 = await Task.aggregate([
 {

          $match: {
            $and: [
   srch
    ]
          },

                },
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

console.log("YYYYYYYYYYYYYY")
 res.send({"status":200,"result":orderedByMonths});
}else{
  console.log("nnnnnnnnnnnnnnnn")
  res.send({"status":200,"result":[]}); 
}


};
const privacypolicy = (req, res) => {
res.send("Dummy content");
}

module.exports = {
  createTask: createTask,
   updateTask: updateTask,
   getAllTask: getAllTask,
   geOneTask: geOneTask,
    deleteTask: deleteTask,
    getAllFilter: getAllFilter,
    privacypolicy:privacypolicy,
    getStatusTask:getStatusTask
};