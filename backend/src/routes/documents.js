import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'
import { updateDocumentStatus } from '../models/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG and PDF files are allowed'))
    }
  }
})

// Get all documents
router.get('/', async (req, res) => {
  try {
    const { category, status, vehicle_id, personnel_id } = req.query

    let query = `
      SELECT 
        d.*,
        dt.name as type_name,
        v.plate as vehicle_plate,
        v.name as vehicle_name,
        p.name as personnel_name,
        c.name as client_name
      FROM documents d
      LEFT JOIN document_types dt ON d.type_id = dt.id
      LEFT JOIN vehicles v ON d.vehicle_id = v.id
      LEFT JOIN personnel p ON d.personnel_id = p.id
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE 1=1
    `
    const params = []
    let paramCount = 0

    if (category) {
      paramCount++
      query += ` AND d.category = $${paramCount}`
      params.push(category)
    }

    if (status) {
      paramCount++
      query += ` AND d.status = $${paramCount}`
      params.push(status)
    }

    if (vehicle_id) {
      paramCount++
      query += ` AND d.vehicle_id = $${paramCount}`
      params.push(vehicle_id)
    }

    if (personnel_id) {
      paramCount++
      query += ` AND d.personnel_id = $${paramCount}`
      params.push(personnel_id)
    }

    query += ' ORDER BY d.expiration_date ASC'

    const result = await pool.query(query, params)

    res.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Documents fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    })
  }
})

// Upload document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { name, type_id, category, expiration_date, vehicle_id, personnel_id, client_id } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const fileUrl = `/uploads/${req.file.filename}`

    const result = await pool.query(`
      INSERT INTO documents (
        name, type_id, category, file_url, file_name, file_size, 
        expiration_date, vehicle_id, personnel_id, client_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      name,
      type_id,
      category,
      fileUrl,
      req.file.originalname,
      req.file.size,
      expiration_date,
      vehicle_id || null,
      personnel_id || null,
      client_id
    ])

    // Update document statuses
    await updateDocumentStatus()

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Document upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    })
  }
})

// Update document
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, expiration_date, status } = req.body

    const result = await pool.query(`
      UPDATE documents 
      SET name = $1, expiration_date = $2, status = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [name, expiration_date, status, id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Document update error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating document'
    })
  }
})

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    })
  } catch (error) {
    console.error('Document deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    })
  }
})

// Get document types
router.get('/types', async (req, res) => {
  try {
    const { category } = req.query

    let query = 'SELECT * FROM document_types'
    const params = []

    if (category) {
      query += ' WHERE category = $1'
      params.push(category)
    }

    query += ' ORDER BY name'

    const result = await pool.query(query, params)

    res.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Document types fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching document types'
    })
  }
})

export default router
