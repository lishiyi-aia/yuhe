export type WorkLanguage = 'zh' | 'en'

export interface WorkListItem {
  name: string
  meta?: string
  tags?: string[]
  link?: string
  slug?: string
}

export type WorkItem = WorkListItem

export interface WorkGroup {
  heading: string
  items: string[]
}

export interface WorkSection {
  id: string
  no: string
  title: string
  tagline: string
  items?: WorkListItem[]
  groups?: WorkGroup[]
  awards?: string[]
  footer?: string
}

export interface WorksLang {
  title: string
  closeLabel: string
  openLabel: string
  hint: string
  awardsLabel: string
  visitLabel: string
  detailPlaceholder: string
  phImageLabel: string
  phButtonLabel: string
  countLabel: (n: number) => string
  sections: WorkSection[]
}

export type WorksCopy = WorksLang

export const WORKS: Record<WorkLanguage, WorksLang> = {
  "zh": {
    "title": "项目经历",
    "closeLabel": "返回",
    "openLabel": "展开作品",
    "hint": "继续下滑",
    "awardsLabel": "项目成果",
    "visitLabel": "查看完整项目",
    "detailPlaceholder": "项目详情",
    "phImageLabel": "项目预览",
    "phButtonLabel": "打开项目",
    "countLabel": (n: number) => `${n} 个项目`,
    "sections": [
      {
        "id": "project-1",
        "no": "01",
        "title": "AI资讯内容运营",
        "tagline": "选题创作｜图文物料｜达人协作｜AI复盘",
        "items": [
          {
            "name": "AI资讯产品内容运营与传播复盘",
            "meta": "",
            "slug": "ai-news-dashboard",
            "link": `${import.meta.env.BASE_URL}projects/ai-news-dashboard/case_study.html`,
            "tags": [
              "内容：100+条公众号、小红书及社群内容",
              "制作：推广素材、文案校对与达人协作",
              "复盘：AI看板与标题、首图、内容测试"
            ]
          }
        ]
      },
      {
        "id": "project-2",
        "no": "02",
        "title": "公众号建设与案例传播",
        "tagline": "用户调研｜技术表达｜内容复用｜业务协同",
        "items": [
          {
            "name": "AI教育产品公众号建设与案例传播",
            "meta": "",
            "slug": "ai-education-partnership",
            "link": `${import.meta.env.BASE_URL}projects/ai-education-partnership/case_study.html`,
            "tags": [
              "调研：100+条反馈转化为选题依据",
              "内容：从0到1建设公众号，输出30+篇",
              "迭代：案例资料与高校推广反馈回流"
            ]
          }
        ]
      },
      {
        "id": "project-4",
        "no": "03",
        "title": "社媒制作与新品传播",
        "tagline": "卖点提炼｜拍摄剪辑｜英文文案｜内容复盘",
        "items": [
          {
            "name": "ZUS Coffee社媒内容制作与新品传播",
            "meta": "",
            "slug": "zus-everywhere",
            "link": `${import.meta.env.BASE_URL}projects/zus-everywhere/case_study.html`,
            "tags": [
              "制作：参与50条Instagram内容发布",
              "传播：新品卖点、英文文案与渠道排期",
              "优化：15+次内容复盘，调整后续表达"
            ]
          }
        ]
      }
    ]
  },
  "en": {
    "title": "Project Experience",
    "closeLabel": "Back",
    "openLabel": "Open case",
    "hint": "Scroll to continue",
    "awardsLabel": "Outcomes",
    "visitLabel": "View full case",
    "detailPlaceholder": "Project details",
    "phImageLabel": "Project preview",
    "phButtonLabel": "Open project",
    "countLabel": (n: number) => `${n} projects`,
    "sections": [
      {
        "id": "project-1",
        "no": "01",
        "title": "AI Content Operations",
        "tagline": "Topics · Visual Materials · Creators · AI Reviews",
        "items": [
          {
            "name": "AI News Content & Communication Reviews",
            "meta": "",
            "slug": "ai-news-dashboard",
            "link": `${import.meta.env.BASE_URL}projects/ai-news-dashboard/case_study.html`,
            "tags": [
              "Content: 100+ WeChat, Xiaohongshu and community posts",
              "Production: promotional materials, copy and creator support",
              "Reviews: AI dashboard and title, cover and content tests"
            ]
          }
        ]
      },
      {
        "id": "project-2",
        "no": "02",
        "title": "WeChat & Product Stories",
        "tagline": "Research · Product Messaging · Reuse · Collaboration",
        "items": [
          {
            "name": "AI Education WeChat & Use-Case Communication",
            "meta": "",
            "slug": "ai-education-partnership",
            "link": `${import.meta.env.BASE_URL}projects/ai-education-partnership/case_study.html`,
            "tags": [
              "Research: 100+ feedback items informed content topics",
              "Content: WeChat account from scratch and 30+ pieces",
              "Iteration: teaching cases and university feedback"
            ]
          }
        ]
      },
      {
        "id": "project-4",
        "no": "03",
        "title": "Social Content & Launches",
        "tagline": "Messages · Shooting & Editing · English Copy · Reviews",
        "items": [
          {
            "name": "ZUS Coffee Social Content & Product Communication",
            "meta": "",
            "slug": "zus-everywhere",
            "link": `${import.meta.env.BASE_URL}projects/zus-everywhere/case_study.html`,
            "tags": [
              "Production: supported 50 Instagram posts",
              "Communication: product messages, English copy and schedules",
              "Optimization: 15+ reviews informed subsequent content"
            ]
          }
        ]
      }
    ]
  }
}

export const WORKS_CONTENT = WORKS

export const SECTION_COVERS: Record<string, string> = {
  'project-1': `${import.meta.env.BASE_URL}works/covers/sohu-dashboard.png`,
  'project-2': `${import.meta.env.BASE_URL}works/covers/education-pilot.png`,
  'project-4': `${import.meta.env.BASE_URL}works/covers/zus-everywhere.jpg`,
}
