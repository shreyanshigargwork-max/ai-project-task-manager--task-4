const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')
const aiRoutes = require('./routes/aiRoutes')

const app = express()

app.use(cors())
app.use(express.json())

// Authentication routes
app.use('/api/auth', authRoutes)

// Project routes
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai', aiRoutes)
console.log('PROJECT ROUTES REGISTERED')

// Test API + database
app.get('/', async (req, res) => {
  try {
    await db.query('SELECT 1')

    res.json({
      message: 'AI Project & Task Manager API is running!',
      database: 'Connected'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Database connection failed'
    })
  }
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})