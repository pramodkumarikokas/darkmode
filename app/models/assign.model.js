const mongoose = require('mongoose');

const AssignSchema = mongoose.Schema(
	{
  userId: {
  	type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
  },
   taskId: {
    type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Task'
  },
  subtaskId: {
    type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Subtask'
  },
  assign_notes: {
    type: String,
    required: true
  },
  assign_assignDate: {
    type: Date,
    required: false
  },
  assign_created_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
  assign_updated_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
   isDeleteAssignStatus: {
    type: Boolean,
     default: false
  }
}
 

);
AssignSchema.pre('save', function(done) {
  this.assign_updated_at = Date.now();
  done();
  console.log("AssignSchema");
});
module.exports = mongoose.model('Assign', AssignSchema);
