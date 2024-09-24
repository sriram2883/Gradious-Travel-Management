const express = require('express');
const app = express();
const cors =require('cors')
const corsOptions={
    origin:'*',
    optionsSuccessStatus:200
}
const db = require('./models/database');
app.use(cors(corsOptions))
app.use(express.json());
const AdminRoutes = require("./routes/AdminRoutes");
const UserRoutes = require("./routes/UserRoutes");
const GuideRoutes = require("./routes/GuideRoutes");
const LoginRoutes = require("./routes/LoginRoutes");
app.use('/admin',AdminRoutes);
app.use('/user',UserRoutes);
app.use('/guide',GuideRoutes);
app.use('/login',LoginRoutes);
app.listen(3001,(req,res)=>{
    console.log("server is up on port 3001");
})