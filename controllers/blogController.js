const mongoose = require("mongoose");
const blogModel = require("../model/blogModel");
const userModel = require("../model/userModel");

//get all blogs
exports.getAllBlogController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "No blogs found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "All blogs list",
      blogsCount: blogs.length,
      blogs,
      // user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while getting all blogs",
      error,
    });
  }
};

//get Single blog
exports.getSingleBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Single blog fetched",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.staus(400).send({
      success: false,
      message: "Error while getting all blogs",
      error,
    });
  }
};

//create blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
    await newBlog.save();
    return res.status(200).send({
      success: true,
      message: "Blog created",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while Creating blog",
      error,
    });
  }
};

//update blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Blog updated",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while updating blog",
      error,
    });
  }
};
//get user blog
exports.getUserBlogController = async (req, res) => {
  try {
    const userBlogs = await userModel.findById(req.params.id).populate("blogs");

    if (!userBlogs) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blogs by the user found",
      blogs: userBlogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while getting user blog",
      error,
    });
  }
};

//delete blog
exports.deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while deleting blog",
      error,
    });
  }
};
