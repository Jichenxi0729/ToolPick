<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheContainer from './components/layout/TheContainer.vue'
import TheBottomNav from './components/layout/TheBottomNav.vue'
import TheHeader from './components/layout/TheHeader.vue'

const route = useRoute()
const router = useRouter()

const activeTab = ref('home')

const routeToTab = {
  '/': 'home',
  '/category': 'category'
}

watch(() => route.path, (path) => {
  activeTab.value = routeToTab[path] || 'home'
}, { immediate: true })

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const handleSearch = (keyword) => {
  if (keyword.trim()) {
    router.push({ path: '/search', query: { q: keyword.trim() } })
  }
}

const handleAddClick = () => {
  router.push({ path: '/', query: { add: 'true' } })
}
</script>

<template>
  <TheContainer>
    <TheHeader 
      v-if="route.path !== '/search'"
      :active-tab="activeTab" 
      @update:activeTab="handleTabChange"
      @search="handleSearch"
    />
    
    <div class="content-area" :class="{ 'pt-4': route.path === '/search' }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </TheContainer>
  
  <TheBottomNav 
    :active-tab="activeTab" 
    @update:activeTab="handleTabChange"
    @add="handleAddClick"
  />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-area {
  padding: 0 1rem;
  min-height: calc(100vh - 50px - 56px);
  overflow-y: auto;
}
</style>
