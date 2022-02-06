const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
	{
  taskId: {
  	type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Task'
  },
   userid: {
    type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
  },
  member_name: {
    type: String,
    required: true
  },
  member_created_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
    member_updated_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
   isDeleteMemberStatus: {
    type: Boolean,
     default: false
  }
}
 

);
memberSchema.pre('save', function(done) {
  this.member_updated_at = Date.now();
  done();
  console.log("memberSchema"); 
});
module.exports = mongoose.model('Member', memberSchema);
