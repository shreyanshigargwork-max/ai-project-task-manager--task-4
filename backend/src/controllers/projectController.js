const db = require('../config/db')

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { project_name, description } = req.body
    const user_id = req.user.user_id

    if (!project_name) {
      return res.status(400).json({
        message: 'Project name is required'
      })
    }

    const [result] = await db.query(
      `INSERT INTO projects (user_id, project_name, description)
       VALUES (?, ?, ?)`,
      [user_id, project_name, description || null]
    )

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        project_id: result.insertId,
        project_name,
        description: description || null,
        status: 'active'
      }
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create project'
    })
  }
}

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const user_id = req.user.user_id

    const [projects] = await db.query(
      `SELECT project_id, project_name, description, status, created_at
       FROM projects
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user_id]
    )

    res.json(projects)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch projects'
    })
  }
}

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const project_id = req.params.id
    const user_id = req.user.user_id
    const { project_name, description, status } = req.body

    if (!project_name) {
      return res.status(400).json({
        message: 'Project name is required'
      })
    }

    const [result] = await db.query(
      `UPDATE projects
       SET project_name = ?, description = ?, status = ?
       WHERE project_id = ? AND user_id = ?`,
      [
        project_name,
        description || null,
        status || 'active',
        project_id,
        user_id
      ]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    res.json({
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update project'
    })
  }
}

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project_id = req.params.id
    const user_id = req.user.user_id

    const [result] = await db.query(
      `DELETE FROM projects
       WHERE project_id = ? AND user_id = ?`,
      [project_id, user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    res.json({
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete project'
    })
  }
}

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
}