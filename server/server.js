import dotenv from "dotenv/config.js";
import app from "./src/app.js";
import DB_connection from './src/common/config/Db.config.js';

const PORT = process.env.PORT || 3000
const start = async () => {
      await DB_connection()
      app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
      })
}
start().catch(error => {
      console.error("fail to start server:", error)
      process.exit(1);
})
