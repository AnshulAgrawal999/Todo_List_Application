
const express = require( 'express' ) ;

const dotenv = require( 'dotenv' ) ;

dotenv.config() ;

const cors = require( 'cors' ) ;

const PORT = process.env.PORT || 5000 ;

const { connection } = require( './configs/db' ) ;

const { userRouter } = require( './routes/userRouter' ) ;

const { todoRouter } = require( './routes/todoRouter' ) ;



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

app.use( '/api/users' , userRouter )  ;

app.use( '/api/todos' , todoRouter )  ;


app.listen( PORT , async ()=>{
    try {
        console.log( `server is running on http://localhost:${PORT}` ) ;
        
        await connection ;

        console.log( 'server is connected to DB' ) ;

    } catch ( error ) {
        
        console.log( { error } ) ;
    }
} )  ;