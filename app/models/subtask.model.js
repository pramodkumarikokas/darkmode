const mongoose = require('mongoose');

const SubtaskSchema = mongoose.Schema(
	{
  assignId: {
  	type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Task'
  },
  
  sub_name: {
    type: String,
    required: true
  },
  sub_notes: {
    type: String,
    required: true
  },
  sub_assignDate: {
    type: Date,
    required: false
  },
  sub_created_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
    sub_updated_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    } ,
    isDeleteSubtaskStatus: {
    type: Boolean,
     default: false
  }
}
 

);
SubtaskSchema.pre('save', function(done) {
  this.updated_at = Date.now();
  done();
  console.log("SubtaskSchema");
});
module.exports = mongoose.model('Subtask', SubtaskSchema);
