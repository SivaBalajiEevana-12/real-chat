const mongoose=require('mongoose');
const dbConnection= async ()=>{
    try{
    const con=await mongoose.connect(process.env.DATABASE_URI,);
    console.log(`mongo db connected successfully ${con.connection.host}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10 // <= Connection pooling
    })
}
catch(err){
    console.log("mongo db connection error",err)
}
}
module.exports=dbConnection;