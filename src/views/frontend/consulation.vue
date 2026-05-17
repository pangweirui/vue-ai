<template>
  <main class="consultation-page">
    <div class="consultation-shell">
      <aside class="sidebar-panel">
        <section class="assistant-panel">
          <div class="assistant-mark">
            <el-avatar :size="54" :src="logo" />
            <span class="status-dot"></span>
          </div>
          <div class="assistant-copy">
            <h1>心晴倾听</h1>
            <p>AI 心理咨询助手</p>
          </div>
          <el-tag class="online-tag" type="success" effect="light">
            <el-icon><CircleCheck /></el-icon>
            在线
          </el-tag>
        </section>

        <section class="emotion-panel" :class="riskClass">
          <div class="panel-heading">
            <div>
              <p>Emotion</p>
              <h2>情绪观察</h2>
            </div>
            <el-icon><Sunny /></el-icon>
          </div>

          <div class="emotion-summary">
            <div class="emotion-meter">
              <strong>{{ currentEmotion.primaryEmotion || '平稳' }}</strong>
              <span>{{ emotionStatusText }}</span>
            </div>
            <div class="emotion-risk">
              <span>风险等级</span>
              <strong>{{ getRiskText(riskLevel) }}</strong>
              <div class="risk-dots" aria-hidden="true">
                <i
                  v-for="index in 3"
                  :key="index"
                  :class="{ active: index <= intensityLevel }"
                ></i>
              </div>
            </div>
          </div>

          <div v-if="currentEmotion.suggestion" class="suggestion-row">
            <el-icon><Memo /></el-icon>
            <p>{{ currentEmotion.suggestion }}</p>
          </div>

          <div v-if="emotionActions.length" class="action-list">
            <div
              v-for="(item, index) in emotionActions"
              :key="`${item}-${index}`"
              class="action-item"
            >
              <span>{{ index + 1 }}</span>
              <p>{{ item }}</p>
            </div>
          </div>

          <div v-if="showRiskNotice" class="risk-notice">
            <el-icon><WarningFilled /></el-icon>
            <p>{{ currentEmotion.riskDescription || '当前情绪波动较大，建议及时联系可信任的人或专业支持。' }}</p>
          </div>
        </section>

        <section class="history-panel">
          <div class="panel-heading history-heading">
            <div>
              <p>Sessions</p>
              <h2>会话历史</h2>
            </div>
            <el-button :icon="Refresh" circle :loading="sessionListLoading" @click="getSessionList" />
          </div>

          <el-skeleton v-if="sessionListLoading && sessionList.length === 0" :rows="4" animated />

          <div v-else-if="sessionList.length" class="session-list">
            <article
              v-for="session in sessionList"
              :key="getSessionKey(session)"
              class="session-item"
              :class="{ active: isActiveSession(session) }"
              @click="selectSession(session)"
            >
              <div class="session-copy">
                <div class="session-title-row">
                  <h3>{{ session.sessionTitle }}</h3>
                  <span>{{ formatTime(session.lastMessageTime) }}</span>
                </div>
                <p>{{ session.lastMessageContent || '暂无消息内容' }}</p>
                <div class="session-meta">
                  <span>
                    <el-icon><ChatRound /></el-icon>
                    {{ session.messageCount ?? 0 }}
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ session.durationMinutes ?? 0 }} 分钟
                  </span>
                </div>
              </div>

              <div class="session-actions" @click.stop>
                <el-dropdown trigger="click" @command="(command) => handleSessionCommand(command, session)">
                  <el-button :icon="MoreFilled" text circle />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="delete">
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </article>
          </div>

          <el-empty v-else description="还没有会话记录" :image-size="92" />
        </section>
      </aside>

      <section class="chat-panel">
        <header class="chat-header">
          <div class="header-left">
            <el-avatar :size="44" :src="logo" />
            <div>
              <p>当前会话</p>
              <h2>{{ currentSessionTitle }}</h2>
            </div>
          </div>

          <div class="header-actions">
            <span>{{ messageCountText }}</span>
            <el-button :icon="Plus" type="primary" plain @click="createNewFrontendSession">
              新建会话
            </el-button>
          </div>
        </header>

        <div ref="messagesRef" class="messages-panel" v-loading="sessionLoading">
          <div v-if="messages.length === 0 && !sessionLoading" class="welcome-state">
            <el-avatar :size="58" :src="logo" />
            <h3>你好，我在这里听你说</h3>
            <p>可以从最近困扰你的事情开始，也可以只说一句“我今天有点累”。</p>
          </div>

          <article
            v-for="msg in messages"
            :key="msg.id"
            class="message-item"
            :class="{
              'user-message': isUserMessage(msg),
              'ai-message': !isUserMessage(msg),
              'error-message': msg.isError,
            }"
          >
            <el-avatar
              class="message-avatar"
              :size="34"
              :src="isUserMessage(msg) ? users : logo"
            />

            <div class="message-body">
              <div class="message-meta">
                <span>{{ isUserMessage(msg) ? '我' : '心晴倾听' }}</span>
                <time>{{ msg.createdAt || '刚刚' }}</time>
              </div>

              <div class="message-bubble">
                <div
                  v-if="isTypingMessage(msg)"
                  class="typing-indicator"
                  aria-label="AI 正在输入"
                >
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <MarkdownRenderer
                  v-else-if="!isUserMessage(msg)"
                  :content="msg.content || msg.errorMessage || ''"
                  :is-ai-message="true"
                />
                <p v-else>{{ msg.content }}</p>

                <div v-if="msg.isError && msg.retryContent" class="message-actions">
                  <el-button
                    size="small"
                    :icon="Refresh"
                    :loading="msg.retrying"
                    :disabled="isSending && !msg.retrying"
                    @click="retryAIMessage(msg)"
                  >
                    重新生成
                  </el-button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <footer class="chat-input-panel">
          <div v-if="messages.length === 0" class="quick-prompts">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              type="button"
              :disabled="isSending"
              @click="useQuickPrompt(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <div class="input-row">
            <el-input
              v-model="userMessage"
              class="message-input"
              type="textarea"
              resize="none"
              :rows="3"
              maxlength="800"
              show-word-limit
              :disabled="isSending"
              placeholder="把你想说的话写在这里"
              @keydown="handleKeyDown"
            />
            <el-button
              v-if="isAiTyping"
              class="stop-btn"
              :icon="Close"
              title="停止生成"
              @click="stopGenerating"
            />
            <el-button
              v-else
              type="primary"
              class="send-btn"
              :icon="Promotion"
              :loading="sessionCreating"
              :disabled="!canSend"
              title="发送"
              @click="sendMessage"
            />
          </div>
        </footer>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatRound,
  CircleCheck,
  Clock,
  Close,
  Delete,
  Memo,
  MoreFilled,
  Plus,
  Promotion,
  Refresh,
  Sunny,
  WarningFilled,
} from '@element-plus/icons-vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { deleteSession, getSession, getSessionDatail, gwtSessionEmotion, startSession } from '@/apis/frontend'
import MarkdownRenderer from '@/components/frontend/MarkdownRenderer.vue'
import logo from '@/assets/images/xinqing-logo.svg'
import users from '@/assets/images/user.jpg'

