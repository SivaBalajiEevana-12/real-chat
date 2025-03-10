const express=require('express')
const cookieParser=require('cookie-parser')
const authRoute=require('./src/routes/auth')
const messageRoute=require('./src/routes/messages')
const {app,server}=require('./src/config/socket')
require('dotenv').config()
const dbConnection=require('./src/config/dbConn')
const cors=require('cors');
const compression =require('compression')
// const redis = require('./src/config/redisClient')
// const redix=redis
// const app=express()
const PORT=process.env.PORT||3000;
// app.get('/',(req,res)=>{
//     res.send("hello");
// })
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// redis.on('connect', () => {
//     console.log('✅ Redis Connected');
// });
// redis.on('error', (err) => {
//     console.error('❌ Redis Connection Error:', err);
// });
app.use(express.json({limit:'10mb'}))
app.use(cookieParser())

app.use('/api/auth',authRoute);
app.use('/api/messages',messageRoute);
console.log(process.env.DATABASE_URI)
server.listen(PORT,()=>{
    console.log(`app is listening to http://localhost:${PORT}`)
    dbConnection();
})
 