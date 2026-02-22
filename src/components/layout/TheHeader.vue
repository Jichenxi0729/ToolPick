<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['update:activeTab', 'search'])

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}
</script>

<template>
  <div class="bg-white px-4 py-3">
    <div class="relative">
      <input
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="搜索名称或标签..."
        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
      />
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  </div>
</template>
