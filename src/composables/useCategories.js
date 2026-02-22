import { ref } from 'vue'
import { getCategories } from '../services/items'

const categories = ref([])
const loading = ref(false)

export function useCategories() {
  const fetchCategories = async () => {
    loading.value = true
    try {
      categories.value = await getCategories()
    } catch (e) {
      console.error('Error fetching categories:', e)
    } finally {
      loading.value = false
    }
  }

  const addCategory = (categoryName) => {
    if (categoryName && !categories.value.includes(categoryName)) {
      categories.value.push(categoryName)
    }
  }

  return {
    categories,
    loading,
    fetchCategories,
    addCategory
  }
}
