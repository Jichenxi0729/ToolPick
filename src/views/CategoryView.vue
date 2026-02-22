<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CategoryCard from '../components/item/CategoryCard.vue'
import { useItems } from '../composables/useItems'

const router = useRouter()
const { items, fetchItems, loading } = useItems()

const showAddModal = ref(false)
const newCategoryName = ref('')

onMounted(() => {
  fetchItems()
})

const categoryList = computed(() => {
  const categoryMap = new Map()
  
  items.value.forEach(item => {
    const category = item.category || '未分类'
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category).push(item)
  })
  
  return Array.from(categoryMap.entries())
    .map(([name, items]) => ({
      name,
      count: items.length
    }))
    .sort((a, b) => b.count - a.count)
})

const handleCategoryClick = (categoryName) => {
  router.push({ path: '/category-items', query: { name: categoryName } })
}

const handleAddCategory = () => {
  if (newCategoryName.value.trim()) {
    router.push({ path: '/category-items', query: { name: newCategoryName.value.trim(), new: true } })
    newCategoryName.value = ''
    showAddModal.value = false
  }
}
</script>

<template>
  <div class="pb-20 pt-4">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-gray-900">分类管理</h2>
      <p class="text-sm text-gray-500 mt-1">按分类查看收藏</p>
    </div>

    <div v-if="loading && categoryList.length === 0" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="categoryList.length === 0" class="text-center py-12">
      <div class="text-5xl mb-4">📁</div>
      <p class="text-gray-500">还没有分类</p>
      <p class="text-sm text-gray-400 mt-1">添加收藏后会自动生成分类</p>
    </div>

    <div v-else class="space-y-3">
      <CategoryCard
        v-for="category in categoryList"
        :key="category.name"
        :name="category.name"
        :count="category.count"
        @click="handleCategoryClick"
      />
    </div>

    <button
      @click="showAddModal = true"
      class="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl hover:scale-110 transition-all duration-300"
    >
      +
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showAddModal = false"></div>
          
          <div class="relative bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">新增分类</h3>
            
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="输入分类名称"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 mb-4"
              @keyup.enter="handleAddCategory"
            />
            
            <div class="flex gap-3">
              <button
                @click="handleAddCategory"
                class="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                添加
              </button>
              <button
                @click="showAddModal = false"
                class="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
