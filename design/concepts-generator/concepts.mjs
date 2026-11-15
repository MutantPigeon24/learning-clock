import { corners } from './theme-art.mjs';
import { FRAMES, sizes, wordsH, fdFor, clock, scene, deco, lab, digits12, digits24, ampm, speakBtn, nowBtn, iconBtn, themeBtn, lockBtn, calBtn, overlays, toast, logic, icon, SAY } from './parts.mjs';

const R = Math.round;
const abs = (z, inner, extra = '') => `<div style="position:absolute;inset:0;padding:${z.pad}px;box-sizing:border-box;display:flex;${extra}">${inner}</div>`;

// ---------- Concept 1 · Clock Hub ----------
function c1(f, z) {
  const { pad, gap, btn, small, fs, fl, r, ampH, cp, W, H } = z;
  const card = `background:{{ th.card }};color:{{ th.ink }};border-radius:${r}px;box-shadow:0 ${R(4 + 4 * z.S)}px 0 rgba(0,0,0,.14);{{ th.cardFx }}`;
  const words = (w) => `<div style="${card};padding:${cp}px"><p style="margin:0;font-size:${fs}px;line-height:1.3;font-weight:700">${SAY}</p></div>`;
  const digi = (cardW) => {
    const fd = fdFor(z, cardW);
    return `<div style="display:flex;gap:${gap}px">
<div style="${card};flex:1;min-width:0;padding:${cp}px;display:flex;flex-direction:column;gap:8px">${lab('12-hour', fl)}${digits12(fd, z)}</div>
<div style="${card};flex:1;min-width:0;padding:${cp}px;display:flex;flex-direction:column;gap:8px">${lab('24-hour', fl)}${digits24(fd)}</div></div>`;
  };
  const header = `<div style="display:flex;align-items:center;justify-content:flex-end;gap:${gap}px"><div style="display:flex;gap:${R(gap * 0.6)}px">${calBtn(small)}${lockBtn(f, small)}</div></div>`;
  const tools = `<div style="display:flex;gap:${gap}px">${speakBtn(btn, z, { grow: true })}${nowBtn(btn, z)}${themeBtn(f, btn)}</div>`;
  if (z.wide) {
    const cs = H - 2 * pad - ampH - gap;
    const rightW = W - 2 * pad - cs - 2 * gap;
    return abs(z, `<div style="display:flex;flex-direction:column;align-items:center;gap:${gap}px;flex:none">${clock(cs)}${ampm(ampH, cs * 0.5, z)}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;gap:${gap}px">${header}${words(rightW)}${digi((rightW - gap) / 2)}${tools}</div>`, `gap:${2 * gap}px`);
  }
  const inner = W - 2 * pad;
  const fd = fdFor(z, (inner - gap) / 2);
  const rest = 2 * pad + small + ampH + wordsH(z, inner) + (fl * 1.3 + fd + 2 * cp + 8) + btn + 6 * gap;
  const cs = Math.min(inner, H - rest);
  return abs(z, `${header}<div style="display:flex;flex-direction:column;align-items:center;gap:${gap}px">${clock(cs)}${ampm(ampH, cs * 0.5, z)}</div>${words(inner)}${digi((inner - gap) / 2)}${tools}`, `flex-direction:column;justify-content:space-between;gap:${gap}px`);
}

