const Task = require("../models/task");
const mongoose = require("mongoose");
const createTask = async (req, res) => {
  try{
    const { title, description, status, priority, dueDate } = req.body;
    
    if(!title || !title.trim()){
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  }catch(error){
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const filter = {};

    if(req.query.status){
      filter.status = req.query.status;
    }
    if(req.query.priority){
      filter.priority = req.query.priority;
    }

    if(req.query.search){
      filter.title={
        $regex: req.query.search,
        $options: "i",
      };
    }
    
    let sortOption = {};
    if(req.query.sort==="newest"){
      sortOption = { createdAt: -1 };
    }

    if(req.query.sort==="oldest"){
      sortOption = { createdAt: 1 };
    }
    const tasks = await Task.find(filter).sort(sortOption);
    
    res.status(200).json(tasks);
  }
  catch(error){
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) =>{
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
    const task = await Task.findById(req.params.id);

    if(!task){
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  }
  catch(error){
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) =>{
  try{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
    if(req.body.title !== undefined && (!req.body.title.trim()) || !req.body.title){
      return res.status(400).json({
        message: "Title cannot be empty",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if(!task){
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json(task);
  }catch(error){
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
    const task = await Task.findByIdAndDelete(req.params.id);

    if(!task){
      return res.status(404).json({
        message: "task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  }
  catch(error){
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};