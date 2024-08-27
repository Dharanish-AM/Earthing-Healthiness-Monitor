const express = require("express");
const app = express();
const port = 8000;
const dotenv = require("dotenv");

dotenv.config();

const { Login, addEmployee } = require("./database/db");

app.use(express.json());

app.post("/loradata",(req,res)=>{
  const data = req.body.data
  console.log("recieved data",data)
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