// ---------- Concept 2 · Storybook ----------
function c2(f, z) {
  const { pad, gap, btn, fs, fl, r, ampH, cp, W, H } = z;
  const tag = (label, body, rot) => `<div style="position:relative;transform:rotate(${rot}deg);padding-top:${R(26 * Math.max(z.S, 0.6))}px;flex:none">
<span aria-hidden="true" style="position:absolute;left:50%;top:0;width:3px;height:${R(30 * Math.max(z.S, 0.6))}px;margin-left:-1.5px;background:{{ th.edge }}"></span>
<div style="background:{{ th.card }};color:{{ th.ink }};border-radius:${R(r * 0.8)}px;padding:${cp}px ${R(cp * 1.2)}px;border:4px solid {{ th.rim }};display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:0 8px 0 rgba(0,0,0,.15);{{ th.cardTex }}">
<span aria-hidden="true" style="width:${R(14 * Math.max(z.S, 0.7))}px;height:${R(14 * Math.max(z.S, 0.7))}px;border-radius:50%;background:{{ th.soft }};border:3px solid {{ th.edge }}"></span>${lab(label, fl)}${body}</div></div>`;
  const ribbon = (sp) => `<div style="display:flex;align-items:center;flex:none">
${speakBtn(sp, z, { label: false, extra: `position:relative;z-index:2;border:${R(Math.max(4, 6 * z.S))}px solid {{ th.card }};box-shadow:0 6px 0 rgba(0,0,0,.18)` })}
<div style="flex:1;min-width:0;margin-left:-${R(sp * 0.35)}px;background:{{ th.card }};color:{{ th.ink }};padding:${R(cp * 0.8)}px ${R(cp * 2)}px ${R(cp * 0.8)}px ${R(sp * 0.35 + cp)}px;clip-path:polygon(0 0, 100% 0, calc(100% - ${R(22 * Math.max(z.S, 0.6))}px) 50%, 100% 100%, 0 100%);box-shadow:0 6px 0 rgba(0,0,0,.18);{{ th.cardTex }}">
<p style="margin:0;font-size:${fs}px;line-height:1.3;font-weight:700">${SAY}</p></div></div>`;
  const corners = (mid = '') => `<div style="display:flex;align-items:center;gap:${R(gap * 0.6)}px">${themeBtn(f, btn, { bg: '{{ th.card }}' })}${calBtn(btn)}</div>${mid}${lockBtn(f, R(btn * 0.8))}`;
  const sp = R(btn * 1.25);
  if (z.wide) {
    const ribH = Math.max(sp, wordsH(z, W - 2 * pad - sp, fs, R(cp * 0.8)));
    const cs = H - 2 * pad - ribH - gap - ampH - R(gap * 0.6);
    const colW = (W - 2 * pad - cs - 2 * gap) / 2;
    const fd = fdFor(z, colW - 20, R(cp * 1.2));
    return `<div style="position:absolute;left:${pad}px;right:${pad}px;top:${pad}px;display:flex;justify-content:space-between;align-items:flex-start;z-index:2">${corners()}</div>`
      + abs(z, `<div style="flex:1;min-height:0;display:flex;align-items:center;gap:${gap}px">
<div style="flex:1;min-width:0;display:flex;justify-content:center">${tag('12-hour', digits12(fd, z), -3)}</div>
<div style="display:flex;flex-direction:column;align-items:center;gap:${R(gap * 0.6)}px;flex:none">${clock(cs, { double: true, rimW: 10 })}${ampm(ampH, cs * 0.46, z)}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:${gap}px">${tag('24-hour', digits24(fd), 3)}${nowBtn(btn, z)}</div></div>${ribbon(sp)}`, `flex-direction:column;gap:${gap}px`);
  }
  const inner = W - 2 * pad;
  const fd = fdFor(z, (inner - gap) / 2 - 20, R(cp * 1.2));
  const tagH = R(26 * Math.max(z.S, 0.6)) + 2 * cp + 14 + fl * 1.3 + fd + 24 + 8;
  const ribH = Math.max(sp, wordsH(z, inner - sp, fs, R(cp * 0.8)) + fs * 1.3);
  const cs = Math.min(inner - 20, H - 2 * pad - btn - tagH - ribH - ampH - 5 * gap);
  return abs(z, `<div style="display:flex;justify-content:space-between;align-items:center">${corners(nowBtn(btn, z))}</div>
<div style="display:flex;justify-content:space-around;gap:${gap}px">${tag('12-hour', digits12(fd, z), -3)}${tag('24-hour', digits24(fd), 3)}</div>
<div style="display:flex;flex-direction:column;align-items:center;gap:${R(gap * 0.6)}px">${clock(cs, { double: true, rimW: 10 })}${ampm(ampH, cs * 0.46, z)}</div>${ribbon(sp)}`, `flex-direction:column;justify-content:space-between;gap:${gap}px`);
}

