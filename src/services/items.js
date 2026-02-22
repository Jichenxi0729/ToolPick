import { supabase } from './supabase'

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

export const getItems = async () => {
  try {
    console.log('Fetching items from Supabase...')
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    console.log('Items fetched:', data)
    return data || []
  } catch (error) {
    console.error('Error fetching items:', error)
    return []
  }
}

export const getItemById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching item:', error)
    return null
  }
}

export const createItem = async (item) => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .insert([item])
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error creating item:', error)
    return { success: false, error: error.message }
  }
}

export const updateItem = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error updating item:', error)
    return { success: false, error: error.message }
  }
}

export const deleteItem = async (id) => {
  try {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting item:', error)
    return { success: false, error: error.message }
  }
}

export const searchItems = async (keyword) => {
  try {
    const searchPattern = `%${keyword}%`
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .or(`name.ilike.*${keyword}*,category.ilike.*${keyword}*,advantages.ilike.*${keyword}*,scenario.ilike.*${keyword}*,comment.ilike.*${keyword}*,type.ilike.*${keyword}*,link.ilike.*${keyword}*`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching items:', error)
    return []
  }
}

export const getItemsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching items by category:', error)
    return []
  }
}

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('category')
    
    if (error) throw error
    
    const categories = [...new Set(data.map(item => item.category).filter(Boolean))]
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