const createDefaultEmotion = () => ({
  primaryEmotion: '平稳',
  isNegative: false,
  emotionScore: 0,
  riskLevel: 0,
  suggestion: '开始对话后，我会结合本次咨询内容给出更贴近你的情绪观察。',
  improvementSuggestions: ['先把感受说出来', '给自己一点暂停时间', '需要时联系可信任的人'],
  improvmentSuggestions: ['先把感受说出来', '给自己一点暂停时间', '需要时联系可信任的人'],
  riskDescription: '',
})

const userMessage = ref('')
const isAiTyping = ref(false)
const sessionCreating = ref(false)
const sessionLoading = ref(false)
const sessionListLoading = ref(false)
const currentSession = ref({})
const sessionList = ref([])
const messages = ref([])
const currentEmotion = ref(createDefaultEmotion())
const messagesRef = ref(null)
const streamController = ref(null)
const activeAiMessageId = ref('')
const stopRequested = ref(false)

const quickPrompts = [
  '我最近总是睡不好',
  '我今天情绪很低落',
  '我想整理一下压力来源',
]

const currentSessionTitle = computed(() => currentSession.value.sessionTitle || '新的倾听会话')
const messageCountText = computed(() => `${messages.value.length} 条消息`)
const riskLevel = computed(() => normalizeRiskLevel(currentEmotion.value?.riskLevel, currentEmotion.value))
const intensityLevel = computed(() => getIntensity(currentEmotion.value?.emotionScore ?? 0))
const emotionActions = computed(() => {
  return currentEmotion.value?.improvementSuggestions
    ?? currentEmotion.value?.improvmentSuggestions
    ?? []
})
const showRiskNotice = computed(() => riskLevel.value > 1 && Boolean(currentEmotion.value?.isNegative))
const emotionStatusText = computed(() => (currentEmotion.value?.isNegative ? '需要关注' : '状态稳定'))
const riskClass = computed(() => `risk-${Math.min(Math.max(riskLevel.value, 0), 3)}`)
const isSending = computed(() => isAiTyping.value || sessionCreating.value)
const canSend = computed(() => Boolean(userMessage.value.trim()) && !isSending.value)

