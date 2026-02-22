<script setup>
import { ref, watch, computed } from 'vue'
import GradientButton from '../common/GradientButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const types = ['工具', 'APP', '物品', '网站', '资源', '自定义']
const categorySuggestions = [
  '云存储', '图像处理', '视频处理', '笔记工具', '效率工具', 
  '开发工具', '设计工具', '文档工具', '协作工具', '其他'
]

const form = ref({
  name: '',
  type: '自定义',
  icon: '📦',
  category: '',
  tags: '',
  advantages: '',
  scenario: '',
  comment: '',
  link: ''
})

const isEditing = computed(() => !!props.item)

const resetForm = () => {
  form.value = {
    name: '',
    type: '自定义',
    icon: '',
    category: '',
    tags: '',
    advantages: '',
    scenario: '',
    comment: '',
    link: ''
  }
}

watch(() => props.item, (newItem) => {
  if (newItem) {
    form.value = {
      name: newItem.name || '',
      type: newItem.type || '自定义',
      icon: newItem.icon || '📦',
      category: newItem.category || '',
      tags: Array.isArray(newItem.tags) ? newItem.tags.join(', ') : '',
      advantages: newItem.advantages || '',
      scenario: newItem.scenario || '',
      comment: newItem.comment || '',
      link: newItem.link || newItem.url || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSave = () => {
  const itemData = {
    ...form.value,
    tags: form.value.tags.split(',').map(t => t.trim()).filter(t => t)
  }
  emit('save', itemData)
}

const handleClose = () => {
  resetForm()
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
            <h2 class="text-lg font-semibold text-gray-900">
              {{ isEditing ? '编辑收藏' : '新增收藏' }}
            </h2>
            <button @click="handleClose" class="p-2 -mr-2 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="输入名称"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <input
                  v-model="form.category"
                  type="text"
                  list="category-suggestions"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="输入分类"
                />
                <datalist id="category-suggestions">
                  <option v-for="c in categorySuggestions" :key="c" :value="c" />
                </datalist>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">图标</label>
              <input
                v-model="form.icon"
                type="url"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="输入图标图片网址"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <input
                v-model="form.tags"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="用逗号分隔，如：免费, 速度快"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">优点</label>
              <textarea
                v-model="form.advantages"
                rows="2"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="描述优点"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">使用场景</label>
              <input
                v-model="form.scenario"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="使用场景"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">个人评价</label>
              <textarea
                v-model="form.comment"
                rows="2"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="个人评价"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">网址</label>
              <input
                v-model="form.link"
                type="url"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="https://"
              />
            </div>

            <div class="flex gap-3 pt-4">
              <GradientButton 
                type="submit" 
                :loading="loading" 
                class="flex-1"
              >
                <span>保存</span>
              </GradientButton>
              
              <button
                type="button"
                @click="handleClose"
                class="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                取消
              </button>
            </div>
          </form>
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
