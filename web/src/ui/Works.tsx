import { useEffect, useRef, useState, type Ref } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { WORKS, SECTION_COVERS, type WorkListItem, type WorkSection, type WorksLang } from '../data/works'

// 项目标题与入口直接链接到完整案例，支持返回和在新标签页打开。
function WorkLine({
  item,
  actionLabel,
}: {
  item: WorkListItem
  actionLabel: string
}) {
  const canOpen = Boolean(item.link)

  const content = (
    <>
      <span className="wk-line-primary">
        <span className="wk-line-name">{item.name}</span>
        {item.meta && <span className="wk-line-num">{item.meta}</span>}
      </span>
      {canOpen && (
        <span className="wk-line-action">
          {actionLabel}
          <span className="wk-line-action-arrow" aria-hidden="true">↗</span>
        </span>
      )}
    </>
  )

  return (
    <li className="wk-line">
      {canOpen ? (
        <a className="wk-line-btn" href={item.link}>
          {content}
        </a>
      ) : (
        <span className="wk-line-btn" aria-disabled="true">
          {content}
        </span>
      )}
      {item.tags && item.tags.length > 0 && (
        <ul className="wk-proof-list" aria-label="项目证据">
          {item.tags.map((tag, index) => (
            <li key={tag}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{tag}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

// 一张全高板块卡：左侧整高配图，右侧文字（编号 + 标题 + 清单）
function SectionCard({
  section,
  data,
}: {
  section: WorkSection
  data: WorksLang
}) {
  const [coverError, setCoverError] = useState(false)
  const cover = SECTION_COVERS[section.id]
  return (
    <div className="wk-card">
      <div className="wk-card-head">
        <span className="wk-card-no">{section.no}</span>
        <h3 className="wk-card-title">{section.title}</h3>
        <span className="wk-card-tagline">{section.tagline}</span>
      </div>
      <a
        className="wk-card-cover"
        href={section.items?.[0]?.link}
        aria-label={`${data.visitLabel}：${section.title}`}
      >
        {cover && !coverError ? (
          <img
            src={cover}
            alt={section.title}
            onError={() => setCoverError(true)}
            onLoad={() => setCoverError(false)}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="wk-card-cover-ph" aria-hidden="true">
            <span className="wk-card-cover-no">{section.no}</span>
          </div>
        )}
      </a>
      <SectionWorks section={section} data={data} />
    </div>
  )
}

// 板块内的作品清单（items 扁平 / groups 分组 / awards · footer 底部小字）
function SectionWorks({
  section,
  data,
}: {
  section: WorkSection
  data: WorksLang
}) {
  return (
    <div className="wk-card-body">
      {section.items && (
        <ul className="wk-list">
          {section.items.map((it, i) => (
            <WorkLine key={i} item={it} actionLabel={data.visitLabel} />
          ))}
        </ul>
      )}

      {section.groups &&
        section.groups.map((g, gi) => (
          <div key={gi} className="wk-sub">
            <div className="wk-sub-head">{g.heading}</div>
            <ul className="wk-list">
              {g.items.map((it, i) => (
                <WorkLine key={i} item={{ name: it }} actionLabel={data.visitLabel} />
              ))}
            </ul>
          </div>
        ))}

      {(section.awards || section.footer) && (
        <div className="wk-foot">
          {section.awards && (
            <p className="wk-foot-line">
              <span className="wk-foot-label">{data.awardsLabel}</span>
              <span className="wk-foot-val accent">{section.awards.join('  ·  ')}</span>
            </p>
          )}
          {section.footer && <p className="wk-foot-line">{section.footer}</p>}
        </div>
      )}
    </div>
  )
}

export default function Works({ lang, innerRef }: { lang: 'en' | 'zh'; innerRef: Ref<HTMLElement> }) {
  const data = WORKS[lang]
  const sections = data.sections
  const count = sections.length

  // 竖滚 pin 转横移：测量整排卡片的实际可横移距离（px），竖滚进度 → 横移
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start start', 'end end'],
  })

  // track 实际宽度 - 视口宽 = 需要横移的距离；随尺寸/语言变化重测
  const [scrollRange, setScrollRange] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => setScrollRange(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [count, lang])

  // px 数值插值（比 vw 字符串更顺）；竖滚行程与横移 1:1
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])
  // 横移到底时「继续下滑」提示渐隐
  const hintOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0])

  return (
    <section className="works" lang={lang} ref={innerRef}>
      <div
        className="wk-gallery"
        ref={galleryRef}
        style={{ height: `calc(100vh + ${scrollRange}px)` }}
      >
        <div className="wk-gallery-sticky">
          <span className="wk-gallery-title">{data.title}</span>

          <motion.div className="wk-track" ref={trackRef} style={{ x }}>
            {sections.map((s) => (
              <SectionCard key={s.id} section={s} data={data} />
            ))}
          </motion.div>

          <div className="wk-progress" aria-hidden="true">
            <motion.div className="wk-progress-fill" style={{ scaleX: scrollYProgress }} />
          </div>
          <motion.span className="wk-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
            {data.hint}
          </motion.span>
        </div>
      </div>
    </section>
  )
}