// ---------- Concept 3 · Toy Blocks ----------
function c3(f, z) {
  const { gap, btn, fs, fl, ampH, cp, W, H } = z;
  const pad = R(Math.max(14, 24 * z.S));
  const ew = R(Math.max(6, 10 * z.S));
  const rr = R(Math.max(16, 26 * z.S));
  const blk = (bg, ink) => `background:${bg};color:${ink};border:3px solid {{ th.edge }};border-bottom-width:${ew}px;border-radius:${rr}px;box-sizing:border-box${bg === '{{ th.card }}' ? ';{{ th.cardTex }}' : ''}`;
  const tile = (label, body, extra = '') => `<div style="${blk('{{ th.card }}', '{{ th.ink }}')};padding:${cp}px;display:flex;flex-direction:column;gap:8px;min-width:0;${extra}">${lab(label, fl)}${body}</div>`;
  const words = (extra = '') => `<div style="${blk('{{ th.card }}', '{{ th.ink }}')};padding:${cp}px;display:flex;align-items:center;min-width:0;${extra}"><p style="margin:0;font-size:${fs}px;line-height:1.25;font-weight:800">${SAY}</p></div>`;
  const bb = (o = {}) => ({ ...o, radius: rr, extra: `border:3px solid {{ th.edge }};border-bottom-width:${ew}px;${o.extra || ''}` });
  const tp = R(Math.max(12, 20 * z.S));
  const z2 = { ...z, pad };
  if (z.wide) {
    const tileH = H - 2 * pad;
    const cs = tileH - 2 * tp - ampH - gap - ew - 6;
    const tileW = cs + 2 * tp + 6;
    const railW = btn;
    const midW = W - 2 * pad - tileW - railW - 2 * gap;
    const fd = fdFor(z, midW, cp);
    return abs(z2, `<div style="${blk('{{ th.soft }}', '{{ th.softInk }}')};width:${tileW}px;flex:none;padding:${tp}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${gap}px">${clock(cs, { shadow: false, rimW: 9 })}${ampm(ampH, cs * 0.5, z, { radius: R(rr * 0.7) })}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:${gap}px">${tile('12-hour', digits12(fd, z))}${tile('24-hour', digits24(fd))}${words('flex:1')}</div>
<div style="width:${railW}px;flex:none;display:flex;flex-direction:column;gap:${R(gap * 0.8)}px">${speakBtn(btn, z, { label: false, ...bb({ extra: 'height:auto;flex:1 1 auto;max-height:' + R(btn * 2.2) + 'px' }) })}${nowBtn(btn, z, { label: false, radius: rr })}${themeBtn(f, btn, bb({ bg: '{{ th.soft }}', color: '{{ th.softInk }}' }))}${calBtn(btn, bb({ bg: '{{ th.soft }}', color: '{{ th.softInk }}' }))}<div style="flex:1"></div>${lockBtn(f, btn, bb())}</div>`, `gap:${gap}px`);
  }
  const inner = W - 2 * pad;
  const fd = fdFor(z, (inner - gap) / 2, cp);
  const digH = fl * 1.3 + fd + 2 * cp + 8 + ew;
  const cs = Math.min(inner - 2 * tp - 6, H - 2 * pad - digH - wordsH(z, inner) - ew - (btn + ew) - 3 * gap - (2 * tp + ampH + gap + ew + 6));
  return abs(z2, `<div style="${blk('{{ th.soft }}', '{{ th.softInk }}')};padding:${tp}px;display:flex;flex-direction:column;align-items:center;gap:${gap}px">${clock(cs, { shadow: false, rimW: 9 })}${ampm(ampH, cs * 0.5, z, { radius: R(rr * 0.7) })}</div>
<div style="display:flex;gap:${gap}px">${tile('12-hour', digits12(fd, z), 'flex:1')}${tile('24-hour', digits24(fd), 'flex:1')}</div>${words()}
<div style="display:flex;gap:${R(gap * 0.8)}px">${speakBtn(btn, z, { grow: true, ...bb() })}${nowBtn(btn, z, { radius: rr, label: !z.phone })}${themeBtn(f, btn, bb({ bg: '{{ th.soft }}', color: '{{ th.softInk }}' }))}${calBtn(btn, bb({ bg: '{{ th.soft }}', color: '{{ th.softInk }}' }))}${lockBtn(f, btn, bb())}</div>`, `flex-direction:column;justify-content:space-between;gap:${gap}px`);
}

