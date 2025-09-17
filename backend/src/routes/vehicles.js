import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// Get all vehicles with their documents
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.*,
        c.name as client_name,
        COUNT(d.id) as document_count,
        MIN(d.expiration_date) as next_expiration
      FROM vehicles v
      LEFT JOIN clients c ON v.client_id = c.id
      LEFT JOIN documents d ON v.id = d.vehicle_id AND d.category = 'vehicle'
      GROUP BY v.id, c.name
      ORDER BY v.created_at DESC
    `)

    // Get documents for each vehicle
    const vehicles = await Promise.all(
      result.rows.map(async (vehicle) => {
        const documents = await pool.query(`
          SELECT 
            d.*,
            dt.name as type_name
          FROM documents d
          LEFT JOIN document_types dt ON d.type_id = dt.id
          WHERE d.vehicle_id = $1 AND d.category = 'vehicle'
          ORDER BY d.expiration_date ASC
        `, [vehicle.id])

        // Calculate global status
        let globalStatus = 'valid'
        if (documents.rows.some(doc => doc.status === 'expired')) {
          globalStatus = 'expired'
        } else if (documents.rows.some(doc => doc.status === 'warning')) {
          globalStatus = 'warning'
        }

        return {
          ...vehicle,
          global_status: globalStatus,
          documents: documents.rows
        }
      })
    )

    res.json({
      success: true,
      data: vehicles
    })
  } catch (error) {
    console.error('Vehicles fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles'
    })
  }
})

// Get single vehicle
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const vehicle = await pool.query(`
      SELECT 
        v.*,
        c.name as client_name
      FROM vehicles v
      LEFT JOIN clients c ON v.client_id = c.id
      WHERE v.id = $1
    `, [id])

    if (vehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    }

    const documents = await pool.query(`
      SELECT 
        d.*,
        dt.name as type_name
      FROM documents d
      LEFT JOIN document_types dt ON d.type_id = dt.id
      WHERE d.vehicle_id = $1 AND d.category = 'vehicle'
      ORDER BY d.expiration_date ASC
    `, [id])

    res.json({
      success: true,
      data: {
        ...vehicle.rows[0],
        documents: documents.rows
      }
    })
  } catch (error) {
    console.error('Vehicle fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicle'
    })
  }
})

// Create vehicle
router.post('/', async (req, res) => {
  try {
    const { plate, name, type, client_id } = req.body

    const result = await pool.query(`
      INSERT INTO vehicles (plate, name, type, client_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [plate, name, type, client_id])

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this plate already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle'
    })
  }
})

// Update vehicle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { plate, name, type, client_id, status } = req.body

    const result = await pool.query(`
      UPDATE vehicles 
      SET plate = $1, name = $2, type = $3, client_id = $4, status = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [plate, name, type, client_id, status, id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Vehicle update error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating vehicle'
    })
  }
})

// Delete vehicle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    })
  } catch (error) {
    console.error('Vehicle deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting vehicle'
    })
  }
})

export default router
