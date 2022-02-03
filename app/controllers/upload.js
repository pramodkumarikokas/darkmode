const upload = require("../middleware/upload");
const Task = require('../models/task.model.js');
const multipleUpload = async (req, res) => {
  try {



    await upload(req, res);




   // console.log(">>>>>>>>>>>dd ",req.body);

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }


     if(!req.body.content) {
        return res.status(400).send({
            message: "Tasks content can not be empty"
        });
    }

      const task = new Task({
        title: req.body.title || "", 
        content: req.body.content
    });
 await task.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the tasks."
        });
    });

  //  return res.send(`Files has been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

module.exports = {
  multipleUpload: multipleUpload
};