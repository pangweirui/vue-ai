<template>
  <main class="knowledge-container">
    <section class="hero-section">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">心理知识库</p>
          <h1>把复杂的情绪问题，拆成更容易读懂的一页</h1>
          <p class="description">
            精选心理健康、情绪管理和自我照顾文章，适合在需要一点陪伴和答案的时候慢慢阅读。
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <strong>{{ pagination.total || articleList.length }}</strong>
              <span>篇文章</span>
            </div>
            <div class="stat-item">
              <strong>{{ recommendList.length }}</strong>
              <span>推荐阅读</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <el-image :src="logo" alt="知识库" fit="contain" />
          <span class="visual-label">Knowledge</span>
        </div>
      </div>
    </section>

    <section class="content-section">
      <aside class="recommend-section">
        <div class="section-heading">
          <div>
            <p>Recommended</p>
            <h2>推荐阅读</h2>
          </div>
          <el-icon><Medal /></el-icon>
        </div>

        <el-skeleton v-if="recommendLoading" :rows="5" animated />
        <div v-else-if="recommendList.length" class="recommend-list">
          <article
            v-for="(item, index) in recommendList"
            :key="item.id"
            class="recommend-item"
            @click="goArticleDetail(item.id)"
          >
            <span class="rank">{{ index + 1 }}</span>
            <div class="recommend-content">
              <h3>{{ item.title }}</h3>
              <p>
                <el-icon><View /></el-icon>
                {{ formatNumber(item.readCount) }} 次阅读
              </p>
            </div>
          </article>
        </div>
        <el-empty v-else description="暂无推荐文章" :image-size="92" />
      </aside>

      <section class="article-section">
        <div class="article-toolbar">
          <div>
            <p>Latest Articles</p>
            <h2>最新文章</h2>
          </div>
          <el-button :icon="Refresh" :loading="refreshing" @click="refreshArticles">
            刷新
          </el-button>
        </div>

        <div
          v-if="initialLoading"
          class="skeleton-list"
        >
          <div v-for="item in 3" :key="item" class="article-card skeleton-card">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" class="skeleton-cover" />
                <div class="skeleton-copy">
                  <el-skeleton-item variant="h3" />
                  <el-skeleton-item variant="text" />
                  <el-skeleton-item variant="text" />
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>

        <template v-else>
          <div v-if="articleList.length" class="article-list">
            <article
              v-for="item in articleList"
              :key="item.id"
              class="article-card"
              @click="goArticleDetail(item.id)"
            >
              <div class="cover-wrap">
                <el-image
                  :src="getCoverImage(item.coverImage)"
                  :alt="item.title"
                  fit="cover"
                  lazy
                >
                  <template #error>
                    <div class="cover-fallback">
                      <el-icon><Reading /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>

              <div class="article-info">
                <div class="title-row">
                  <h3>{{ item.title }}</h3>
                  <el-tag v-if="item.categoryName" effect="light">
                    {{ item.categoryName }}
                  </el-tag>
                </div>

                <p v-if="item.summary" class="summary">
                  {{ item.summary }}
                </p>

                <div class="meta-row">
                  <span>
                    <el-icon><Avatar /></el-icon>
                    {{ item.authorName || '匿名作者' }}
                  </span>
                  <span>
                    <el-icon><Clock /></el-icon>
                    {{ formatDate(item.updatedAt || item.publishedAt) }}
                  </span>
                  <span>
                    <el-icon><View /></el-icon>
                    {{ formatNumber(item.readCount) }} 次阅读
                  </span>
                </div>
              </div>
            </article>
          </div>

          <el-empty
            v-else
            class="empty-state"
            description="暂无知识文章"
            :image-size="130"
          />

          <div ref="loadTriggerRef" class="load-trigger" aria-hidden="true"></div>

          <div v-if="articleList.length" class="load-status">
            <template v-if="loadingMore">
              <el-icon class="is-loading"><Loading /></el-icon>
              正在加载更多
            </template>
            <template v-else-if="loadError">
              <span>{{ loadError }}</span>
              <el-button type="primary" text @click="loadNextPage">重试</el-button>
            </template>
            <template v-else-if="!hasMore">
              已经看到全部文章了
            </template>
          </div>
        </template>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Avatar, Clock, Loading, Medal, Reading, Refresh, View } from '@element-plus/icons-vue'
import { getKnowledgeArticlePage } from '@/apis/frontend'
import logo from '@/assets/images/book.png'

type Article = {
  id: string | number
  title: string
  summary?: string
  categoryName?: string
  authorName?: string
  coverImage?: string
  updatedAt?: string
  publishedAt?: string
  readCount?: number
}

type PageResult = {
  records?: Article[]
  total?: number
  size?: number
  current?: number
  pages?: number
}

