const db = require('../config/db')

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      project_id
    } = req.body

    const user_id = req.user.user_id

    if (!title) {
      return res.status(400).json({
        message: 'Task title is required'
      })
    }

    if (!project_id) {
      return res.status(400).json({
        message: 'Project is required'
      })
    }

    // Check that the project belongs to the logged-in user
    const [projects] = await db.query(
      `SELECT project_id
       FROM projects
       WHERE project_id = ? AND user_id = ?`,
      [project_id, user_id]
    )

    if (projects.length === 0) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    const [result] = await db.query(
      `INSERT INTO tasks
       (title, description, status, project_id, user_id, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        status || 'todo',
        project_id,
        user_id,
        priority || 'medium',
        due_date || null
      ]
    )

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        task_id: result.insertId,
        title,
        description: description || null,
        status: status || 'todo',
        priority: priority || 'medium',
        due_date: due_date || null,
        project_id
      }
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create task'
    })
  }
}

// GET TASKS
const getTasks = async (req, res) => {
  try {
    const user_id = req.user.user_id

    const [tasks] = await db.query(
      `SELECT
        t.task_id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.project_id,
        t.created_at,
        p.project_name
       FROM tasks t
       LEFT JOIN projects p
       ON t.project_id = p.project_id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [user_id]
    )

    res.json(tasks)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch tasks'
    })
  }
}

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task_id = req.params.id
    const user_id = req.user.user_id

    const {
      title,
      description,
      status,
      priority,
      due_date,
      project_id
    } = req.body

    if (!title) {
      return res.status(400).json({
        message: 'Task title is required'
      })
    }

    // Check project ownership
    const [projects] = await db.query(
      `SELECT project_id
       FROM projects
       WHERE project_id = ? AND user_id = ?`,
      [project_id, user_id]
    )

    if (projects.length === 0) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    const [result] = await db.query(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           priority = ?,
           due_date = ?,
           project_id = ?
       WHERE task_id = ? AND user_id = ?`,
      [
        title,
        description || null,
        status || 'todo',
        priority || 'medium',
        due_date || null,
        project_id,
        task_id,
        user_id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    res.json({
      message: 'Task updated successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update task'
    })
  }
}

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task_id = req.params.id
    const user_id = req.user.user_id

    const [result] = await db.query(
      `DELETE FROM tasks
       WHERE task_id = ? AND user_id = ?`,
      [task_id, user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    res.json({
      message: 'Task deleted successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete task'
    })
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
}