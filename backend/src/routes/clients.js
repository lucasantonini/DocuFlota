import express from 'express'
import supabase from '../config/database.js'

const router = express.Router()

// Get all clients with statistics
router.get('/', async (req, res) => {
  try {
    // Get clients with basic info
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (clientsError) throw clientsError

    // Get statistics for each client
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        // Get vehicle count
        const { count: vehicleCount } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)

        // Get personnel count
        const { count: personnelCount } = await supabase
          .from('personnel')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)

        // Get document counts by status
        const { data: documents } = await supabase
          .from('documents')
          .select('status')
          .eq('client_id', client.id)

        const documentCount = documents?.length || 0
        const validDocuments = documents?.filter(d => d.status === 'valid').length || 0
        const expiringDocuments = documents?.filter(d => d.status === 'warning').length || 0
        const expiredDocuments = documents?.filter(d => d.status === 'expired').length || 0

        return {
          ...client,
          vehicle_count: vehicleCount || 0,
          personnel_count: personnelCount || 0,
          document_count: documentCount,
          valid_documents: validDocuments,
          expiring_documents: expiringDocuments,
          expired_documents: expiredDocuments
        }
      })
    )

    res.json({
      success: true,
      data: clientsWithStats
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

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (clientError || !client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }

    // Get vehicles for this client
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })

    if (vehiclesError) throw vehiclesError

    // Get personnel for this client
    const { data: personnel, error: personnelError } = await supabase
      .from('personnel')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })

    if (personnelError) throw personnelError

    res.json({
      success: true,
      data: {
        ...client,
        vehicles: vehicles || [],
        personnel: personnel || []
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

    const { data: client, error: createError } = await supabase
      .from('clients')
      .insert([{
        name,
        cuit,
        contact_name,
        contact_email,
        contact_phone
      }])
      .select()
      .single()

    if (createError) {
      if (createError.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Client with this CUIT already exists'
        })
      }
      throw createError
    }

    res.status(201).json({
      success: true,
      data: client
    })
  } catch (error) {
    console.error('Client creation error:', error)
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

    const { data: client, error: updateError } = await supabase
      .from('clients')
      .update({
        name,
        cuit,
        contact_name,
        contact_email,
        contact_phone,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }

    res.json({
      success: true,
      data: client
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

    const { data: client, error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (deleteError || !client) {
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
