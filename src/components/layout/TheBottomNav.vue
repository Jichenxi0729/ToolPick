<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Home, FolderOpen, Plus } from 'lucide-vue-next'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['update:activeTab', 'add'])

const router = useRouter()

const tabs = [
  { id: 'home', label: '首页', path: '/' },
  { id: 'category', label: '分类', path: '/category' }
]

const handleTabClick = (tab) => {
  emit('update:activeTab', tab.id)
  router.push(tab.path)
}

const handleAdd = () => {
  emit('add')
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-40">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="handleTabClick(tab)"
      :class="[
        'flex-1 py-3 flex items-center justify-center gap-2 transition-colors',
        activeTab === tab.id
          ? 'text-blue-500'
          : 'text-gray-400 hover:text-gray-600'
      ]"
    >
      <Home v-if="tab.id === 'home'" class="w-5 h-5" />
      <FolderOpen v-else class="w-5 h-5" />
      <span class="text-sm font-medium">{{ tab.label }}</span>
    </button>

    <button
      @click="handleAdd"
      class="flex-1 py-3 flex items-center justify-center gap-2 text-blue-500"
    >
      <Plus class="w-5 h-5" />
      <span class="text-sm font-medium">添加</span>
    </button>
  </nav>
</template>
