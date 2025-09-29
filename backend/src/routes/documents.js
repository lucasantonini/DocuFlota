import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import supabase from '../config/database.js'
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

    let query = supabase
      .from('documents')
      .select(`
        *,
        document_types(name),
        vehicles(plate, name),
        personnel(name),
        clients(name)
      `)
      .order('expiration_date', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (vehicle_id) {
      query = query.eq('vehicle_id', vehicle_id)
    }

    if (personnel_id) {
      query = query.eq('personnel_id', personnel_id)
    }

    const { data: documents, error: documentsError } = await query

    if (documentsError) throw documentsError

    const formattedDocuments = documents.map(doc => ({
      ...doc,
      type_name: doc.document_types?.name,
      vehicle_plate: doc.vehicles?.plate,
      vehicle_name: doc.vehicles?.name,
      personnel_name: doc.personnel?.name,
      client_name: doc.clients?.name
    }))

    res.json({
      success: true,
      data: formattedDocuments
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

    const { data: document, error: createError } = await supabase
      .from('documents')
      .insert([{
        name,
        type_id,
        category,
        file_url: fileUrl,
        file_name: req.file.originalname,
        file_size: req.file.size,
        expiration_date,
        vehicle_id: vehicle_id || null,
        personnel_id: personnel_id || null,
        client_id
      }])
      .select()
      .single()

    if (createError) throw createError

    // Update document statuses
    await updateDocumentStatus()

    res.status(201).json({
      success: true,
      data: document
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

    const { data: document, error: updateError } = await supabase
      .from('documents')
      .update({
        name,
        expiration_date,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    res.json({
      success: true,
      data: document
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

    const { data: document, error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (deleteError || !document) {
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

    let query = supabase
      .from('document_types')
      .select('*')
      .order('name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: documentTypes, error: typesError } = await query

    if (typesError) throw typesError

    res.json({
      success: true,
      data: documentTypes
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
