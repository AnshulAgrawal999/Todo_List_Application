
const express = require( 'express' ) ;

const dotenv = require( 'dotenv' ) ;

const mongoose = require('mongoose') ;

dotenv.config() ;

const cors = require( 'cors' ) ;

const PORT = process.env.PORT || 5000 ;

const { connection } = require( './configs/db' ) ;



const app = express() ;

app.use( express.json() ) ;

app.use( cors() ) ;


app.get( '/' , ( req , res ) => {

    try {
        res.status( 200 ).send( { 'msg' : 'This is Todo List Express Server base url' } ) ;
    } catch ( error ) {
        res.status( 500 ).send( { 'error' : error } ) ;
    }
   
} ) ;


// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Todo Schema
const todoSchema = new mongoose.Schema({
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
});

// Create indexes for performance
todoSchema.index({ user: 1 });
todoSchema.index({ tags: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

// Helper function to get user from request
const getCurrentUser = async (req) => {
  const username = req.query.user || req.headers['x-current-user'] || 'john_doe';
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  return user;
};

// User Endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Export Endpoint
app.get('/api/todos/export', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const format = req.query.format || 'json';
    
    const todos = await Todo.find({ user: currentUser._id })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // Simple CSV export
      const csvHeader = 'Title,Description,Priority,Completed,Tags,Assigned Users,Created At\n';
      const csvRows = todos.map(todo => {
        return `"${todo.title}","${todo.description}","${todo.priority}","${todo.completed}","${todo.tags.join(';')}","${todo.assignedUsers.join(';')}","${todo.createdAt}"`;
      }).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=todos.csv');
      res.send(csvHeader + csvRows);
    } else {
      res.json(todos);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Todo Endpoints
app.get('/api/todos', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const {
      page = 1,
      limit = 10,
      priority,
      completed,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: currentUser._id };
    
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const todos = await Todo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email');

    const total = await Todo.countDocuments(query);

    res.json({
      todos,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: todos.length,
        totalCount: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/todos/:id', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: currentUser._id 
    }).populate('user', 'username email');
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const { title, description, priority, tags, assignedUsers } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      user: currentUser._id,
      tags: tags || [],
      assignedUsers: assignedUsers || [],
      notes: []
    });

    await todo.save();
    await todo.populate('user', 'username email');
    
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const { title, description, priority, completed, tags, assignedUsers } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (completed !== undefined) updateData.completed = completed;
    if (tags !== undefined) updateData.tags = tags;
    if (assignedUsers !== undefined) updateData.assignedUsers = assignedUsers;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: currentUser._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: currentUser._id 
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Note Endpoints
app.post('/api/todos/:id/notes', async (req, res) => {
  try {
    const currentUser = await getCurrentUser(req);
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: currentUser._id 
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.notes.push({
      content: content.trim(),
      createdAt: new Date()
    });

    await todo.save();
    await todo.populate('user', 'username email');

    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



app.listen( PORT , async ()=>{
    try {
        console.log( `server is running on http://localhost:${PORT}` ) ;
        
        await connection ;

        console.log( 'server is connected to DB' ) ;

    } catch ( error ) {
        
        console.log( { error } ) ;
    }
} )  ;