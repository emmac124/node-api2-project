// implement your posts router here
const Posts = require("./posts-model")

const express = require("express")
const router = express.Router()

//ENDPOINTS

// GET | /api/posts | Returns **an array of all the post objects** contained in the database 
router.get("/", (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

// GET | /api/posts/:id | Returns **the post object with the specified id**
router.get("/:id", (req,res) => {
    const { id } = req.params
    Posts.findById(id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        })
})

// POST | /api/posts | Creates a post using the information sent inside the request body and returns **the newly created post object** 
router.post("/", (req,res) => {
    const newPost = req.body
    if(!newPost.title || !newPost.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.insert(newPost)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }
})

// PUT | /api/posts/:id | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original 
router.put("/:id", async (req,res) => {
    const { id } = req.params
    const post = req.body
    try{
        if(!post.title || !post.contents){
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            const updatedPost = await Posts.update(id, post)
            if(!updatedPost){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else{
                res.status(200).json(updatedPost)
            }
        }  
    } catch(err){
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

// DELETE | /api/posts/:id | Removes the post with the specified id and returns the **deleted post object**    
router.delete("/:id", async (req,res) => {
    try{
        const { id } = req.params
        const deletedPost = await Posts.remove(id)
        if(!deletedPost){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else{
            res.status(201).json(deletedPost)
        }
    } catch(err){
        res.status(500).json({ message: "The post could not be removed" })
    }
})

// GET | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id 
router.get("/:id/comments", (req,res) => {
    const { postId } = req.params
    Posts.findPostComments(postId)
        .then(comments => {
            if(!comments){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(comments)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})

module.exports = router