// ---------- Concept 4 · Colour Links ----------
function c4(f, z) {
  const { pad, gap, btn, small, fs, fl, r, ampH, cp, W, H } = z;
  const card = `background:{{ th.card }};color:{{ th.ink }};border-radius:${R(r * 0.6)}px;box-shadow:0 2px 0 rgba(0,0,0,.08), 0 10px 30px rgba(0,0,0,.12);{{ th.cardFx }}`;
  const hands = { rimW: 6, numSize: 20 };
  const legend = `<div style="display:flex;flex-wrap:wrap;gap:${R(gap * 0.6)}px">
<span style="${card};display:inline-flex;align-items:center;gap:10px;padding:8px 16px;font-size:${fl}px;font-weight:700"><span aria-hidden="true" style="width:${R(28 * Math.max(z.S, .7))}px;height:10px;border-radius:5px;background:{{ lf.h }}"></span><span>Short hand: <b style="color:{{ lk.h }}">hours</b></span></span>
<span style="${card};display:inline-flex;align-items:center;gap:10px;padding:8px 16px;font-size:${fl}px;font-weight:700"><span aria-hidden="true" style="width:${R(44 * Math.max(z.S, .7))}px;height:6px;border-radius:3px;background:{{ lf.m }}"></span><span>Long hand: <b style="color:{{ lk.m }}">minutes</b></span></span></div>`;
  const words = `<div style="${card};padding:${cp}px ${R(cp * 1.2)}px"><p style="margin:0;font-size:${fs}px;line-height:1.3;font-weight:700">${SAY}</p></div>`;
  const digiRow = (fd, dir) => `<div style="${card};padding:${cp}px;display:flex;flex-direction:${dir};gap:${dir === 'row' ? 2 * gap : gap}px">
<div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:0">${lab('12-hour', fl)}${digits12(fd, z)}</div>
<div style="display:flex;flex-direction:column;gap:8px;flex:1;min-width:0">${lab('24-hour', fl)}${digits24(fd)}</div></div>`;
  const tools = `<div style="display:flex;gap:${R(gap * 0.7)}px;flex-wrap:wrap">${speakBtn(btn, z, { grow: true, radius: R(r * 0.6) })}${nowBtn(btn, z, { radius: R(r * 0.6) })}${themeBtn(f, btn, { radius: R(r * 0.6) })}${calBtn(btn, { radius: R(r * 0.6) })}</div>`;
  if (z.wide) {
    const wH = wordsH(z, W - 2 * pad, fs, cp) + 4;
    const cs = H - 2 * pad - wH - gap - ampH - R(gap * 0.6);
    const rightW = W - 2 * pad - cs - 2 * gap;
    const fd = fdFor(z, (rightW - 2 * cp - 2 * gap) / 2 + cp);
    return abs(z, `<div style="flex:1;min-height:0;display:flex;gap:${2 * gap}px">
<div style="display:flex;flex-direction:column;align-items:center;gap:${R(gap * 0.6)}px;flex:none">${clock(cs, hands)}${ampm(ampH, cs * 0.46, z, { radius: R(r * 0.5) })}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;gap:${gap}px">
<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:${gap}px">${legend}${lockBtn(f, small, { radius: R(r * 0.5) })}</div>${digiRow(fd, 'row')}${tools}</div></div>${words}`, `flex-direction:column;gap:${gap}px`);
  }
  const inner = W - 2 * pad;
  const fd = fdFor(z, (inner - 2 * cp - 2 * gap) / 2 + cp);
  const legendH = z.phone ? 2 * (fl * 1.4 + 16) + 8 : fl * 1.4 + 16;
  const cs = Math.min(inner, H - 2 * pad - Math.max(small, legendH) - ampH - wordsH(z, inner) - (fl * 1.3 + fd + 2 * cp + 8) - btn - 6 * gap);
  return abs(z, `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:${gap}px">${legend}${lockBtn(f, small, { radius: R(r * 0.5) })}</div>
<div style="display:flex;flex-direction:column;align-items:center;gap:${R(gap * 0.6)}px">${clock(cs, hands)}${ampm(ampH, cs * 0.46, z, { radius: R(r * 0.5) })}</div>${digiRow(fd, 'row')}${words}${tools}`, `flex-direction:column;justify-content:space-between;gap:${gap}px`);
}

