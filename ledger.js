/* Screenshots in reference/new details define amounts; IMG_4040 defines gestures. */
window.createLedger=({header,icon,money,termFor,navigate,render,showModal,closeModal,choices,service,getRoute})=>{
  const entries=[
    {id:'transfer-large',month:'2023-12',day:'12.18',date:'2023-12-18',label:'转账-张建生(8896)',time:'02:51',seconds:'34',amount:6137179.46,balance:6138179.46,type:'transfer',party:'张建生'},
    {id:'transfer-initial',month:'2023-12',day:'12.18',date:'2023-12-18',label:'转账-张建生(8896)',time:'02:32',seconds:'18',amount:1000,balance:1000,type:'transfer',party:'张建生'},
    {id:'deposit-opening',month:'2024-01',day:'1.1',date:'2024-01-01',label:'开户起息，产品代码：D23SU71LA048069',time:'09:51',seconds:'26',balance:0,type:'deposit',product:'m'},
    {id:'may-transfer',month:'2024-05',day:'5.27',date:'2024-05-27',label:'转账-张迅(1233)',time:'10:22',seconds:'43',amount:4306.15,balance:4306.15,type:'transfer',party:'张迅'},
    {id:'may-fund',month:'2024-05',day:'5.27',date:'2024-05-27',label:'蚂蚁（杭州）销售…',time:'07:19',seconds:'08',amount:-1000,balance:0,type:'fund'},
    {id:'may-initial-transfer',month:'2024-05',day:'5.10',date:'2024-05-10',label:'转账-张迅(1233)',time:'09:42',seconds:'35',amount:1000,balance:1000,type:'transfer',party:'张迅'},
    {id:'june-opening',month:'2024-06',day:'6.15',date:'2024-06-15',label:'开户起息，产品代码：D23SU613A076237',time:'12:13',seconds:'11',amount:-2234306.15,balance:0,type:'deposit',product:'5'},
    {id:'june-transfer',month:'2024-06',day:'6.15',date:'2024-06-15',label:'转账-张建生(8896)',time:'11:36',seconds:'52',amount:2230000,balance:2234306.15,type:'transfer',party:'张建生'},
    // July dates corrected to July 15 at the user's request.
    {id:'recent-fund',month:'2026-07',day:'7.15',date:'2026-07-15',label:'蚂蚁（杭州）销售…',time:'14:29',seconds:'37',amount:-640.47,balance:359.33,type:'fund'},
    {id:'recent-transfer',month:'2026-07',day:'7.15',date:'2026-07-15',label:'转账-张迅(1233)',time:'10:44',seconds:'15',amount:1000,balance:1000,type:'transfer',party:'张迅'}
  ].map(entry=>entry.type==='deposit'?{...entry,amount:-termFor(entry.product,entry.date).amount}:entry);
  let month='all',filter='全部',selected=entries[0],pickerMode='month',year=new Date().getFullYear(),pickMonth=new Date().getMonth()+1,rangeStart='2026-09-01',rangeEnd='2026-09-05',custom=false;
  const excluded=new Set(entries.map(r=>r.id));
  const notes=new Map();
  const escapeText=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const ledgerIcon=type=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${type==='deposit'?'<circle cx="12" cy="14" r="8"/><path d="M8 2h8M12 2v4M9 10l3 4 3-4M8 14h8M12 14v6"/>':type==='fund'?'<path d="M3 4h18v15H3zM6 15l4-4 4 2 5-6M12 19v3"/>':'<path d="M2 5h20v14H2zM6 10h12l-3-3M18 14H6l3 3"/>'}</svg>`;
  const amount=r=>(r.amount>0?'+':'-')+'¥'+money(Math.abs(r.amount));
  const refresh=()=>render(document.querySelector?.('#app [data-scroll]')?.scrollTop||0);
  function top(){return `<header class="page-header ledger-header"><div class="nav"><button data-action="back" aria-label="返回">${icon('back')}</button><h1 tabindex="-1">收支</h1><button data-action="ledger-search" aria-label="搜索"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8"/><path d="m16 16 6 6"/></svg></button><button data-action="menu" aria-label="更多">···</button></div></header>`;}
  const tabs=()=>`<nav class="ledger-tabs"><button class="selected" data-action="ledger-list"><span>¥</span>明细</button><button data-action="ledger-book"><span>▤</span>账本</button></nav>`;
  function rows(list){return list.map((r,i)=>`${i===0||r.date!==list[i-1].date?`<p class="ledger-day">${r.day}</p>`:''}<button class="income-row ledger-row" data-action="income-item" data-value="${r.id}"><span class="ledger-icon">${ledgerIcon(r.type)}</span><span class="ledger-label">${r.label}</span>${excluded.has(r.id)?'<em>不计入</em>':'<em class="included">计入</em>'}<strong>${amount(r)}</strong><small class="ledger-time">${r.time}:${r.seconds}</small><small class="ledger-balance">余额:¥ ${money(r.balance)}</small></button>`).join('');}
  function renderIncome(phase){
    let list=entries.filter(r=>(custom?r.date>=rangeStart&&r.date<=rangeEnd:month==='all'?r.month.startsWith('2026-'):r.month===month)&&(filter==='全部'||(filter==='收入'?r.amount>0:r.amount<0)));
    const months=month==='all'&&!custom?Array.from({length:9},(_,i)=>'2026-'+String(9-i).padStart(2,'0')):custom?[...new Set(list.map(r=>r.month))].sort().reverse():[month];
    return `${top()}<div class="income-filters ledger-filters"><button data-action="income-month">${custom?'自定义':month==='all'?'2026':month.replace('-','.')}▼</button><button data-action="income-card">储蓄卡 0813</button>${month==='all'&&!custom?'<button data-action="income-filter">按金额</button>':''}<button data-action="income-filter">${filter==='全部'?'筛选':filter}</button></div><div class="scroll-area ledger-scroll" data-scroll>${phase!=='ready'?'<div class="income-loading">一大波数据正在赶来，请耐心等待</div>':months.map(m=>{const items=list.filter(r=>r.month===m);return `<section class="ledger-month ${items.length?'':'ledger-empty'}"><h2>${Number(m.slice(5))}月</h2>${items.length?`${rows(items)}`:'<span>暂无明细</span>'}</section>`;}).join('')||'<p class="empty">暂无明细</p>'}</div>${tabs()}`;
  }
  function wheel(name,values,value){return `<div class="date-wheel" data-wheel="${name}" tabindex="0" role="listbox" aria-label="${name==='year'?'年份':'月份'}">${values.map(v=>`<button role="option" aria-selected="${v===value}" class="${v===value?'selected':''}" data-action="wheel-option" data-wheel="${name}" data-value="${v}">${v}</button>`).join('')}</div>`;}
  function clampPicker(){year=Math.max(2022,Math.min(2026,year));pickMonth=Math.max(1,Math.min(year===2026?9:12,pickMonth));}
  // Keep the sheet mounted so changing a wheel never restarts its backdrop animation.
  function syncWheels(scrollName){
    clampPicker();
    document.querySelectorAll?.('.date-wheel').forEach(el=>{
      const name=el.dataset.wheel,value=name==='year'?year:pickMonth;
      if(name==='month'&&el.querySelectorAll('button').length!==(year===2026?9:12)){
        el.innerHTML=Array.from({length:year===2026?9:12},(_,i)=>`<button role="option" aria-selected="false" data-action="wheel-option" data-wheel="month" data-value="${i+1}">${i+1}</button>`).join('');
      }
      const options=[...el.querySelectorAll('button')];
      options.forEach(b=>{const active=Number(b.dataset.value)===value;b.classList.toggle('selected',active);b.setAttribute('aria-selected',String(active));});
      if(name===scrollName||name==='month'&&scrollName==='year'){
        const index=options.findIndex(b=>Number(b.dataset.value)===value);
        if(index>=0)el.scrollTop=index*options[index].offsetHeight;
      }
    });
  }
  function picker(){
    clampPicker();
    showModal(`<div class="picker-tabs"><button data-action="picker-tab" data-value="month" class="${pickerMode==='month'?'selected':''}">月份选择</button><button data-action="picker-tab" data-value="custom" class="${pickerMode==='custom'?'selected':''}">自定义</button><button data-action="close" aria-label="关闭">×</button></div>${pickerMode==='month'?`<div class="picker-wheels">${wheel('year',Array.from({length:5},(_,i)=>2022+i),year)}${wheel('month',Array.from({length:year===2026?9:12},(_,i)=>i+1),pickMonth)}</div>`:`<div class="custom-dates"><p>快捷时间</p><div>${['上月','近三月','近一年'].map(x=>`<button data-action="date-shortcut" data-value="${x}">${x}</button>`).join('')}</div><p>自定义</p><label>开始日期<input type="date" data-date="start" value="${rangeStart}" max="${rangeEnd}"></label><label>结束日期<input type="date" data-date="end" value="${rangeEnd}" min="${rangeStart}"></label></div>`}<button class="picker-confirm" data-action="confirm-month">确定</button>`,'month-picker');
    document.querySelectorAll?.('.date-wheel').forEach(el=>{const selectedOption=el.querySelector('[aria-selected="true"]');if(selectedOption)el.scrollTop=[...el.querySelectorAll('button')].indexOf(selectedOption)*selectedOption.offsetHeight;let pending;el.addEventListener('scroll',()=>{clearTimeout(pending);pending=setTimeout(()=>{if(!el.isConnected)return;const options=[...el.querySelectorAll('button')];const h=options[0]?.offsetHeight||1;const index=Math.max(0,Math.min(options.length-1,Math.round(el.scrollTop/h)));options.forEach((b,i)=>{b.classList.toggle('selected',i===index);b.setAttribute('aria-selected',String(i===index));});if(el.dataset.wheel==='year'){const nextYear=Number(options[index].dataset.value);if(nextYear!==year){year=nextYear;syncWheels('month');}}else{pickMonth=Number(options[index].dataset.value);clampPicker();}},80);},{passive:true});});
  }
  function detail(){
    selected=entries.find(r=>r.id===getRoute().record)||selected;const r=selected;
    const category=r.type==='deposit'?'定期':r.type==='fund'?'基金':'转账给他人';
    const label=r.type==='fund'?'蚂蚁（杭州）基金销售有限公司':r.type==='transfer'?r.party:r.label;
    const info=[['交易卡号','6214********0813'],['交易时间',r.date+' '+r.time+(r.seconds?':'+r.seconds:'')],...(r.type==='transfer'?[['付款银行',r.party==='张建生'?'中国建设银行':'交通银行'],['付款账号',r.party==='张建生'?'6217********8896':'尾号1233'],['转账附言','转账']]:r.type==='fund'?[['交易渠道','<span class="alipay-mark">支</span> 支付宝']]:[]),['银行交易类型',r.type==='deposit'?'享定存开户起息':r.type==='fund'?'网联协议支付':'转账汇款']];
    return `${header('交易详情')}<div class="scroll-area ledger-detail latest-ledger-detail" data-scroll><section class="ledger-detail-card"><div class="ledger-detail-amount"><span><i class="party-symbol ${r.type}">${r.type==='transfer'?'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="4"/><path d="M3 22a9 9 0 0 1 18 0z"/></svg>':r.type==='fund'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h18l-2-5H5zM3 8v4q3 3 6 0 3 3 6 0 3 3 6 0V8M5 14v7h14v-7"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 10h20M15 16h4"/></svg>'}</i>${label}</span><strong>${amount(r)}</strong><small>余额 ¥${money(r.balance)}</small></div><dl class="detail-rows">${info.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section><button class="pension-banner" data-action="ledger-pension"><span>个人养老金</span><b>算出未来资产增幅</b></button><div class="ledger-detail-options"><button data-action="ledger-category"><span>分类</span><span>${ledgerIcon(r.type)} ${category} <i class="option-chevron">›</i></span></button><button data-action="ledger-book"><span>所属账本</span><span>${r.type==='transfer'?'请选择':'理财'} <i class="option-chevron">›</i></span></button><button data-action="ledger-exclude" role="switch" aria-checked="${excluded.has(r.id)}"><span>不计入本月收支</span><i class="ledger-switch ${excluded.has(r.id)?'on':''}"></i></button><label class="ledger-note">备注<textarea data-ledger-note="${r.id}" aria-label="备注" placeholder="记录点什么..." maxlength="100">${escapeText(notes.get(r.id)||'')}</textarea></label></div></div>`;
  }
  document.addEventListener('input',e=>{if(e.target.dataset?.ledgerNote)notes.set(e.target.dataset.ledgerNote,e.target.value);});
  document.addEventListener('change',e=>{if(e.target.dataset?.date==='start')rangeStart=e.target.value;if(e.target.dataset?.date==='end')rangeEnd=e.target.value;});
  function handle(action,b){const v=b.dataset.value;
    if(action==='cash-actions'){showModal(`${[['转账汇款','transfer'],['收支明细','income'],['购买理财','finance'],['购买存款','products'],['转入朝朝宝','finance'],['银行卡管理',null]].map(([label,page])=>`<button class="cash-action" ${page?`data-go="${page}"`:'data-action="income-card"'}>${label}<span>›</span></button>`).join('')}<button class="sheet-cancel" data-action="close">取消</button>`,'cash-sheet');return true;}
    if(action==='income-month'){pickerMode='month';if(month!=='all'){year=Number(month.slice(0,4));pickMonth=Number(month.slice(5));}else{const now=new Date();year=now.getFullYear();pickMonth=now.getMonth()+1;}picker();return true;}
    if(action==='picker-tab'){pickerMode=v;picker();return true;}
    if(action==='wheel-option'){if(b.dataset.wheel==='year')year=Number(v);else pickMonth=Number(v);syncWheels(b.dataset.wheel);return true;}
    if(action==='date-shortcut'){rangeEnd='2026-09-05';rangeStart=v==='上月'?'2026-08-01':v==='近三月'?'2026-06-05':'2025-09-05';if(v==='上月')rangeEnd='2026-08-31';picker();return true;}
    if(action==='confirm-month'){clampPicker();if(pickerMode==='custom'&&(!rangeStart||!rangeEnd||rangeStart>rangeEnd))return true;custom=pickerMode==='custom';month=year+'-'+String(pickMonth).padStart(2,'0');navigate({page:'income'},{replace:true});return true;}
    if(action==='set-income-month'){month=v;custom=false;navigate({page:'income'},{replace:true});return true;}
    if(action==='income-filter'){choices('收支类型',['全部','收入','支出'].map(x=>[x,x]),'set-income-filter',filter);return true;}
    if(action==='set-income-filter'){filter=v;navigate({page:'income'},{replace:true});return true;}
    if(action==='income-item'){selected=entries.find(r=>r.id===v)||entries[0];navigate({page:'incomedetail',record:selected.id});return true;}
    if(action==='ledger-exclude'){excluded.has(selected.id)?excluded.delete(selected.id):excluded.add(selected.id);refresh();return true;}
    if(action==='ledger-list'){month='all';custom=false;filter='全部';refresh();return true;}
    const messages={'ledger-pension':['个人养老金','算出未来资产增幅'],'income-card':['银行卡','储蓄卡 6214********0813'],'ledger-search':['查询收支','请使用月份选择或自定义日期范围查询记录。'],'ledger-book':['账本','暂无账本'],'ledger-category':['分类',selected.type==='deposit'?'定期':selected.type==='fund'?'基金':'转账给他人'],'ledger-sub':['开户子账户','一卡通 0813'],'ledger-help':['交易查询',selected.label],'ledger-voucher':['电子回单','参考素材未包含本笔交易的电子回单。']};
    if(messages[action]){service(...messages[action]);return true;}return false;
  }
  return {render:renderIncome,detail,handle,resetFilters(){month='all';filter='全部';custom=false;},reset(){month='all';filter='全部';custom=false;notes.clear();excluded.clear();entries.forEach(r=>excluded.add(r.id));}};
};
