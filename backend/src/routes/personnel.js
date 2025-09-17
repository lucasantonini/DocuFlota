import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// Get all personnel with their documents
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as client_name,
        COUNT(d.id) as document_count,
        MIN(d.expiration_date) as next_expiration
      FROM personnel p
      LEFT JOIN clients c ON p.client_id = c.id
      LEFT JOIN documents d ON p.id = d.personnel_id AND d.category = 'personnel'
      GROUP BY p.id, c.name
      ORDER BY p.created_at DESC
    `)

    // Get documents for each personnel
    const personnel = await Promise.all(
      result.rows.map(async (person) => {
        const documents = await pool.query(`
          SELECT 
            d.*,
            dt.name as type_name
          FROM documents d
          LEFT JOIN document_types dt ON d.type_id = dt.id
          WHERE d.personnel_id = $1 AND d.category = 'personnel'
          ORDER BY d.expiration_date ASC
        `, [person.id])

        // Calculate global status
        let globalStatus = 'valid'
        if (documents.rows.some(doc => doc.status === 'expired')) {
          globalStatus = 'expired'
        } else if (documents.rows.some(doc => doc.status === 'warning')) {
          globalStatus = 'warning'
        }

        return {
          ...person,
          global_status: globalStatus,
          documents: documents.rows
        }
      })
    )

    res.json({
      success: true,
      data: personnel
    })
  } catch (error) {
    console.error('Personnel fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching personnel'
    })
  }
})

// Get single personnel
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const person = await pool.query(`
      SELECT 
        p.*,
        c.name as client_name
      FROM personnel p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = $1
    `, [id])

    if (person.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personnel not found'
      })
    }

    const documents = await pool.query(`
      SELECT 
        d.*,
        dt.name as type_name
      FROM documents d
      LEFT JOIN document_types dt ON d.type_id = dt.id
      WHERE d.personnel_id = $1 AND d.category = 'personnel'
      ORDER BY d.expiration_date ASC
    `, [id])

    res.json({
      success: true,
      data: {
        ...person.rows[0],
        documents: documents.rows
      }
    })
  } catch (error) {
    console.error('Personnel fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching personnel'
    })
  }
})

// Create personnel
router.post('/', async (req, res) => {
  try {
    const { name, role, dni, client_id } = req.body

    const result = await pool.query(`
      INSERT INTO personnel (name, role, dni, client_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, role, dni, client_id])

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Personnel creation error:', error)
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Personnel with this DNI already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error creating personnel'
    })
  }
})

// Update personnel
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, role, dni, client_id, status } = req.body

    const result = await pool.query(`
      UPDATE personnel 
      SET name = $1, role = $2, dni = $3, client_id = $4, status = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [name, role, dni, client_id, status, id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personnel not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Personnel update error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating personnel'
    })
  }
})

// Delete personnel
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM personnel WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personnel not found'
      })
    }

    res.json({
      success: true,
      message: 'Personnel deleted successfully'
    })
  } catch (error) {
    console.error('Personnel deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting personnel'
    })
  }
})

export default router
