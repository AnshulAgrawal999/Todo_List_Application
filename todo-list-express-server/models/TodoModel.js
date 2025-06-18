
const mongoose = require( 'mongoose' ) ;

// Todo Schema
const todoSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String
  }],
  assignedUsers: [{
    type: String
  }],
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
}
) ;

// Create indexes for performance
todoSchema.index( { user: 1 } ) ;
todoSchema.index( { tags: 1 } ) ;
todoSchema.index( { priority: 1 } ) ;
todoSchema.index( { completed: 1 } ) ;
todoSchema.index( { createdAt: -1 } ) ;

const Todo = mongoose.model( 'Todo' , todoSchema ) ;

module.exports = { Todo } ;