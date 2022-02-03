const mongoose = require('mongoose');

const RecentSchema = mongoose.Schema(
	{
  taskId: {
  	type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Task'
  },
  recent_created_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
    recent_updated_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    }
}
 

);
RecentSchema.pre('save', function(done) {
  this.recent_updated_at = Date.now();
  done();
  console.log("RecentSchema");
});
module.exports = mongoose.model('Recent', RecentSchema);
