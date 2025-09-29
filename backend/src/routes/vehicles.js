import express from 'express'
import supabase from '../config/database.js'

const router = express.Router()

// Get all vehicles with their documents
router.get('/', async (req, res) => {
  try {
    // Get vehicles with client info
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select(`
        *,
        clients!inner(name)
      `)
      .order('created_at', { ascending: false })

    if (vehiclesError) throw vehiclesError

    // Get documents for each vehicle
    const vehicles = await Promise.all(
      vehiclesData.map(async (vehicle) => {
        const { data: documents, error: docsError } = await supabase
          .from('documents')
          .select(`
            *,
            document_types(name)
          `)
          .eq('vehicle_id', vehicle.id)
          .eq('category', 'vehicle')
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
          ...vehicle,
          client_name: vehicle.clients.name,
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

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select(`
        *,
        clients(name)
      `)
      .eq('id', id)
      .single()

    if (vehicleError || !vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    }

    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select(`
        *,
        document_types(name)
      `)
      .eq('vehicle_id', id)
      .eq('category', 'vehicle')
      .order('expiration_date', { ascending: true })

    if (docsError) throw docsError

    res.json({
      success: true,
      data: {
        ...vehicle,
        client_name: vehicle.clients.name,
        documents: documents.map(doc => ({
          ...doc,
          type_name: doc.document_types?.name
        }))
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

    const { data: vehicle, error: createError } = await supabase
      .from('vehicles')
      .insert([{
        plate,
        name,
        type,
        client_id
      }])
      .select()
      .single()

    if (createError) {
      if (createError.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Vehicle with this plate already exists'
        })
      }
      throw createError
    }

    res.status(201).json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Vehicle creation error:', error)
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

    const { data: vehicle, error: updateError } = await supabase
      .from('vehicles')
      .update({
        plate,
        name,
        type,
        client_id,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    }

    res.json({
      success: true,
      data: vehicle
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

    const { data: vehicle, error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (deleteError || !vehicle) {
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
