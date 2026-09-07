(() => {
  'use strict';
  // Supplied screenshots define balances/products. Missing detail fields are demo data.
  const products = [
    {id:'m',name:'享定存M',serial:'048069',code:'D23SU71LA048069',opened:'2024-01-01',minimum:1000,amount:6613562.25,rate:2.75,start:'2026-09-02',end:'2027-09-02'},
    {id:'2',name:'享定期2号',serial:'088169',code:'D23SU718A088169',opened:'2010-11-26',minimum:100000,amount:6524980.43,rate:2.75,start:'2026-08-20',end:'2027-08-20'},
    {id:'5',name:'享定期5号',serial:'076237',code:'D23SU613A076237',opened:'2024-06-15',minimum:100000,amount:2363474.18,rate:2.75,start:'2026-06-15',end:'2027-06-15'}
  ];
  const total=products.reduce((sum,p)=>sum+p.amount,0);
  const money=n=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const app=document.getElementById('app'),overlay=document.getElementById('overlay'),phone=document.getElementById('phone');
  // Some iOS Home Screen versions report dvh without the bottom system area.
  // In that mode only, use the device's logical screen bounds for the app surface.
  // Ordinary Safari keeps its actual browser viewport, including toolbar changes.
  function syncAppHeight(){
    const root=document.documentElement;
    if(!root)return;
    const installed=window.navigator?.standalone===true||window.matchMedia?.('(display-mode: standalone)').matches;
    const iphone=/iPhone|iPod/.test(window.navigator?.userAgent||'');
    if(installed&&iphone&&window.screen?.height&&window.screen?.width){
      const landscape=window.matchMedia?.('(orientation: landscape)').matches;
      const height=landscape?Math.min(window.screen.width,window.screen.height):Math.max(window.screen.width,window.screen.height);
      root.style.setProperty('--app-height',`${height}px`);
    }else root.style.removeProperty('--app-height');
  }
  syncAppHeight();
  window.addEventListener('resize',syncAppHeight);
  window.addEventListener('orientationchange',syncAppHeight);
  window.addEventListener('pageshow',syncAppHeight);
  const titles={splash:'开机',home:'首页',login:'登录',overview:'账户总览',deposits:'我的存单',holding:'持仓详情',records:'交易记录',transaction:'交易详情',products:'存款产品',productdetail:'产品详情'};
  let route={page:'splash',product:'m',status:'已起息'},loggedIn=false,pendingLogin={page:'overview'},phase='ready',generation=0,modal=null,filterStatus='全部',filterProduct='all',card='全部一卡通',timerIds=[],stack=[],positions={},returnFocus=null;
  const collapsed={};
  const selected=()=>products.find(p=>p.id===route.product)||products[0];
  const key=r=>[r.page,r.product,r.status,r.record].join(':');
  const later=(fn,ms)=>{const g=generation;timerIds.push(setTimeout(()=>{if(g===generation)fn()},ms));};
  function cancelTimers(){generation++;timerIds.forEach(clearTimeout);timerIds=[];}
  const icon=name=>{
    const paths={back:'<path d="m15 4-8 8 8 8"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v7l4 3" class="accent"/>',paper:'<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h3"/><path d="m14 18 6-6" class="accent"/>',pledge:'<path d="M5 3h14v18H5zM9 6l3 4 3-4M8 11h8M8 14h8M12 10v8"/>',plan:'<path d="M8 4H5v17h12v-6M10 2h6v4h-6zM8 10h7M8 14h3"/><path d="m14 19 6-6 2 2-6 6h-2z" class="accent"/>',reserve:'<path d="M15 21H3V3h14v7M6 7h8M6 11h5"/><circle cx="17" cy="16" r="5"/><path d="m15 13 2 3 2-3M14 16h6M17 16v3" class="accent"/>',box:'<path d="m3 7 9-4 9 4-9 4-9-4v11l9 4 9-4V7M12 11v11M7 5l10 5"/>',holding:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h8"/>',face:'<path d="M8 2H5a3 3 0 0 0-3 3v3M16 2h3a3 3 0 0 1 3 3v3M22 16v3a3 3 0 0 1-3 3h-3M8 22H5a3 3 0 0 1-3-3v-3M8 8v3M16 8v3M12 10v4h-2M7 16q5 5 10 0"/>'};
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.paper}</svg>`;
  };
  // Status information and the home gesture indicator belong to iOS, not the page.
  const header=(title,theme='')=>`<header class="page-header ${theme}"><div class="nav"><button data-action="back" aria-label="返回">${icon('back')}</button><h1 tabindex="-1">${title}</h1><button data-action="menu" class="more" aria-label="更多选项">···<small>37</small></button></div></header>`;
  const chevron='<span class="chevron" aria-hidden="true">›</span>';
  const skeleton=()=>'<div class="skeleton-list" aria-label="正在加载存单"><div class="skeleton banner"></div>'+[1,2,3].map(()=>'<div class="skeleton-row"><i class="skeleton square"></i><div><i class="skeleton line"></i><i class="skeleton line short"></i><i class="skeleton line"></i></div></div>').join('')+'</div>';
  const navTabs=active=>`<nav class="deposit-tabs" aria-label="存款导航"><button data-go="products" class="${active==='products'?'selected':''}" ${active==='products'?'aria-current="page"':''}>${icon('box')}<span>产品</span></button><button data-go="deposits" class="${active==='deposits'?'selected':''}" ${active==='deposits'?'aria-current="page"':''}>${icon('holding')}<span>持仓</span></button></nav>`;
  const extra=window.createExtraPages({header,icon,skeleton,money,total,products,navigate,render,service,choices,showModal,closeModal,goBack,getRoute:()=>route});
  Object.assign(titles,extra.titles);
  function home(){return extra.home();}
  function login(){return extra.profile();}
  function overview(){const loading=phase!=='ready';return `${header('账户总览','purple')}<div class="scroll-area overview-scroll" data-scroll><div class="overview-hero"><p class="announcement"><i></i> 开实名钱包，领10元红包</p><div class="balance-cards"><div><b>总资产</b><strong aria-label="${loading?'加载中':money(total+359.52)}">${loading?'<span class="spinner"></span>':money(total+359.52).split('.')[0]+'<small>.'+money(total+359.52).split('.')[1]+'</small>'}</strong></div><aside>本月剩余应还<strong>${loading?'--':'0.00'}</strong></aside></div></div><div class="account-body">${loading?'<div class="overview-placeholder"></div>':`<section class="card"><div class="deposit-group-title"><button data-action="collapse" data-group="cash" aria-expanded="${!collapsed.cash}">直接可用 <span class="triangle">${collapsed.cash?'▾':'▴'}</span></button><button data-action="cash-actions"><strong>359.33</strong>${chevron}</button></div>${collapsed.cash?'':'<button class="row" data-action="cash-actions"><span>活期存款</span><strong>359.33</strong></button>'}</section><section class="card row"><span>外汇</span><div class="align-right"><strong>0.19</strong><small>折合人民币</small></div></section><section class="card"><div class="deposit-group-title"><button data-action="collapse" data-group="deposits" aria-expanded="${!collapsed.deposits}">存款 <span class="triangle">${collapsed.deposits?'▾':'▴'}</span></button><button data-go="deposits" aria-label="查看全部存款 ${money(total)}"><strong>${money(total)}</strong>${chevron}</button></div>${collapsed.deposits?'':products.map(p=>`<button class="row" data-go="deposits"><span>${p.name}</span><strong>${money(p.amount)}</strong></button>`).join('')}</section><section class="card row insurance"><b>保险</b><span>未配置，您的保障方案待查看 ${chevron}</span></section><div class="notes"><p>说明：</p><p>1.资产信息仅供参考，且不包含保险资产、延期黄金市值，请以实际信息为准。</p><p>2.总负债包含信用卡负债与个人贷款余额。其中，信用卡负债金额为预估值，包含尚未入账的交易，与账单金额加总可能不一致，请以入账后为准。</p><p>3.外币资产将会被折算成人民币资产统计，因汇率实时变动，请以<span class="blue">实际信息</span>为准。</p><p>4.信用卡如有美元账单，将会折算成人民币负债计入到总负债中。</p></div><button class="contact blue" data-action="contact"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4a13 13 0 1 1-5 10M4 2v8M0 6h8M12 13v5M22 13v5"/></svg>如有其他疑问或建议，可联系小招</button>`}</div></div>`;}
  function depositPage(){const loading=phase!=='ready';return `${header('我的存单','red')}<div class="scroll-area deposits-scroll" data-scroll><div class="deposit-red"></div><section class="deposit-balance card"><div><strong>${loading?'--':money(total)}</strong><button data-action="cards">${card} <span class="triangle">▾</span></button></div><p>存单总本金(元)</p></section><nav class="deposit-actions card" aria-label="存单服务">${[['reserve','已预留额度','reserved'],['clock','交易记录','records'],['paper','纸质存单','paper'],['pledge','存单质押','pledge'],['plan','协议/计划','plan']].map(([i,label,a])=>`<button data-action="${a}">${icon(i)}<span>${label}</span></button>`).join('')}</nav>${loading?skeleton():`<button class="recommendation card" data-go="products"><em>推荐</em><span>定期本金兑付率100%，持有更安心</span>${chevron}</button><section class="holdings card"><button class="holdings-title" data-action="collapse" data-group="holdings" aria-expanded="${!collapsed.holdings}"><b>招行特色 <span class="triangle">${collapsed.holdings?'▾':'▴'}</span></b><strong>¥${money(total)}</strong></button>${collapsed.holdings?'':products.map(p=>`<button class="holding-row" data-go="holding" data-product="${p.id}" aria-label="查看${p.name}持仓详情"><div><span>${p.name} ${p.serial}</span><strong>${money(p.amount)}</strong></div><div class="muted"><span>到期日：${p.end}</span><span>本金(元)</span></div><div class="muted">年利率：<span class="red-text">${p.rate.toFixed(2)}%</span></div></button>`).join('')}</section>`}</div>${navTabs('deposits')}`;}
  const detailRows=rows=>`<dl class="detail-rows">${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const depositNotes=()=>`<div class="notes deposit-notes"><p>说明:</p><p>1、本业务依照《存款保险条例》有关法律法规，纳入存款保险保障范围。</p><p>2、客户承诺存入资金为合法所有，且资金来源合法，并非任何犯罪或其他任何非法活动所得及/或其产生的收益。</p><p>3、如需咨询服务，请拨打电话 95555。如您所在地无招商银行营业网点，投诉电话请拨打0755-95555-7。</p><p>4、客户不得利用本金融产品和服务从事各类违法活动，或以资金及所得收益支持、资助或变相帮助从事非法活动；如发现或有合理理由怀疑客户或客户资金存在洗钱、恐怖融资、逃税等嫌疑，我行有权提前终止服务，造成客户损失的，我行不承担责任。</p></div>`;
  function historicalProduct(){const record=historyData.find(r=>r.id===route.record);return record?{...record.p,amount:record.amount,rate:record.p.id==='2'||['2024-01-01','2024-06-15'].includes(record.date)?2.95:2.75,start:record.date,end:String(Number(record.date.slice(0,4))+1)+record.date.slice(4)}:selected();}
  function holding(){const p=historicalProduct();return `${header('持仓详情')}<div class="scroll-area detail-scroll latest-holding" data-scroll><section class="holding-summary"><button class="holding-product-link" data-go="productdetail" data-product="${p.id}"><span>${p.name}</span><strong>${p.code}</strong></button><div class="summary-columns"><div><strong class="red-text">${money(p.amount)}</strong><small>存单本金(元)</small></div><div><strong>${p.end.replaceAll('-','.')}</strong><small>到期日</small></div></div></section><section class="information"><h2>存入信息</h2>${detailRows([['银行卡','<span class="masked-card">6214********0813</span> <button class="view-card" data-action="view-card">查看卡号</button>'],['币种','人民币'],['年利率',p.rate.toFixed(2)+'%'],['存期','12个月'],['开户日',p.opened],['可用本金',money(p.amount)+'元']])}</section><section class="maturity"><div class="row"><span>到期资金安排</span><span>到期转存</span></div></section>${depositNotes()}</div>`;}
  // Exact historical amounts, grouping and dates from reference/new resource/14-定存交易记录new.png.
  const historyData=[
    ['m',6613562.25,'提前续约','2026-09-02'],['m',6613562.25,'已起息','2026-09-02'],
    ['2',6524980.43,'提前续约','2026-08-20'],['2',6524980.43,'已起息','2026-08-20'],
    ['5',2363474.18,'到期转存','2026-06-15'],['m',6493035.28,'到期转存','2026-01-01'],
    ['2',6394558.09,'到期转存','2025-11-26'],['5',2300218.18,'到期转存','2025-06-15'],
    ['m',6319255.75,'到期转存','2025-01-01'],['2',6223414.20,'到期转存','2024-11-26'],
    ['5',2234306.15,'已起息','2024-06-15'],['m',6138179.46,'已起息','2024-01-01'],['2',6054797.67,'到期转存','2023-11-26']
  ].map(([id,amount,status,date,month],i)=>({id:String(i),p:products.find(p=>p.id===id),amount,status,date,month:month||date.slice(0,7)}));
  let recordPeriod='近三年';
  function recordItems(){return historyData.filter(r=>(filterStatus==='全部'||r.status===filterStatus)&&(filterProduct==='all'||r.p.id===filterProduct)&&(recordPeriod==='近三年'||r.month>=(recordPeriod==='近一年'?'2025-09':'2026-06')));}
  function records(){const items=recordItems();return `${header('交易记录')}<div class="scroll-area records-scroll" data-scroll><div class="filters"><button data-action="record-period">${recordPeriod} <span>⌄</span></button><button data-action="filter-product">${filterProduct==='all'?'全部产品':products.find(p=>p.id===filterProduct).name} <span>⌄</span></button></div>${phase!=='ready'?'<div class="inline-loading" role="status"><span class="spinner"></span> 加载中...</div>':`<div class="records-list">${items.map((r,i)=>`${i===0||r.month!==items[i-1].month?`<p class="month">${r.month}</p>`:''}<button class="transaction-row" data-go="${r.status==='提前续约'?'transaction':'holding'}" data-product="${r.p.id}" data-status="${r.status}" data-record="${r.id}"><div><span>${r.p.name} ${r.p.serial}</span><span>¥${money(r.amount)}</span></div><div><span>${r.status}</span><span>${r.date}</span></div></button>`).join('')||'<p class="empty">暂无交易记录</p>'}</div><div class="notes"><p>说明：</p><p>1.整存整取的历史委托此处未包括，请前往收支明细查询。通知存款自2024年11月8日起纳入此处查询，在此之前的历史交易请前往收支明细查询。</p><p>2.本页面展示以往购买的、全额支取或已到期还本付息的招行特色产品，部分支取记录可在活期交易中查询。</p><p>3.结构性存款仅支持查询2020.01.01以来的交易记录及详情，如需查询更早的历史记录请前往收支明细查询。</p></div>`}</div>`;}
  function transaction(){const p=historicalProduct();return `${header('交易详情')}<div class="scroll-area transaction-scroll latest-transaction" data-scroll>${detailRows([['银行卡','6214********0813'],['产品代码',p.code],['产品名称',p.name],['币种','人民币'],['委托金额（元）',money(p.amount)],['利率',p.rate.toFixed(2)+'%'],['存期','1年'],['开户日',p.opened],['起息日',p.start],['到期日',p.end],['委托状态',route.status]])}</div>`;}
  function productDetail(){const p=selected();return `${header(p.name+'<small class="product-code">'+p.code+'</small>','product-detail-header')}<div class="scroll-area product-detail-scroll" data-scroll><section class="product-rate"><div><strong>${p.rate.toFixed(2)}%</strong><small>年利率</small></div><div><b>1年期</b><small>期限</small></div></section><section class="product-features"><h2>产品特点</h2>${detailRows([['制度保障','本产品为存款产品，人民币50万元内依照存款保险条例纳入存款保险保障范围'],['无手续费','存入、支取均不收取任何费用'],['当日起息','成功存入后当日起息，<em>周末与节假日利息不间断</em>']])}</section><section class="product-rules"><h2>交易规则</h2>${detailRows([['存入规则',money(p.minimum).replace('.00','')+'元起存，当日存入成功当日起息。'],['提前支取','提前支取，起息日30天后，按天计算利息。'],['到期规则','到期日按照产品年利率计息，一个自然日内本息自动入账，可选到期转存，本息到期日起息。']])}</section>${depositNotes()}</div>`;}
  function productPage(){return `${header('存款产品','red')}<div class="scroll-area product-scroll" data-scroll><p class="product-intro">招行特色存款</p>${products.map(p=>`<button class="card product-card" data-go="productdetail" data-product="${p.id}"><b>${p.name}</b><div><strong class="red-text">${p.rate.toFixed(2)}<small>%</small></strong><span>12个月 ${chevron}</span></div><small>年利率 · 查看产品详情</small></button>`).join('')}</div>${navTabs('products')}`;}
  function render(restoreScroll=0){
    const page=route.page;phone.dataset.page=page;phone.classList.toggle('dark',['home','login'].includes(page));phone.classList.toggle('busy',phase!=='ready');
    const bottomColor=['home','login'].includes(page)?'#000000':['overview','income','holding','transaction','incomedetail','productdetail','deposits','products','credit','finance','funds','borrow','activities','fxclosed','wealth','life'].includes(page)&&phase!=='blank'?'#f7f7f7':'#ffffff';
    document.documentElement?.style.setProperty('--page-bottom-bg',bottomColor);
    const views={home,login,overview,deposits:depositPage,holding,records,transaction,products:productPage,productdetail:productDetail};
    app.innerHTML=page==='splash'?'<div class="splash" aria-label="开机画面"><img src="01-开机.png?v=2" alt="招商银行：支付 理财 借钱"></div>':phase==='blank'?`${header(['overview','deposits'].includes(page)?'':titles[page])}<div class="web-progress" role="status" aria-label="正在打开页面"></div>`:views[page]?views[page]():extra.render(page,phase);
    app.setAttribute('aria-busy',String(phase!=='ready'));document.getElementById('caption').textContent=titles[page]+(phase!=='ready'?' · 加载中':'');
    const scroll=app.querySelector('[data-scroll]');if(scroll)scroll.scrollTop=restoreScroll;
  }
  function saveScroll(){const scroll=app.querySelector('[data-scroll]');if(scroll&&phase==='ready')positions[key(route)]=scroll.scrollTop;}
  function navigate(next,{back=false,replace=false,instant=false,historyEvent=false}={}){
    if(!Object.hasOwn(titles,next.page))next={page:'home'};
    const normalized={product:'m',status:'已起息',...next};
    if(!back&&!replace&&key(route)===key(normalized)){closeModal();return;}
    saveScroll();cancelTimers();closeModal(false);
    if(!back&&!replace&&key(route)!==key(normalized))stack.push({...route});
    extra.enter?.(normalized.page,route.page,{back,replace});
    route=normalized;
    extra.preload(route.page);
    if(!historyEvent){const state={replica:true,route,stack:[...stack]};history[replace?'replaceState':'pushState'](state,'','#'+route.page+(['holding','transaction','incomedetail','productdetail'].includes(route.page)?'?product='+route.product+(['holding','transaction','incomedetail'].includes(route.page)?'&status='+encodeURIComponent(route.status)+(route.record!==undefined?'&record='+encodeURIComponent(route.record):''):''):''));}
    const scroll=back?(positions[key(route)]||0):0;
    phone.classList.remove('enter-forward','enter-back');void phone.offsetWidth;phone.classList.add(back?'enter-back':'enter-forward');
    if(instant||['home','login','splash'].includes(route.page)){phase='ready';render(scroll);if(route.page==='splash')later(()=>navigate({page:'home'},{replace:true}),1000);return;}
    phase=route.page==='records'?'skeleton':'blank';render(scroll);
    const customTiming=extra.timing[route.page];
    const blankTime=back?260:customTiming?customTiming[0]:route.page==='deposits'?1500:route.page==='overview'?850:950;
    if(['overview','deposits'].includes(route.page)||(customTiming&&customTiming[1]))later(()=>{phase='skeleton';render(scroll)},blankTime);
    const duration=route.page==='records'?(back?650:1100):blankTime+(customTiming?(back?300:customTiming[1]):['overview','deposits'].includes(route.page)?(back?400:1100):0);
    later(()=>{phase='ready';render(scroll);app.querySelector('h1')?.focus({preventScroll:true})},duration);
  }
  let backPending=false;
  function goBack(){if(backPending)return;if(modal){closeModal();return;}if(stack.length){backPending=true;history.back();return;}navigate({page:{holding:'deposits',productdetail:'products',transaction:'records',incomedetail:'income',records:'deposits',deposits:'overview',overview:'home',products:'deposits',login:'home',fxclosed:'forex'}[route.page]||'home'},{back:true,replace:true});}
  function showModal(content,type='sheet'){
    returnFocus=document.activeElement;modal=type;app.inert=true;
    overlay.innerHTML=`<div class="modal-backdrop"><section class="modal ${type}" role="dialog" aria-modal="true" aria-label="${type==='face'?'登录验证':'选项'}">${content}</section></div>`;overlay.querySelector('button')?.focus();
  }
  function closeModal(focus=true){modal=null;overlay.innerHTML='';app.inert=false;if(focus&&returnFocus?.isConnected)returnFocus.focus();}
  function showFace(destination={page:'overview'}){pendingLogin=destination;if(loggedIn){navigate(destination);return;}showModal(`<button class="modal-close" data-action="close" aria-label="关闭登录">×</button><p>M**aelxz 请登录验证</p><button class="face-button" data-action="authenticate"><i class="face-orbit">${icon('face')}<svg class="face-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m5 12 4 4 10-10"/></svg></i><span>点击进行面容 ID 登录</span></button><button class="text-link" data-action="login-options">更多选项</button>`,'face');}
  function choices(title,items,action,active){showModal(`<h2>${title}</h2>${items.map(([id,label])=>`<button class="choice ${active===id?'chosen':''}" data-action="${action}" data-value="${id}">${label}<span>${active===id?'✓':''}</span></button>`).join('')}<button class="sheet-cancel" data-action="close">取消</button>`);}
  function service(title,content){showModal(`<h2>${title}</h2><p class="service-message">${content}</p><button class="sheet-cancel" data-action="close">知道了</button>`);}
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='restart'||b.dataset.action==='restart'){cancelTimers();extra.reset();loggedIn=false;pendingLogin={page:'overview'};stack=[];positions={};filterStatus='全部';filterProduct='all';recordPeriod='近三年';card='全部一卡通';Object.keys(collapsed).forEach(k=>delete collapsed[k]);navigate({page:'splash'},{replace:true,instant:true});return;}
    if(b.dataset.go){if(phase!=='ready'&&b.dataset.go!=='home')return;const next={page:b.dataset.go,product:b.dataset.product||route.product,status:b.dataset.status||'已起息',record:b.dataset.record};if(route.page==='home'&&!loggedIn&&next.page!=='home'){showFace(next);return;}navigate(next);return;}
    const action=b.dataset.action;
    if(action==='back'){goBack();return;}if(action==='close'){closeModal();return;}
    if(action==='account'||action==='face'){showFace();return;}
    if(action==='authenticate'){
      if(b.disabled)return;b.disabled=true;b.classList.add('scanning');b.querySelector('span').textContent='正在验证…';
      later(()=>{if(modal!=='face'||!b.isConnected)return;b.classList.remove('scanning');b.classList.add('verified');b.querySelector('span').textContent='验证成功';later(()=>{if(modal==='face'&&b.isConnected){loggedIn=true;navigate(pendingLogin)}},400)},1050);return;
    }
    if(action==='login-options'){showModal('<h2>登录方式</h2><p class="service-message">本地演示无需真实密码或面容信息。</p><button class="choice" data-action="demo-login">演示登录<span>›</span></button><button class="sheet-cancel" data-action="close">取消</button>');return;}
    if(action==='demo-login'){loggedIn=true;navigate(pendingLogin);return;}
    if(phase!=='ready'&&!['filter-status','filter-product','select-status','select-product'].includes(action))return;
    if(extra.handle(action,b))return;
    if(action==='record-period'){choices('查询时间',['近三个月','近一年','近三年'].map(x=>[x,x]),'select-period',recordPeriod);return;}
    if(action==='select-period'){recordPeriod=b.dataset.value;navigate({...route},{replace:true});return;}
    if(action==='view-card'){showModal('<button class="modal-close" data-action="close" aria-label="关闭">×</button><h2>卡号信息</h2><p>户名: 张迅</p><p>卡号: 6214 8610 9787 0813</p><p>开户行: 招商银行北京双榆树支行</p><p>身份证: 110108198708136334</p>','card-information');return;}
    if(action==='contact'){service('小招','您好，请问有什么可以帮您？');return;}
    if(action==='records'){navigate({page:'records'});return;}
    if(action==='collapse'){saveScroll();collapsed[b.dataset.group]=!collapsed[b.dataset.group];render(positions[key(route)]);return;}
    if(action==='cards'){choices('选择一卡通',[['全部一卡通','全部一卡通'],['一卡通 (0813)','一卡通 6214********0813']],'select-card',card);return;}
    if(action==='select-card'){card=b.dataset.value;closeModal();saveScroll();phase='skeleton';render(positions[key(route)]);later(()=>{phase='ready';render(positions[key(route)])},750);return;}
    if(action==='filter-status'){choices('交易状态',['全部','已起息','提前续约','到期转存'].map(x=>[x,x]),'select-status',filterStatus);return;}
    if(action==='filter-product'){choices('选择产品',[['all','全部产品'],...products.map(p=>[p.id,p.name])],'select-product',filterProduct);return;}
    if(action==='select-status'||action==='select-product'){if(action==='select-status')filterStatus=b.dataset.value;else filterProduct=b.dataset.value;closeModal();cancelTimers();phase='skeleton';render();later(()=>{phase='ready';render()},700);return;}
    if(action==='menu'){showModal('<h2>更多</h2><button class="choice" data-go="home">返回首页</button><button class="choice" data-action="restart">登出</button><button class="sheet-cancel" data-action="close">取消</button>');return;}
    if(action==='refresh'){navigate({...route},{replace:true});return;}
    const services={reserved:['已预留额度','暂无预留额度'],paper:['纸质存单','当前存单为电子存单，暂无纸质存单。'],pledge:['存单质押','当前无存单质押记录。'],plan:['协议/计划','当前到期资金安排：到期不转存。'],withdraw:['支取存款','此页面为交互演示，不会发起真实支取或修改账户余额。']};if(services[action])service(...services[action]);
  });
  window.addEventListener('popstate',e=>{
    touch=null;backPending=false;
    const valid=e.state?.replica&&Object.hasOwn(titles,e.state.route?.page);
    const [page,query='']=location.hash.slice(1).split('?'),params=new URLSearchParams(query);
    const target=valid?e.state.route:Object.hasOwn(titles,page)?{page,product:params.get('product')||'m',record:params.get('record')||undefined,status:params.get('status')||'已起息'}:stack.at(-1);
    if(!target)return;
    stack=valid&&Array.isArray(e.state.stack)?e.state.stack:stack.slice(0,-1);
    navigate(target,{back:true,historyEvent:true});
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();goBack();}if(e.key==='Tab'&&modal){const buttons=[...overlay.querySelectorAll('button:not(:disabled)')];if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  let touch=null;
  phone.addEventListener('touchstart',e=>{const t=e.touches[0],rect=phone.getBoundingClientRect();touch={x:t.clientX,y:t.clientY,edge:t.clientX-rect.left<28,top:(app.querySelector('[data-scroll]')?.scrollTop||0)===0}}, {passive:true});
  // Safari owns browser edge swipes; custom back is only for installed apps.
  const installedApp=()=>window.navigator?.standalone===true||window.matchMedia?.('(display-mode: standalone)').matches;
  phone.addEventListener('touchmove',e=>{if(!touch||!touch.edge||!installedApp())return;const t=e.touches[0];if(t.clientX-touch.x>12&&Math.abs(t.clientY-touch.y)<Math.abs(t.clientX-touch.x)&&e.cancelable){e.preventDefault();touch.owned=true;}},{passive:false});
  phone.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  phone.addEventListener('touchend',e=>{if(!touch)return;const start=touch;touch=null;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;if(start.edge&&start.owned&&dx>75&&Math.abs(dy)<70)goBack();else if(!start.edge&&start.top&&dy>95&&Math.abs(dx)<50&&['deposits','records','overview'].includes(route.page)&&phase==='ready')navigate({...route},{replace:true});},{passive:true});
  // iOS may resume an existing Home Screen window instead of loading its URL.
  let launchWasHidden=false;
  document.addEventListener('visibilitychange',()=>{
    if(!installedApp())return;
    if(document.visibilityState==='hidden'){launchWasHidden=true;return;}
    if(document.visibilityState==='visible'&&launchWasHidden){
      launchWasHidden=false;loggedIn=false;
      if(route.page==='home'||route.page==='splash')navigate({page:'splash'},{replace:true,instant:true});
    }
  });
  const [hash,query='']=location.hash.slice(1).split('?'),params=new URLSearchParams(query);
  navigate({page:installedApp()&&hash==='home'?'splash':Object.hasOwn(titles,hash)?hash:'splash',product:products.some(p=>p.id===params.get('product'))?params.get('product'):'m',record:params.get('record')||undefined,status:['提前支取本息','提前续约','到期转存'].includes(params.get('status'))?params.get('status'):'已起息'},{replace:true,instant:true});
})();
