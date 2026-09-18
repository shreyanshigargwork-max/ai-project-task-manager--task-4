const express = require('express')

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

// Get all tasks
router.get('/', protect, getTasks)

// Create task
router.post('/', protect, createTask)

// Update task
router.put('/:id', protect, updateTask)

// Delete task
router.delete('/:id', protect, deleteTask)

module.exports = router