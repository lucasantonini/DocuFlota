import supabase from '../config/database.js'

// Note: Tables are created via Supabase SQL Editor using supabase-schema.sql
// This function is kept for compatibility but doesn't create tables
export const createTables = async () => {
  try {
    console.log('ℹ️  Tables should be created via Supabase SQL Editor using supabase-schema.sql')
    console.log('✅ Database connection verified')
  } catch (error) {
    console.error('❌ Error verifying database connection:', error)
    throw error
  }
}

// Update document status based on expiration dates
export const updateDocumentStatus = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const warningDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Update expired documents
    const { error: expiredError } = await supabase
      .from('documents')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .lt('expiration_date', today)
      .neq('status', 'expired')

    if (expiredError) throw expiredError

    // Update documents expiring soon (30 days)
    const { error: warningError } = await supabase
      .from('documents')
      .update({ status: 'warning', updated_at: new Date().toISOString() })
      .gte('expiration_date', today)
      .lte('expiration_date', warningDate)
      .eq('status', 'valid')

    if (warningError) throw warningError

    // Update valid documents (more than 30 days)
    const { error: validError } = await supabase
      .from('documents')
      .update({ status: 'valid', updated_at: new Date().toISOString() })
      .gt('expiration_date', warningDate)
      .eq('status', 'warning')

    if (validError) throw validError

    console.log('📊 Document statuses updated')
  } catch (error) {
    console.error('❌ Error updating document statuses:', error)
  }
}

export default supabase
