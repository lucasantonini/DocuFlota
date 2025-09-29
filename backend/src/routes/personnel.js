import express from 'express'
import supabase from '../config/database.js'

const router = express.Router()

// Get all personnel with their documents
router.get('/', async (req, res) => {
  try {
    // Get personnel with client info
    const { data: personnelData, error: personnelError } = await supabase
      .from('personnel')
      .select(`
        *,
        clients!inner(name)
      `)
      .order('created_at', { ascending: false })

    if (personnelError) throw personnelError

    // Get documents for each personnel
    const personnel = await Promise.all(
      personnelData.map(async (person) => {
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select(`
            *,
            document_types(name)
          `)
          .eq('personnel_id', person.id)
          .eq('category', 'personnel')
          .order('expiration_date', { ascending: true })

        if (docsError) throw docsError

        // Calculate global status
        let globalStatus = 'valid'
        if (documents.some(doc => doc.status === 'expired')) {
          globalStatus = 'expired'
        } else if (documents.some(doc => doc.status === 'warning')) {
          globalStatus = 'warning'
        }

        return {
          ...person,
          client_name: person.clients.name,
          document_count: documents.length,
          next_expiration: documents.length > 0 ? documents[0].expiration_date : null,
          global_status: globalStatus,
          documents: documents.map(doc => ({
            ...doc,
            type_name: doc.document_types?.name
          }))
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

    const { data: person, error: personError } = await supabase
      .from('personnel')
      .select(`
        *,
        clients(name)
      `)
      .eq('id', id)
      .single()

    if (personError || !person) {
      return res.status(404).json({
        success: false,
        message: 'Personnel not found'
      })
    }

    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select(`
        *,
        document_types(name)
      `)
      .eq('personnel_id', id)
      .eq('category', 'personnel')
      .order('expiration_date', { ascending: true })

    if (docsError) throw docsError

    res.json({
      success: true,
      data: {
        ...person,
        client_name: person.clients.name,
        documents: documents.map(doc => ({
          ...doc,
          type_name: doc.document_types?.name
        }))
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

    const { data: person, error: createError } = await supabase
      .from('personnel')
      .insert([{
        name,
        role,
        dni,
        client_id
      }])
      .select()
      .single()

    if (createError) {
      if (createError.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Personnel with this DNI already exists'
        })
      }
      throw createError
    }

    res.status(201).json({
      success: true,
      data: person
    })
  } catch (error) {
    console.error('Personnel creation error:', error)
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

    const { data: person, error: updateError } = await supabase
      .from('personnel')
      .update({
        name,
        role,
        dni,
        client_id,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !person) {
      return res.status(404).json({
        success: false,
        message: 'Personnel not found'
      })
    }

    res.json({
      success: true,
      data: person
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

    const { data: person, error: deleteError } = await supabase
      .from('personnel')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (deleteError || !person) {
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
