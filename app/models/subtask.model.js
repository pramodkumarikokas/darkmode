const mongoose = require('mongoose');

const SubtaskSchema = mongoose.Schema(
	{
  taskId: {
  	type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Task'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
  },
  sub_listFavorite: [],
  sub_assignId: [],
  sub_latlong_location: [],
  subtask_images: {
    type: [],
    required: false
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
  },
  subtaskStatus: {
    type: Boolean,
     default: false
  }, 
  sub_getting_started: {
    type: Boolean,
    default: false
  },
   sub_in_progress: {
    type: Boolean,
    default: false
  },
     sub_isFavorite: {
    type: Boolean,
    default: false
  },
   sub_incomplete: {
    type: Boolean,
     default: false
  },
  sub_wont_abble_to_perform: {
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