// ---------- Concept 5 · Full Face ----------
function c5(f, z) {
  const { pad, gap, btn, fs, fl, ampH, cp, W, H } = z;
  const pill = `background:{{ th.card }};color:{{ th.ink }};border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.18);{{ th.cardFx }}`;
  const dockS = `background:{{ th.card }};border-radius:999px;padding:${R(gap * 0.5)}px;box-shadow:0 10px 30px rgba(0,0,0,.25);display:flex;gap:${R(gap * 0.6)}px;align-items:center`;
  const p12 = (fd) => `<div style="${pill};padding:${R(cp * 0.6)}px ${R(cp * 1.2)}px;display:flex;align-items:center;gap:${R(gap * 0.7)}px;min-width:0">${lab('12h', fl)}${digits12(fd, z, { row: true })}</div>`;
  const p24 = (fd) => `<div style="${pill};padding:${R(cp * 0.6)}px ${R(cp * 1.2)}px;display:flex;align-items:center;gap:${R(gap * 0.7)}px;min-width:0">${lab('24h', fl)}${digits24(fd)}</div>`;
  const words = `<div style="background:{{ th.card }};color:{{ th.ink }};border-radius:${R(z.r * 1.2)}px;padding:${cp}px ${R(cp * 1.2)}px;box-shadow:0 6px 20px rgba(0,0,0,.18);{{ th.cardFx }}"><p style="margin:0;font-size:${fs}px;line-height:1.3;font-weight:700">${SAY}</p></div>`;
  const db = R(btn * 0.92);
  const dockBtns = `${speakBtn(R(db * 1.15), z, { label: false })}${nowBtn(db, z, { label: false })}${themeBtn(f, db, { bg: '{{ th.soft }}', color: '{{ th.softInk }}' })}${calBtn(db, { bg: '{{ th.soft }}', color: '{{ th.softInk }}' })}`;
  if (z.wide) {
    const dockW = R(db * 1.15) + gap;
    const ampW = ampH;
    const minInfo = R(Math.max(320, W * 0.28));
    const cs = Math.min(H - 2 * pad, W - 2 * pad - dockW - ampW - 3 * gap - minInfo);
    const infoW = W - 2 * pad - dockW - cs - ampW - 3 * gap;
    const fd = Math.floor(Math.min(z.fd, (infoW - 2 * cp - fl * 2.4 - z.chip * 5) / 2.75));
    return abs(z, `<div style="${dockS};flex-direction:column;flex:none;align-self:center">${dockBtns}<span aria-hidden="true" style="height:${R(gap * 1.5)}px"></span>${lockBtn(f, db, { bg: '{{ th.card }}' })}</div>
${clock(cs, { rimW: 7 })}
<div style="align-self:center">${ampm(ampH, cs * 0.34, z, { vertical: true })}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:${gap}px">${p12(fd)}${p24(fd)}${words}</div>`, `gap:${gap}px;align-items:stretch`);
  }
  const inner = W - 2 * pad;
  const fd = Math.floor(Math.min(z.fd * 0.8, ((inner - gap) / 2 - 2 * cp - fl * 2) / 2.75 - (z.phone ? 0 : 6)));
  const pillsH = z.phone ? 2 * (fd + cp * 1.2 + 6) + gap : fd + cp * 1.2 + 10;
  const cs = Math.min(inner, H - 2 * pad - pillsH - ampH - wordsH(z, inner, fs, cp) - (btn + gap) - 4 * gap);
  const fdP = z.phone ? Math.floor(Math.min(z.fd, (inner - 2 * cp - fl * 2.4 - z.chip * 5) / 2.75)) : fd;
  return abs(z, `<div style="display:flex;gap:${gap}px;justify-content:center;flex-wrap:wrap">${p12(fdP)}${p24(fdP)}</div>
<div style="display:flex;flex-direction:column;align-items:center;gap:${R(gap * 0.8)}px">${clock(cs, { rimW: 7 })}${ampm(ampH, cs * 0.42, z)}</div>${words}
<div style="display:flex;justify-content:space-between;align-items:center"><div style="${dockS}">${dockBtns}</div>${lockBtn(f, R(db * 0.8))}</div>`, `flex-direction:column;justify-content:space-between;gap:${gap}px`);
}

