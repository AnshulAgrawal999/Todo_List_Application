
const express = require( 'express' ) ;

const userRouter = express.Router() ;

const { User } = require( '../models/UserModel' ) ;

// User Endpoints
userRouter.get( '/' , async ( req , res ) => {

  try {

    const users = await User.find().select( 'username email' ) ;

    res.json( users ) ;

  } catch ( error ) {

    res.status( 500 ).json( { error: error.message } ) ;

  }
}
) ;

module.exports = { userRouter } ;