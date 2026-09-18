const generateTasks = async (req, res) => {
  try {
    const { project_name, project_description } = req.body

    if (!project_name) {
      return res.status(400).json({
        message: 'Project name is required',
      })
    }

    const description = project_description || ''

    const tasks = [
      {
        title: `Plan ${project_name}`,
        description: `Define the goals, requirements and scope for ${project_name}.`,
        priority: 'high',
      },
      {
        title: `Design ${project_name}`,
        description: `Create the basic design and structure for ${project_name}.`,
        priority: 'high',
      },
      {
        title: `Develop ${project_name}`,
        description: `Implement the main features and functionality of ${project_name}.`,
        priority: 'medium',
      },
      {
        title: `Test ${project_name}`,
        description: `Test the features of ${project_name} and fix identified issues.`,
        priority: 'medium',
      },
      {
        title: `Document ${project_name}`,
        description: `Prepare documentation and usage instructions for ${project_name}.`,
        priority: 'low',
      },
    ]

    res.json({
      message: 'Tasks generated successfully',
      source: 'local task suggestion engine',
      project: project_name,
      description,
      tasks,
    })
  } catch (error) {
    console.error('Task Generation Error:', error)

    res.status(500).json({
      message: 'Failed to generate tasks',
    })
  }
}

module.exports = {
  generateTasks,
}