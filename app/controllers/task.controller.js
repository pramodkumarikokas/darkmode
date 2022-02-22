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
//console.log("assignDatesssssssssss :: ")
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
       assignId=req.body.sub_assignId;
    }else{
      assignId=[];
    }
    var location="";
    if(req.body.location) {
       location=req.body.location;
    }else{
      location=[];
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
                   $match: { isDeleteTaskStatus: true }
                },
      {$lookup:{ from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
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

// Retrieve and return all tasks from the database.
const getStatusTask = async (req, res) => {
  
  if(!req.body.taskId) {
        return res.status(400).send({
            message: "Task Id can not be empty"
        });
    }
var taskobj={};
      taskobj.getting_started=false;
    if(req.body.getting_started==1){
       taskobj.getting_started=true; 
    }
    taskobj.in_progress=false;
    if(req.body.in_progress==1){
       taskobj.in_progress=true; 
    }
  taskobj.incomplete=false;
    if(req.body.incomplete==1){
       taskobj.incomplete=true; 
    }

taskobj.wont_abble_to_perform=false;
    if(req.body.wont_abble_to_perform==1){
       taskobj.wont_abble_to_perform=true; 
    }


 await Task.updateOne({_id: req.body.taskId},{$set:taskobj}).then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.taskId
            });
        }
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

const result1 = await Task.aggregate([
{
                   $match: { isDeleteTaskStatus: true }
                },
      {$lookup:{ from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
        {$lookup:{ from: 'subtasks', localField:'_id', 
        foreignField:'taskId',as:'subtasks'}},
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
                   $match: { _id: ObjectId(req.params.taskId),isDeleteTaskStatus: true }
                },
      {$lookup:{ from: 'categories', localField:'catId', 
        foreignField:'_id',as:'category'}},
        {$lookup:
          { from: 'subtasks', localField:'_id', 
        foreignField:'taskId',pipeline: [
            { $match: { isDeleteSubtaskStatus: false } }
         ],as:'subtasks'}
      },
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

console.log("YYYYYYYYYYYYYY")
 res.send({"status":200,"result":orderedByMonths});
}else{
  console.log("nnnnnnnnnnnnnnnn")
  res.send({"status":200,"result":[]}); 
}


};
const privacypolicy = (req, res) => {
res.send("<h1>Privacy Policy for Task Management App</h1><p>At Task Management App, accessible from www.ikokasdev.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by task management app and how we use it.</p><p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p><p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in task management app. This policy is not applicable to any information collected offline or via channels other than this website.</p><h2>Consent</h2><p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p><h2>Information we collect</h2><p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p><p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p><p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p><h2>How we use your information</h2><p>We use the information we collect in various ways, including to:</p><ul><li>Provide, operate, and maintain our website</li><li>Improve, personalize, and expand our website</li><li>Understand and analyze how you use our website</li><li>Develop new products, services, features, and functionality</li><li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li><li>Send you emails</li><li>Find and prevent fraud</li></ul><h2>Log Files</h2><p>Task management app follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p><h2>Advertising Partners Privacy Policies</h2><p>You may consult this list to find the Privacy Policy for each of the advertising partners of task management app.</p><p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on task management app, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p><p>Note that aask management app has no access to or control over these cookies that are used by third-party advertisers.</p><h2>Third Party Privacy Policies</h2><p>Task management app's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p><p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p><h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2><p>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p><p>Request that a business delete any personal data about the consumer that a business has collected.</p><p>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p><p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p><h2>GDPR Data Protection Rights</h2><p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p><p>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</p><p>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p><p>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</p><p>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</p><p>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</p><p>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p><p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p><h2>Children's Information</h2><p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p><p>Task management app does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>");
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