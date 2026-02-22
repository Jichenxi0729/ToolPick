<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemCard from '../components/item/ItemCard.vue'
import ItemForm from '../components/item/ItemForm.vue'
import ItemDetail from '../components/item/ItemDetail.vue'
import { useItems } from '../composables/useItems'

const route = useRoute()
const router = useRouter()
const { items, fetchItems, addItem, editItem, removeItem } = useItems()

const categoryName = computed(() => route.query.name || '')

const showForm = ref(false)
const showDetail = ref(false)
const editingItem = ref(null)
const detailItem = ref(null)
const formLoading = ref(false)

onMounted(() => {
  fetchItems()
})

const categoryItems = computed(() => {
  return items.value.filter(item => item.category === categoryName.value)
})

const handleCardClick = (item) => {
  detailItem.value = item
  showDetail.value = true
}

const handleEditFromDetail = (item) => {
  showDetail.value = false
  handleEdit(item)
}

const handleDeleteFromDetail = async (item) => {
  showDetail.value = false
  await removeItem(item.id)
}

const handleEdit = (item) => {
  editingItem.value = { ...item }
  showForm.value = true
}

const handleDelete = async (item) => {
  if (confirm(`确定要删除 "${item.name}" 吗？`)) {
    await removeItem(item.id)
  }
}

const handleSave = async (formData) => {
  formLoading.value = true
  
  try {
    if (editingItem.value && editingItem.value.id) {
      await editItem(editingItem.value.id, formData)
    } else {
      await addItem({ ...formData, category: categoryName.value })
    }
    
    showForm.value = false
    editingItem.value = null
  } finally {
    formLoading.value = false
  }
}

const handleCloseForm = () => {
  showForm.value = false
  editingItem.value = null
}

const handleCloseDetail = () => {
  showDetail.value = false
  detailItem.value = null
}

const handleAddNew = () => {
  editingItem.value = null
  showForm.value = true
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="pb-20 pt-4">
    <div class="flex items-center gap-3 mb-4">
      <button @click="goBack" class="p-2 -ml-2 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ categoryName }}</h2>
        <p class="text-sm text-gray-500 mt-0.5">共 {{ categoryItems.length }} 个收藏</p>
      </div>
    </div>

    <div v-if="categoryItems.length === 0" class="text-center py-12">
      <div class="text-5xl mb-4">📭</div>
      <p class="text-gray-500">该分类下还没有收藏</p>
      <button
        @click="handleAddNew"
        class="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
      >
        添加第一个收藏
      </button>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <ItemCard
        v-for="item in categoryItems"
        :key="item.id"
        :item="item"
        @click="handleCardClick"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <button
      @click="handleAddNew"
      class="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl hover:scale-110 transition-all duration-300"
    >
      +
    </button>

    <ItemDetail
      :show="showDetail"
      :item="detailItem"
      @close="handleCloseDetail"
      @edit="handleEditFromDetail"
      @delete="handleDeleteFromDetail"
    />

    <ItemForm
      :show="showForm"
      :item="editingItem"
      :loading="formLoading"
      @close="handleCloseForm"
      @save="handleSave"
    />
  </div>
</template>
