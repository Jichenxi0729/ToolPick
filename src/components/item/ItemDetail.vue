<script setup>
import { computed } from 'vue'
import { ExternalLink, Pencil, Trash2, X } from 'lucide-vue-next'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])

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

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  if (confirm(`确定要删除 "${props.item.name}" 吗？`)) {
    emit('delete', props.item)
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="handleClose"></div>
        
        <div class="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">详情</h2>
            <button @click="handleClose" class="p-2 -mr-2 text-gray-400 hover:text-gray-600">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="flex items-center gap-4">
              <img 
                v-if="isIconUrl" 
                :src="item.icon" 
                class="w-16 h-16 rounded-xl object-cover"
                :alt="item.name"
              />
              <div v-else class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900">{{ item.name || '未命名' }}</h3>
                <span 
                  :class="[
                    'inline-block px-2 py-1 rounded-lg text-xs font-medium mt-1',
                    item.type === '工具' ? 'bg-blue-100 text-blue-700' :
                    item.type === 'APP' ? 'bg-purple-100 text-purple-700' :
                    item.type === '网站' ? 'bg-green-100 text-green-700' :
                    item.type === '资源' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ item.type || '其他' }}
                </span>
              </div>
            </div>

            <div v-if="item.category" class="pt-2">
              <span class="text-sm text-gray-500">分类：</span>
              <span class="text-sm font-medium text-gray-900">{{ item.category }}</span>
            </div>

            <div v-if="tagsArray.length > 0">
              <span class="text-sm text-gray-500 block mb-1">标签：</span>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in tagsArray" 
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div v-if="item.advantages">
              <span class="text-sm text-gray-500 block mb-1">优点：</span>
              <p class="text-sm text-gray-900">{{ item.advantages }}</p>
            </div>

            <div v-if="item.scenario">
              <span class="text-sm text-gray-500 block mb-1">使用场景：</span>
              <p class="text-sm text-gray-900">{{ item.scenario }}</p>
            </div>

            <div v-if="item.comment">
              <span class="text-sm text-gray-500 block mb-1">个人评价：</span>
              <p class="text-sm text-gray-900">{{ item.comment }}</p>
            </div>

            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm"
            >
              <ExternalLink class="w-4 h-4" />
              打开链接
            </a>

            <div class="flex gap-3 pt-4 border-t border-gray-100">
              <button
                @click="handleEdit"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Pencil class="w-4 h-4" />
                编辑
              </button>
              <button
                @click="handleDelete"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
