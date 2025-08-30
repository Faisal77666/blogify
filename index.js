
const express=require('express')
const path=require('path')
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const Blog=require('./models/blog')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const { checkForAuthenticationCookie } = require("./middleware/authentication")
const app=express()

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(e=>
console.log("MongoDb connected!")
)


app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
 app.use(checkForAuthenticationCookie("token"))
 app.use(express.json())
 app.use(express.static(path.join(__dirname, 'public')));




app.get("/",async(req,res)=>{
  const allBlogs=await Blog.find({})
  return res.render('home',{
    user:req.user,
    blogs:allBlogs
  })
})


app.use("/user",userRoute)
app.use("/blog",blogRoute)


app.listen(5000,()=>{
  console.log("Server is listening on port 5000...");
  
})