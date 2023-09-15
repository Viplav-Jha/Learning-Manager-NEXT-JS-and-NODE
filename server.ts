import { connect } from 'http2';
import {app} from './app';
import connectDB from './utils/db';

require('dotenv').config();


//create server
app.listen(process.env.PORT,()=>{
    console.log(`Server is connect with port ${process.env.PORT}`)
    connectDB();
})
