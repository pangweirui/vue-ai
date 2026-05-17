<template>
  <main class="article-detail-container">
    <section class="detail-hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <el-button class="back-button" :icon="ArrowLeft" @click="goBack">
            返回知识库
          </el-button>
          <el-skeleton v-if="loading" animated class="hero-skeleton">
            <template #template>
              <el-skeleton-item variant="h1" />
              <el-skeleton-item variant="text" />
              <el-skeleton-item variant="text" />
            </template>
          </el-skeleton>

          <template v-else>
            <h1>{{ articleDetail.title || '知识文章详情' }}</h1>
            <p v-if="articleDetail.summary" class="summary">
              {{ articleDetail.summary }}
            </p>

            <div class="hero-meta">
              <span>
                <el-icon><Avatar /></el-icon>
                {{ articleDetail.authorName || '匿名作者' }}
              </span>
              <span>
                <el-icon><Calendar /></el-icon>
                {{ formatDate(articleDate) }}
              </span>
              <span>
                <el-icon><View /></el-icon>
                {{ formatNumber(articleDetail.readCount) }} 次阅读
              </span>
            </div>
          </template>
        </div>

        <div class="cover-panel">
          <el-image :src="coverImage" :alt="articleDetail.title || '知识文章封面'" fit="cover">
            <template #error>
              <div class="cover-fallback">
                <el-icon><Reading /></el-icon>
              </div>
            </template>
          </el-image>
          <div v-if="articleDetail.categoryName" class="cover-badge">
            {{ articleDetail.categoryName }}
          </div>
        </div>
      </div>
    </section>

    <section class="detail-content">
      <article class="article-card content-card">
        <div class="section-heading">
          <span class="heading-index">01</span>
          <div>
            <p>Article Content</p>
            <h2>文章内容</h2>
          </div>
        </div>

        <el-alert
          v-if="loadError"
          :title="loadError"
          type="error"
          show-icon
          :closable="false"
        />

        <el-skeleton v-else-if="loading" :rows="10" animated />

        <div
          v-else-if="articleDetail.content"
          class="content-wrap"
          v-html="formatContent(articleDetail.content)"
        ></div>

        <el-empty v-else description="暂无文章内容" :image-size="120" />
      </article>

      <aside class="article-sidebar">
        <div class="article-card info-card">
          <div class="info-row">
            <span class="info-icon">
              <el-icon><Clock /></el-icon>
            </span>
            <div>
              <p>预计阅读</p>
              <strong>{{ estimatedMinutes }} 分钟</strong>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">
              <el-icon><CollectionTag /></el-icon>
            </span>
            <div>
              <p>文章分类</p>
              <strong>{{ articleDetail.categoryName || '心理知识' }}</strong>
            </div>
          </div>
        </div>

        <div class="article-card tags-card">
          <div class="sidebar-title">
            <p>Tags</p>
            <h3>相关标签</h3>
          </div>

          <div v-if="articleTags.length" class="tag-list">
            <el-tag
              v-for="tag in articleTags"
              :key="tag"
              effect="light"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>

          <p v-else class="empty-tags">暂无标签</p>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  ArrowLeft,
  Avatar,
  Calendar,
  Clock,
  CollectionTag,
  Reading,
  View,
} from '@element-plus/icons-vue'
import { getKnowledgeArticleDetail } from '@/apis/frontend'
import { fileBaseUrl } from '@/config'
import fallbackCover from '@/assets/images/book.png'

type ArticleDetail = {
  id?: string | number
  title?: string
  content?: string
  summary?: string
  categoryName?: string
  authorName?: string
  coverImage?: string
  updatedAt?: string
  publishedAt?: string
  createdAt?: string
  readCount?: number
  tagArray?: string[]
  tags?: string[] | string
}

const route = useRoute()
const router = useRouter()
const articleDetail = ref<ArticleDetail>({})
const loading = ref(true)
const loadError = ref('')