// ---------- Concept 6 · Clock Buddy ----------
function buddy(size) {
  const s = R(size);
  return `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 120 120" style="display:block;overflow:visible">
<path d="M28 70 Q60 140 92 70 L100 110 Q60 124 20 110z" style="fill:#D3242C;display:{{ bd.hero }}"></path>
<g style="display:{{ bd.dino }}"><path d="M40 34 L48 16 L56 32 L64 12 L72 32 L80 18 L84 38z" fill="#2E7D32"></path></g>
<circle cx="60" cy="68" r="42" style="fill:{{ th.body }};stroke:{{ th.edge }}" stroke-width="3"></circle>
<ellipse cx="60" cy="86" rx="24" ry="16" fill="#FFFFFF" opacity=".55"></ellipse>
<g style="display:{{ bd.unicorn }}"><path d="M54 30 L60 2 L66 30z" fill="#FFC93C" stroke="#B7791F" stroke-width="2"></path><circle cx="36" cy="38" r="10" fill="#FF8FC8"></circle><circle cx="28" cy="52" r="9" fill="#7FD6E8"></circle><circle cx="27" cy="68" r="8" fill="#FFC93C"></circle></g>
<g style="display:{{ bd.blossom }}"><circle cx="84" cy="34" r="8" fill="#FF8FB8"></circle><circle cx="96" cy="30" r="8" fill="#FF8FB8"></circle><circle cx="96" cy="44" r="8" fill="#FF8FB8"></circle><circle cx="84" cy="46" r="8" fill="#FF8FB8"></circle><circle cx="90" cy="38" r="6" fill="#FFD43B"></circle></g>
<g style="display:{{ bd.sky }}" fill="#FFFFFF" stroke="#9CC7F2" stroke-width="2"><ellipse cx="48" cy="30" rx="16" ry="11"></ellipse><ellipse cx="66" cy="24" rx="17" ry="14"></ellipse><ellipse cx="80" cy="32" rx="12" ry="9"></ellipse></g>
<g style="display:{{ bd.space }}"><circle cx="60" cy="64" r="32" fill="none" stroke="#FFFFFF" stroke-width="5" opacity=".9"></circle><line x1="60" y1="26" x2="60" y2="8" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"></line><circle cx="60" cy="7" r="6" fill="#FFC93C"></circle></g>
<rect x="30" y="50" width="60" height="20" rx="10" fill="#111C3A" style="display:{{ bd.hero }}"></rect>
<circle cx="46" cy="60" r="9" fill="#FFFFFF"></circle><circle cx="74" cy="60" r="9" fill="#FFFFFF"></circle>
<circle cx="48" cy="61" r="4.5" fill="#111C3A"></circle><circle cx="76" cy="61" r="4.5" fill="#111C3A"></circle>
<circle cx="36" cy="76" r="5" fill="#FF7FA8" opacity=".6"></circle><circle cx="84" cy="76" r="5" fill="#FF7FA8" opacity=".6"></circle>
<path d="M50 78 Q60 88 70 78" fill="none" stroke="#111C3A" stroke-width="4" stroke-linecap="round" style="display:{{ bd.mouthSmile }}"></path>
<ellipse cx="60" cy="82" rx="8" ry="7" fill="#111C3A" style="display:{{ bd.mouthOpen }}"></ellipse>
</svg>`;
}
function c6(f, z) {
  const { pad, gap, btn, small, fs, fl, r, ampH, cp, W, H } = z;
  const card = `background:{{ th.card }};color:{{ th.ink }};border-radius:${r}px;box-shadow:0 6px 0 rgba(0,0,0,.12);{{ th.cardFx }}`;
  const digi = (fd) => `<div style="display:flex;gap:${gap}px">
<div style="${card};flex:1;min-width:0;padding:${cp}px;display:flex;flex-direction:column;gap:8px">${lab('12-hour', fl)}${digits12(fd, z)}</div>
<div style="${card};flex:1;min-width:0;padding:${cp}px;display:flex;flex-direction:column;gap:8px">${lab('24-hour', fl)}${digits24(fd)}</div></div>`;
  const tools = `<div style="display:flex;align-items:center;gap:${R(gap * 0.6)}px">${themeBtn(f, small)}${calBtn(small)}${nowBtn(small, z)}<div style="flex:1"></div>${lockBtn(f, small)}</div>`;
  const bs = z.phone ? 104 : 190;
  const zone = `<div style="display:flex;align-items:flex-end;gap:${gap}px;flex:none">
<button type="button" onClick="{{ speak }}" aria-label="Hear the time from your buddy" style="position:relative;flex:none;padding:0;border:none;background:transparent;cursor:pointer">${buddy(bs)}<span style="position:absolute;right:-4px;bottom:-4px;width:${R(bs * 0.34)}px;height:${R(bs * 0.34)}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:{{ th.accent }};color:{{ th.onAccent }};border:4px solid {{ th.card }}"><sc-if value="{{ speaking }}" hint-placeholder-val="{{ false }}">${icon('speaking', bs * 0.2)}</sc-if><sc-if value="{{ notSpeaking }}" hint-placeholder-val="{{ true }}">${icon('speaker', bs * 0.2)}</sc-if></span></button>
<div style="position:relative;flex:1;min-width:0;align-self:center;${card};border-radius:${R(r * 1.3)}px;padding:${cp}px ${R(cp * 1.1)}px">
<span aria-hidden="true" style="position:absolute;left:-${R(14 * Math.max(z.S, .7))}px;bottom:${R(26 * Math.max(z.S, .7))}px;width:0;height:0;border-top:${R(12 * Math.max(z.S, .7))}px solid transparent;border-bottom:${R(12 * Math.max(z.S, .7))}px solid transparent;border-right:${R(16 * Math.max(z.S, .7))}px solid {{ th.card }}"></span>
<p style="margin:0;font-family:Andika, sans-serif;font-size:${fs}px;line-height:1.3;font-weight:700">${SAY}</p></div></div>`;
  if (z.wide) {
    const cs = H - 2 * pad - ampH - gap;
    const rightW = W - 2 * pad - cs - 2 * gap;
    const fd = fdFor(z, (rightW - gap) / 2);
    return abs(z, `<div style="display:flex;flex-direction:column;align-items:center;gap:${gap}px;flex:none">${clock(cs, { rimW: 9 })}${ampm(ampH, cs * 0.5, z)}</div>
<div style="flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;gap:${gap}px">${tools}${digi(fd)}${zone}</div>`, `gap:${2 * gap}px`);
  }
  const inner = W - 2 * pad;
  const fd = fdFor(z, (inner - gap) / 2);
  const zoneH = Math.max(bs, wordsH(z, inner - bs - gap, fs, cp) + fs * 1.3);
  const cs = Math.min(inner, H - 2 * pad - small - (fl * 1.3 + fd + 2 * cp + 8) - ampH - zoneH - 5 * gap);
  return abs(z, `${tools}${digi(fd)}<div style="display:flex;flex-direction:column;align-items:center;gap:${gap}px">${clock(cs, { rimW: 9 })}${ampm(ampH, cs * 0.5, z)}</div>${zone}`, `flex-direction:column;justify-content:space-between;gap:${gap}px`);
}

