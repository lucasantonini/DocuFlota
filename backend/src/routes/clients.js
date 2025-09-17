import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// Get all clients with statistics
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        COUNT(DISTINCT v.id) as vehicle_count,
        COUNT(DISTINCT p.id) as personnel_count,
        COUNT(d.id) as document_count,
        COUNT(CASE WHEN d.status = 'valid' THEN 1 END) as valid_documents,
        COUNT(CASE WHEN d.status = 'warning' THEN 1 END) as expiring_documents,
        COUNT(CASE WHEN d.status = 'expired' THEN 1 END) as expired_documents
      FROM clients c
      LEFT JOIN vehicles v ON c.id = v.client_id
      LEFT JOIN personnel p ON c.id = p.client_id
      LEFT JOIN documents d ON (c.id = d.client_id)
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `)

    res.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Clients fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching clients'
    })
  }
})

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const client = await pool.query(`
      SELECT * FROM clients WHERE id = $1
    `, [id])

    if (client.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }

    // Get vehicles for this client
    const vehicles = await pool.query(`
      SELECT * FROM vehicles WHERE client_id = $1 ORDER BY created_at DESC
    `, [id])

    // Get personnel for this client
    const personnel = await pool.query(`
      SELECT * FROM personnel WHERE client_id = $1 ORDER BY created_at DESC
    `, [id])

    res.json({
      success: true,
      data: {
        ...client.rows[0],
        vehicles: vehicles.rows,
        personnel: personnel.rows
      }
    })
  } catch (error) {
    console.error('Client fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching client'
    })
  }
})

// Create client
router.post('/', async (req, res) => {
  try {
    const { name, cuit, contact_name, contact_email, contact_phone } = req.body

    const result = await pool.query(`
      INSERT INTO clients (name, cuit, contact_name, contact_email, contact_phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, cuit, contact_name, contact_email, contact_phone])

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Client creation error:', error)
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Client with this CUIT already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error creating client'
    })
  }
})

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, cuit, contact_name, contact_email, contact_phone, status } = req.body

    const result = await pool.query(`
      UPDATE clients 
      SET name = $1, cuit = $2, contact_name = $3, contact_email = $4, contact_phone = $5, status = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [name, cuit, contact_name, contact_email, contact_phone, status, id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Client update error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating client'
    })
  }
})

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }

    res.json({
      success: true,
      message: 'Client deleted successfully'
    })
  } catch (error) {
    console.error('Client deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting client'
    })
  }
})

export default router