const makeLocalId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

const formatTime = (value) => {
  if (!value) {
    return '刚刚'
  }

  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('MM-DD HH:mm') : String(value)
}

const formatFullTime = (value = new Date()) => {
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm') : '刚刚'
}

const buildSessionTitle = (content) => {
  const title = content.replace(/\s+/g, ' ').slice(0, 18)
  return title || '新的倾听会话'
}

const normalizeSession = (session = {}) => {
  const id = session.id ?? session.sessionId ?? makeLocalId('session')
  return {
    ...session,
    id,
    sessionId: session.sessionId ?? id,
    sessionTitle: session.sessionTitle || '未命名会话',
    lastMessageContent: session.lastMessageContent || '暂无消息内容',
    lastMessageTime: session.lastMessageTime || session.updatedAt || session.createdAt || '',
    messageCount: Number(session.messageCount ?? 0),
    durationMinutes: Number(session.durationMinutes ?? 0),
    status: session.status || 'ACTIVE',
  }
}

const normalizeMessage = (item = {}, index = 0) => {
  const senderType = Number(item.senderType ?? (item.role === 'user' ? 1 : 2))
  return {
    ...item,
    id: item.id ?? makeLocalId(`message_${index}`),
    senderType,
    content: item.content ?? item.message ?? '',
    createdAt: formatFullTime(item.createdAt || item.createTime || item.sentAt),
    isError: Boolean(item.isError),
    errorMessage: item.errorMessage || '',
  }
}

const normalizeMessages = (res) => {
  const records = Array.isArray(res) ? res : (res?.records ?? res?.messages ?? [])
  return records.map(normalizeMessage)
}

const parseRiskLevelValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return null
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(Math.max(Math.round(value), 0), 3)
  }

  const text = String(value).trim().toLowerCase()
  const numericValue = Number(text)
  if (Number.isFinite(numericValue)) {
    return Math.min(Math.max(Math.round(numericValue), 0), 3)
  }

  if (/高|严重|危急|high|severe|critical/.test(text)) {
    return 3
  }
  if (/中|medium|moderate/.test(text)) {
    return 2
  }
  if (/低|轻|low|mild/.test(text)) {
    return 1
  }
  if (/无|正常|稳定|平稳|none|normal|stable/.test(text)) {
    return 1
  }

  return null
}

const normalizeRiskLevel = (value, emotion = {}) => {
  const directLevel = parseRiskLevelValue(value)
  if (directLevel !== null) {
    return directLevel
  }

  const riskCandidates = [
    emotion.riskLevel,
    emotion.risk_level,
    emotion.risk,
    emotion.riskGrade,
    emotion.riskLevelText,
    emotion.riskText,
    emotion.level,
  ]

  for (const item of riskCandidates) {
    const parsed = parseRiskLevelValue(item)
    if (parsed !== null) {
      return parsed
    }
  }

  const score = Number(emotion.riskScore ?? emotion.emotionScore ?? 0)
  if (!Number.isFinite(score) || score <= 0) {
    return 0
  }
  if (score >= 70) {
    return 3
  }
  if (score >= 35) {
    return 2
  }
  return 1
}

