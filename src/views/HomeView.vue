<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AIParser from '../components/common/AIParser.vue'
import ItemCard from '../components/item/ItemCard.vue'
import ItemForm from '../components/item/ItemForm.vue'
import ItemDetail from '../components/item/ItemDetail.vue'
import { useItems } from '../composables/useItems'

const router = useRouter()
const route = useRoute()
const { items, loading, fetchItems, addItem, editItem, removeItem } = useItems()

const showAIParser = ref(false)
const showForm = ref(false)
const showDetail = ref(false)
const editingItem = ref(null)
const detailItem = ref(null)
const formLoading = ref(false)

onMounted(() => {
  fetchItems()
  if (route.query.add === 'true') {
    showAIParser.value = true
    router.replace({ path: '/' })
  }
})

watch(() => route.query.add, (val) => {
  if (val === 'true') {
    showAIParser.value = true
    router.replace({ path: '/' })
  }
})

const handleParsed = (parsedData) => {
  editingItem.value = {
    ...parsedData,
    id: null
  }
  showAIParser.value = false
  showForm.value = true
}

const handleManualEdit = () => {
  editingItem.value = null
  showAIParser.value = false
  showForm.value = true
}

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
    await fetchItems()
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

const openAIParser = () => {
  showAIParser.value = true
}
</script>

<template>
  <div class="pb-20 pt-4">
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-gray-900">我的收藏</h2>
      <p class="text-base text-gray-500 mt-1">共 {{ items.length }} 个收藏</p>
    </div>

    <div v-if="loading && items.length === 0" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="items.length === 0" class="text-center py-12">
      <div class="text-5xl mb-4">📭</div>
      <p class="text-gray-500">还没有收藏</p>
      <p class="text-sm text-gray-400 mt-1">点击右下角按钮添加收藏</p>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <TransitionGroup name="list">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @click="handleCardClick"
        />
      </TransitionGroup>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAIParser" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" @click="showAIParser = false"></div>
          
          <div class="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">添加收藏</h2>
              <button @click="showAIParser = false" class="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <div class="p-4">
              <AIParser @parsed="handleParsed" @manual-edit="handleManualEdit" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
