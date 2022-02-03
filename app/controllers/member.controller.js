const upload = require("../middleware/upload");
const Recent = require('../models/recent.model.js');
const Category = require('../models/category.model.js');
const Favorite = require('../models/favorite.model.js');
const Member = require('../models/member.model.js');
const User=require('../../models/User');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const _ = require('underscore');
const date = require('date-and-time')
const createMember = async (req, res) => {
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

     var member = new Member({
        taskId:req.params.taskId,
        userid:req.body.userid
    });
console.log("Member  ",Member)
 await member.save()
    .then(data => {
        res.send({"status":200,"message":"successfully","data":member});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the recents."
        });
    });




};

// Retrieve and return all tasks from the database.
const getAllMember = (req, res) => {

if(!req.params.userid) {
        return res.status(400).send({
            message: "userid can not be empty"
        })
}
Member.aggregate([
                {
                   $match: { userid: ObjectId(req.params.userid) }
                },
      {$lookup:{ from: 'tasks', localField:'taskId', 
        foreignField:'_id',as:'tasks'}},
        {$lookup:{ from: 'users', localField:'userid', 
        foreignField:'_id',as:'users'}},
        { $sort: { created_at : -1 } }
]).exec((err, result)=>{
      if (err) {
        //date.format(now, 'YYYY/MM/DD HH:mm:ss');

        res.status(500).send({
            message: err.message || "Some error occurred while retrieving favorites."
        });
          console.log("error" ,err)
      }else{
         res.send({"status":200,"results":result});
      }
})

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



module.exports = {
  createMember: createMember,
   getAllMember: getAllMember,
};