const normalizeEmotion = (emotion = {}) => {
  const fallback = createDefaultEmotion()
  const actions = emotion.improvementSuggestions ?? emotion.improvmentSuggestions ?? fallback.improvementSuggestions
  const riskLevel = normalizeRiskLevel(
    emotion.riskLevel
      ?? emotion.risk_level
      ?? emotion.risk
      ?? emotion.riskGrade
      ?? emotion.riskLevelText
      ?? emotion.riskText,
    emotion,
  )
  return {
    ...fallback,
    ...emotion,
    primaryEmotion: emotion.primaryEmotion || fallback.primaryEmotion,
    emotionScore: Number(emotion.emotionScore ?? fallback.emotionScore),
    riskLevel,
    improvementSuggestions: actions,
    improvmentSuggestions: actions,
  }
}

const collectSessionKeys = (session = {}) => {
  const rawKeys = [session.id, session.sessionId].filter((item) => item !== undefined && item !== null && item !== '')
  const keys = new Set()

  rawKeys.forEach((item) => {
    const value = String(item)
    keys.add(value)
    if (value.startsWith('session_')) {
      keys.add(value.replace(/^session_/, ''))
    } else if (!value.startsWith('temp_')) {
      keys.add(`session_${value}`)
    }
  })

  return keys
}

const getSessionKey = (session) => String(session.id ?? session.sessionId)

const getActiveSessionKeys = () => {
  return collectSessionKeys(currentSession.value)
}

const isActiveSession = (session) => {
  const activeKeys = getActiveSessionKeys()
  return Array.from(collectSessionKeys(session)).some((key) => activeKeys.has(key))
}

const isUserMessage = (msg) => Number(msg.senderType) === 1

const isTypingMessage = (msg) => {
  return !isUserMessage(msg) && isAiTyping.value && msg.id === activeAiMessageId.value && !msg.content
}

const getIntensity = (score) => {
  const value = Number(score)
  if (value >= 70) {
    return 3
  }
  if (value >= 35) {
    return 2
  }
  if (value > 0) {
    return 1
  }
  return 0
}

