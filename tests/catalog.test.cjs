const {readFileSync,readdirSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=readFileSync('dist/index.html','utf8');
const source=JSON.parse(readFileSync('data/catalog.json','utf8'));
class Element {
 constructor(){this.style={};this.attrs={};this.children=[];this.value='';this.innerHTML='';this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x),contains:x=>this.classes.has(x)};}
 setAttribute(k,v){this.attrs[k]=String(v)}
 getAttribute(k){return this.attrs[k]||"0 0 2122 3000"}
 addEventListener(){}
 appendChild(c){if(c.parent)c.parent.children=c.parent.children.filter(x=>x!==c);this.children.push(c);c.parent=this;return c}
 replaceChildren(){this.children=[];this.innerHTML=''}
 querySelectorAll(){return []}
 querySelector(s){return this.children.find(c=>c.tagName===s.toUpperCase())}
 focus(){}
}
const elements={};const document={querySelector:s=>elements[s]??=new Element(),createElementNS:(_,tag)=>{const el=new Element();el.tagName=tag.toUpperCase();return el},createElement:tag=>{const el=new Element();el.tagName=tag.toUpperCase();return el},addEventListener(){}};
const ctx=vm.createContext({document});
for(const file of [...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]))vm.runInContext(readFileSync('dist/'+file,'utf8'),ctx);
const read=code=>vm.runInContext(code,ctx);
assert.equal(read('data.length'),483);
assert.equal(source.records.length,483);
assert.equal(read('data.filter(d=>d.regions.length).length'),466);
assert.equal(read('data.filter(d=>!d.regions.length).length'),17);
assert.equal(read('groups.size'),299);
assert.equal(new Set(source.records.map(d=>d.id)).size,483);
for(const d of source.records){
 assert.equal(read(`data[${d.id}].name`),d.name);
 assert.equal(read(`data[${d.id}].code`),d.code);
 assert(read(`findMatches(${JSON.stringify(d.name)}).includes(${d.id})`),d.name);
 const ascii=d.name.toLocaleLowerCase('pl-PL').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
 assert(read(`findMatches(${JSON.stringify(ascii)}).includes(${d.id})`),ascii);
 read(`select(${d.id})`);
 const highlighted=read('[...groups.values()].filter(g=>g.classList.contains("selected")).length');
 assert.equal(highlighted,d.regions.length?1:0,d.name);
 if(!d.regions.length)assert(/uczestnik online|nie podał/.test(elements['#info'].innerHTML));
 for(const r of d.regions){assert(r.x>=0&&r.y>=0&&r.x+r.w<=2123&&r.y+r.h<=3002,d.name);assert(r.w>0&&r.h>0);}
}
for(const spelling of ['ąćęłńóśźż','ĄĆĘŁŃÓŚŹŻ','ĄĆĘŁŃÓŚŹŻ'.normalize('NFD')])assert.equal(read(`norm(${JSON.stringify(spelling)})`),'acelnoszz');
read('renderResults("")');assert.equal(read('results.length'),483);assert.equal(elements['#suggest'].children.filter(c=>c.tagName==='BUTTON').length,483);
for(const spelling of ['Prószyński','proszynski','PRÓSZYŃSKI','poznańskie','poznanskie'])assert(read(`findMatches(${JSON.stringify(spelling)}).length>0`));
for(const code of new Set(source.records.map(d=>d.code).filter(Boolean)))assert(read(`findMatches(${JSON.stringify(code)}).some(i=>data[i].code===${JSON.stringify(code)})`));
read('clear()');assert.equal(elements['#search'].value,'');assert.equal(read('selected'),-1);
assert(!html.includes('30 wydawnictw'));assert(html.includes('charset="utf-8"'));assert(html.includes('lang="pl"'));
console.log('OK: 483 źródłowe wpisy; wyszukiwanie każdego z polskimi znakami i bez; 466 lokalizacji, 17 bez lokalizacji; 299 obszarów stoisk/sal; pełna lista; reset.');
