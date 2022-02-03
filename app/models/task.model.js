const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema(
	{
  catId: {
  	type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
  },
 /* assignId: [{
  	type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
  }],*/
  
  listFavorite: [],
  assignId: [],
  latlong_location: [],
  name: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
  },
location: {
    type: [], //the type is an array of numbers
    index: "2dsphere"
  },
  attachments: {
    type: [],
    required: false
  },
   description: {
    type: String,
    required: false
  },
  assignDate: {
    type: Date,
    required: false
  },
   getting_started: {
    type: Boolean,
    default: false
  },
   in_progress: {
    type: Boolean,
    default: false
  },
     isFavorite: {
    type: Boolean,
    default: false
  },
   incomplete: {
    type: Boolean,
     default: false
  },
  wont_abble_to_perform: {
    type: Boolean,
    default: false
  },
   status: {
    type: Boolean,
     default: true
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
TaskSchema.pre('save', function(done) {
  this.updated_at = Date.now();
  done();
  console.log("updateeeee");
});
module.exports = mongoose.model('Task', TaskSchema);