// Display fonts for the six looks (labels and look names only).
const THEME_FONTS = 'family=Baloo+2:wght@800&family=Grandstander:wght@800&family=Sniglet:wght@800&family=Bangers&family=Chewy&family=Audiowide';

const DECO_SPOTS = [[3, 4, 46, -12], [90, 3, 36, 14], [46, 2, 28, 0], [2, 88, 34, 8], [93, 90, 42, -10]];

export const CONCEPTS = [
  { n: 1, file: 'Concept1.dc.html', title: 'Concept 1 · Clock Hub', font: "'Baloo 2', system-ui, sans-serif", fontUrl: 'family=Baloo+2:wght@500;600;700;800', theme: 'sky', time: 'live', gate: 'math', layout: c1 },
  { n: 2, file: 'Concept2.dc.html', title: 'Concept 2 · Storybook', font: "'Fredoka', system-ui, sans-serif", fontUrl: 'family=Fredoka:wght@500;600;700', theme: 'blossom', time: '18:20 sunset', gate: 'math', layout: c2 },
  { n: 3, file: 'Concept3.dc.html', title: 'Concept 3 · Toy Blocks', font: "'Nunito', system-ui, sans-serif", fontUrl: 'family=Nunito:wght@600;700;800;900', theme: 'hero', time: '09:45 day', gate: 'math', layout: c3 },
  { n: 4, file: 'Concept4.dc.html', title: 'Concept 4 · Colour Links', font: "'Andika', system-ui, sans-serif", fontUrl: 'family=Andika:wght@400;700', theme: 'dino', time: 'live', gate: 'math', layout: c4, ring: true },
  { n: 5, file: 'Concept5.dc.html', title: 'Concept 5 · Full Face', font: "'Quicksand', system-ui, sans-serif", fontUrl: 'family=Quicksand:wght@600;700', theme: 'space', time: '21:45 night', gate: 'math', layout: c5 },
  { n: 6, file: 'Concept6.dc.html', title: 'Concept 6 · Clock Buddy', font: "'Sniglet', system-ui, sans-serif", fontUrl: 'family=Sniglet:wght@400;800&family=Andika:wght@400;700', theme: 'unicorn', time: '05:30 sunrise', gate: 'math', layout: c6 },
];