const articleDate = computed(() => (
  articleDetail.value.updatedAt ||
  articleDetail.value.publishedAt ||
  articleDetail.value.createdAt ||
  ''
))

const articleTags = computed(() => {
  const tags = articleDetail.value.tagArray ?? articleDetail.value.tags

  if (Array.isArray(tags)) {
    return tags.filter(Boolean)
  }

  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean)
  }

  return []
})

const plainContent = computed(() => {
  return (articleDetail.value.content || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '')
})

const estimatedMinutes = computed(() => {
  return Math.max(1, Math.ceil(plainContent.value.length / 450))
})

const coverImage = computed(() => getCoverImage(articleDetail.value.coverImage))

const getArticleDetail = async () => {
  const routeId = route.params.id
  const id = Array.isArray(routeId) ? routeId[0] : routeId

  if (!id) {
    loadError.value = '未找到文章信息'
    loading.value = false
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    const res = await getKnowledgeArticleDetail(String(id)) as unknown as ArticleDetail
    articleDetail.value = res || {}
  } catch {
    loadError.value = '文章加载失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

const getCoverImage = (url?: string) => {
  if (!url) {
    return fallbackCover
  }

  if (/^https?:\/\//.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  return `${fileBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

const formatContent = (content?: string) => {
  if (!content) {
    return ''
  }

  return content
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const formatDate = (date?: string) => {
  if (!date) {
    return '刚刚更新'
  }

  const parsed = dayjs(date)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm') : date
}

const formatNumber = (value?: number) => {
  return Number(value ?? 0).toLocaleString('zh-CN')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/front/knowledge')
}

onMounted(() => {
  getArticleDetail()
})
</script>

<style lang="scss" scoped>
.article-detail-container {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  min-height: calc(100vh - 142px);
  color: #0f172a;
  background:
    linear-gradient(180deg, rgba(236, 254, 255, 0.82) 0%, rgba(248, 250, 252, 0.96) 48%, #f8fafc 100%),
    #f8fafc;
}

.detail-hero {
  position: relative;
  overflow: hidden;
  color: #ffffff;
  background:
    linear-gradient(120deg, rgba(12, 74, 110, 0.96) 0%, rgba(15, 118, 110, 0.9) 56%, rgba(30, 64, 175, 0.84) 100%),
    url('https://file.itndedu.com/psychology_ai.png') center/cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 56px 56px;
    opacity: 0.2;
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  align-items: center;
  gap: 54px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 56px 24px 90px;
}

.hero-copy {
  min-width: 0;
  max-width: 760px;

  .back-button {
    height: 34px;
    margin-bottom: 22px;
    border-color: rgba(255, 255, 255, 0.34);
    border-radius: 8px;
    color: #ffffff;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.12);

    &:hover {
      border-color: rgba(255, 255, 255, 0.62);
      color: #ffffff;
      background: rgba(255, 255, 255, 0.18);
    }
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 32px;
    padding: 0 14px;
    margin-bottom: 18px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.12);
  }

  h1 {
    max-width: 760px;
    margin-bottom: 18px;
    font-size: 46px;
    line-height: 1.18;
    font-weight: 800;
    letter-spacing: 0;
  }

  .summary {
    max-width: 690px;
    color: rgba(255, 255, 255, 0.84);
    font-size: 17px;
    line-height: 1.85;
  }
}

.hero-skeleton {
  max-width: 680px;

  :deep(.el-skeleton__item) {
    background: rgba(255, 255, 255, 0.24);
  }
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 36px;
    padding: 0 13px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.86);
    font-size: 13px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
  }
}

.cover-panel {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1.05;
  justify-self: end;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.24);

  :deep(.el-image) {
    width: 100%;
    height: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 46%, rgba(15, 23, 42, 0.28) 100%);
    pointer-events: none;
  }
}

.cover-badge {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 1;
  max-width: calc(100% - 36px);
  padding: 8px 12px;
  border-radius: 8px;
  color: #075985;
  font-size: 13px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
}

.cover-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #0f766e;
  font-size: 56px;
  background: linear-gradient(135deg, #ecfeff 0%, #eff6ff 100%);
}

.detail-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: start;
  gap: 22px;
  max-width: 1180px;
  margin: -46px auto 0;
  padding: 0 24px 66px;
  position: relative;
  z-index: 2;
}

