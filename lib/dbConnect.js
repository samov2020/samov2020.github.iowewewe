import mongoose from "mongoose";

const dbConnect = () => {
  mongoose.set("strictQuery", false);
  
  try{
    return mongoose.connect(process.env.MONGO_URI);
  }catch(errors){
    console.log('There is a problem connecting to the database.')
  }
}

export default dbConnect;