import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const liveMongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOSTS}/${process.env.DB_NAME}?${process.env.DB_OPTIONS}`;

    const conn = await mongoose.connect(liveMongoURI);
    console.log(
      `📡 MongoDB Atlas Connected Successfully to Database: ${process.env.DB_NAME}`,
    );
  } catch (error) {
    console.error(`❌ Cloud Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
