// Keep all navigation in the SVG viewBox so touch and the existing controls agree.
(function () {
  const svg = document.querySelector('#map');
  const points = new Map();
  const captures = new Map();
  let blockClick = false;
  let origin = null;
  const bounds = { width: 2122, height: 3000, maxZoom: 8 };
  const read = () => svg.getAttribute('viewBox').trim().split(/[ ,]+/).map(Number);
  const distance = p => Math.hypot(p[1].x - p[0].x, p[1].y - p[0].y);
  const middle = p => ({ x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 });
  function local(p) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = svg.createSVGPoint();
    point.x = p.x; point.y = p.y;
    return point.matrixTransform(matrix.inverse());
  }
  function write(x, y, w, h) {
    x = Math.max(0, Math.min(bounds.width - w, x));
    y = Math.max(0, Math.min(bounds.height - h, y));
    svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    // The search/zoom controls use this shared scale; they retain the panned center.
    svg.dispatchEvent(new CustomEvent('mapnavigate', { detail: { zoom: bounds.width / w } }));
  }
  svg.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!points.size) { blockClick = false; origin = { x: e.clientX, y: e.clientY }; }
    points.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (points.size > 1) blockClick = true;
    const target = e.target;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
      captures.set(e.pointerId, target);
    }
  });
  svg.addEventListener('pointermove', e => {
    if (!points.has(e.pointerId)) return;
    const before = [...points.values()].slice(0, 2);
    const previous = points.get(e.pointerId);
    const next = { x: e.clientX, y: e.clientY };
    points.set(e.pointerId, next);
    if (origin && Math.hypot(next.x - origin.x, next.y - origin.y) > 6) blockClick = true;
    if (!blockClick) return;
    e.preventDefault();
    const [x, y, w, h] = read();
    if (points.size >= 2) {
      const after = [...points.values()].slice(0, 2);
      const oldDistance = distance(before), newDistance = distance(after);
      if (oldDistance < 2 || newDistance < 2) return;
      const anchor = local(middle(before)), target = local(middle(after));
      if (!anchor || !target) return;
      const width = Math.max(bounds.width / bounds.maxZoom, Math.min(bounds.width, w * oldDistance / newDistance));
      const ratio = width / w;
      write(anchor.x - (target.x - x) * ratio, anchor.y - (target.y - y) * ratio, width, h * ratio);
    } else {
      const a = local(previous), b = local(next);
      if (a && b) write(x + a.x - b.x, y + a.y - b.y, w, h);
    }
  }, { passive: false });
  function end(e) {
    points.delete(e.pointerId);
    const target = captures.get(e.pointerId);
    captures.delete(e.pointerId);
    if (target?.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId);
    if (e.type === 'pointercancel') blockClick = true;
    if (!points.size) origin = null;
  }
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
  svg.addEventListener('lostpointercapture', end);
  svg.addEventListener('click', e => {
    if (blockClick && e.detail !== 0) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
})();
