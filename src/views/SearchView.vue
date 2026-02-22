<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemCard from '../components/item/ItemCard.vue'
import ItemForm from '../components/item/ItemForm.vue'
import ItemDetail from '../components/item/ItemDetail.vue'
import { useItems } from '../composables/useItems'

const route = useRoute()
const router = useRouter()
const { items, search, fetchItems, addItem, editItem, removeItem } = useItems()

const showForm = ref(false)
const showDetail = ref(false)
const editingItem = ref(null)
const detailItem = ref(null)
const formLoading = ref(false)
const isSearching = ref(false)

const searchQuery = ref(route.query.q || '')

const doSearch = async (query) => {
  isSearching.value = true
  try {
    if (query) {
      await search(query)
    } else {
      await fetchItems()
    }
  } finally {
    isSearching.value = false
  }
}

onMounted(async () => {
  await doSearch(searchQuery.value)
})

watch(() => route.query.q, async (newQuery) => {
  const query = newQuery || ''
  searchQuery.value = query
  await doSearch(query)
}, { immediate: false })

onBeforeUnmount(() => {
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
      await addItem(formData)
    }
    
    showForm.value = false
    editingItem.value = null
    
    if (searchQuery.value) {
      await search(searchQuery.value)
    }
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
        <h2 class="text-lg font-semibold text-gray-900">搜索结果</h2>
        <p class="text-sm text-gray-500 mt-0.5">"{{ searchQuery }}" 找到 {{ items.length }} 个结果</p>
      </div>
    </div>

    <div v-if="isSearching" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="text-5xl mb-4">🔍</div>
      <p class="text-gray-500">没有找到相关收藏</p>
      <p class="text-sm text-gray-400 mt-1">试试其他关键词</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="handleCardClick"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

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
