const express = require('express')

const {
  generateTasks,
} = require('../controllers/aiController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/generate-tasks', protect, generateTasks)

module.exports = router