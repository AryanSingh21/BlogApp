//get all users
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      success: true,
      message: "All users data",
      userCount: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error found in getting all users",
      error,
    });
  }
};

//create user || register user
exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Existing user",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //save user if no error or existance
    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "new user added",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Register Callback",
      Success: false,
      error,
    });
  }
};

//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // username does not exist
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const pwIsMatch = await bcrypt.compare(password, user.password);
    if (!pwIsMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User successfully logged in",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error in login",
      success: false,
      error,
    });
  }
};
