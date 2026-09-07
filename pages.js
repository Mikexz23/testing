/* Additional journeys from reference/detials/IMG_4037.mov.
   Screenshot slices preserve supplied artwork, while navigation and state are HTML.
   All slice coordinates use a 390px-wide reference (the source PNGs are 1170px). */
window.createExtraPages=({header,icon,skeleton,money,total,products,termFor,navigate,render,service,choices,showModal,closeModal,goBack,getRoute})=>{
  const titles={transfer:'转账',income:'收支',incomedetail:'交易详情',credit:'我的信用卡',finance:'理财',funds:'基金',borrow:'借钱',cities:'城市服务',activities:'热门活动',remittance:'境外汇款',forex:'外汇兑换',fxclosed:'购汇委托',all:'全部',community:'社区',wealth:'财富',life:'生活'};
  const timing={transfer:[400,1200],income:[500,2000],credit:[800,1600],finance:[600,800],funds:[600,800],borrow:[500,900],cities:[450,650],activities:[1700,1800],remittance:[650,900],forex:[900,800],fxclosed:[500,0],all:[300,450],community:[400,600],wealth:[450,700],life:[400,700]};
  Object.assign(titles,{my:'我的',bankcards:'银行卡',debitcard:'消费卡',todo:'待办',coupons:'我的卡券',points:'我的积分'});
  Object.assign(timing,{my:[180,350],bankcards:[300,550],debitcard:[250,500],todo:[250,400],coupons:[350,650],points:[400,850]});
  const P='assets/pages/';
  let fxSide='购汇',incomeMonth='all',incomeFilter='全部',city='北京',activityTab='最新上线';
  const cqw=n=>(n/3.9).toFixed(4)+'cqw';
  const hit=(x,y,w,h,label,go,action,extra='')=>`<button class="reference-hit" style="left:${cqw(x)};top:${cqw(y)};width:${cqw(w)};height:${cqw(h)}" aria-label="${label}" ${go?`data-go="${go}"`:''} ${action?`data-action="${action}"`:''} ${extra}></button>`;
  function slice(file,top,bottom,hits='',alt=''){
    return `<div class="reference-slice" style="height:${cqw(bottom-top)}"><img src="${file}" alt="${alt}" width="1170" height="2532" style="top:-${cqw(top)}">${hits}</div>`;
  }
  const mainTabs=active=>`<nav class="main-tabs" aria-label="主导航">${[['home','首页','home'],['community','社区','community'],['wealth','财富','wealth'],['life','生活','life'],['my','我的','person']].map(([page,label,i])=>`<button data-go="${page}" class="${active===page?'selected':''}" ${active===page?'aria-current="page"':''}>${tabIcon(i)}<span>${label}</span></button>`).join('')}</nav>`;
  function tabIcon(name){const p={home:'<path d="m3 11 9-8 9 8M6 9v12h12V9M10 21v-7h4v7"/>',community:'<ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(40 12 12)"/><path d="M3 20 21 4"/>',wealth:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 16 4-5 3 2 4-6"/>',life:'<path d="M4 3h16v6a3 3 0 0 0 0 6v6H4v-6a3 3 0 0 0 0-6zM9 5v14"/>',person:'<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3z"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${p[name]}</svg>`;}
  const miniTabs=(labels,active=0)=>`<nav class="mini-tabs" aria-label="页面导航">${labels.map((label,i)=>`<button class="${i===active?'selected':''}" data-action="extra-tab" data-label="${label}">${icon(i?'holding':'box')}<span>${label}</span></button>`).join('')}</nav>`;
  function home(){
    const items=[['账户总览',null,'account'],['转账','transfer'],['收支明细','income'],['信用卡','credit'],['理财','finance'],['基金','funds'],['借钱','borrow'],['城市服务','cities'],['热门活动','activities'],['外汇购汇','forex'],['境外汇款','remittance'],['全部','all']];
    const hotspots=items.map(([label,go,action],i)=>hit(i%4*97.5,Math.floor(i/4)*98+48,97.5,92,label,go,action)).join('');
    return `<header class="home-search"><button data-go="all" aria-label="全部服务">⌗</button><button class="search-pill" data-go="all">⌕ <span>随心领</span></button><button data-action="menu" aria-label="更多">···</button></header><div class="scroll-area home-scroll" data-scroll>${slice('02-首页.png',100,617,hotspots,'账户总览、转账、收支明细、信用卡、理财、基金、借钱、城市服务、热门活动、外汇购汇、境外汇款、全部')}${slice(P+'首页下.png',166,752,hit(8,14,370,200,'理财产品','finance')+hit(8,230,370,270,'优享基金','funds'),'臻选产品、优享基金、尊享权益')}</div>${mainTabs('home')}`;
  }
  function profile(){return `<div class="profile-scroll" data-scroll>${slice('03-登陆.png',44,756,hit(90,305,210,120,'面容 ID 登录',null,'face')+hit(100,427,190,45,'更多登录选项',null,'login-options'),'我的：点击进行面容 ID 登录')}</div>${mainTabs('login')}`;}
  const configs={
    transfer:{file:'IMG_9517.png',top:92,bottom:820},
    credit:{file:'IMG_9518.png',top:92,bottom:754,theme:'coral',tabs:['用卡','管卡']},
    finance:{file:'理财页.png',top:92,bottom:754,tabs:['产品','持仓'],search:'交银理财灵动聚利日开…'},
    funds:{file:'IMG_9519.png',top:92,bottom:754,tabs:['基金','发现','自选','持仓'],search:'广发美国房地产指数…'},
    borrow:{file:'IMG_9521.png',top:92,bottom:754,theme:'gold',tabs:['借钱','我的额度']},
    activities:{file:'IMG_9523.png',top:92,bottom:830},
    remittance:{file:'IMG_9525.png',top:92,bottom:830},
    fxclosed:{file:'IMG_9524.png',top:92,bottom:815},
    community:{file:'IMG_9527.png',top:44,bottom:754,main:true},
    wealth:{file:'IMG_9528.png',top:44,bottom:754,main:true,theme:'coral'},
    life:{file:'IMG_9530.png',top:44,bottom:754,main:true,theme:'gold'}
  };
  function pageHits(page){
    if(page==='transfer')return hit(16,45,175,135,'银行账号转账',null,'local-form','data-label="银行账号转账"')+hit(199,45,175,135,'手机号转账',null,'local-form','data-label="手机号转账"')+hit(16,186,90,66,'转账记录','income')+hit(190,186,85,66,'信用卡还款','credit')+hit(16,285,360,420,'最近转账伙伴',null,'recipients');
    if(page==='credit')return hit(25,55,340,130,'信用卡账单',null,'credit-bill')+hit(20,215,350,190,'信用卡借钱','borrow');
    if(page==='finance')return hit(0,0,390,74,'查看理财分类',null,'finance-categories')+hit(20,165,350,430,'查看理财产品',null,'finance-product');
    if(page==='funds')return hit(0,0,390,100,'基金分类',null,'fund-categories')+hit(22,166,347,138,'分红基金',null,'fund-detail');
    if(page==='borrow')return hit(15,160,360,94,'闪电贷额度',null,'loan-detail')+hit(20,377,350,123,'e招贷额度',null,'loan-detail');
    if(page==='activities')return hit(5,241,380,32,'活动分类',null,'activity-tabs')+hit(10,280,370,290,'查看活动',null,'activity-detail');
    if(page==='remittance')return hit(15,15,179,150,'普通境外汇款',null,'local-form','data-label="普通境外汇款"')+hit(195,15,179,150,'留学快汇',null,'local-form','data-label="留学快汇"')+hit(15,167,119,65,'汇款记录','income')+hit(15,338,360,360,'历史收款人',null,'remit-recipient');
    if(page==='fxclosed')return hit(112,423,167,44,'我知道了',null,'back');
    if(page==='community')return hit(15,100,360,120,'养老避坑指南',null,'article')+hit(15,340,360,300,'社区资讯',null,'article');
    if(page==='wealth')return hit(0,173,78,70,'理财','finance')+hit(78,173,78,70,'基金','funds')+hit(234,173,78,70,'存款','deposits')+hit(312,255,78,70,'全部','all')+hit(0,255,78,70,'跨境金融','forex')+hit(10,55,370,100,'显示或隐藏总资产',null,'wealth-balance');
    if(page==='life')return hit(0,0,92,40,'选择城市','cities')+hit(14,180,360,65,'生活服务',null,'life-services')+hit(20,345,350,290,'精选活动','activities');
    return '';
  }
  function screenshotPage(page,phase){
    const c=configs[page];
    const bar=c.main?`<div class="native-background ${c.theme||''}"></div>`:c.search?`<header class="page-header" aria-label="${titles[page]}"><div class="nav"><button data-action="back" aria-label="返回">${icon('back')}</button><button class="reference-search" data-action="${page==='funds'?'fund-categories':'finance-categories'}">⌕ ${c.search}</button><button class="more" data-action="menu" aria-label="更多">···<small>37</small></button></div></header>`:header(titles[page],c.theme||'');
    let content=phase!=='ready'?`<div class="extra-skeleton">${skeleton()}</div>`:slice(P+c.file,c.top,c.bottom,pageHits(page),titles[page]);
    if(page==='finance'&&phase==='ready')content+=slice(P+'IMG_9515.png',128,754,hit(10,0,370,605,'理财产品分类',null,'finance-categories'),'活钱管理、稳健低波、稳健增值');
    if(page==='wealth'&&phase==='ready')content+=`<button class="wealth-live-balance" data-action="wealth-balance" aria-label="显示或隐藏总资产"><span data-wealth-amount>${wealthVisible?money(total+359.52):'••••••'}</span><small>总资产(元)</small></button>`;
    return `${bar}<div class="scroll-area reference-scroll ${c.main?'main-reference-scroll':''} ${c.theme||''}" data-scroll>${content}</div>${c.main?mainTabs(page):c.tabs?miniTabs(c.tabs):''}`;
  }
  const cityGroups={A:['安阳','安庆','鞍山'],B:['北京','包头','滨海','宝鸡','滨州'],C:['重庆','成都','长沙','常州','长春'],D:['大连','东莞','大庆'],F:['福州','佛山'],G:['广州','桂林','贵阳'],H:['杭州','合肥','哈尔滨','海口'],J:['济南','嘉兴','金华'],K:['昆明'],L:['兰州','洛阳'],N:['南京','南昌','南宁','宁波'],Q:['青岛','泉州'],S:['上海','深圳','苏州','沈阳','石家庄'],T:['天津','太原','台州'],W:['武汉','无锡','温州'],X:['西安','厦门','徐州'],Y:['烟台','扬州'],Z:['郑州','珠海','中山']};
  function cities(phase){return `${header('城市服务')}<div class="scroll-area city-scroll" data-scroll><p class="city-prompt">请选择您所需的城市服务专区</p>${phase!=='ready'?'<div class="inline-loading"><span class="spinner"></span> 加载中...</div>':Object.entries(cityGroups).map(([letter,list])=>`<section id="city-${letter}"><h2>${letter}</h2>${list.map(name=>`<button data-action="select-city" data-value="${name}">${name}</button>`).join('')}</section>`).join('')}</div><nav class="city-index" aria-label="城市首字母">${Object.keys(cityGroups).map(letter=>`<button data-action="city-index" data-value="${letter}">${letter}</button>`).join('')}</nav>`;}
  const fx=[['🇺🇸','美元','673.59'],['🇭🇰','港币','85.78'],['🇬🇧','英镑','910.81'],['🇦🇺','澳元','485.49'],['🇯🇵','日元','4.58'],['🇪🇺','欧元','782.63'],['🇨🇦','加元','486.98'],['🇸🇬','新元','532.03'],['🇳🇿','纽元','396.20']];
  function forex(phase){return `${header('外汇兑换')}<div class="scroll-area fx-scroll" data-scroll><div class="fx-tabs">${['购汇','结汇'].map(side=>`<button class="${side===fxSide?'selected':''}" data-action="fx-side" data-value="${side}">${side}</button>`).join('')}</div><div class="fx-columns"><span>币种</span><span>汇率走势</span><span>${fxSide==='购汇'?'银行卖出价':'银行买入价'}</span></div>${phase!=='ready'?'<div class="inline-loading"><span class="spinner"></span> 加载中...</div>':fx.map(([flag,name,rate])=>`<button class="fx-row" data-go="fxclosed"><span>${flag} ${name}</span><span class="fx-trend">⌁</span><span>${rate} <i>›</i></span></button>`).join('')}<p class="fx-note">每100外币折合人民币 · 参考录屏展示</p></div><div class="fx-footer"><button data-action="fx-calculator">算汇率</button><button class="primary-button" data-go="fxclosed">去${fxSide}</button></div>`;}
  const ledger=window.createLedger({header,icon,money,termFor,navigate,render,showModal,closeModal,choices,service,getRoute});
  const income=phase=>ledger.render(phase);
  const allGroups={查询:[['账户总览',null,'account'],['收支明细','income'],['我的账本','income'],['交易查询','records']],财富:[['朝朝宝','finance'],['朝朝盈2号','finance'],['朝朝盈','finance'],['理财','finance'],['基金','funds'],['私享投资','finance'],['存款','deposits'],['保险','wealth'],['黄金','wealth'],['债券','wealth'],['股票','wealth'],['银证期转账','transfer']],转账:[['银行账号转账','transfer'],['手机号转账','transfer'],['转账记录','income']],贷款:[['借钱','borrow'],['闪电贷','borrow'],['信用卡','credit']],跨境金融:[['境外汇款','remittance'],['外汇购汇','forex']]};
  const grid=items=>`<div class="service-grid">${items.map(([label,go,action],i)=>`<button ${go?`data-go="${go}"`:`data-action="${action}"`}>${icon(['clock','pledge','paper','plan'][i%4])}<span>${label}</span></button>`).join('')}</div>`;
  function all(phase){return `${header('全部服务')}<div class="scroll-area all-scroll" data-scroll>${phase!=='ready'?skeleton():`<h2>精选</h2>${slice(P+'IMG_9526.png',145,312,hit(0,0,97.5,95,'账户总览',null,'account')+hit(97.5,0,97.5,95,'基金','funds')+hit(195,0,97.5,95,'存款证明',null,'extra-unavailable','data-label="存款证明"')+hit(292.5,0,97.5,95,'转账','transfer'),'账户总览、基金、存款证明、转账等精选服务')}${Object.entries(allGroups).map(([k,items])=>`<section id="all-${k}"><h2>${k}</h2>${grid(items)}</section>`).join('')}`}</div>`;}
  let wealthVisible=false;
  function refresh(){render(document.querySelector?.('#app [data-scroll]')?.scrollTop||0);}
  function handle(action,b){
    const value=b.dataset.value,label=b.dataset.label;
    if(action==='fx-side'){fxSide=value;refresh();return true;}
    if(ledger.handle(action,b))return true;
    if(handleMy(action,b))return true;
    if(action==='city-index'){document.getElementById('city-'+value)?.scrollIntoView({block:'start'});return true;}
    if(action==='select-city'){city=value;service(value+'城市服务','已选择'+value+'。生活服务、热门活动可从生活页查看。');return true;}
    if(action==='all-category'){document.getElementById('all-'+value)?.scrollIntoView({block:'start'});return true;}
    if(action==='wealth-balance'){wealthVisible=!wealthVisible;const amount=document.querySelector?.('[data-wealth-amount]');if(amount)amount.textContent=wealthVisible?money(total+359.52):'••••••';return true;}
    if(action==='activity-tabs'){choices('活动分类',['最新上线','任务中心','月月有好礼','新户专享礼'].map(x=>[x,x]),'set-activity',activityTab);return true;}
    if(action==='set-activity'){activityTab=value;service(value,'M会员缤纷福利、境外好车、秋味盛宴等活动。');return true;}
    if(action==='extra-tab'){if(label==='产品'&&getRoute().page==='finance'){refresh();return true;}if(label==='持仓'){navigate({page:'deposits'});return true;}service(label,'当前暂无更多'+label+'记录。');return true;}
    const messages={
      'local-form':[label,'本地交互演示，不会提交真实转账或汇款。'],
      recipients:['最近转账伙伴','张迅、张晗、杨跃芬、张向东。此演示不会提交转账。'],
      'remit-recipient':['历史收款人','BAOFEN **** · 澳大利亚；XUN ***** · 加拿大。'],
      'credit-bill':['信用卡账单','9月3日账单：¥0.00 · 可用额度 ¥220,000.00'],
      'finance-categories':['理财分类','活钱管理 · 稳健低波 · 稳健增值 · 稳中求进 · 进取投资'],
      'finance-product':['多宝理财','周周宝 3.12% · 月月宝 3.38% · 季季宝 3.38% · 半年宝 2.97%。参考截图展示。'],
      'fund-categories':['基金分类','基金排行 · 指数基金 · 债券基金 · 全球投资 · FOF基金'],
      'fund-detail':['分红基金','历史年分红率 3.7% · 数据来自参考截图。'],
      'loan-detail':['借款额度','闪电贷最高可借 ¥300,000；e招贷可借额度 ¥50,000。此演示不会申请借款。'],
      'activity-detail':['热门活动','境外好车，秋日滋味；秋味盛宴，畅享美食。'],
      article:['养老避坑指南','本页展示录屏中的社区入口。文章全文未包含在参考素材中。'],
      'life-services':['生活服务',city+' · 饭票、影票、出行、便民服务、生活缴费'],
      'fx-calculator':['汇率参考','每100美元对应人民币673.59元（录屏示例），非实时汇率。'],
      'extra-unavailable':[label,'参考素材未包含该服务的后续页面。']
    };
    if(messages[action]){service(...messages[action]);return true;}return false;
  }
  // September 7 reference journey. Native status bars are cropped out of each image.
  const myFiles={my:'my-home.png',bankcards:'bank-cards.png',debitcard:'debit-card.png',coupons:'coupons.png',points:'points.png'};
  let pinLength=0,todoYear=2026,todoMonth=10,todoDay=5;
  function myHits(page){
    if(page==='my')return hit(0,4,60,48,'登出',null,'restart')+hit(75,59,130,51,'个人主页','bankcards')+
      [['bankcards','银行卡'],['todo','待办'],['coupons','卡券'],['points','积分']].map(([go,label],i)=>hit(18+i*89,115,89,67,label,go)).join('')+
      hit(15,194,360,116,'账户总览','overview')+hit(15,394,180,116,'信用卡','credit')+hit(199,394,176,116,'贷款','borrow')+hit(15,714,360,60,'我的养老','wealth')+hit(15,774,360,58,'全资产','overview')+
      ['数字人民币','去看房','风险评估','购车分期','我的网点','我的收藏'].map((label,i)=>hit(30+i%2*170,894+Math.floor(i/2)*65,160,57,label,null,'my-service',`data-label="${label}"`)).join('');
    if(page==='bankcards')return hit(275,39,100,38,'添加银行卡',null,'my-add-card')+hit(10,94,370,246,'消费卡','debitcard')+hit(10,398,370,350,'信用卡','credit');
    if(page==='debitcard')return hit(10,188,238,35,'开户行',null,'my-branch')+hit(260,187,120,38,'修改卡片名称',null,'my-card-name')+hit(10,250,370,51,'快捷支付',null,'my-quick-pay')+hit(70,430,250,30,'闲钱投资','funds')+hit(12,505,181,105,'亲友转账','transfer')+hit(197,505,181,105,'还款计划','credit')+hit(12,623,181,115,'理财计划','finance')+hit(197,623,181,115,'生活缴费','life');
    if(page==='coupons')return hit(10,5,370,55,'五险一金专享礼','activities')+hit(10,65,180,142,'财富福利社','activities')+hit(195,65,180,68,'现金红包',null,'my-redpacket')+hit(195,141,180,67,'数字人民币红包',null,'my-redpacket')+hit(100,515,195,35,'查看非可使用券',null,'my-used-coupons');
    if(page==='points')return hit(270,54,112,70,'积分账单',null,'my-points-bill')+['积分商城','推荐办卡','星巴克卡','排行榜','奈雪优惠'].map((label,i)=>hit(i*78,137,78,95,label,null,'my-service',`data-label="${label}"`)).join('')+hit(5,320,380,420,'查看积分商品',null,'my-points-product');
    return '';
  }
  function myPage(page,phase){
    if(page==='todo')return todoPage(phase);
    const isMy=page==='my',isCoupons=page==='coupons';
    const bar=isMy?'<div class="native-background my-native"></div>':header(titles[page],page==='points'?'points-header':page==='debitcard'?'debit-header':'').replace('<small>37</small>',page==='points'||isCoupons?'':'<small>52</small>');
    const bottom=isMy?mainTabs('my'):isCoupons?`<nav class="mini-tabs coupon-tabs"><button class="selected" data-action="my-coupon-tab" data-value="tickets">${icon('paper')}<span>票券</span></button><button data-action="my-coupon-tab" data-value="cards">${icon('holding')}<span>卡证</span></button></nav>`:'';
    let content=phase!=='ready'?skeleton():slice(P+myFiles[page],isMy?44:92,isMy?1125:isCoupons?754:820,myHits(page),titles[page]);
    if(isMy&&phase==='ready')content+=`<button class="my-total" data-go="overview" aria-label="账户总览 总资产">¥ ${money(total+359.52)}</button>`;
    if(isMy&&phase==='ready')content+='<span class="my-gear-cover" aria-hidden="true"></span>';
    if(page==='debitcard'&&phase==='ready')content+='<section class="debit-live-hero"><button class="debit-live-balance" data-go="overview"><span>可用余额</span><strong>¥ 359.33<small> ›</small></strong></button><div class="debit-live-card-art" aria-hidden="true"></div><div class="debit-live-number"><p>储蓄卡(I类)</p><b>**** 0813</b> <button data-action="debit-pin">查看卡号</button></div></section>';
    return `${bar}<div class="scroll-area new-page-scroll ${isMy?'my-page-scroll':''} ${isCoupons?'coupon-scroll':''}" data-scroll>${content}</div>${bottom}`;
  }
  function todoPage(phase){
    const first=(new Date(todoYear,todoMonth-1,1).getDay()+6)%7,days=new Date(todoYear,todoMonth,0).getDate();
    return `${header(`${todoYear}年${todoMonth}月`,'todo-header').replace('data-action="menu"','data-action="my-add-reminder"').replace('···<small>37</small>','＋')}<div class="scroll-area todo-scroll" data-scroll>${phase!=='ready'?skeleton():`<nav class="calendar-month"><button data-action="todo-month" data-value="-1" aria-label="上个月">‹</button><button data-action="my-add-reminder" aria-label="添加待办">＋</button><button data-action="todo-month" data-value="1" aria-label="下个月">›</button></nav><div class="calendar-week">${['一','二','三','四','五','六','日'].map(d=>`<span>${d}</span>`).join('')}</div><div class="calendar-days">${'<span></span>'.repeat(first)}${Array.from({length:days},(_,i)=>`<button data-action="todo-day" data-value="${i+1}" class="${todoDay===i+1?'selected':''}">${i+1}${todoYear===2026&&todoMonth===10&&i===4?'<small>风评到期</small>':''}</button>`).join('')}</div><section class="todo-event">${todoYear===2026&&todoMonth===10&&todoDay===5?'<h2>风评到期</h2><p>当前风评结果：A5</p><p>请及时进行风险评估，避免影响财富产品购买</p><button data-action="my-service" data-label="风险评估">去评估</button>':'<p>当日暂无待办事项</p>'}</section><p class="todo-note">以上事项如已处理请您忽略</p>`}</div>`;
  }
  function debitPin(){
    pinLength=0;
    showModal(`<div class="pin-dialog"><button class="modal-close" data-action="close" aria-label="关闭">×</button><h2>请输入取款密码</h2><p>请输入一卡通****0813取款密码</p><div class="pin-boxes" aria-label="演示密码输入">${'<span></span>'.repeat(6)}</div><button data-action="debit-pin-confirm" class="pin-confirm" disabled>确定</button></div><div class="pin-keyboard"><p>招商银行安全输入</p><div>${['1','2','3','4','5','6','7','8','9','完成','0','⌫'].map(v=>`<button data-action="debit-pin-key" data-value="${v}">${v}</button>`).join('')}</div></div>`,'debit-pin-modal');
  }
  function cardInfo(){showModal('<button class="modal-close" data-action="close" aria-label="关闭">×</button><h2>卡号信息</h2><p>户名: 张迅</p><p>卡号: 6214 8610 9787 0813</p><p>开户行: 招商银行北京双榆树支行</p><p>身份证: 110108198708136334</p>','card-information');}
  function handleMy(action,b){
    if(action==='debit-pin'||action==='view-card'){debitPin();return true;}
    if(action==='debit-pin-key'){
      const v=b.dataset.value;
      if(v==='完成'){if(pinLength===6)cardInfo();return true;}
      pinLength=v==='⌫'?Math.max(0,pinLength-1):Math.min(6,pinLength+1);
      document.querySelectorAll('.pin-boxes span').forEach((el,i)=>{el.textContent=i<pinLength?'●':'';});
      document.querySelector('.pin-confirm').disabled=pinLength!==6;return true;
    }
    if(action==='debit-pin-confirm'){if(pinLength===6)cardInfo();return true;}
    if(action==='debit-copy'){
      const value=b.dataset.value==='all'?'户名：张迅\n卡号：6214 8610 9787 0813\n开户行：招商银行北京双榆树支行':'6214861097870813';
      if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(()=>{b.textContent='已复制';}).catch(()=>{b.textContent='请长按卡号复制';});else b.textContent='请长按卡号复制';return true;
    }
    if(action==='todo-month'){todoMonth+=Number(b.dataset.value);if(todoMonth===0){todoMonth=12;todoYear--;}if(todoMonth===13){todoMonth=1;todoYear++;}todoDay=1;refresh();return true;}
    if(action==='todo-day'){todoDay=Number(b.dataset.value);refresh();return true;}
    if(action==='my-coupon-tab'){if(b.dataset.value==='cards')service('我的卡证','暂无卡证');return true;}
    if(action==='my-service'){service(b.dataset.label,'参考素材未包含此服务的后续页面。');return true;}
    const messages={'my-settings':['设置','可通过左上角登出结束本次体验。'],'my-add-card':['添加银行卡','本地演示不绑定真实银行卡。'],'my-branch':['开户行','招商银行北京双榆树支行'],'my-card-name':['卡片名称','消费卡'],'my-quick-pay':['快捷支付','支付宝 · 微信支付 · Apple Pay'],'my-redpacket':['红包','您还没有红包哦'],'my-used-coupons':['非可使用券','暂无已使用或已过期票券'],'my-points-bill':['积分账单','可用积分 57848，永久有效。参考素材未提供账单明细。'],'my-points-product':['积分商品','参考素材未提供商品详情；本地演示不兑换或下单。'],'my-add-reminder':['添加待办','参考素材未提供新增待办页面。']};
    if(messages[action]){service(...messages[action]);return true;}return false;
  }
  const preloaded=new Set();
  function preload(page){if(typeof Image==='undefined')return;const files=myFiles[page]?[myFiles[page]]:configs[page]?[configs[page].file]:page==='all'?['IMG_9526.png']:[];if(page==='finance')files.push('IMG_9515.png');if(page==='home')files.push('首页下.png');for(const file of files){if(preloaded.has(file))continue;preloaded.add(file);const image=new Image();image.src=P+file;}}
  function reset(){pinLength=0;todoYear=2026;todoMonth=10;todoDay=5;ledger.reset();fxSide='购汇';incomeMonth='all';incomeFilter='全部';city='北京';wealthVisible=false;activityTab='最新上线';}
  return {titles,timing,home,profile,mainTabs,handle,reset,preload,cardInfo,enter:(page,previous,{replace})=>{if(page==='income'&&previous!=='income'&&previous!=='incomedetail'&&!replace)ledger.resetFilters();},render:(page,phase)=>myFiles[page]||page==='todo'?myPage(page,phase):page==='income'?income(phase):page==='incomedetail'?ledger.detail():page==='forex'?forex(phase):page==='cities'?cities(phase):page==='all'?all(phase):screenshotPage(page,phase)};
};