const getRiskText = (level) => {
  switch (normalizeRiskLevel(level)) {
    case 1:
      return '低风险'
    case 2:
      return '中风险'
    case 3:
      return '高风险'
    default:
      return '未评估'
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

const createNewFrontendSession = () => {
  if (isAiTyping.value) {
    ElMessage.warning('当前回复还在生成中，可以先停止后再新建会话')
    return
  }

  const tempId = `temp_${Date.now()}`
  currentSession.value = {
    id: tempId,
    sessionId: tempId,
    sessionTitle: '新的倾听会话',
    status: 'TEMP',
  }
  messages.value = []
  userMessage.value = ''
  currentEmotion.value = createDefaultEmotion()
  scrollToBottom()
}

const getSessionList = async () => {
  sessionListLoading.value = true
  try {
    const res = await getSession({
      currentPage: 1,
      size: 20,
      pageNum: 1,
      pageSize: 20,
    })
    const records = Array.isArray(res) ? res : (res?.records ?? [])
    sessionList.value = records.map(normalizeSession)
  } catch {
    sessionList.value = []
  } finally {
    sessionListLoading.value = false
  }
}

const formatEmotionSessionId = (sessionId) => {
  const value = String(sessionId || '')
  if (!value || value.startsWith('temp_')) {
    return ''
  }
  return value.startsWith('session_') ? value : `session_${value}`
}

const getEmotion = async (sessionId) => {
  const targetId = formatEmotionSessionId(sessionId)
  if (!targetId) {
    currentEmotion.value = createDefaultEmotion()
    return
  }

  try {
    const res = await gwtSessionEmotion(targetId)
    currentEmotion.value = normalizeEmotion(res)
  } catch {
    currentEmotion.value = createDefaultEmotion()
  }
}

const selectSession = async (session) => {
  if (isAiTyping.value) {
    ElMessage.warning('请先停止当前回复，再切换会话')
    return
  }

  const normalized = normalizeSession(session)
  sessionLoading.value = true
  currentSession.value = normalized
  messages.value = []

  try {
    const res = await getSessionDatail(normalized.id)
    messages.value = normalizeMessages(res)
    await getEmotion(normalized.sessionId ?? normalized.id)
    await scrollToBottom()
  } catch {
    ElMessage.error('会话详情加载失败')
  } finally {
    sessionLoading.value = false
  }
}

const handleSessionCommand = (command, session) => {
  if (command === 'delete') {
    deleteSessionById(session)
  }
}

const deleteSessionById = async (session) => {
  if (isAiTyping.value) {
    ElMessage.warning('请先停止当前回复，再删除会话')
    return
  }

  const normalized = normalizeSession(session)
  try {
    await ElMessageBox.confirm('删除后无法恢复，确定删除这段会话吗？', '删除会话', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteSession(normalized.id)
    if (isActiveSession(normalized)) {
      createNewFrontendSession()
    }
    await getSessionList()
    ElMessage.success('会话已删除')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('删除失败，请稍后再试')
    }
  }
}

const ensureActiveSession = async (initialMessage) => {
  if (currentSession.value?.status !== 'TEMP') {
    return currentSession.value.sessionId ?? currentSession.value.id
  }

  sessionCreating.value = true
  try {
    const title = buildSessionTitle(initialMessage)
    const res = await startSession({
      initialMessage,
      sessionTitle: title,
    })
    const session = normalizeSession({
      ...res,
      sessionTitle: res?.sessionTitle || title,
      status: res?.status || 'ACTIVE',
    })
    currentSession.value = session
    await getSessionList()
    return session.sessionId ?? session.id
  } finally {
    sessionCreating.value = false
  }
}

const useQuickPrompt = (prompt) => {
  userMessage.value = prompt
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const readStreamContent = (payload) => {
  if (typeof payload === 'string') {
    return payload
  }

  const data = payload?.data ?? payload
  if (typeof data === 'string') {
    return data
  }

  return data?.delta ?? data?.content ?? data?.answer ?? data?.message ?? ''
}

const normalizeStreamError = (error) => {
  const message = error?.message || '回复生成失败，请稍后重试'
  if (message.includes('系统繁忙') || message.includes('服务繁忙')) {
    return '对话服务暂时繁忙，请稍后点击“重新生成”。'
  }
  return message
}

const createAIMessage = () => ({
  id: makeLocalId('ai'),
  senderType: 2,
  content: '',
  createdAt: formatFullTime(),
  isError: false,
  errorMessage: '',
  retryContent: '',
  retrySessionId: '',
  retrying: false,
})

const mergeStreamContent = (target, chunk, eventName) => {
  if (!chunk) {
    return
  }

  const text = String(chunk)
  if (['delta', 'chunk'].includes(eventName)) {
    target.content += text
    return
  }

  if (!target.content || text.startsWith(target.content)) {
    target.content = text
  } else if (!target.content.endsWith(text)) {
    target.content += text
  }
}

const applyStreamMessage = (event, target) => {
  const raw = event.data?.trim()
  if (!raw || raw === '[DONE]') {
    return true
  }

  let payload = raw
  try {
    payload = JSON.parse(raw)
  } catch {
    mergeStreamContent(target, raw, event.event)
    return false
  }

  if (payload?.code && String(payload.code) !== '200') {
    const message = payload.msg || 'AI 回复生成失败'
    target.isError = true
    target.errorMessage = message
    target.content = message
    throw new Error(message)
  }

  mergeStreamContent(target, readStreamContent(payload), event.event)
  return Boolean(payload?.data?.done || payload?.done)
}

const startAIResponse = async (sessionId, content, targetMessage = null) => {
  const aiMessage = targetMessage ?? createAIMessage()
  Object.assign(aiMessage, {
    senderType: 2,
    content: '',
    createdAt: formatFullTime(),
    isError: false,
    errorMessage: '',
    retryContent: '',
    retrySessionId: '',
    retrying: Boolean(targetMessage),
  })

  if (!targetMessage) {
    messages.value.push(aiMessage)
  }

  activeAiMessageId.value = aiMessage.id
  isAiTyping.value = true
  stopRequested.value = false
  await scrollToBottom()

  const controller = new AbortController()
  streamController.value = controller
  let completed = false

  try {
    const token = localStorage.getItem('token') || ''
    await fetchEventSource('/api/psychological-chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: token,
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        message: content,
        sessionId,
      }),
      signal: controller.signal,
      async onopen(response) {
        if (!response.ok) {
          throw new Error(`服务响应异常：${response.status}`)
        }

        const contentType = response.headers.get('content-type') || ''
        if (contentType && !contentType.includes('text/event-stream')) {
          throw new Error('服务器返回的不是事件流类型')
        }
      },
      onmessage(event) {
        const target = messages.value.find((item) => item.id === aiMessage.id)
        if (!target) {
          return
        }

        if (event.event === 'done' || applyStreamMessage(event, target)) {
          completed = true
          controller.abort()
          return
        }

        scrollToBottom()
      },
      onclose() {
        completed = true
      },
      onerror(error) {
        throw error
      },
    })
  } catch (error) {
    if (stopRequested.value) {
      if (!aiMessage.content) {
        aiMessage.content = '已停止生成。'
      }
    } else if (!completed) {
      const errorMessage = normalizeStreamError(error)
      aiMessage.isError = true
      aiMessage.errorMessage = errorMessage
      aiMessage.content = errorMessage
      aiMessage.retryContent = content
      aiMessage.retrySessionId = sessionId
      ElMessage.error(errorMessage)
    }
  } finally {
    isAiTyping.value = false
    activeAiMessageId.value = ''
    streamController.value = null
    stopRequested.value = false
    aiMessage.retrying = false
    await Promise.all([
      getEmotion(sessionId),
      getSessionList(),
    ])
    await scrollToBottom()
  }
}

