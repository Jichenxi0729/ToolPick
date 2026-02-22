<script setup>
import { ref } from 'vue'
import GradientButton from './GradientButton.vue'
import { parseWithAI } from '../../services/api'

const emit = defineEmits(['parsed', 'manual-edit'])

const inputText = ref('')
const loading = ref(false)
const error = ref('')

const handleAIParse = async () => {
  if (!inputText.value.trim()) {
    error.value = '请输入内容'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    const result = await parseWithAI(inputText.value.trim())
    emit('parsed', result)
  } catch (e) {
    error.value = '解析失败，请重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleManualEdit = () => {
  emit('manual-edit')
}

const clearInput = () => {
  inputText.value = ''
  error.value = ''
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
    <textarea
      v-model="inputText"
      @keydown.ctrl.enter="handleAIParse"
      placeholder="粘贴或输入自然语言描述，例如：推荐一个非常好用的手机挂载网盘工具，名字叫XX，速度快、免费。网址是 https://example.com"
      class="w-full min-h-[120px] p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
    ></textarea>
    
    <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>
    
    <div class="flex gap-3 mt-4">
      <GradientButton 
        :loading="loading" 
        @click="handleAIParse"
        class="flex-1"
      >
        <span>✨ AI智能解析</span>
      </GradientButton>
      
      <button
        @click="handleManualEdit"
        class="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        手动编辑
      </button>
      
      <button
        v-if="inputText"
        @click="clearInput"
        class="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>
