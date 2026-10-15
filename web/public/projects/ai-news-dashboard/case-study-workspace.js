(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const steps = [
    { id: 'overview', title: '用户问题', sub: '反馈与价格问卷', icon: 'scan-search', sections: ['overview'] },
    { id: 'campaigns', title: '内容选题', sub: '问题、场景与多平台内容', icon: 'route', sections: ['campaigns'] },
    { id: 'materials', title: '图文物料', sub: '文案、视觉与A/B测试', icon: 'panels-top-left', sections: ['materials', 'content-test'] },
    { id: 'channels', title: '达人与发布', sub: '筛选、素材配合与跟进', icon: 'network', sections: ['channels'] },
    { id: 'research', title: 'AI看板复盘', sub: '数据、反馈与下一轮内容', icon: 'chart-no-axes-combined', sections: ['sop', 'results', 'research'] }
  ];
  const sections = Object.fromEntries(steps.flatMap(step => step.sections).map(id => [id, document.getElementById(id)]));
  const main = $('main');
  const workspace = document.createElement('div');
  workspace.className = 'workspace report';
  workspace.id = 'workspace';
  workspace.innerHTML = `
    <aside class="workspace-rail">
      <p class="rail-label">PROJECT WORKFLOW <span>05 STEPS</span></p>
      <div class="workflow-tabs" role="tablist" aria-label="项目工作流程" aria-orientation="vertical">
        ${steps.map((step, index) => `<button type="button" role="tab" id="step-${step.id}" aria-controls="panel-${step.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-step="${index}"><span class="step-number">0${index + 1}</span><span class="step-text"><strong>${step.title}</strong><small>${step.sub}</small></span>${icon(step.icon)}</button>`).join('')}
      </div>
      <div class="rail-ownership"><span>我的职责</span><p>用户问题 · 内容选题<br>图文物料 · 达人协作<br>AI提效 · 传播复盘</p></div>
      <p class="rail-note">内容与A/B版本展示工作思路；看板内置虚构示例数据。</p>
    </aside>
    <div class="workspace-body">
      <div class="workspace-toolbar"><span class="workspace-breadcrumb"><b>01</b> / 05 <span>${steps[0].title}</span></span><div class="workspace-actions"><button type="button" class="read-mode" aria-pressed="false">${icon('rows-3')}<span>完整阅读</span></button><a href="operations_dashboard.html" class="tool-link">${icon('chart-no-axes-combined')}<span>AI分析看板</span>${icon('arrow-up-right')}</a></div></div>
      <div class="workspace-panels"></div>
      <nav class="workflow-footer" aria-label="流程翻页"><button type="button" class="step-prev" aria-label="上一步">${icon('arrow-left')}<span>上一步</span></button><span class="step-position" aria-live="polite">01 / 05</span><button type="button" class="step-next"><span>下一步：${steps[1].title}</span>${icon('arrow-right')}</button></nav>
    </div>`;
  main.prepend(workspace);

  // Move the original evidence and charts intact; old section URLs remain valid.
  const panels = steps.map((step, index) => {
    const panel = document.createElement('div');
    panel.className = 'workflow-panel';
    panel.id = `panel-${step.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `step-${step.id}`);
    panel.tabIndex = 0;
    step.sections.forEach(id => {
      const section = sections[id];
      section.classList.remove('report');
      if (id === 'content-test' || id === 'sop') {
        const details = document.createElement('details');
        details.className = 'evidence-drawer';
        details.innerHTML = `<summary>${icon(id === 'sop' ? 'chart-no-axes-combined' : 'split')}<span>${id === 'sop' ? 'AI辅助运营看板' : 'A/B测试与内容优化'}<small>${id === 'sop' ? '虚构示例 · 方法演示' : '版本示意 · 非历史投放截图'}</small></span>${icon('chevron-down')}</summary>`;
        if (id === 'sop') {
          details.classList.add('tool-drawer');
          details.open = true;
          $('.dashboard-shot', section).before($('.demo-footer', section));
        }
        details.append(section);
        panel.append(details);
      } else panel.append(section);
    });
    $('.workspace-panels', workspace).append(panel);
    panel.hidden = index !== 0;
    return panel;
  });
  $$('main > .band').forEach(band => band.remove());
  document.body.classList.add('interactive-case');

  $('.nav-links').innerHTML = `<a href="#overview">项目工作</a><a href="#materials">图文物料</a><a href="#results">项目结果</a><a href="operations_dashboard.html">复盘工具 ${icon('arrow-up-right')}</a>`;
  $('.snapshot .metric-strip').innerHTML = `
    <a class="summary-stat" href="#materials"><strong>100<span>+</span></strong><span>内容输出<small>公众号 / 小红书 / 社群</small></span>${icon('arrow-up-right')}</a>
    <a class="summary-stat" href="#results"><strong>+50<span>%</span></strong><span>新增注册<small>较前一周 · 期间整体结果</small></span>${icon('arrow-up-right')}</a>
    <a class="summary-stat" href="#research"><strong><small>约</small>+15<span>%</span></strong><span>首次专题创建率<small>相对提升 · 期间整体结果</small></span>${icon('arrow-up-right')}</a>`;
  $('h1').innerHTML = 'AI资讯产品<span>YouNews</span>';
  $('h1').insertAdjacentHTML('afterend', '<p class="project-subtitle">内容运营与传播复盘</p>');
  $('#overview .kicker').textContent = '01 / USER QUESTIONS & TOPICS';
  $('#overview h2').textContent = '从用户问题找到内容选题';
  $('#overview .section-lead').textContent = '围绕AI产品功能、使用场景与用户高频问题，结合用户反馈和价格问卷提炼传播重点；把需求转为产品介绍、场景案例和FAQ，再用传播数据与反馈调整下一轮选题。';
  $('#campaigns .kicker').textContent = '02 / CONTENT PLANNING & DELIVERY';
  $('#campaigns h2').textContent = '把选题转为多平台内容与物料';
  $('#channels .kicker').textContent = '04 / CREATORS & CHANNELS';
  $('#channels h2').textContent = '让内容与受众匹配，并跟进发布';
  $('#channels .section-lead').textContent = '累计输出100+条公众号、小红书及社群内容；依据粉丝画像、内容垂直度和互动表现筛选博主，参与推广素材准备、内容上线及发布跟进，配合内容合作与传播。';
  $('#results .kicker').textContent = '05 / RESULTS & REVIEW';
  $('#results h2').textContent = '把传播复盘带回下一轮内容';
  $('#results .section-lead').textContent = '以下为本人提供的实习期整体汇总结果。结合AI看板、A/B测试与用户反馈，调整选题、图文表达、推广节奏及渠道预算；各项增长不单独归因于某篇内容、某位达人或某项测试。';
  $('#research .section-head').hidden = true;
  $('#research .review-journey').hidden = true;

  let active = 0;
  let fullRead = false;
  const stepTabs = $$('.workflow-tabs [role="tab"]');
  const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const rootTarget = () => workspace.scrollIntoView({ behavior: motion(), block: 'start' });
  function selectStep(index, { scroll = false, hash = true } = {}) {
    active = index;
    stepTabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = !fullRead && i !== index;
    });
    $('.workspace-breadcrumb').innerHTML = `<b>0${index + 1}</b> / 05 <span>${steps[index].title}</span>`;
    $('.step-position').textContent = `0${index + 1} / 05`;
    $('.step-prev').disabled = index === 0;
    $('.step-next span').textContent = index === steps.length - 1 ? `回到${steps[0].title}` : `下一步：${steps[index + 1].title}`;
    $('.step-next').setAttribute('aria-label', $('.step-next span').textContent);
    if (hash) history.pushState(null, '', `#${steps[index].id}`);
    if (scroll) {
      if (fullRead) panels[index].scrollIntoView({ behavior: motion(), block: 'start' });
      else rootTarget();
      panels[index].focus({ preventScroll: true });
    }
    if (matchMedia('(max-width: 900px)').matches) {
      const rail = $('.workflow-tabs');
      const tabBox = stepTabs[index].getBoundingClientRect();
      const railBox = rail.getBoundingClientRect();
      if (tabBox.left < railBox.left || tabBox.right > railBox.right) {
        rail.scrollTo({ left: rail.scrollLeft + tabBox.left - railBox.left, behavior: motion() });
      }
    }
  }
  stepTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectStep(index, { scroll: true }));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : delta ? (active + delta + 5) % 5 : null;
      if (next === null) return;
      event.preventDefault();
      selectStep(next);
      stepTabs[next].focus({ preventScroll: true });
      stepTabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
  $('.step-prev').addEventListener('click', () => selectStep(Math.max(0, active - 1), { scroll: true }));
  $('.step-next').addEventListener('click', () => selectStep((active + 1) % 5, { scroll: true }));
  $('.read-mode').addEventListener('click', () => {
    fullRead = !fullRead;
    workspace.classList.toggle('is-full-read', fullRead);
    $('.read-mode').setAttribute('aria-pressed', String(fullRead));
    $('.read-mode span').textContent = fullRead ? '分步阅读' : '完整阅读';
    selectStep(active, { hash: false });
    rootTarget();
  });
  function followHash(scroll = true) {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const index = steps.findIndex(step => step.sections.includes(id));
    if (index < 0) return;
    selectStep(index, { hash: false });
    const section = sections[id];
    const drawer = section.closest('details');
    if (drawer) drawer.open = true;
    if (scroll) {
      const target = id === steps[index].id ? panels[index] : drawer || section;
      target.scrollIntoView({ behavior: motion(), block: 'start' });
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.hash.slice(1);
    if (!steps.some(step => step.sections.includes(id))) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    followHash();
  });
  window.addEventListener('popstate', () => {
    if (!location.hash) selectStep(0, { hash: false, scroll: true });
    else followHash();
  });
  window.addEventListener('hashchange', () => followHash());

  function selectableTabs(buttons, onSelect) {
    buttons.forEach((button, index) => {
      function select(i) {
        buttons.forEach((item, n) => { item.setAttribute('aria-selected', String(n === i)); item.tabIndex = n === i ? 0 : -1; });
        onSelect(i);
      }
      button.addEventListener('click', () => select(index));
      button.addEventListener('keydown', event => {
        const i = event.key === 'ArrowRight' ? (index + 1) % buttons.length : event.key === 'ArrowLeft' ? (index + buttons.length - 1) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : null;
        if (i === null) return;
        event.preventDefault(); select(i); buttons[i].focus();
      });
    });
  }
  const needs = [
    ['信息太多，哪些值得持续关注？', '先从信息分散、反复搜索的场景切入，让用户判断产品是否对自己有用。', '用“信息焦虑自救计划”介绍资讯追踪的用途，再接上产品功能说明。', '了解产品，进入体验。', '03-awareness.jpg', '信息焦虑自救计划'],
    ['感兴趣，但为什么现在就试？', '结合付费意愿与价格接受度，先讲清可体验内容、参与方式与权益，让用户有判断价值的依据。', '准备新用户体验物料，并接上功能说明与参与入口。', '进入产品，开始尝试。', '04-activation.jpg', '新用户专属福利'],
    ['注册之后，第一步该做什么？', '注册并不等于真正用起来；需要让用户知道如何完成第一次专题创建。', '用创建专题的功能图说明操作入口，结合社群答疑与体验问卷收集问题。', '创建专题，留下使用反馈。', '08-topic-creation.png', '创建专题']
  ];
  selectableTabs($$('[data-need]'), index => {
    const [question, reason, action, next, file, title] = needs[index];
    $('.need-question').textContent = question;
    $('[data-need-reason]').textContent = reason;
    $('[data-need-action]').textContent = action;
    $('[data-need-next]').textContent = next;
    $('.need-evidence img').src = `event-materials/${file}`;
    $('.need-evidence img').alt = title;
    $('.need-evidence strong').textContent = title;
    $('#need-detail').setAttribute('aria-labelledby', $$('[data-need]')[index].id);
  });

  const campaignRoute = document.createElement('div');
  campaignRoute.className = 'campaign-flow';
  campaignRoute.innerHTML = `<div class="campaign-flow-label"><span>产品介绍与场景表达</span><span>内容组织思路 · 项目物料展示</span></div><ol>${[
    ['看见价值', '上新与场景海报', 'megaphone'], ['产生兴趣', '功能与体验说明', 'mouse-pointer-2'], ['开始使用', '专题创建与答疑', 'square-plus'], ['反馈问题', '社群交流与问卷', 'messages-square']
  ].map(([name, detail, symbol], i) => `<li>${icon(symbol)}<span>0${i + 1}</span><h3>${name}</h3><p>${detail}</p></li>`).join('')}</ol><a class="evidence-jump" href="#materials">查看对应宣传物料 ${icon('arrow-right')}</a>`;
  $('#campaigns .section-head').after(campaignRoute);
  const campaignTabs = document.createElement('div');
  campaignTabs.className = 'campaign-tabs need-tabs';
  campaignTabs.setAttribute('role', 'tablist');
  campaignTabs.setAttribute('aria-label', '内容交付场景');
  const campaignBriefs = $$('.campaign-brief');
  campaignTabs.innerHTML = ['选题与图文准备', '传播场景与配合'].map((title, i) => `<button type="button" role="tab" id="campaign-tab-${i}" aria-controls="campaign-detail-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${title}</button>`).join('');
  campaignRoute.before(campaignTabs);
  campaignBriefs.forEach((brief, i) => {
    brief.id = `campaign-detail-${i}`;
    brief.setAttribute('role', 'tabpanel');
    brief.setAttribute('aria-labelledby', `campaign-tab-${i}`);
    brief.tabIndex = 0;
  });
  campaignBriefs[1].append($('.field-evidence'));
  const showCampaign = i => {
    campaignBriefs.forEach((brief, n) => { brief.hidden = n !== i; });
    campaignRoute.hidden = i !== 0;
  };
  selectableTabs($$('button', campaignTabs), showCampaign);
  showCampaign(0);

  const materials = sections.materials;
  materials.classList.add('section');
  $('h3', materials).outerHTML = '<div class="section-head"><div><p class="kicker">03 / VISUAL CONTENT & CREATIVE</p><h2>用图文回应用户关心的问题</h2></div><p class="section-lead">参与推广素材准备，校对文案与视觉呈现，保持各渠道品牌调性一致。以下按传播目的展示项目图文物料；用标题、首图与内容测试继续优化表达。</p></div>';
  $('.materials-intro').hidden = true;
  const figures = $$('.campaign-material', materials);
  const materialNotes = [
    ['让用户知道 YouNews 是什么。', '围绕产品定位，参与推广素材准备与文案、视觉校对。', '了解功能，进入产品。'],
    ['让用户知道如何开始追踪。', '突出输入话题与创建专题的操作入口。', '完成首次专题创建。'],
    ['讲清不同解读方式的用途。', '并列展示概览、大白话与深度解读。', '选择适合自己的阅读方式。'],
    ['说明产品在日常阅读中的用途。', '用日报界面展示专题更新如何汇总。', '关注专题，查看持续更新。'],
    ['从信息分散、反复搜索的困扰切入。', '将资讯追踪功能转化为场景化表达。', '判断是否适合自己，了解产品。'],
    ['给感兴趣的用户一个体验理由。', '整理体验内容、活动权益与参与说明。', '按活动说明参与体验。'],
    ['为使用中的问题提供交流入口。', '讲清答疑、功能体验与社群支持。', '进入社群，交流使用问题。'],
    ['邀请体验用户反馈问题与建议。', '整理参与对象、填写方式与奖励说明。', '填写体验问卷。']
  ];
  const viewer = document.createElement('div');
  viewer.className = 'creative-viewer';
  viewer.innerHTML = `<div class="creative-image"><img alt=""><button type="button" class="creative-zoom" aria-label="放大查看海报" title="放大查看海报">${icon('expand')}</button></div><div class="creative-annotation"><p class="creative-index">01 / 08</p><h3></h3><dl><div><dt>传播目的</dt><dd data-creative-purpose></dd></div><div><dt>图文表达</dt><dd data-creative-work></dd></div><div><dt>用户下一步</dt><dd data-creative-next></dd></div></dl><p class="creative-credit">图文物料 / 项目展示</p></div>`;
  $('.materials-credit').after(viewer);
  let selectedMaterial = 0;
  let openingLightbox = false;
  function selectMaterial(index) {
    selectedMaterial = index;
    const figure = figures[index];
    const source = $('img', figure);
    $('.creative-image img').src = source.src;
    $('.creative-image img').alt = source.alt;
    $('.creative-annotation h3').textContent = $('figcaption strong', figure).textContent;
    $('.creative-index').textContent = `0${index + 1} / 08`;
    $('[data-creative-purpose]').textContent = materialNotes[index][0];
    $('[data-creative-work]').textContent = materialNotes[index][1];
    $('[data-creative-next]').textContent = materialNotes[index][2];
    figures.forEach((item, i) => { item.classList.toggle('is-selected', i === index); $('a', item).setAttribute('aria-pressed', String(i === index)); });
  }
  figures.forEach((figure, index) => {
    const link = $('a', figure);
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', `选择海报：${$('figcaption strong', figure).textContent}`);
    link.addEventListener('click', event => {
      if (openingLightbox || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); event.stopImmediatePropagation();
      selectMaterial(index);
    }, true);
    link.addEventListener('keydown', event => { if (event.key === ' ') { event.preventDefault(); link.click(); } });
  });
  $('.creative-zoom').addEventListener('click', () => {
    openingLightbox = true;
    try { $('a', figures[selectedMaterial]).click(); } finally { openingLightbox = false; }
  });
  $('.material-lightbox').addEventListener('close', () => $('.creative-zoom').focus({ preventScroll: true }));
  selectMaterial(0);

  const channelMap = $('.channel-map');
  const channels = [
    ['公众号', '完整讲清产品价值', '产品介绍、功能教程与场景案例', '围绕产品卖点、适用场景与操作步骤组织内容，承接用户从了解产品到开始体验。', '阅读与互动，以及用户对产品价值和使用方式的反馈。'],
    ['小红书', '从具体使用场景切入', '场景选题、标题与首图', '围绕资讯分散、反复搜索等使用问题组织内容，调整标题与文案表达。', '内容阅读、收藏与评论中的需求信号。'],
    ['社群', '把关注接到实际使用', '内容分发、答疑与反馈收集', '分发相关内容，结合交流中的问题补充教程和FAQ。', '能够追踪的访问与注册，以及后续使用问题。']
  ];
  channelMap.innerHTML = `<div class="channel-select" role="tablist" aria-label="分发渠道">${channels.map((item, i) => `<button type="button" id="channel-${i}" role="tab" aria-controls="channel-detail" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span>0${i + 1}</span>${item[0]}${icon('arrow-right')}</button>`).join('')}</div><div id="channel-detail" role="tabpanel" aria-labelledby="channel-0" tabindex="0"><span class="channel-content-label"></span><h3></h3><dl><div><dt>内容处理</dt><dd data-channel-action></dd></div><div><dt>发布后看</dt><dd data-channel-review></dd></div></dl></div>`;
  function selectChannel(index) {
    $('.channel-content-label').textContent = channels[index][2];
    $('#channel-detail h3').textContent = channels[index][1];
    $('[data-channel-action]').textContent = channels[index][3];
    $('[data-channel-review]').textContent = channels[index][4];
    $('#channel-detail').setAttribute('aria-labelledby', `channel-${index}`);
  }
  selectableTabs($$('.channel-select button'), selectChannel);
  selectChannel(0);

  const chartTabs = document.createElement('div');
  chartTabs.className = 'chart-tabs';
  chartTabs.setAttribute('role', 'tablist');
  chartTabs.setAttribute('aria-label', '复盘指标');
  chartTabs.innerHTML = '<button type="button" role="tab" id="chart-registration" aria-controls="chart-0" aria-selected="true">新增注册 <strong>+50%</strong></button><button type="button" role="tab" id="chart-activation" aria-controls="chart-1" aria-selected="false" tabindex="-1">首次专题创建率 <strong>约 +15%</strong></button>';
  $('.result-charts').before(chartTabs);
  const charts = $$('.result-chart');
  charts.forEach((chart, index) => {
    chart.id = `chart-${index}`;
    chart.setAttribute('role', 'tabpanel');
    chart.setAttribute('aria-labelledby', index === 0 ? 'chart-registration' : 'chart-activation');
    chart.tabIndex = 0;
    chart.hidden = index !== 0;
  });
  selectableTabs($$('.chart-tabs button'), index => charts.forEach((chart, i) => { chart.hidden = i !== index; }));
  const loop = document.createElement('a');
  loop.className = 'review-loop';
  loop.href = '#overview';
  loop.innerHTML = `${icon('corner-up-left')}<span><strong>把复盘带回下一轮内容</strong><small>问题与问卷 → 选题 / 图文 / 达人协作 → A/B与AI看板 → 内容优化</small></span>${icon('arrow-right')}`;
  $('#research').append(loop);

  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.6, 'aria-hidden': 'true' } });
  selectStep(0, { hash: false });
  if (location.hash) requestAnimationFrame(() => followHash());
  const narrow = matchMedia('(max-width: 900px)');
  const updateOrientation = () => $('.workflow-tabs').setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical');
  updateOrientation();
  narrow.addEventListener('change', updateOrientation);
})();
