const upload = require("../middleware/u_upload");
const User=require('../../models/User');


const updateUser = async (req, res) => {

 try {

    await upload(req, res);


var userobj={};

    if(req.body.fname) {
       userobj.fname= req.body.fname;
    }
    if(req.body.email) {
       userobj.email= req.body.email;
    }

  if(req.body.lname) {
       userobj.lname= req.body.lname;
    }


    if (req.files.length > 0) {
     userobj.profileimage=req.files;
    }
      const userupdate = userobj;
     console.log("userupdate >> ",userupdate)
    User.updateOne({_id: req.body.userId},{$set:userupdate}).then(note => {
        if(!note) {
            //
            return res.status(404).send({
                message: "Task not found with id " + req.params.userId
            });
        }
        res.send(
            {
                "status":200,
                "message":"updated successfully",
                "data":userupdate
           }
    );
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Task not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.userId
        });
    });

} catch (error) {
   // console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send({message:"Too many files to upload."});
    }
    return res.send({message:`Error when trying upload many files: ${error}`});
  }
};


// Retrieve and return all User from the database.
const getAllUser = (req, res) => {

User.find().then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving User."
        });
    });
};

// Find a single User with a TaskId
const geOneUser = (req, res) => {
User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.userId
        });
    });
};

// Delete a User with the specified userId in the request
const deleteUser = (req, res) => {
    User.updateOne({_id: req.params.userId},{$set:{"isDeleteUserStatus":false}}).then(task => {
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
module.exports = {
   updateUser: updateUser,
   getAllUser: getAllUser,
   geOneUser: geOneUser,
    deleteUser: deleteUser
};