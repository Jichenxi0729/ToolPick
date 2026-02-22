<script setup>
import { computed } from 'vue'
import { formatDate, truncateText, getTypeColor, getCategoryColor } from '../../utils/helpers'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'edit', 'delete'])

const displayText = computed(() => {
  return props.item.advantages || props.item.comment || ''
})

const tagsArray = computed(() => {
  if (Array.isArray(props.item.tags)) {
    return props.item.tags
  }
  return []
})

const isIconUrl = computed(() => {
  const icon = props.item.icon
  return icon && (icon.startsWith('http://') || icon.startsWith('https://'))
})
</script>

<template>
  <div 
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
    @click="emit('click', item)"
  >
    <div class="flex items-center gap-2 mb-2">
      <img 
        v-if="isIconUrl" 
        :src="item.icon" 
        class="w-8 h-8 rounded-lg object-cover flex-shrink-0"
        :alt="item.name"
      />
      <div v-else class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="font-semibold text-gray-900 text-base leading-tight truncate min-w-0 flex-1">{{ item.name || '未命名' }}</h3>
    </div>

    <p v-if="displayText" class="text-xs text-gray-500 mb-2 line-clamp-2">
      {{ truncateText(displayText, 80) }}
    </p>

    <div class="flex items-center gap-1.5 flex-wrap mb-1">
      <span 
        :class="[
          'px-2 py-0.5 rounded text-xs font-medium',
          getCategoryColor(item.category)
        ]"
      >
        {{ item.category || '未分类' }}
      </span>
      <span 
        :class="[
          'px-2 py-0.5 rounded text-xs font-medium',
          getTypeColor(item.type)
        ]"
      >
        {{ item.type || '自定义' }}
      </span>
    </div>

    <div class="text-xs text-gray-400">
      {{ formatDate(item.created_at) }}
    </div>
  </div>
</template>
