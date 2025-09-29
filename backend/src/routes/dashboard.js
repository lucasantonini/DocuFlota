import express from 'express'
import supabase from '../config/database.js'

const router = express.Router()

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total counts
    const [
      { count: totalDocuments },
      { count: totalVehicles },
      { count: totalPersonnel },
      { count: validDocuments },
      { count: expiringSoon },
      { count: expired }
    ] = await Promise.all([
      supabase.from('documents').select('*', { count: 'exact', head: true }),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }),
      supabase.from('personnel').select('*', { count: 'exact', head: true }),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'valid'),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'warning'),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'expired')
    ])

    const stats = {
      totalDocuments: totalDocuments || 0,
      vehicles: totalVehicles || 0,
      personnel: totalPersonnel || 0,
      validDocuments: validDocuments || 0,
      expiringSoon: expiringSoon || 0,
      expired: expired || 0
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
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select(`
        id,
        name,
        category,
        status,
        created_at,
        vehicles(plate),
        personnel(name),
        clients(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (documentsError) throw documentsError

    const formattedActivity = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      category: doc.category,
      status: doc.status,
      created_at: doc.created_at,
      vehicle_plate: doc.vehicles?.plate,
      personnel_name: doc.personnel?.name,
      client_name: doc.clients?.name
    }))

    res.json({
      success: true,
      data: formattedActivity
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
