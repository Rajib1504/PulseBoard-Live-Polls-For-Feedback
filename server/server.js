import dotenv from "dotenv/config.js";
import app from "./src/app.js";
import DB_connection from './src/common/config/Db.config.js';
import http from "http";
import { initSocket } from "./src/common/config/socket.js";
const PORT = process.env.PORT || 3000

//socket io part
const server = http.createServer(app)// creating server
initSocket(server)//initilizing with socket


const start = async () => {
      await DB_connection()
      server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
      })
}
start().catch(error => {
      console.error("fail to start server:", error)
      process.exit(1);
})
