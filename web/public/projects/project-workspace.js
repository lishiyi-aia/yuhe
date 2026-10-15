(() => {
  'use strict';
  const project = document.currentScript.dataset.project;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const node = (tag, className, html) => {
    const element = document.createElement(tag);
    element.className = className;
    if (html) element.innerHTML = html;
    return element;
  };
  const section = (id, heading, lead) => {
    const element = node('section', 'section', `<div class="section-head"><div><p class="kicker"></p><h2>${heading}</h2></div><p class="lead section-lead">${lead}</p></div>`);
    element.id = id;
    return element;
  };
  function bindTabs(buttons, callback) {
    function select(index) {
      buttons.forEach((button, i) => {
        button.setAttribute('aria-selected', String(index === i));
        button.tabIndex = index === i ? 0 : -1;
      });
      callback(index);
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : delta ? (index + delta + buttons.length) % buttons.length : null;
        if (next === null) return;
        event.preventDefault();
        select(next);
        buttons[next].focus();
      });
    });
    select(0);
    return select;
  }
  function explorer(target, id, label, items) {
    target.classList.add('project-explorer');
    target.innerHTML = `<div class="explorer-tabs" role="tablist" aria-label="${label}" aria-orientation="vertical">${items.map((item, i) => `<button type="button" role="tab" id="${id}-tab-${i}" aria-controls="${id}-detail"><span class="mono">0${i + 1}</span><span>${item.label}</span>${icon('arrow-right')}</button>`).join('')}</div><div class="explorer-detail" id="${id}-detail" role="tabpanel" tabindex="0"></div>`;
    const panel = $('.explorer-detail', target);
    bindTabs($$('.explorer-tabs button', target), i => {
      panel.setAttribute('aria-labelledby', `${id}-tab-${i}`);
      panel.innerHTML = `<p class="explorer-eyebrow">${items[i].eyebrow || label}</p><h3>${items[i].title}</h3><p class="explorer-copy">${items[i].copy}</p>${items[i].body || ''}`;
    });
  }
  const main = $('main');
  if (project === 'partnership') {
    $('.topbar').classList.add('nav');
    $('.topnav').classList.add('nav-links');
    $('.confidential').classList.add('disclosure');
    $('.confidential-inner').classList.add('disclosure-inner');
    $$('.index').forEach(item => item.classList.add('kicker'));
    $$('.section-intro').forEach(item => item.classList.add('lead'));
    $('.hero').after(node('div', 'snapshot', '<div class="metric-row"></div>'));
  }
  // Keep section IDs and existing tab listeners while moving content into the workflow.
  const sections = {};
  const ids = project === 'partnership' ? ['overview', 'journey', 'collaboration', 'followup', 'evidence', 'outcome'] : project === 'zus' ? ['overview', 'research', 'content', 'review', 'results'] : ['overview', 'feedback', 'content', 'pilot', 'results'];
  ids.forEach(id => {
    const original = document.getElementById(id);
    if (original.classList.contains('band')) {
      const inner = $('.section', original);
      original.removeAttribute('id');
      inner.id = id;
      sections[id] = inner;
    } else sections[id] = original;
  });
  let config;
  if (project === 'zus') {
    config = {
      title: 'ZUS Coffee', subtitle: '社媒内容制作与新品传播', number: '03', eyebrow: 'SOCIAL CONTENT / SHOOTING, EDITING & ENGLISH COPY',
      ownership: '新品卖点 · 内容选题<br>拍摄剪辑 · 英文文案<br>发布排期 · 内容复盘',
      note: '内部后台明细不公开。账号截图与产品资料不代表个人全部作品。',
      steps: [
        { id: 'research', title: '新品调研', sub: '将用户偏好转成卖点', icon: 'scan-search', sections: ['research', 'overview'] },
        { id: 'content', title: '社媒内容', sub: '围绕卖点制作与发布', icon: 'images', sections: ['content'] },
        { id: 'channels', title: '排期与传播', sub: '线上首发与门店信息', icon: 'network', sections: ['channels'] },
        { id: 'review', title: '内容复盘', sub: '反馈与下一步调整', icon: 'chart-no-axes-combined', sections: ['review', 'results'] }
      ],
      metrics: [ ['50', '条 Instagram 内容', '参与制作与发布', 'content'], ['15+', '次内容复盘', '累计完成', 'review'], ['1.1w+', '账号粉丝增长', '项目期账号整体结果', 'results'] ]
    };
    const evidence = $('.evidence', sections.content);
    const production = node('details', 'evidence-drawer production-drawer', `<summary>${icon('clapperboard')}<span>内容制作与发布工作</span>${icon('chevron-down')}</summary>`);
    const productionItems = [...sections.content.children].filter(item => item !== evidence && !item.classList.contains('section-head'));
    evidence.before(production);
    production.append(...productionItems);
    $('.section-head h2', sections.content).textContent = '内容发布与素材展示';
    const source = $('.hero-source');
    if (source) { source.classList.add('asset-source'); sections.content.append(source); }
    const channelLead = $('.lead p', sections.review).textContent;
    sections.channels = section('channels', '内容发布，也要接上购买信息', channelLead);
    sections.channels.append($('.channel-steps', sections.review));
    $('.section-head h2', sections.review).textContent = '看完反馈，再决定下一条怎么做';
    $('.section-head .lead', sections.review).textContent = '每周跟踪内容表现，累计完成15+次复盘，并根据互动反馈调整后续选题、内容形式与发布节奏。';
    $('.section-head h2', sections.research).textContent = '先决定这条内容要讲什么';
    const researchItems = $$('.research-item', sections.research);
    const topics = researchItems.map((item, i) => ({
      label: ['用户偏好', '竞品表达', '本次选题'][i], title: $('h3', item).textContent,
      copy: $('p', item).textContent,
      body: `<p class="explorer-takeaway">${$('small', item).textContent}</p>`
    }));
    explorer($('.research-grid', sections.research), 'zus-research', '调研与选题', topics);
    const productProof = node('figure', 'research-product', '<img src="evidence/coffizz-product.png" alt="COFFIZZ 产品资料图" width="1080" height="1080"><figcaption>产品资料图 · 非个人摄影作品</figcaption>');
    $('.research-grid', sections.research).after(productProof);
    const researchBody = node('div', 'research-body');
    $('.research-grid', sections.research).before(researchBody);
    researchBody.append($('.research-grid', sections.research), productProof);
    const channelExplorer = node('div', 'channel-explorer');
    $('.channel-steps', sections.channels).before(channelExplorer);
    explorer(channelExplorer, 'zus-channel', '渠道传播', [
      { label: '线上首发', title: '产品信息、文案与发布时间一致', copy: '配合产品线上首发，协助整理宣传素材与发布排期，让产品画面、英文文案和发布信息相互对应。', body: '<dl class="explorer-rows"><div><dt>准备内容</dt><dd>产品素材、英文 caption、hashtag、购买入口。</dd></div><div><dt>核对重点</dt><dd>产品名称、发布主题、链接与时间安排。</dd></div></dl>' },
      { label: 'FamilyMart', title: '让感兴趣的人知道去哪里购买', copy: '配合 FamilyMart 线下渠道传播，协助整理宣传素材、门店信息、购买入口与发布排期。', body: '<dl class="explorer-rows"><div><dt>准备内容</dt><dd>已确认的门店与渠道说明、对应产品资料。</dd></div><div><dt>核对重点</dt><dd>门店范围、购买信息与发布安排是否一致。</dd></div></dl>' }
    ]);
    setupZusGallery(evidence);
  } else if (project === 'education') {
    config = {
      title: 'AI 教育产品', subtitle: '公众号运营与高校活动', number: '03', eyebrow: 'USER EDUCATION / UNIVERSITY EVENTS',
      ownership: '用户反馈 · 需求整理<br>公众号内容 · 产品资料<br>高校对接 · 现场组织',
      note: '内部反馈原文与数据明细不公开。场景示例为方法整理，不是用户原话。',
      steps: [
        { id: 'feedback', title: '用户需求', sub: '从问题确认原因', icon: 'scan-search', sections: ['feedback', 'overview'] },
        { id: 'content', title: '公众号内容', sub: '从0到1建设内容', icon: 'notebook-pen', sections: ['content'] },
        { id: 'resources', title: '产品资料', sub: '把问题变成说明', icon: 'files', sections: ['resources'] },
        { id: 'pilot', title: '高校活动', sub: '对接、组织与答疑', icon: 'presentation', sections: ['pilot'] },
        { id: 'results', title: '工作结果', sub: '内容沉淀与建议', icon: 'clipboard-check', sections: ['results'] }
      ],
      metrics: [ ['100+', '用户反馈', '归类师生与试点用户问题', 'feedback'], ['30+', '使用内容', '指南 / FAQ / 教程 / 案例', 'content'], ['10', '条优化建议', '建议数量不代表全部实施', 'results'], ['0→1', '公众号内容建设', '围绕使用需求组织内容', 'content'] ]
    };
    sections.resources = section('resources', '把使用问题整理成可查阅的资料', '协同团队整理产品演示资料、FAQ、教师案例及课程方案，为产品培训与宣讲提供内容支持。');
    const resources = node('div', 'resource-explorer');
    sections.resources.append(resources);
    const documents = [
      { label: '产品演示', title: '把功能放进具体的使用顺序', copy: '配合团队整理演示资料，串起任务场景、关键操作与结果查看方式。', purpose: '支持产品介绍与功能演示', rows: [['场景', '从教学、备课或自学任务切入'], ['操作', '整理入口、输入要求与关键步骤'], ['结果', '说明查看方式与需要留意的问题']] },
      { label: 'FAQ', title: '把重复出现的问题集中说明', copy: '根据用户反馈归类常见疑问，协同整理说明与注意事项。', purpose: '支持答疑与用户自行查阅', rows: [['问题', '按入口、操作与结果等类型归类'], ['说明', '补充已确认的操作步骤与答案'], ['跟进', '待确认的问题交由相关团队核查']] },
      { label: '教师案例', title: '让功能对应到教学使用情境', copy: '协同整理教师使用案例，帮助说明产品可以应用于哪些任务。', purpose: '为培训与宣讲提供场景材料', rows: [['任务', '说明案例对应的使用需求'], ['过程', '整理与任务相关的产品操作'], ['补充', '保留需要解释的背景与注意事项']] },
      { label: '课程方案', title: '把产品使用与课程需求衔接', copy: '配合团队整理课程相关材料，为后续产品培训与试点沟通提供参考。', purpose: '支持课程相关产品沟通', rows: [['需求', '结合师生反馈整理课程使用需求'], ['资料', '梳理对应功能、案例与使用说明'], ['反馈', '记录培训与使用中待补充的问题']] }
    ];
    explorer(resources, 'education-resource', '资料组织思路', documents.map(item => ({ ...item, eyebrow: '结构示意 · 非内部原始文件', body: `<p class="resource-purpose">${item.purpose}</p><ol class="document-preview">${item.rows.map(([name, detail], i) => `<li><span>0${i + 1}</span><strong>${name}</strong><p>${detail}</p></li>`).join('')}</ol>` })));
    sections.resources.append($('.document-outline', sections.content));
    sections.resources.append(node('p', 'example-note', '以上展示资料整理思路，不公开内部文档、教师身份及课程细节。'));
    const articles = $$('.content-item', sections.content);
    const contentNotes = [
      ['产品入口与首次使用', '从哪里进入 → 主要功能 → 第一次操作', '对应首次接触产品的用户。'],
      ['具体功能与操作步骤', '任务目标 → 输入要求 → 操作过程 → 查看结果', '对应已开始使用、需要具体指导的用户。'],
      ['重复出现的使用问题', '常见疑问 → 已确认说明 → 注意事项', '让重复问题有一个可持续查阅的答案。'],
      ['教学、备课与自学场景', '使用需求 → 功能选择 → 场景说明', '帮助用户理解功能适合什么任务。']
    ];
    explorer($('.content-grid', sections.content), 'education-content', '公众号内容类型', articles.map((article, i) => ({
      label: $('h3', article).textContent, title: contentNotes[i][0], copy: $('p', article).textContent,
      body: `<div class="article-outline"><span>内容组织思路</span><p>${contentNotes[i][1]}</p></div><p class="explorer-takeaway">${contentNotes[i][2]}</p>`
    })));
    sections.content.append(node('div', 'content-connection', `${icon('files')}<div><strong>线上说明与培训资料，回应同一批使用问题</strong><p>公众号提供持续查阅的内容，产品资料补充具体步骤与案例。</p></div><a href="#resources">查看产品资料 ${icon('arrow-right')}</a>`));
    const stages = $$('.pilot-stage', sections.pilot);
    const handoffs = ['高校宣讲与体验安排、师生关注重点', '活动流程、产品演示、FAQ、教师案例及课程材料', '现场组织、使用答疑与师生反馈记录', '后续内容补充与10条优化建议'];
    const roles = ['对接高校并沟通活动安排。', '安排活动流程，协同产品和业务团队准备材料。', '负责现场组织与使用答疑，记录师生反馈。', '整理问题、补充使用说明，向相关团队提交改进建议。'];
    explorer($('.pilot-stages', sections.pilot), 'education-pilot', '高校活动环节', stages.map((stage, i) => ({ label: $('h3', stage).textContent, title: $('h3', stage).textContent, copy: $('p', stage).textContent, body: `<dl class="explorer-rows"><div><dt>对应产出</dt><dd>${handoffs[i]}</dd></div><div><dt>我的职责</dt><dd>${roles[i]}</dd></div></dl>` })));
    const path = $('.usage-path', sections.feedback);
    const pathHeading = path.previousElementSibling;
    const drawer = node('details', 'evidence-drawer usage-drawer', `<summary>${icon('route')}<span>用户使用过程<small>流程示意 · 非后台转化数据</small></span>${icon('chevron-down')}</summary>`);
    sections.feedback.append(drawer);
    drawer.append(path);
    pathHeading.remove();
  } else {
    config = {
      title: 'AI 教育产品', subtitle: '公众号建设与案例传播', number: '02', eyebrow: 'WECHAT CONTENT / AI PRODUCT STORIES',
      ownership: '用户调研 · 选题依据<br>公众号建设 · 产品案例<br>高校推广 · 合作跟进',
      note: '展示已脱敏合作记录与活动照片。结构示意为方法整理；使用率为实习期间整体表现。',
      steps: [
        { id: 'journey', title: '调研与选题', sub: '把使用问题转成内容依据', icon: 'scan-search', sections: ['journey', 'overview'] },
        { id: 'followup', title: '公众号与案例', sub: '把AI功能写成易懂内容', icon: 'notebook-pen', sections: ['followup'] },
        { id: 'collaboration', title: '业务协同', sub: '案例材料、高校推广与合作', icon: 'presentation', sections: ['collaboration'] },
        { id: 'evidence', title: '过程材料', sub: '活动背景与合作记录', icon: 'images', sections: ['evidence'] },
        { id: 'outcome', title: '复盘与迭代', sub: '反馈回到下一轮内容', icon: 'chart-no-axes-combined', sections: ['outcome'] }
      ],
      metrics: [['100+', '条用户反馈', '按场景与问题归类', 'journey'], ['30+', '篇使用内容', '指南 / FAQ / 教程 / 案例', 'followup'], ['10', '条优化建议', '建议数量不代表全部上线', 'outcome'], ['+30%', '核心功能使用率', '实习期间整体表现', 'outcome']]
    };
    const stages = $$('.stage', sections.journey).map(stage => ({
      label: $('h3', stage).textContent, title: $('h3', stage).textContent, copy: $('p', stage).textContent,
      body: `<p class="explorer-takeaway">${$('.stage-output strong', stage).textContent}</p>${$('a', stage).outerHTML}`
    }));
    const timeline = $('.timeline', sections.journey);
    const timelineExplorer = node('div', 'partnership-stages');
    timeline.replaceWith(timelineExplorer);
    explorer(timelineExplorer, 'partnership-stage', '用户洞察与推广闭环', stages);
    const handoffNotes = ['需求确认 → 材料准备 → 宣讲体验 → 现场答疑与反馈。', '用户任务 → 对应功能 → 演示、FAQ与场景材料。', '活动安排 → 分工执行 → 问题记录 → 后续跟进。', '当地需求 → 双方分工 → 协议签署 → 项目交接。'];
    const teamItems = $$('.team', sections.collaboration).map((team, i) => ({ label: $('h4', team).textContent, title: $('h4', team).textContent, copy: $('p', team).textContent, body: `<p class="explorer-takeaway">${handoffNotes[i]}</p>` }));
    const teamExplorer = node('div', 'team-explorer');
    $('.collaboration-map', sections.collaboration).replaceWith(teamExplorer);
    explorer(teamExplorer, 'partnership-team', '推广与合作执行', teamItems);
    const rows = $$('.followup-row:not(.header)', sections.followup).map(row => ({
      label: $('h3', row).textContent.replace(/^\d+\s*/, ''), title: $('h3', row).textContent.replace(/^\d+\s*/, ''),
      copy: $$('p > span:last-child', row)[0].textContent,
      body: `<dl class="explorer-rows"><div><dt>我的工作</dt><dd>${$$('p > span:last-child', row)[1].textContent}</dd></div></dl>`
    }));
    const followupExplorer = node('div', 'followup-explorer');
    $('.followup-table', sections.followup).replaceWith(followupExplorer);
    explorer(followupExplorer, 'partnership-file', '内容与物料类型', rows);
  }

  const totalSteps = config.steps.length;
  const totalLabel = String(totalSteps).padStart(2, '0');
  const resultId = project === 'partnership' ? 'outcome' : 'results';
  const workspace = node('div', 'workspace report');
  workspace.id = 'workspace';
  workspace.innerHTML = `<aside class="workspace-rail"><p class="rail-label">PROJECT WORKFLOW <span>05 STEPS</span></p><div class="workflow-tabs" role="tablist" aria-label="项目工作流程" aria-orientation="vertical">${config.steps.map((step, i) => `<button type="button" role="tab" id="step-${step.id}" aria-controls="panel-${step.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-step="${i}"><span class="step-number">0${i + 1}</span><span class="step-text"><strong>${step.title}</strong><small>${step.sub}</small></span>${icon(step.icon)}</button>`).join('')}</div><div class="rail-ownership"><span>我的职责</span><p>${config.ownership}</p></div><p class="rail-note">${config.note}</p></aside><div class="workspace-body"><div class="workspace-toolbar"><span class="workspace-breadcrumb"></span><div class="workspace-actions"><button type="button" class="read-mode" aria-pressed="false">${icon('rows-3')}<span>完整阅读</span></button><a href="#results" class="tool-link">${icon('clipboard-check')}<span>工作结果</span>${icon('arrow-up-right')}</a></div></div><div class="workspace-panels"></div><nav class="workflow-footer" aria-label="流程翻页"><button type="button" class="step-prev" aria-label="上一步">${icon('arrow-left')}<span>上一步</span></button><span class="step-position" aria-live="polite"></span><button type="button" class="step-next"><span></span>${icon('arrow-right')}</button></nav></div>`;
  $('.rail-label span', workspace).textContent = `${totalLabel} STEPS`;
  $('.tool-link', workspace).href = `#${resultId}`;
  const disclosure = $('.disclosure');
  const snapshot = $('.snapshot');
  snapshot.after(disclosure);
  disclosure.after(workspace);
  const panels = config.steps.map((step, i) => {
    const panel = node('div', 'workflow-panel');
    panel.id = `panel-${step.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `step-${step.id}`);
    panel.tabIndex = 0;
    step.sections.forEach(id => {
      const content = sections[id];
      content.classList.remove('wrap');
      if (id === 'overview') {
        const details = node('details', 'evidence-drawer responsibilities-drawer', `<summary>${icon('briefcase-business')}<span>项目背景与我的职责</span>${icon('chevron-down')}</summary>`);
        details.append(content);
        panel.append(details);
      } else panel.append(content);
    });
    const firstHeading = $('.section-head .kicker', panel);
    firstHeading.textContent = `0${i + 1} / ${step.title}`;
    $('.workspace-panels', workspace).append(panel);
    return panel;
  });
  $$('main > .band').forEach(band => band.remove());
  document.body.classList.add('interactive-case', 'companion-case', `project-${project}`);
  $('.nav').classList.add('site-nav');
  $('.brand').classList.add('nav-brand');
  $('.brand > span:last-child').textContent = '项目经历';
  $('.hero-inner').classList.add('report');
  $('.eyebrow').textContent = `PROJECT ${config.number} / ${config.eyebrow}`;
  $('h1').textContent = config.title;
  $('h1').after(node('p', 'project-subtitle', config.subtitle));
  $('.hero-foot')?.remove();
  $$('.lead').forEach(lead => lead.classList.add('section-lead'));
  const evidenceId = project === 'partnership' ? 'evidence' : project === 'zus' ? 'materials' : 'content';
  $('.nav-links').innerHTML = `<a href="#${config.steps[0].id}">项目工作</a><a href="#${evidenceId}">${project === 'education' ? '公众号内容' : '素材展示'}</a><a href="#${resultId}">工作结果</a>`;
  $('.metric-row').className = 'metric-strip companion-metrics';
  $('.metric-strip').innerHTML = config.metrics.map(([value, title, note, target]) => `<a class="summary-stat" href="#${target}"><strong>${value}</strong><span>${title}<small>${note}</small></span>${icon('arrow-up-right')}</a>`).join('');

  const resultMetrics = node('div', 'result-metrics');
  resultMetrics.innerHTML = config.metrics.slice(0, 3).map(([value, title, note]) => `<div><strong>${value}</strong><h3>${title}</h3><p>${note}</p></div>`).join('');
  if (project !== 'partnership') $('.section-head', sections.results).after(resultMetrics);
  const resultLoop = node('a', 'review-loop', `${icon('corner-up-left')}<span><strong>${project === 'zus' ? '将复盘带回下一条内容' : '将使用反馈带回内容与资料'}</strong><small>${project === 'zus' ? '核对信息 → 调整选题与表达 → 发布后继续观察' : '使用问题 → 内容更新 / 产品建议 → 继续确认'}</small></span>${icon('arrow-right')}`);
  resultLoop.href = `#${config.steps[0].id}`;
  if (project === 'partnership') resultLoop.querySelector('span').innerHTML = '<strong>把反馈带回下一轮推广</strong><small>需求归类 → 卖点与内容 → 宣讲体验 → 复盘改进 → 再收集反馈</small>';
  sections[resultId].append(resultLoop);

  let active = 0;
  let fullRead = false;
  const tabs = $$('.workflow-tabs button', workspace);
  const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  function selectStep(index, { scroll = false, hash = true } = {}) {
    active = index;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = !fullRead && i !== index; });
    $('.workspace-breadcrumb').innerHTML = `<b>0${index + 1}</b> / ${totalLabel} <span>${config.steps[index].title}</span>`;
    $('.step-position').textContent = `0${index + 1} / ${totalLabel}`;
    $('.step-prev').disabled = index === 0;
    $('.step-next span').textContent = index === totalSteps - 1 ? `回到${config.steps[0].title}` : `下一步：${config.steps[index + 1].title}`;
    if (hash) history.pushState(null, '', `#${config.steps[index].id}`);
    if (scroll) {
      (fullRead ? panels[index] : workspace).scrollIntoView({ behavior: motion(), block: 'start' });
      panels[index].focus({ preventScroll: true });
    }
    if (matchMedia('(max-width: 900px)').matches) {
      const rail = $('.workflow-tabs');
      const tabBox = tabs[index].getBoundingClientRect();
      const railBox = rail.getBoundingClientRect();
      if (tabBox.left < railBox.left || tabBox.right > railBox.right) {
        rail.scrollTo({ left: rail.scrollLeft + tabBox.left - railBox.left, behavior: motion() });
      }
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectStep(index, { scroll: true }));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? totalSteps - 1 : delta ? (index + delta + totalSteps) % totalSteps : null;
      if (next === null) return;
      event.preventDefault(); selectStep(next); tabs[next].focus({ preventScroll: true }); tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
  $('.step-next').addEventListener('click', () => selectStep((active + 1) % totalSteps, { scroll: true }));
  $('.step-prev').addEventListener('click', () => selectStep(Math.max(0, active - 1), { scroll: true }));
  $('.read-mode').addEventListener('click', () => {
    fullRead = !fullRead;
    workspace.classList.toggle('is-full-read', fullRead);
    $('.read-mode').setAttribute('aria-pressed', String(fullRead));
    $('.read-mode span').textContent = fullRead ? '分步阅读' : '完整阅读';
    selectStep(active, { hash: false });
    workspace.scrollIntoView({ behavior: motion(), block: 'start' });
  });
  function showTarget(id, scroll = true) {
    const target = document.getElementById(id);
    if (!target) return false;
    const index = panels.findIndex(panel => panel.contains(target));
    if (index < 0) return false;
    selectStep(index, { hash: false });
    const drawer = target.closest('details');
    if (drawer) drawer.open = true;
    if (target.matches('.panel, .decision-panel')) {
      const nestedTab = $(`[aria-controls="${target.id}"]`);
      nestedTab?.click();
    }
    if (scroll) (id === config.steps[index].id ? panels[index] : drawer || target).scrollIntoView({ behavior: motion(), block: 'start' });
    return true;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!showTarget(link.hash.slice(1))) return;
    event.preventDefault(); history.pushState(null, '', link.hash);
  });
  function followHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) selectStep(0, { hash: false, scroll: true });
    else showTarget(id);
  }
  window.addEventListener('hashchange', followHash);
  window.addEventListener('popstate', followHash);
  const narrow = matchMedia('(max-width: 900px)');
  function orientations() {
    $('.workflow-tabs').setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical');
    $$('.explorer-tabs').forEach(list => list.setAttribute('aria-orientation', getComputedStyle(list).display === 'flex' ? 'horizontal' : 'vertical'));
  }
  orientations();
  narrow.addEventListener('change', orientations);
  matchMedia('(max-width: 600px)').addEventListener('change', orientations);
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.6, 'aria-hidden': 'true' } });
  selectStep(0, { hash: false });
  if (location.hash) requestAnimationFrame(followHash);

  function setupZusGallery(evidence) {
    const feed = $('.feed', evidence);
    const materials = $$('.product-materials figure', evidence);
    const sourceImages = [feed, ...materials].map(figure => ({
      src: $('.photo-link', figure).getAttribute('href'), alt: $('img', figure).alt,
      caption: $('figcaption', figure).textContent
    }));
    sourceImages.push({ src: 'evidence/coffizz-launch.jpg', alt: 'COFFIZZ 产品发布资料图', caption: 'COFFIZZ 产品发布资料图 · 非个人摄影作品' });
    const labels = ['账号内容', '产品资料', '包装资料', '发布资料'];
    const notes = [
      ['Instagram 账号内容', '账号截图呈现产品、生活场景与活动内容。', '参与选题、拍摄剪辑、英文文案与发布配合；截图不代表其中全部作品由本人制作。'],
      ['COFFIZZ 产品资料', '用于核对产品名称、包装与内容需要说明的信息。', '产品资料图不作为个人摄影或设计作品展示。'],
      ['COFFIZZ 包装资料', '配合整理产品与传播素材时，用于核对对应产品信息。', '包装资料图不作为个人设计作品展示。'],
      ['COFFIZZ 发布资料', '呈现新品发布时的产品与品牌信息。', '品牌资料仅提供背景，不代表本人独立负责整个新品上市。']
    ];
    const gallery = node('div', 'asset-gallery', `<div class="asset-tabs" role="tablist" aria-label="ZUS 资料类型">${labels.map((label, i) => `<button type="button" role="tab" id="asset-tab-${i}" aria-controls="asset-detail">${label}</button>`).join('')}</div><div id="asset-detail" role="tabpanel" tabindex="0"><figure class="asset-visual"><img alt=""><button type="button" class="asset-zoom" aria-label="放大查看资料" title="放大查看资料">${icon('expand')}</button></figure><div class="asset-caption"><p class="asset-count mono"></p><h3></h3><p data-asset-context></p><p data-asset-credit class="asset-credit"></p><a class="asset-original" target="_blank" rel="noopener noreferrer">查看原图 ${icon('arrow-up-right')}</a></div></div>`);
    gallery.id = 'materials';
    evidence.replaceWith(gallery);
    let current = 0;
    bindTabs($$('.asset-tabs button', gallery), i => {
      current = i;
      $('#asset-detail', gallery).setAttribute('aria-labelledby', `asset-tab-${i}`);
      $('.asset-visual img', gallery).src = sourceImages[i].src;
      $('.asset-visual img', gallery).alt = sourceImages[i].alt;
      $('.asset-count', gallery).textContent = `0${i + 1} / 04`;
      $('.asset-caption h3', gallery).textContent = notes[i][0];
      $('[data-asset-context]', gallery).textContent = notes[i][1];
      $('[data-asset-credit]', gallery).textContent = notes[i][2];
      $('.asset-original', gallery).href = sourceImages[i].src;
    });
    const dialog = node('dialog', 'asset-lightbox', `<header><h2 id="asset-lightbox-title">资料原图</h2><button type="button" class="asset-close" aria-label="关闭资料" title="关闭资料" autofocus>${icon('x')}</button></header><div class="asset-lightbox-body"><img alt=""></div><p class="asset-lightbox-note"></p>`);
    dialog.setAttribute('aria-labelledby', 'asset-lightbox-title');
    document.body.append(dialog);
    let previousOverflow = '';
    $('.asset-zoom', gallery).addEventListener('click', () => {
      $('img', dialog).src = sourceImages[current].src;
      $('img', dialog).alt = sourceImages[current].alt;
      $('h2', dialog).textContent = notes[current][0];
      $('.asset-lightbox-note', dialog).textContent = sourceImages[current].caption;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    });
    $('.asset-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      $('.asset-zoom', gallery).focus({ preventScroll: true });
    });
  }
})();