// Desktop + tablet landscape | tablet portrait + phone landscape | phone portrait.
export const ART_W = 3080, ART_H = 2020;

export function conceptFile(c) {
  const dev = (fr) => {
    const z = sizes(fr.W, fr.H);
    const small = z.phone;
    const desk = fr.id === 'D';
    const screen = `<div style="position:relative;width:${fr.W}px;height:${fr.H}px;overflow:hidden;border-radius:${desk ? '0 0 10px 10px' : (small ? '24px' : '32px')};font-family:${c.font};color:{{ th.ink }}">
${scene(`c${c.n}-${fr.id}`)}${corners(z)}${deco(z, DECO_SPOTS)}${c.layout(fr.id, z)}${overlays(fr.id, z, c.gate)}${toast(z)}
</div>`;
    const shell = desk
      ? `<div style="width:${fr.W + 16}px;box-sizing:border-box;padding:0 8px 8px;background:#2B2D33;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.18)">
<div aria-hidden="true" style="height:48px;display:flex;align-items:center;gap:10px;padding:0 10px"><span style="width:14px;height:14px;border-radius:50%;background:#FF5F57"></span><span style="width:14px;height:14px;border-radius:50%;background:#FEBC2E"></span><span style="width:14px;height:14px;border-radius:50%;background:#28C840"></span><span style="margin-left:18px;padding:6px 18px;border-radius:999px;background:#3A3D45;color:#C9CCD3;font-family:system-ui, sans-serif;font-size:16px;font-weight:600">Learning Clock · installed app</span></div>
${screen}</div>`
      : `<div style="width:${fr.W + 32}px;height:${fr.H + 32}px;box-sizing:border-box;padding:16px;background:#17181C;border-radius:${small ? 38 : 48}px">${screen}</div>`;
    return `<div style="display:flex;flex-direction:column;gap:14px;flex:none">
<p style="margin:0;font-family:system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;font-size:22px;font-weight:600;color:#3A3F4B">${fr.label}</p>
${shell}</div>`;
  };
  const [L, P, A, B, D] = FRAMES;
  const props = {
    theme: { editor: 'enum', options: ['sky', 'blossom', 'unicorn', 'hero', 'dino', 'space'], default: c.theme },
    hands: { editor: 'enum', options: ['theme', 'red-blue', 'orange-purple', 'pink-teal', 'purple-orange'], default: 'theme' },
    helpers: { editor: 'enum', options: ['on', 'off'], default: 'on' },
    time: { editor: 'enum', options: ['live', '05:30 sunrise', '09:45 day', '18:20 sunset', '21:45 night'], default: c.time },
    $preview: { width: ART_W, height: ART_H },
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${c.title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${(c.fontUrl + '&' + THEME_FONTS).replace(/&/g, '&amp;')}&amp;display=swap">
<style>
body{margin:0}
button:focus-visible{outline:4px solid #FFD43B;outline-offset:2px;box-shadow:0 0 0 2px #0B1035}
a{color:#1A64C8}a:hover{color:#0F4A99}
</style>
</helmet>
<div style="width:${ART_W}px;height:${ART_H}px;box-sizing:border-box;padding:48px;display:flex;gap:64px;align-items:flex-start;background:#ECEEF2">
<div style="display:flex;flex-direction:column;gap:40px;flex:none">${dev(D)}${dev(L)}</div>
<div style="display:flex;flex-direction:column;gap:40px;flex:none">${dev(P)}${dev(A)}</div>
${dev(B)}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='${JSON.stringify(props)}'>
${logic({ gate: c.gate, theme: c.theme, time: c.time })}
</script>
</body>
</html>
`;
}