const IMAGE_BASE_URL = 'http://159.75.169.224:1235'

const articleList = ref<Article[]>([])
const recommendList = ref<Article[]>([])
const initialLoading = ref(true)
const loadingMore = ref(false)
const refreshing = ref(false)
const recommendLoading = ref(true)
const loadError = ref('')
const loadTriggerRef = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const pagination = reactive({
  currentPage: 0,
  size: 8,
  total: 0,
  pages: 0,
})

const hasMore = computed(() => {
  if (pagination.pages > 0) {
    return pagination.currentPage < pagination.pages
  }

  if (pagination.total > 0) {
    return articleList.value.length < pagination.total
  }

  return pagination.currentPage === 0 || articleList.value.length >= pagination.size
})

const requestArticles = async (page: number) => {
  const res = await getKnowledgeArticlePage({
    sortField: 'publishedAt',
    sortDirection: 'desc',
    currentPage: page,
    size: pagination.size,
  }) as PageResult

  const records = res.records ?? []
  const current = Number(res.current ?? page)
  const size = Number(res.size ?? pagination.size)
  const total = Number(res.total ?? 0)
  const pages = Number(res.pages ?? (total > 0 ? Math.ceil(total / size) : 0))

  pagination.currentPage = current
  pagination.size = size
  pagination.total = total
  pagination.pages = pages

  return records
}

const appendArticles = (records: Article[]) => {
  const existingIds = new Set(articleList.value.map((item) => item.id))
  const nextRecords = records.filter((item) => !existingIds.has(item.id))
  articleList.value.push(...nextRecords)
}

const loadNextPage = async () => {
  if (initialLoading.value || loadingMore.value || !hasMore.value) {
    return
  }

  loadingMore.value = true
  loadError.value = ''

  try {
    const records = await requestArticles(pagination.currentPage + 1)
    appendArticles(records)
  } catch {
    loadError.value = '加载失败，请稍后再试'
  } finally {
    loadingMore.value = false
  }
}

const refreshArticles = async () => {
  if (refreshing.value) {
    return
  }

  refreshing.value = true
  initialLoading.value = articleList.value.length === 0
  loadError.value = ''

  try {
    pagination.currentPage = 0
    pagination.total = 0
    pagination.pages = 0
    const records = await requestArticles(1)
    articleList.value = records
    await nextTick()
    if (hasMore.value && isTriggerVisible()) {
      loadNextPage()
    }
  } catch {
    loadError.value = '文章加载失败，请点击重试'
    articleList.value = []
  } finally {
    initialLoading.value = false
    refreshing.value = false
  }
}

const getRecommendList = async () => {
  recommendLoading.value = true
  try {
    const res = await getKnowledgeArticlePage({
      sortField: 'readCount',
      sortDirection: 'desc',
      currentPage: 1,
      size: 8,
    }) as PageResult
    recommendList.value = res.records ?? []
  } finally {
    recommendLoading.value = false
  }
}

const isTriggerVisible = () => {
  const el = loadTriggerRef.value
  if (!el) {
    return false
  }

  const rect = el.getBoundingClientRect()
  return rect.top <= window.innerHeight + 120
}

const observeLoadTrigger = () => {
  if (!loadTriggerRef.value) {
    return
  }

  observer.value?.disconnect()
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        loadNextPage()
      }
    },
    {
      root: null,
      rootMargin: '240px 0px',
      threshold: 0,
    },
  )
  observer.value.observe(loadTriggerRef.value)
}

const getCoverImage = (url?: string) => {
  if (!url) {
    return logo
  }

  if (/^https?:\/\//.test(url)) {
    return url
  }

  return `${IMAGE_BASE_URL}${url}`
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

const router = useRouter()
const goArticleDetail = (id: string|number) => {
  router.push(`/front/knowledge/article/${id}`)
}

onMounted(async () => {
  await Promise.all([
    refreshArticles(),
    getRecommendList(),
  ])
  observeLoadTrigger()
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})
</script>

<style lang="scss" scoped>
.knowledge-container {
  min-height: calc(100vh - 142px);
  background: #f6fbff;
  color: #0f172a;
}

.hero-section {
  position: relative;
  overflow: hidden;
  padding: 58px 24px 88px;
  color: #ffffff;
  background:
    linear-gradient(120deg, rgba(12, 74, 110, 0.96) 0%, rgba(15, 118, 110, 0.9) 56%, rgba(67, 56, 202, 0.82) 100%),
    url('https://file.itndedu.com/psychology_ai.png') center/cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
      linear-gradient(180deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 56px 56px;
    opacity: 0.2;
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  align-items: center;
  gap: 54px;
  max-width: 1180px;
  margin: 0 auto;
}

.hero-copy {
  max-width: 720px;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding: 0 12px;
    margin-bottom: 18px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-weight: 700;
  }

  h1 {
    max-width: 680px;
    margin-bottom: 18px;
    font-size: 46px;
    line-height: 1.18;
    font-weight: 800;
    letter-spacing: 0;
  }

  .description {
    max-width: 620px;
    color: rgba(255, 255, 255, 0.84);
    font-size: 17px;
    line-height: 1.85;
  }
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.stat-item {
  min-width: 116px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);

  strong {
    display: block;
    font-size: 25px;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 7px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 13px;
  }
}

.hero-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: end;
  width: 220px;
  padding: 28px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.24);
  backdrop-filter: blur(14px);

  :deep(.el-image) {
    width: 120px;
    height: 120px;
  }

  .visual-label {
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}

