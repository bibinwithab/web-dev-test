const User = require('../models/User')
const Note = require('../models/Note')
const asycHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
const getAllUsers = asycHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: "No users found"})
    }
    res.status(200).json(users)
})
// @desc    Create new user
// @route   GET /users
// @access  Private/Admin
const createNewUser = asycHandler(async (req, res) => {
  const { username, password, roles } = req.body
  
  if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message: "Invalid input. All fields are required"})
  }

  const duplicate = await User.findOne({ username }).lean().exec()

    if(duplicate){
        return res.status(409).json({message: "Username already exists"})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPwd, roles }

    const user = await User.create(userObject)

    if(user){
        return res.status(201).json({message: `User ${username} created successfully`})
    } else{
        return res.status(400).json({message: "invalid user data recieved"})
    
    }
})
// @desc    Update user
// @route   GET /users
// @access  Private/Admin
const updateUser = asycHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active!== 'boolean'){
        return res.status(400).json({message: "Invalid input. All fields are required"})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: "Duplicate username"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message:`${updatedUser.username} updated` })
})
// @desc    Delete user
// @route   GET /users
// @access  Private/Admin
const deleteUser = asycHandler(async (req, res) => {
    const {id} = req.body

    if(!id){
        return res.status(400).json({message: "Invalid input. Id required"})
    }

    const note = await Note.findOne({ user:id }).lean().exec()
    if(note){
        return res.status(400).json({message: "User has notes. Delete notes first"})
    }

    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const result = await user.deleteOne()

    const reply = `Username ${user.username} with ID ${user._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}