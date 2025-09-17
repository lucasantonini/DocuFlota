import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total counts
    const [
      totalDocuments,
      totalVehicles,
      totalPersonnel,
      validDocuments,
      expiringSoon,
      expired
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM documents'),
      pool.query('SELECT COUNT(*) FROM vehicles'),
      pool.query('SELECT COUNT(*) FROM personnel'),
      pool.query("SELECT COUNT(*) FROM documents WHERE status = 'valid'"),
      pool.query("SELECT COUNT(*) FROM documents WHERE status = 'warning'"),
      pool.query("SELECT COUNT(*) FROM documents WHERE status = 'expired'")
    ])

    const stats = {
      totalDocuments: parseInt(totalDocuments.rows[0].count),
      vehicles: parseInt(totalVehicles.rows[0].count),
      personnel: parseInt(totalPersonnel.rows[0].count),
      validDocuments: parseInt(validDocuments.rows[0].count),
      expiringSoon: parseInt(expiringSoon.rows[0].count),
      expired: parseInt(expired.rows[0].count)
    }

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    })
  }
})

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.id,
        d.name,
        d.category,
        d.status,
        d.created_at,
        v.plate as vehicle_plate,
        p.name as personnel_name,
        c.name as client_name
      FROM documents d
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN personnel p ON d.personnel_id = p.id
      LEFT JOIN clients c ON d.client_id = c.id
      ORDER BY d.created_at DESC
      LIMIT 10
    `)

    res.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Dashboard activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity'
    })
  }
})

export default router
