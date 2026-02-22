import { ref, computed } from 'vue'
import { getItems, createItem, updateItem, deleteItem, searchItems } from '../services/items'

const items = ref([])
const loading = ref(false)
const error = ref(null)

export function useItems() {
  const fetchItems = async () => {
    loading.value = true
    error.value = null
    try {
      items.value = await getItems()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item) => {
    loading.value = true
    error.value = null
    try {
      const result = await createItem(item)
      if (result.success) {
        items.value.unshift(result.data)
        return { success: true }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const editItem = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const result = await updateItem(id, updates)
      if (result.success) {
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value[index] = result.data
        }
        return { success: true }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (id) => {
    loading.value = true
    error.value = null
    try {
      const result = await deleteItem(id)
      if (result.success) {
        items.value = items.value.filter(item => item.id !== id)
        return { success: true }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const search = async (keyword) => {
    loading.value = true
    error.value = null
    try {
      items.value = await searchItems(keyword)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const itemCount = computed(() => items.value.length)

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    editItem,
    removeItem,
    search,
    itemCount
  }
}
