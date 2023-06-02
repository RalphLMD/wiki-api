//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(express.static("public"))
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = mongoose.Schema(
    {
        title: String,
        content: String,
    }
)

const Article = mongoose.model("Article", articleSchema)

// ------------------------------------------------------------------------------------------------------------------------------------------------
// CHAINED ROUTES

app.route("/articles")
.get(function(request, response){
    Article.find({}).then(function(foundArticles){
        //response.send(foundArticles)
        //console.log(foundArticles)

        response.render("index", {articles: foundArticles})
    }).catch(function(err){
        console.log(err)
    })
})
.delete(function(request, response){
    Article.deleteMany({}).then(function(){
        console.log("Successfully deleted all articles!")
    }).catch(function(err){
        console.log(err)
    })
})

// CREATE AN ARTICLE

app.route("/articles/create")
.get(function(request, response){
    response.render("create")
})
.post(function(request, response){
    const articleTitle = request.body.title
    const articleContent = request.body.content

    const newArticle = new Article({
        title: articleTitle,
        content: articleContent
    })

    newArticle.save().then(function(){
        console.log("Successfully created an article!")
    }).catch(function(err){
        console.log(err)
    })

    response.redirect("/articles")

    //console.log(articleTitle)
    //console.log(articleContent)
})


// GET SPECIFIC ARTICLE

app.route("/articles/:articleID")
.get(function(request, response){
    const requestedArticle = request.params.articleID

    Article.findOne({_id: requestedArticle})
    .then(function(findArticle){
        console.log("Successfully found the article title:  " + findArticle.title)
        console.log("Successfully found the article content: " + findArticle.content)

        response.render("article", {foundArticle: findArticle})
    })
    .catch(function(err){
        console.log(err)
    })
})
.put(function(request, response){
   const requestedArticle = request.params.articleId
   const articleTitle = request.body.title
   const articleContent = request.body.content
   
    Article.findByIdAndUpdate({_id: requestedArticle},{title: articleTitle ,content: articleContent}, {overwrite: true})
    .then(function(){
        response.redirect("/articles/" + requestedArticle)
        console.log("Successfully updated the article!")
    })
    .catch(function(err){
        console.log(err)
    })
})
.patch(function(request, response){
    const requestedArticle = request.params.articleID
    const bodyArticle = request.body

    Article.findByIdAndUpdate({_id: requestedArticle}, {$set: bodyArticle}, {overwrite: true})
    .then(function(){
        response.redirect("/articles/" + requestedArticle)
        console.log("Successfully updated the article!")
    }).catch(function(err){
        console.log(err)
    })
})
.delete(function(request, response){
    const requestedArticle = request.body.articleId

    Article.findByIdAndDelete({_id: requestedArticle})
    .then(function(){
        response.redirect("/articles")
        console.log("Successfully deleted the article!")
    }).catch(function(err){
        console.log(err)
    })
})


// ------------------------------------------------------------------------------------------------------------------------------------------------
// READ ARTICLES

// app.get("/", function(request, response){
//     Article.find({}).then(function(foundArticles){
//         //response.send(foundArticles)
//         response.render("index", {articles: foundArticles})
//         //console.log(foundArticles)
//     }).catch(function(err){
//         console.log(err)
//     })
// })

// ------------------------------------------------------------------------------------------------------------------------------------------------
// CREATE DEFAULT ARTICLES 

// const defaultArticle = {
//     "title" : "API",
//     "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
// }

// const defaultArticle2 = {
//     "title" : "Bootstrap",
//     "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
// }

// const defaultArticle3 = {
//     "title" : "DOM",
//     "content" : "The Document Object Model is like an API for interacting with our HTML"
// }

// const defaultArticles = [defaultArticle, defaultArticle2, defaultArticle3]

// Article.insertMany(defaultArticles)
// .then(function(){
//     console.log("Default articles are added in database")
// })
// .catch(function(err){
//     console.log(err)
// })

// ------------------------------------------------------------------------------------------------------------------------------------------------
// READ ARTICLES

// app.get("/articles", function(request, response){
//     Article.find({}).then(function(foundArticles){
//         response.send(foundArticles)

//         console.log(foundArticles)
//     }).catch(function(err){
//         console.log(err)
//     })
// })

// CREATE ARTICLES 

// app.post("/articles", function(request, repsonse){
//     const articleTitle = request.body.title
//     const articleContent = request.body.content

//     const newArticle = new Article({
//         title: articleTitle,
//         content: articleContent
//     })

//     newArticle.save().then(function(){
//         console.log("Successfully created an article!")
//     }).catch(function(err){
//         console.log(err)
//     })

//     response.redirect("/")

//     //console.log(articleTitle)
//     //console.log(articleContent)
// })

// ------------------------------------------------------------------------------------------------------------------------------------------------


// app.get("/create", function(request, response){
//     response.render("create", {})
// })

// app.post("/create", function(request, response){
//     const articleTitle = request.body.title
//     const articleContent = request.body.content

//     const newArticle = new Article({
//         title: articleTitle,
//         content: articleContent
//     })

//     newArticle.save().then(function(){
//         console.log("Successfully created an article!")
//         response.redirect("/")
//     }).catch(function(err){
//         console.log(err)
//     })
// })

// ------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE ALL ARTICLES 

// app.delete("/articles", function(request, response){
//     Article.deleteMany().then(function(){
        
//     }).catch(function(err){
//         console.log(err)
//     })
// })


app.listen(3000, function() {
  console.log("Server started on port 3000");
});