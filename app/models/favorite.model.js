const mongoose = require('mongoose');

const FavoriteSchema = mongoose.Schema(
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
  favorite_created_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    },
    favorite_updated_at: {
      type: Date,
      default: function(){
        return Date.now();
      }
    }
}
 

);
FavoriteSchema.pre('save', function(done) {
  this.favorite_updated_at = Date.now();
  done();
  console.log("FavoriteSchema"); 
});
module.exports = mongoose.model('Favorite', FavoriteSchema);