.content-section {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
  max-width: 1180px;
  margin: -46px auto 0;
  padding: 0 24px 66px;
  position: relative;
  z-index: 2;
}

.recommend-section,
.article-section {
  border: 1px solid #dbeafe;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07);
}

.recommend-section {
  position: sticky;
  top: 18px;
  padding: 20px;
}

.section-heading,
.article-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  p {
    margin-bottom: 5px;
    color: #0f766e;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
  }

  h2 {
    color: #0f172a;
    font-size: 21px;
    line-height: 1.25;
  }
}

.section-heading {
  margin-bottom: 18px;

  .el-icon {
    color: #f59e0b;
    font-size: 24px;
  }
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-item {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 10px;
  padding: 12px 0;
  border-top: 1px solid #eef4fb;

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  .rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #ecfeff;
    color: #0f766e;
    font-size: 13px;
    font-weight: 800;
  }
}

.recommend-content {
  min-width: 0;

  h3 {
    display: -webkit-box;
    overflow: hidden;
    color: #0f172a;
    font-size: 15px;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  p {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 8px;
    color: #64748b;
    font-size: 12px;
  }
}

.article-section {
  min-width: 0;
  padding: 22px;
}

.article-toolbar {
  margin-bottom: 18px;

  :deep(.el-button) {
    height: 36px;
    border-radius: 8px;
    font-weight: 700;
  }
}

.article-list,
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 18px;
  overflow: hidden;
  padding: 14px;
  border: 1px solid #e2ebf5;
  border-radius: 8px;
  background: #ffffff;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    border-color: #a7f3d0;
    box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }
}

.cover-wrap {
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1.45;
  border-radius: 8px;
  background: #eef6fb;

  :deep(.el-image) {
    width: 100%;
    height: 100%;
  }

  :deep(img) {
    transition: transform 0.24s ease;
  }

  .article-card:hover & :deep(img) {
    transform: scale(1.04);
  }
}

.cover-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #0f766e;
  background: #ecfeff;
  font-size: 34px;
}

.article-info {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  h3 {
    min-width: 0;
    color: #0f172a;
    font-size: 22px;
    line-height: 1.35;
    font-weight: 800;
  }

  :deep(.el-tag) {
    flex: 0 0 auto;
    border-color: #bae6fd;
    color: #0369a1;
    background: #f0f9ff;
  }
}

.summary {
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 16px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.75;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  color: #64748b;
  font-size: 13px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
  }

  .el-icon {
    color: #0f766e;
  }
}

.load-trigger {
  height: 1px;
}

.load-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  color: #64748b;
  font-size: 13px;

  .el-icon {
    color: #0f766e;
  }
}

.empty-state {
  padding: 56px 0;
}

.skeleton-card {
  pointer-events: none;
}

.skeleton-card :deep(.el-skeleton__template) {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 18px;
  width: 100%;
}

.skeleton-cover {
  width: 100%;
  height: 158px;
  border-radius: 8px;
}

.skeleton-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}

@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-visual {
    justify-self: start;
  }

  .content-section {
    grid-template-columns: 1fr;
  }

  .recommend-section {
    position: static;
  }
}

@media (max-width: 720px) {
  .hero-section {
    padding: 44px 18px 78px;
  }

  .hero-copy {
    h1 {
      font-size: 34px;
    }

    .description {
      font-size: 15px;
    }
  }

  .content-section {
    margin-top: -38px;
    padding: 0 18px 48px;
  }

  .article-section {
    padding: 16px;
  }

  .article-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .article-card,
  .skeleton-card :deep(.el-skeleton__template) {
    grid-template-columns: 1fr;
  }

  .cover-wrap {
    aspect-ratio: 1.62;
  }

  .title-row {
    flex-direction: column;
    align-items: flex-start;

    h3 {
      font-size: 20px;
    }
  }
}

@media (max-width: 480px) {
  .hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .hero-visual {
    width: 100%;
  }

  .meta-row {
    flex-direction: column;
  }
}
</style>