const retryAIMessage = async (msg) => {
  if (!msg.retryContent || isSending.value) {
    return
  }

  const sessionId = msg.retrySessionId || currentSession.value.sessionId || currentSession.value.id
  if (!sessionId) {
    ElMessage.error('缺少会话信息，请新建会话后重试')
    return
  }

  await startAIResponse(sessionId, msg.retryContent, msg)
}

const sendMessage = async () => {
  const content = userMessage.value.trim()
  if (!content || isSending.value) {
    return
  }

  userMessage.value = ''
  messages.value.push({
    id: makeLocalId('user'),
    senderType: 1,
    content,
    createdAt: formatFullTime(),
    isError: false,
    errorMessage: '',
  })
  await scrollToBottom()

  try {
    const sessionId = await ensureActiveSession(content)
    await startAIResponse(sessionId, content)
  } catch {
    messages.value.push({
      id: makeLocalId('error'),
      senderType: 2,
      content: '会话创建失败，请稍后再试。',
      createdAt: formatFullTime(),
      isError: true,
      errorMessage: '会话创建失败，请稍后再试。',
    })
    await scrollToBottom()
  }
}

const stopGenerating = () => {
  if (!streamController.value) {
    return
  }
  stopRequested.value = true
  streamController.value.abort()
}

onMounted(async () => {
  createNewFrontendSession()
  await getSessionList()
})

onBeforeUnmount(() => {
  stopGenerating()
})
</script>

<style lang="scss" scoped>
.consultation-page {
  min-height: calc(100vh - 142px);
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(236, 253, 245, 0.78) 0%, rgba(255, 247, 237, 0.64) 45%, #f8fafc 100%),
    #f8fafc;
  color: #0f172a;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

.consultation-shell {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 20px;
  max-width: 1180px;
  margin: 0 auto;
}

.sidebar-panel {
  display: grid;
  align-content: start;
  gap: 16px;
  min-width: 0;
}

.assistant-panel,
.emotion-panel,
.history-panel,
.chat-panel {
  border: 1px solid rgba(203, 213, 225, 0.72);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07);
}

