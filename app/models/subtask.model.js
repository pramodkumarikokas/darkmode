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
  created_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
    updated_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    }
}
 

);
SubtaskSchema.pre('save', function(done) {
  this.updated_at = Date.now();
  done();
  console.log("SubtaskSchema");
});
module.exports = mongoose.model('Subtask', SubtaskSchema);
