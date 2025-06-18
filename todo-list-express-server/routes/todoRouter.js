
const express = require( 'express' ) ;

const todoRouter = express.Router() ;

const { User } = require( '../models/UserModel' ) ;

const { Todo } = require( '../models/TodoModel' ) ;


// Helper function to get user from request
const getCurrentUser = async ( req ) => {

  const username = req.query.user || req.headers['x-current-user'] ;

  const user = await User.findOne( { username } ) ;

  if ( !user ) 
  {
    throw new Error(`User ${username} not found`) ;
  }

  return user ;
} ;


// Todo Export Endpoint
todoRouter.get( '/export' , async ( req , res ) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const format = req.query.format || 'json' ;
    
    const todos = await Todo.find( { user: currentUser._id } )
        .populate( 'user' , 'username email' )
        .sort( { createdAt: -1 } ) ;

    if ( format === 'csv' ) {

      // Simple CSV export
      const csvHeader = 'Title,Description,Priority,Completed,Tags,Assigned Users,Created At\n' ;

      const csvRows = todos.map(
            todo => {
            return `"${todo.title}","${todo.description}","${todo.priority}","${todo.completed}","${todo.tags.join(';')}","${todo.assignedUsers.join(';')}","${todo.createdAt}"` ;
            }
        ).join( '\n' ) ;
      
      res.setHeader( 'Content-Type' , 'text/csv' ) ;

      res.setHeader( 'Content-Disposition' , 'attachment; filename=todos.csv' ) ;

      res.send( csvHeader + csvRows ) ;

    } else {

      res.json( todos ) ;

    }
  } catch ( error ) {

    res.status( 500 ).json( { error: error.message } ) ;

  }
}
) ;


// Todo Endpoints
todoRouter.get( '/' , async ( req , res ) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const {
      page = 1,
      limit = 10,
      priority,
      completed,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query ;

    // Build query
    const query = { user: currentUser._id } ;
    
    if ( priority ) query.priority = priority ;

    if ( completed !== undefined ) query.completed = completed === 'true' ;

    if ( tags ) {

      const tagArray = tags.split( ',' ) ;

      query.tags = { $in: tagArray } ;
    }

    // Build sort object
    const sort = {} ;

    sort[ sortBy ] = sortOrder === 'desc' ? -1 : 1 ;

    const skip = ( page - 1 ) * limit ;
    
    const todos = await Todo.find( query )
      .sort( sort )
      .skip( skip )
      .limit( parseInt( limit ) )
      .populate( 'user' , 'username email' ) ;

    const total = await Todo.countDocuments( query ) ;

    res.json(
        {
        todos,
        pagination: 
            {
                current: parseInt( page ),
                total: Math.ceil( total / limit ),
                count: todos.length,
                totalCount: total
            }
        }
    ) ;

  } catch ( error ) {

    res.status( 500 ).json( { error: error.message } ) ;

  }
}
) ;


todoRouter.get( '/:id' , async ( req , res ) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const todo = await Todo.findOne(
        { 
            _id: req.params.id, 
            user: currentUser._id 
        }
    ).populate( 'user' , 'username email' ) ;
    
    if ( !todo ) 
    {
      return res.status( 404 ).json( { error: 'Todo not found' } ) ;
    }
    
    res.json( todo ) ;

  } catch (error) {
    
    res.status( 500 ).json( { error: error.message } ) ;

  }
});


todoRouter.post( '/' , async ( req , res ) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const { title , description , priority , tags , assignedUsers } = req.body ;
    
    if ( !title || title.trim() === '' ) {

      return res.status( 400 ).json( { error: 'Title is required' } ) ;

    }

    const todo = new Todo(
        {
            title: title.trim(),
            description: description || '',
            priority: priority || 'medium',
            user: currentUser._id,
            tags: tags || [],
            assignedUsers: assignedUsers || [],
            notes: []
        }
    ) ;

    await todo.save() ;

    await todo.populate( 'user' , 'username email' ) ;
    
    res.status( 201 ).json( todo ) ;

  } catch ( error ) {

    res.status( 400 ).json( { error: error.message } ) ;

  }
}
) ;


todoRouter.put( '/:id' , async ( req , res ) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const { title , description , priority , completed , tags , assignedUsers } = req.body ;
    
    const updateData = {} ;

    if ( title !== undefined ) updateData.title = title.trim() ;

    if ( description !== undefined ) updateData.description = description ;

    if ( priority !== undefined ) updateData.priority = priority ;

    if ( completed !== undefined ) updateData.completed = completed ;

    if ( tags !== undefined ) updateData.tags = tags ;

    if ( assignedUsers !== undefined ) updateData.assignedUsers = assignedUsers ;

    const todo = await Todo.findOneAndUpdate(

      { _id: req.params.id, user: currentUser._id },
        updateData,
      { new: true, runValidators: true }

    ).populate( 'user' , 'username email' ) ;

    if ( !todo ) 
    {
      return res.status( 404 ).json( { error: 'Todo not found' } ) ;
    }

    res.json( todo ) ;

  } catch ( error ) {

    res.status( 400 ).json( { error: error.message } ) ;

  }
}
) ;

todoRouter.delete( '/:id' , async ( req , res ) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const todo = await Todo.findOneAndDelete(
        { 
            _id: req.params.id, 
            user: currentUser._id 
        }
    ) ;

    if ( !todo ) {

      return res.status( 404 ).json( { error: 'Todo not found' } ) ;

    }

    res.json( { message: 'Todo deleted successfully' } ) ;

  } catch ( error ) {

    res.status( 500 ).json( { error: error.message } ) ;

  }
}
) ;


// Note Endpoints
todoRouter.post( '/:id/notes', async ( req , res) => {

  try {

    const currentUser = await getCurrentUser( req ) ;

    const { content } = req.body ;

    if ( !content || content.trim() === '' ) 
    {
      return res.status( 400 ).json( { error: 'Note content is required' } ) ;
    }

    const todo = await Todo.findOne(
        { 
            _id: req.params.id, 
            user: currentUser._id 
        }
    ) ;

    if ( !todo ) {

      return res.status( 404 ).json( { error: 'Todo not found' } ) ;

    }

    todo.notes.push(
        {
            content: content.trim(),
            createdAt: new Date()
        }
    ) ;

    await todo.save() ;

    await todo.populate( 'user' , 'username email' ) ;

    res.json( todo ) ;

  } catch ( error ) {

    res.status( 400 ).json( { error: error.message } ) ;

  }
}
) ;

module.exports = { todoRouter } ;