.assistant-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.assistant-mark {
  position: relative;
  width: 54px;
  height: 54px;

  .status-dot {
    position: absolute;
    right: 1px;
    bottom: 2px;
    width: 12px;
    height: 12px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.12);
  }
}

.assistant-copy {
  min-width: 0;

  h1 {
    margin-bottom: 4px;
    color: #0f172a;
    font-size: 18px;
    line-height: 1.25;
  }

  p {
    color: #64748b;
    font-size: 13px;
  }
}

.online-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  font-weight: 700;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  p {
    margin-bottom: 4px;
    color: #0f766e;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  h2 {
    color: #0f172a;
    font-size: 20px;
    line-height: 1.25;
  }

  > .el-icon {
    color: #f59e0b;
    font-size: 24px;
  }
}

.emotion-panel {
  padding: 18px;
}

.emotion-summary {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

.emotion-meter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 116px;
  padding: 14px;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff7ed 0%, #ecfeff 100%);
  text-align: center;

  strong {
    display: -webkit-box;
    overflow: hidden;
    color: #9a3412;
    font-size: 19px;
    line-height: 1.35;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  span {
    margin-top: 8px;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
  }
}

.emotion-risk {
  min-width: 0;

  span {
    color: #64748b;
    font-size: 13px;
  }

  strong {
    display: block;
    margin: 6px 0 12px;
    color: #0f172a;
    font-size: 22px;
  }
}

.risk-dots {
  display: flex;
  gap: 7px;

  i {
    width: 26px;
    height: 8px;
    border-radius: 999px;
    background: #e2e8f0;
    transition: background-color 0.18s ease, transform 0.18s ease;

    &.active {
      background: #14b8a6;
      transform: translateY(-1px);
    }
  }
}

.risk-2 .risk-dots i.active {
  background: #f59e0b;
}

.risk-3 .risk-dots i.active {
  background: #ef4444;
}

.suggestion-row,
.risk-notice {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  margin-top: 16px;
  padding: 12px 0 0;
  border-top: 1px solid #eef2f7;

  .el-icon {
    margin-top: 3px;
    color: #0f766e;
    font-size: 17px;
  }

  p {
    color: #475569;
    font-size: 13px;
    line-height: 1.7;
  }
}

.risk-notice {
  .el-icon {
    color: #ef4444;
  }

  p {
    color: #991b1b;
  }
}

.action-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.action-item {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  align-items: start;
  gap: 10px;

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: #ccfbf1;
    color: #0f766e;
    font-size: 12px;
    font-weight: 800;
  }

  p {
    color: #334155;
    font-size: 13px;
    line-height: 1.7;
  }
}

.history-panel {
  min-height: 280px;
  padding: 18px;
}

.history-heading {
  :deep(.el-button) {
    border-radius: 50%;
  }
}

.session-list {
  display: grid;
  gap: 10px;
  max-height: 332px;
  overflow-y: auto;
  padding-right: 2px;
}

.session-item {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #99f6e4;
    background: #f8fffe;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.07);
  }

  &.active {
    border-color: #14b8a6;
    background: #ecfeff;
  }
}

.session-copy {
  min-width: 0;
}

.session-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 7px;

  h3 {
    min-width: 0;
    overflow: hidden;
    color: #0f172a;
    font-size: 14px;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    flex: 0 0 auto;
    color: #94a3b8;
    font-size: 12px;
  }
}

.session-copy > p {
  display: -webkit-box;
  overflow: hidden;
  color: #64748b;
  font-size: 12px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.session-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 9px;
  color: #64748b;
  font-size: 12px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .el-icon {
    color: #0f766e;
  }
}

.session-actions {
  align-self: start;
}

.chat-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-width: 0;
  height: min(900px, calc(100vh - 112px));
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(120deg, #0f766e 0%, #2563eb 100%);
  color: #ffffff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;

  p {
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 13px;
    font-weight: 700;
  }

  h2 {
    overflow: hidden;
    max-width: 420px;
    font-size: 20px;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;

  span {
    color: rgba(255, 255, 255, 0.76);
    font-size: 13px;
    font-weight: 700;
  }

  :deep(.el-button) {
    border-color: rgba(255, 255, 255, 0.42);
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
  }
}

.messages-panel {
  min-height: 0;
  overflow-y: auto;
  padding: 22px;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.86) 0%, rgba(255, 255, 255, 0.94) 100%),
    #ffffff;
}

