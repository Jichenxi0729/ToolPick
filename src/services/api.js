const SILICONFLOW_API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || ''
const SILICONFLOW_MODEL = import.meta.env.VITE_SILICONFLOW_MODEL || 'Pro/deepseek-ai/DeepSeek-V3.1-Terminus'
const SILICONFLOW_BASE_URL = 'https://api.siliconflow.cn/v1'

const SYSTEM_PROMPT = `你是一个智能工具/物品/资源分析助手，请根据用户提供的描述，生成结构化的工具信息。 
 
 用户输入：""" 
 {content} 
 """ 
 
 请严格按照以下 JSON 格式输出，确保所有字段都有合理的值： 
 
 { 
   "name": "工具名称", 
   "icon": "图标图片地址", 
   "type": "工具 | APP | 物品 | 网站 | 资源 | 其他", 
   "category": "分类", 
   "tags": ["标签1","标签2"], 
   "advantages": "优点", 
   "scenario": "使用场景", 
   "comment": "个人评价", 
   "link": "官网/下载页/来源链接" 
 } 
 
 注意事项： 
 1. 从用户输入中提取关键信息，无法确定的信息请根据常识合理推测 
 2. icon 请从用户输入中提取图标图片地址，如果没有则留空 
 3. type 请从给定的选项中选择最合适的一个 
 4. category 请给出具体的分类，如 "网盘工具"、"图片工具"、"硬件设备" 等 
 5. tags 请提取或总结相关的标签，如 "免费"、"开源"、"效率" 等 
 6. advantages 请基于用户描述和常识给出 
 7. scenario 请描述该工具的典型使用场景 
 8. comment 请给出基于用户描述的个人评价 
 9. link 请从用户输入中提取链接，如果没有则留空 
 10. 确保输出是有效的 JSON 格式，不要包含任何额外的文本`

const MOCK_DELAY = 1500

const mockAIResponse = (text) => {
  const lowerText = text.toLowerCase()
  
  let type = '自定义'
  let icon = '📦'
  let category = '未分类'
  let tags = []
  let name = ''
  let link = null

  if (lowerText.includes('app') || lowerText.includes('应用') || lowerText.includes('软件')) {
    type = 'APP'
    icon = '📱'
  } else if (lowerText.includes('网站') || lowerText.includes('网页') || lowerText.includes('http')) {
    type = '网站'
    icon = '🌐'
  } else if (lowerText.includes('工具')) {
    type = '工具'
    icon = '🔧'
  } else if (lowerText.includes('资源') || lowerText.includes('资料')) {
    type = '资源'
    icon = '📚'
  }

  if (lowerText.includes('云盘') || lowerText.includes('网盘') || lowerText.includes('存储')) {
    category = '云存储'
    tags.push('云存储')
  } else if (lowerText.includes('图片') || lowerText.includes('图像') || lowerText.includes('photo')) {
    category = '图像处理'
    tags.push('图像')
  } else if (lowerText.includes('视频') || lowerText.includes('video')) {
    category = '视频处理'
    tags.push('视频')
  } else if (lowerText.includes('笔记') || lowerText.includes('文档')) {
    category = '笔记工具'
    tags.push('笔记')
  }

  if (lowerText.includes('免费')) {
    tags.push('免费')
  }
  if (lowerText.includes('快') || lowerText.includes('速度')) {
    tags.push('速度快')
  }
  if (lowerText.includes('简单') || lowerText.includes('易用')) {
    tags.push('易用')
  }

  const urlMatch = text.match(/https?:\/\/[^\s]+/i)
  if (urlMatch) {
    link = urlMatch[0]
  }

  const nameMatch = text.match(/名字[叫是](\S+)|名称(\S+)|叫(\S+)/i)
  if (nameMatch) {
    name = nameMatch[1] || nameMatch[2] || nameMatch[3] || '未命名'
  } else if (text.length > 5) {
    const words = text.split(/[\s,，。]/).filter(w => w.length > 1)
    name = words[0] || '未命名'
  }

  return {
    name: name || '未命名',
    type,
    icon,
    category: category === '未分类' ? '其他' : category,
    tags: tags.slice(0, 3),
    advantages: lowerText.includes('好') ? '好用' : '',
    scenario: '',
    comment: '',
    link
  }
}

const parseAIResponse = (content) => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }
  return null
}

export const parseWithAI = async (text) => {
  console.log('=== AI Parsing Test ===')
  console.log('API Key:', SILICONFLOW_API_KEY ? 'configured' : 'missing')
  console.log('Model:', SILICONFLOW_MODEL)
  console.log('Input:', text)
  
  if (!SILICONFLOW_API_KEY) {
    console.warn('No API key configured, using mock data')
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))
    return mockAIResponse(text)
  }

  try {
    console.log('Calling SiliconFlow API...')
    const response = await fetch(`${SILICONFLOW_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: SILICONFLOW_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT.replace('{content}', text) },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 1024
      })
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API response:', data)
    
    const content = data.choices?.[0]?.message?.content
    console.log('AI content:', content)
    
    if (!content) {
      throw new Error('No content in response')
    }

    const parsed = parseAIResponse(content)
    console.log('Parsed result:', parsed)
    if (parsed) {
      return parsed
    }
    
    return mockAIResponse(text)
  } catch (error) {
    console.error('AI API error:', error)
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))
    return mockAIResponse(text)
  }
}
