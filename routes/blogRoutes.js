const express = require("express");
const {
  getAllBlogController,
  getSingleBlogController,
  createBlogController,
  updateBlogController,
  deleteBlogController,
  getUserBlogController,
} = require("../controllers/blogController");

//router object
const router = express.Router();

//routes
//get all routes
router.get("/all-blog", getAllBlogController);

//get single blog
router.get("/single-blog/:id", getSingleBlogController);

//create blog
router.post("/create-blog", createBlogController);

//update blog
router.put("/update-blog/:id", updateBlogController);

//delete blog
router.delete("/delete-blog/:id", deleteBlogController);

//get user blog
router.get("/user-blog/:id", getUserBlogController);

module.exports = router;
