import mongoose from "mongoose"

const DB_connection = async () => {
      try {
            const connect = await mongoose.connect(process.env.DB_URL)
            console.log(`MongoDB connected: ${connect.connection.host}`)
      } catch (error) {
            console.log(error.message || "MongoDb connection error")
      }
}
export default DB_connection;