export const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getTypeColor = (type) => {
  const colors = {
    '工具': 'bg-blue-100 text-blue-700',
    'APP': 'bg-purple-100 text-purple-700',
    '物品': 'bg-green-100 text-green-700',
    '网站': 'bg-orange-100 text-orange-700',
    '资源': 'bg-yellow-100 text-yellow-700',
    '自定义': 'bg-gray-100 text-gray-700'
  }
  return colors[type] || colors['自定义']
}

export const getCategoryColor = (category) => {
  const colors = [
    'bg-sky-100 text-sky-700',
    'bg-rose-100 text-rose-700', 
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-violet-100 text-violet-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-lime-100 text-lime-700'
  ]
  
  let hash = 0
  for (let i = 0; i < (category || '').length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}