.welcome-state {
  display: grid;
  justify-items: center;
  align-content: center;
  min-height: 100%;
  padding: 40px 20px;
  text-align: center;

  h3 {
    margin-top: 16px;
    color: #0f172a;
    font-size: 24px;
    line-height: 1.3;
  }

  p {
    max-width: 420px;
    margin-top: 10px;
    color: #64748b;
    font-size: 15px;
    line-height: 1.8;
  }
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
}

.message-avatar {
  flex: 0 0 auto;
  margin-top: 22px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

.message-body {
  max-width: min(72%, 720px);
  min-width: 0;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #94a3b8;
  font-size: 12px;

  span {
    color: #475569;
    font-weight: 800;
  }
}

.message-bubble {
  overflow-wrap: anywhere;
  padding: 13px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #1e293b;
  line-height: 1.75;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);

  p {
    white-space: pre-wrap;
  }
}

.user-message {
  flex-direction: row-reverse;

  .message-body {
    display: grid;
    justify-items: end;
  }

  .message-meta {
    flex-direction: row-reverse;
  }

  .message-bubble {
    border-color: #bfdbfe;
    background: #eff6ff;
  }
}

.ai-message {
  .message-bubble {
    border-color: #ccfbf1;
    background: #f8fffe;
  }
}

.error-message {
  .message-bubble {
    border-color: #fecaca;
    background: #fef2f2;
    color: #991b1b;
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 48px;
  min-height: 24px;

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #14b8a6;
    animation: typingPulse 1.1s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.16s;
    }

    &:nth-child(3) {
      animation-delay: 0.32s;
    }
  }
}

.chat-input-panel {
  padding: 16px 18px 18px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 12px;

  button {
    min-height: 34px;
    padding: 0 12px;
    border: 1px solid #bae6fd;
    border-radius: 999px;
    color: #075985;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    background: #f0f9ff;
    transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;

    &:hover:not(:disabled) {
      border-color: #14b8a6;
      color: #0f766e;
      background: #ecfeff;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.56;
    }
  }
}

.input-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px;
  gap: 12px;
  align-items: end;
}

.message-input {
  :deep(.el-textarea__inner) {
    min-height: 88px !important;
    padding: 13px 15px;
    border-radius: 8px;
    background: #fbfdff;
    line-height: 1.7;
    box-shadow: 0 0 0 1px #dbe4ef inset;
  }
}

.send-btn,
.stop-btn {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  font-size: 18px;
}

.send-btn {
  border-color: #0f766e;
  background: #0f766e;
  box-shadow: 0 12px 22px rgba(15, 118, 110, 0.2);
}

.stop-btn {
  border-color: #fecaca;
  color: #b91c1c;
  background: #fff1f2;
}

@keyframes typingPulse {
  0%,
  80%,
  100% {
    opacity: 0.36;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@media (max-width: 980px) {
  .consultation-page {
    padding: 18px;
  }

  .consultation-shell {
    grid-template-columns: 1fr;
  }

  .sidebar-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .assistant-panel {
    grid-column: 1 / -1;
  }

  .chat-panel {
    height: min(840px, calc(100vh - 104px));
  }
}

@media (max-width: 720px) {
  .consultation-page {
    padding: 12px;
  }

  .sidebar-panel {
    grid-template-columns: 1fr;
  }

  .assistant-panel {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .online-tag {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .chat-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .header-left h2 {
    max-width: calc(100vw - 118px);
  }

  .messages-panel {
    padding: 16px;
  }

  .message-body {
    max-width: calc(100% - 46px);
  }

  .emotion-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .session-title-row {
    flex-direction: column;
  }

  .input-row {
    grid-template-columns: minmax(0, 1fr) 48px;
  }

  .send-btn,
  .stop-btn {
    width: 48px;
    height: 48px;
  }
}
</style>
