<script setup>
import { computed } from 'vue'
import { FolderOpen } from 'lucide-vue-next'
import { getCategoryColor } from '../../utils/helpers'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div 
    @click="emit('click', name)"
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
  >
    <div class="flex items-center gap-4">
      <div :class="['p-3 rounded-xl', getCategoryColor(name)]">
        <FolderOpen class="w-6 h-6" />
      </div>
      
      <div class="flex-1">
        <h3 class="font-semibold text-gray-900 text-base">{{ name }}</h3>
        <p class="text-sm text-gray-500 mt-0.5">{{ count }} 个收藏</p>
      </div>
      
      <div class="text-gray-300 group-hover:text-gray-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>
