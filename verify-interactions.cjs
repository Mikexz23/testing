// Deterministic interaction checks without dependencies or a browser.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'script.js'),'utf8');
function boot(hash=''){
  const handlers={},phoneHandlers={},timers=new Map();let time=0,id=0;
  const noop=()=>{};
  class Element{
    constructor(){this.dataset={};this.classList={add:noop,remove:noop,toggle:noop};this.attributes={};this.scrollTop=0;this.isConnected=true;this.nodes=[];this._html='';}
    set innerHTML(value){this.nodes.forEach(n=>n.isConnected=false);this.nodes=[];this._html=value;this.scroll=new ElementStub();}
    get innerHTML(){return this._html;}
    setAttribute(k,v){this.attributes[k]=v;}
    querySelector(selector){if(selector==='[data-scroll]')return this._html.includes('data-scroll')?this.scroll:null;if(selector==='h1')return {focus:noop};if(selector==='span')return this.span||(this.span={textContent:''});if(selector==='button')return {focus:noop};return null;}
    querySelectorAll(){return [];}
    focus(){} addEventListener(k,v){phoneHandlers[k]=v;} getBoundingClientRect(){return {left:0};}
  }
  function ElementStub(){this.scrollTop=0;}
  const elements=Object.fromEntries(['app','overlay','phone','caption'].map(k=>[k,new Element()]));
  const location={hash};let index=-1;const historyEntries=[];
  const history={
    replaceState(s,_,url){if(index<0)index=0;historyEntries[index]={state:structuredClone(s),url};location.hash=url;},
    pushState(s,_,url){historyEntries.splice(index+1);historyEntries.push({state:structuredClone(s),url});index++;location.hash=url;},
    back(){if(index>0){index--;location.hash=historyEntries[index].url;handlers.popstate({state:structuredClone(historyEntries[index].state)});}},
    forward(){if(index<historyEntries.length-1){index++;location.hash=historyEntries[index].url;handlers.popstate({state:structuredClone(historyEntries[index].state)});}}
  };
  const document={getElementById:id=>elements[id],addEventListener:(k,v)=>handlers[k]=v,activeElement:null};
  vm.runInNewContext(source,{document,window:{addEventListener:(k,v)=>handlers[k]=v},history,location,URLSearchParams,console,setTimeout:(f,delay)=>{timers.set(++id,{at:time+delay,f});return id;},clearTimeout:id=>timers.delete(id)});
  function tick(ms){const end=time+ms;while(true){const next=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;timers.delete(next[0]);time=next[1].at;next[1].f();}time=end;}
  function click(dataset,elementId){const owner=elements.overlay.innerHTML?elements.overlay:elements.app;const b=new Element();b.dataset=dataset;b.id=elementId;b.closest=()=>b;owner.nodes.push(b);document.activeElement=b;handlers.click({target:b});return b;}
  return {elements,tick,click,history,handlers,phoneHandlers,location,get page(){return elements.phone.dataset.page;},get html(){return elements.app.innerHTML;},get busy(){return elements.app.attributes['aria-busy']==='true';}};
}
const a=boot();
assert.equal(a.page,'splash');a.tick(1600);assert.equal(a.page,'home');
a.click({action:'account'});assert.match(a.elements.overlay.innerHTML,/请登录验证/);assert.equal(a.elements.app.inert,true);
a.click({action:'authenticate'});a.tick(1450);assert.equal(a.page,'overview');assert.match(a.html,/web-progress/);
a.tick(850);assert.match(a.html,/overview-placeholder/);a.tick(1100);assert.equal(a.busy,false);assert.match(a.html,/15,502,376.38/);
a.elements.app.scroll.scrollTop=370;a.click({go:'deposits'});assert.match(a.html,/web-progress/);a.tick(1500);assert.match(a.html,/skeleton-list/);a.tick(1100);assert.match(a.html,/15,502,016.86/);
for(const [product,amount] of [['m','6,613,562.25'],['2','6,524,980.43'],['5','2,363,474.18']]){
 a.elements.app.scroll.scrollTop=180;a.click({go:'holding',product});a.tick(950);assert.match(a.html,new RegExp(amount.replaceAll('.','\\.')));assert.match(a.html,/持仓详情/);
 a.click({action:'back'});a.tick(660);assert.equal(a.page,'deposits');assert.equal(a.elements.app.scroll.scrollTop,180);
}
a.click({action:'records'});assert.match(a.html,/加载中/);a.tick(1100);assert.equal((a.html.match(/class="transaction-row"/g)||[]).length,6);
for(const status of ['提前支取本息','已起息']){
 a.click({go:'transaction',product:'m',status});assert.match(a.html,/web-progress/);a.tick(950);assert.match(a.html,new RegExp('<dd>'+status+'</dd>'));
 a.click({action:'back'});assert.match(a.html,/加载中/);a.tick(650);assert.equal(a.page,'records');
}
a.click({action:'filter-status'});a.click({action:'select-status',value:'已起息'});a.tick(700);assert.equal((a.html.match(/class="transaction-row"/g)||[]).length,3);
a.click({action:'filter-product'});a.click({action:'select-product',value:'2'});a.tick(700);assert.equal((a.html.match(/class="transaction-row"/g)||[]).length,1);assert.match(a.html,/6,524,980.43/);
a.click({action:'back'});a.tick(660);assert.equal(a.page,'deposits');a.click({action:'back'});a.tick(660);assert.equal(a.page,'overview');assert.equal(a.elements.app.scroll.scrollTop,370);
a.click({go:'deposits'});a.tick(100);a.click({action:'back'});a.tick(5000);assert.equal(a.page,'overview');assert.equal(a.busy,false);
a.click({},'restart');a.tick(1600);assert.equal(a.page,'home');a.click({action:'account'});a.click({action:'authenticate'});a.tick(100);a.click({action:'close'});a.tick(3000);assert.equal(a.page,'home');assert.equal(a.elements.overlay.innerHTML,'');
const b=boot('#holding?product=5');assert.equal(b.page,'holding');assert.match(b.html,/2,363,474.18/);b.click({action:'back'});b.tick(660);assert.equal(b.page,'deposits');
const c=boot('#transaction?product=m&status='+encodeURIComponent('提前支取本息'));assert.match(c.html,/<dd>提前支取本息<\/dd>/);
const d=boot('#__proto__');assert.equal(d.page,'splash');
const e=boot('#deposits');e.click({action:'collapse',group:'holdings'});assert.doesNotMatch(e.html,/class="holding-row"/);e.click({action:'collapse',group:'holdings'});assert.equal((e.html.match(/class="holding-row"/g)||[]).length,3);
e.click({action:'cards'});e.click({action:'select-card',value:'一卡通 (0813)'});e.tick(750);assert.match(e.html,/一卡通 \(0813\)/);
e.click({go:'holding',product:'2'});e.tick(950);e.history.back();e.tick(660);e.history.forward();e.tick(660);assert.equal(e.page,'holding');assert.match(e.html,/6,524,980.43/);
e.phoneHandlers.touchstart({touches:[{clientX:5,clientY:100}]});e.phoneHandlers.touchend({changedTouches:[{clientX:110,clientY:103}]});e.tick(660);assert.equal(e.page,'deposits');
e.click({action:'menu'});e.click({action:'restart'});assert.equal(e.page,'splash');e.tick(1600);assert.equal(e.page,'home');
console.log('PASS: startup, login, staged loading, original balances, all three holdings, six transactions, both statuses, filters, scroll restoration, mid-load back, cancellation, restart, deep links.');