.article-card {
  min-width: 0;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07);
}

.content-card {
  padding: 30px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 26px;

  .heading-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 8px;
    color: #0f766e;
    font-size: 14px;
    font-weight: 800;
    background: #ccfbf1;
  }

  p {
    margin-bottom: 5px;
    color: #0f766e;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
  }

  h2 {
    color: #0f172a;
    font-size: 24px;
    line-height: 1.28;
    letter-spacing: 0;
  }
}

.content-wrap {
  color: #334155;
  font-size: 16px;
  line-height: 1.92;
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0 0 18px;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: 32px 0 14px;
    color: #0f172a;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: 0;
  }

  :deep(h1) {
    font-size: 30px;
  }

  :deep(h2) {
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 25px;
  }

  :deep(h3) {
    font-size: 21px;
  }

  :deep(ul),
  :deep(ol) {
    display: grid;
    gap: 8px;
    margin: 16px 0 20px;
    padding-left: 24px;
  }

  :deep(li) {
    list-style: revert;
  }

  :deep(blockquote) {
    margin: 24px 0;
    padding: 16px 18px;
    border-left: 4px solid #14b8a6;
    border-radius: 0 8px 8px 0;
    color: #475569;
    background: #f0fdfa;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    margin: 18px 0;
    border-radius: 8px;
  }

  :deep(a) {
    color: #0f766e;
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid rgba(15, 118, 110, 0.28);
  }

  :deep(strong) {
    color: #0f172a;
    font-weight: 800;
  }

  :deep(code) {
    padding: 2px 6px;
    border-radius: 6px;
    color: #be123c;
    background: #fff1f2;
  }
}

.article-sidebar {
  position: sticky;
  top: 18px;
  display: grid;
  gap: 16px;
}

.info-card,
.tags-card {
  padding: 20px;
}

.info-card {
  display: grid;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding-top: 16px;
  border-top: 1px solid #eef4fb;

  &:first-child {
    padding-top: 0;
    border-top: 0;
  }

  .info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    border-radius: 8px;
    color: #0f766e;
    background: #ecfeff;
  }

  p {
    margin-bottom: 5px;
    color: #64748b;
    font-size: 12px;
  }

  strong {
    color: #0f172a;
    font-size: 16px;
    line-height: 1.35;
  }
}

.sidebar-title {
  margin-bottom: 16px;

  p {
    margin-bottom: 5px;
    color: #0f766e;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
  }

  h3 {
    color: #0f172a;
    font-size: 20px;
    line-height: 1.3;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  border-color: #bae6fd;
  border-radius: 8px;
  color: #0369a1;
  background: #f0f9ff;
  font-weight: 700;
}

.empty-tags {
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 980px) {
  .hero-inner,
  .detail-content {
    grid-template-columns: 1fr;
  }

  .hero-inner {
    gap: 34px;
    padding: 48px 20px 80px;
  }

  .cover-panel {
    max-width: 420px;
    justify-self: start;
    aspect-ratio: 1.35;
  }

  .article-sidebar {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hero-inner {
    padding: 40px 18px 72px;
  }

  .hero-copy {
    h1 {
      font-size: 34px;
    }

    .summary {
      font-size: 15px;
    }
  }

  .hero-meta {
    flex-direction: column;

    span {
      width: 100%;
    }
  }

  .detail-content {
    margin-top: -36px;
    padding: 0 18px 48px;
  }

  .content-card,
  .info-card,
  .tags-card {
    padding: 20px;
  }

  .article-sidebar {
    grid-template-columns: 1fr;
  }

  .content-wrap {
    font-size: 15px;

    :deep(h1) {
      font-size: 26px;
    }

    :deep(h2) {
      font-size: 22px;
    }
  }
}
</style>
