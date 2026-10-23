const {readFileSync}=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=readFileSync('dist/index.html','utf8'),file=html.match(/src="(map-gestures-[^"]+)"/)[1];
let view=[0,0,2122,3000],events=[];const handlers={};
const svg={getAttribute:()=>view.join(' '),setAttribute:(_,value)=>view=value.split(' ').map(Number),addEventListener:(type,fn)=>handlers[type]=fn,dispatchEvent:e=>events.push(e),getScreenCTM:()=>({inverse:()=>({view:[...view]})}),createSVGPoint:()=>({x:0,y:0,matrixTransform(m){return {x:m.view[0]+this.x*m.view[2]/400,y:m.view[1]+this.y*m.view[3]/600}}})};
vm.runInNewContext(readFileSync('dist/'+file,'utf8'),{document:{querySelector:()=>svg},CustomEvent:function(type,opts){this.type=type;this.detail=opts.detail}});
const captured=new Set(),target={setPointerCapture:id=>captured.add(id),hasPointerCapture:id=>captured.has(id),releasePointerCapture:id=>captured.delete(id)};
function pointer(type,id,x,y){const e={type,pointerId:id,clientX:x,clientY:y,pointerType:'touch',target,preventDefault(){}};handlers[type](e)}
function click(detail=1){const e={detail,preventDefault(){this.blocked=true},stopImmediatePropagation(){this.stopped=true}};handlers.click(e);return !!e.blocked}
function near(a,b){assert(Math.abs(a-b)<.00001,`${a} ≠ ${b}`)}
// Normal taps continue to select a stand.
pointer('pointerdown',1,200,300);pointer('pointerup',1,200,300);assert(!click());
// Spread fingers around an off-centre point: double zoom, preserve that point.
pointer('pointerdown',1,50,200);pointer('pointerdown',2,150,200);pointer('pointermove',2,250,200);
near(view[2],1061);const anchorAfter=view[0]+150*view[2]/400;near(anchorAfter,100*2122/400);
pointer('pointerup',2,250,200);const before=[...view];pointer('pointermove',1,70,200);near(view[0],Math.max(0,before[0]-20*before[2]/400));pointer('pointerup',1,70,200);assert(click());assert(!click(0));assert.equal(captured.size,0);
// The next tap is not blocked by the preceding drag.
pointer('pointerdown',3,120,230);pointer('pointerup',3,120,230);assert(!click());
// Pinch in, limits, cancellation, and boundary clamping.
pointer('pointerdown',4,100,300);pointer('pointerdown',5,200,300);pointer('pointermove',5,102,300);near(view[2],2122);near(view[0],0);near(view[1],0);
pointer('pointermove',5,10000,300);near(view[2],2122/8);assert(view[0]>=0&&view[0]+view[2]<=2122);assert(view[1]>=0&&view[1]+view[3]<=3000);
pointer('pointercancel',4,100,300);pointer('pointercancel',5,10000,300);assert.equal(captured.size,0);assert(click());
assert(events.some(e=>e.type==='mapnavigate'&&e.detail.zoom===8));
console.log('OK: pinch anchor, zoom in/out, pan, 2→1 fingers, bounds, cancellation, taps, suppressed drag clicks and keyboard selection.');
