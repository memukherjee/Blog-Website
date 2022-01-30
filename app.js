const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose')
require('dotenv').config()

// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const content = {
  home: "Hello, I am Akash on this side. Welcome to my blog website. Happy to see you here. I am a self-learned budding Programmer, excited about all new technologies and to learn about them. This is like my online diary to post about several things happening in my life.",
  about:
    "My name is Akash Mukherjee and I am a full-stack Web Application Developer and Software Developer, currently living in Asansol, India. I am currently pursuing my Bachelor degree in Information Technology from Asansol Engineering College, and my primary focus and inspiration for my studies is Web Development. In my free time, I study various types of new techs and their applications. I am both driven and self-motivated, and I am constantly experimenting with new technologies and techniques. I am very passionate about Web Development and strive to better myself as a developer, and the development community as a whole.",
  contact:
    "I am currently in Asansol, India pursuing my college studies. I am available to connect on all my socials and especially on LinkedIn and Github.",
};


const app = express();
const port = process.env.PORT

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


//Database
mongoose.connect(`mongodb+srv://memukherjee:${process.env.MONGOPASS}@cluster0.hmjif.mongodb.net/blogPostDB`)
console.log("Connected Successfully")
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
})

const Post = mongoose.model("Post",postSchema)

//Home
app.get("/", (req, res) => {
  let id = "home"
  let heading = id[0].toUpperCase() + id.slice(1)
  let resource = ""
  if (id in content) 
    resource = content[id]
  Post.find({},(err,posts)=>{
    if(err)
      console.log(err);
    else{
      console.log("Posts found and being rendered");
      res.render(id, { 
        content: resource, 
        heading: heading, 
        posts: posts 
      })
    }
  })
})

// about
app.get("/about", (req, res) => {
  let id = 'about'
  let heading = id[0].toUpperCase() + id.slice(1)
  res.render(id, { 
    content: content[id],
    heading: heading,
    error: false 
  })
})

// contact
app.get("/contact", (req, res) => {
  let id = 'contact'
  let heading = id[0].toUpperCase() + id.slice(1)
  res.render(id, { 
    content: content[id],
    heading: heading 
  })
})

//compose
app.get("/compose", (req, res) => {
  let id = 'compose'
  let heading = id[0].toUpperCase() + id.slice(1)
  res.render(id, { 
    content: content[id],
    heading: heading 
  })
})

//posts
app.get('/posts/:postName',(req,res)=>{
  const postName = _.lowerCase(req.params.postName)
  let found = false

  Post.find({},(err,posts)=>{
    if(err){
      console.log(err);
    }
    else{
      posts.forEach((post)=>{
        const currentTitle = _.lowerCase(post._id)
        if(currentTitle===postName){
          console.log("Posts found");
          found=true
          res.render('post',{title:post.title, content:post.description, error:false})
        }
      })
      let statuscode = (res.statusCode===200)?404:res.statusCode
      if(!found){
        console.log("Posts not found");
        res.render('post',{title:statuscode,content:'Page Not Found',error: true})
      }
    }
  })
})


// others
app.get("/:id", (req, res) => {
  let id = req.params.id
  res.render('about', { 
    content: "Page Not Found",
    heading: '404',
    error: true
  })
})


//compose
app.post("/compose", (req, res) => {
  const title = req.body.postTitle
  const description = req.body.description

  const newPost = new Post({
    title: title,
    description: description,
  })

  newPost.save((err)=>{
    if(err)
      console.log(err);
    else{
      console.log("new post composed and saved");
      res.redirect("/")
    }
  })
});

app.listen(port, function () {
  console.log("Server started on port " + port)
});
