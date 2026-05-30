import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// ─── Muscle labels ────────────────────────────────────────────────────────────
const LABELS = {
  peitoral:'Peitoral', peitoral_sup:'Peitoral Sup.', deltoides:'Deltoides',
  deltoides_post:'Deltoides Post.', biceps:'Bíceps', triceps:'Tríceps',
  antebraco:'Antebraço', abdomen:'Abdômen', obliquo:'Oblíquos',
  dorsais:'Dorsais', trapezio:'Trapézio', lombar:'Lombar',
  gluteos:'Glúteos', quadriceps:'Quadríceps', isquiotibiais:'Isquiotibiais',
  tibial:'Tibial', panturrilha:'Panturrilha',
};

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d0d1a;overflow:hidden;font-family:sans-serif}
#wrap{display:flex;flex-direction:column;height:100vh;align-items:center}
#titleBar{color:#fff;font-size:14px;font-weight:700;text-align:center;padding:10px 16px 2px;min-height:32px;text-shadow:0 1px 6px #000;letter-spacing:.3px}
#toggleRow{display:flex;background:#181c3a;border-radius:30px;overflow:hidden;border:1px solid #2e3470;margin:4px 0}
.tog{padding:7px 26px;color:#666;font-size:12px;font-weight:700;background:transparent;border:none;cursor:pointer;transition:background .2s,color .2s}
.tog.on{background:#e94560;color:#fff}
#bodyWrap{flex:1;display:flex;align-items:center;justify-content:center;width:100%;overflow:hidden;padding:0 8px}
svg.v{width:auto;height:100%;max-height:78vh}
.hidden{display:none}
#tags{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;padding:6px 12px 10px;min-height:36px}
.tag{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;border:1px solid}

/* Muscle paths — always visible as subtle anatomy, color on active */
.m{
  fill:rgba(38,48,105,0.45);
  stroke:rgba(60,75,160,0.55);
  stroke-width:0.8;
  transition:fill .3s,stroke .3s,opacity .3s,filter .3s;
}
.m.prim{fill:rgba(233,69,96,0.82);stroke:#ff5070;stroke-width:1.2;filter:drop-shadow(0 0 4px #e94560)}
.m.sec{fill:rgba(245,166,35,0.78);stroke:#ffbe40;stroke-width:1.0;filter:drop-shadow(0 0 3px #f5a623)}
</style>
</head>
<body>
<div id="wrap">
  <div id="titleBar"></div>
  <div id="toggleRow">
    <button class="tog on" id="btnF" onclick="setView('f')">Frente</button>
    <button class="tog"    id="btnB" onclick="setView('b')">Costas</button>
  </div>
  <div id="bodyWrap">

<!-- ════════════════════════════════════════════════════════ FRONT VIEW -->
<svg id="svgF" class="v" viewBox="0 0 200 460" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="skinF" cx="38%" cy="28%" r="72%">
    <stop offset="0%" stop-color="#2c3272"/><stop offset="55%" stop-color="#1c2158"/><stop offset="100%" stop-color="#0e1030"/>
  </radialGradient>
  <radialGradient id="jointF" cx="50%" cy="50%" r="55%">
    <stop offset="0%" stop-color="#252868"/><stop offset="100%" stop-color="#161840"/>
  </radialGradient>
  <radialGradient id="faceF" cx="42%" cy="35%" r="68%">
    <stop offset="0%" stop-color="#32387c"/><stop offset="100%" stop-color="#1c2158"/>
  </radialGradient>
  <linearGradient id="limbF" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#141640"/><stop offset="40%" stop-color="#1c2158"/><stop offset="100%" stop-color="#141640"/>
  </linearGradient>
</defs>

<!-- ── BODY STRUCTURE ─────────────────────────────────────── -->
<!-- Head -->
<ellipse cx="100" cy="36" rx="26" ry="31" fill="url(#faceF)" stroke="#32387c" stroke-width="1"/>
<ellipse cx="100" cy="12"  rx="24" ry="15" fill="#181b42"/><!-- hair -->
<!-- Eyes / face details -->
<ellipse cx="91" cy="38" rx="3.5" ry="4"  fill="#1a1d48" opacity=".9"/>
<ellipse cx="109" cy="38" rx="3.5" ry="4" fill="#1a1d48" opacity=".9"/>
<path d="M86,35 Q91,32 96,35" fill="none" stroke="#32387c" stroke-width=".9"/>
<path d="M104,35 Q109,32 114,35" fill="none" stroke="#32387c" stroke-width=".9"/>
<path d="M94,52 Q100,57 106,52" fill="none" stroke="#262a62" stroke-width="1.4" stroke-linecap="round"/>
<path d="M97,45 Q100,48 103,45" fill="none" stroke="#262a62" stroke-width=".8"/>

<!-- Neck -->
<path d="M91,65 L89,86 L111,86 L109,65 Q100,70 91,65Z" fill="url(#skinF)" stroke="#2e3470" stroke-width=".7"/>
<!-- Neck muscles (SCM) -->
<path d="M93,67 L90,86" fill="none" stroke="#2a2e6a" stroke-width=".8" opacity=".6"/>
<path d="M107,67 L110,86" fill="none" stroke="#2a2e6a" stroke-width=".8" opacity=".6"/>

<!-- Main torso (chest-to-hip block) -->
<path d="M88,86 C68,90 46,102 36,118 C22,132 18,152 18,175 L18,188 C18,204 24,216 34,224 L48,234 L62,238 L138,238 L152,234 L166,224 C176,216 182,204 182,188 L182,175 C182,152 178,132 164,118 C154,102 132,90 112,86 Z"
  fill="url(#skinF)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Left upper arm -->
<path d="M36,118 C24,132 16,152 14,178 L14,226 C14,234 22,240 32,240 L46,240 C54,236 58,228 56,218 L56,178 C54,152 46,132 40,118 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<!-- Left elbow -->
<ellipse cx="35" cy="240" rx="14" ry="9" fill="url(#jointF)" stroke="#222658" stroke-width=".7"/>
<!-- Left forearm -->
<path d="M16,238 L12,318 C12,328 20,334 32,332 L44,330 C52,326 56,318 54,308 L54,238 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<!-- Left hand -->
<path d="M12,328 C10,344 12,358 20,362 L42,364 C50,362 56,350 54,334 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Right upper arm -->
<path d="M164,118 C176,132 184,152 186,178 L186,226 C186,234 178,240 168,240 L154,240 C146,236 142,228 144,218 L144,178 C146,152 154,132 160,118 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="165" cy="240" rx="14" ry="9" fill="url(#jointF)" stroke="#222658" stroke-width=".7"/>
<path d="M184,238 L188,318 C188,328 180,334 168,332 L156,330 C148,326 144,318 146,308 L146,238 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M188,328 C190,344 188,358 180,362 L158,364 C150,362 144,350 146,334 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Left leg upper -->
<path d="M48,240 L40,258 L32,336 C32,346 42,352 56,350 L66,348 C74,344 78,334 74,322 L66,258 L62,240 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="55" cy="352" rx="16" ry="9" fill="url(#jointF)" stroke="#222658" stroke-width=".7"/>
<!-- Left leg lower -->
<path d="M32,354 L28,432 C28,442 38,448 52,446 L62,444 C70,440 72,432 70,420 L68,354 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<!-- Left foot -->
<path d="M26,440 C22,454 28,460 44,460 L62,460 C70,458 72,450 68,440 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Right leg upper -->
<path d="M152,240 L160,258 L168,336 C168,346 158,352 144,350 L134,348 C126,344 122,334 126,322 L134,258 L138,240 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="145" cy="352" rx="16" ry="9" fill="url(#jointF)" stroke="#222658" stroke-width=".7"/>
<path d="M168,354 L172,432 C172,442 162,448 148,446 L138,444 C130,440 128,432 130,420 L132,354 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M174,440 C178,454 172,460 156,460 L138,460 C130,458 128,450 132,440 Z"
  fill="url(#limbF)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Body definition lines -->
<path d="M100,90 L100,238" fill="none" stroke="#32387c" stroke-width=".7" opacity=".5"/>
<path d="M80,140 L78,238" fill="none" stroke="#32387c" stroke-width=".6" opacity=".4"/>
<path d="M120,140 L122,238" fill="none" stroke="#32387c" stroke-width=".6" opacity=".4"/>
<path d="M62,238 Q100,234 138,238" fill="none" stroke="#32387c" stroke-width=".8" opacity=".5"/>
<path d="M18,188 Q100,184 182,188" fill="none" stroke="#32387c" stroke-width=".6" opacity=".35"/>
<path d="M50,258 L48,348" fill="none" stroke="#32387c" stroke-width=".6" opacity=".35"/>
<path d="M150,258 L152,348" fill="none" stroke="#32387c" stroke-width=".6" opacity=".35"/>
<path d="M44,258 L42,348" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>
<path d="M22,155 L20,228" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>
<path d="M178,155 L180,228" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>

<!-- ── MUSCLE REGIONS (front) ─────────────────────────────── -->
<!-- TRAPÉZIO front -->
<path class="m" data-id="trapezio"
  d="M90,86 Q100,82 110,86 L118,98 Q100,95 82,98 Z"/>

<!-- DELTOIDES left -->
<path class="m" data-id="deltoides"
  d="M36,118 C26,130 20,146 22,162 C26,174 42,178 54,168 C64,154 66,136 58,120 C52,110 42,112 36,118 Z"/>
<!-- DELTOIDES right -->
<path class="m" data-id="deltoides"
  d="M164,118 C174,130 180,146 178,162 C174,174 158,178 146,168 C136,154 134,136 142,120 C148,110 158,112 164,118 Z"/>

<!-- PEITORAL left -->
<path class="m" data-id="peitoral"
  d="M72,102 Q88,92 100,98 C100,142 84,148 66,140 C60,128 62,112 72,102 Z"/>
<!-- PEITORAL right -->
<path class="m" data-id="peitoral"
  d="M128,102 Q112,92 100,98 C100,142 116,148 134,140 C140,128 138,112 128,102 Z"/>

<!-- PEITORAL SUP left -->
<path class="m" data-id="peitoral_sup"
  d="M72,102 Q88,92 100,97 Q90,106 74,104 Z"/>
<!-- PEITORAL SUP right -->
<path class="m" data-id="peitoral_sup"
  d="M128,102 Q112,92 100,97 Q110,106 126,104 Z"/>

<!-- BÍCEPS left -->
<path class="m" data-id="biceps"
  d="M20,164 C12,180 12,208 16,222 C22,234 38,236 48,226 C56,212 56,182 50,166 C44,154 28,154 20,164 Z"/>
<!-- BÍCEPS right -->
<path class="m" data-id="biceps"
  d="M180,164 C188,180 188,208 184,222 C178,234 162,236 152,226 C144,212 144,182 150,166 C156,154 172,154 180,164 Z"/>

<!-- TRÍCEPS front strip left -->
<path class="m" data-id="triceps"
  d="M22,164 C16,178 14,205 16,222 C12,222 10,205 12,178 Z"/>
<!-- TRÍCEPS front strip right -->
<path class="m" data-id="triceps"
  d="M178,164 C184,178 186,205 184,222 C188,222 190,205 188,178 Z"/>

<!-- ANTEBRAÇO left -->
<path class="m" data-id="antebraco"
  d="M14,240 L10,318 C10,328 18,334 30,332 L44,330 C52,326 56,316 54,306 L54,240 Z"/>
<!-- ANTEBRAÇO right -->
<path class="m" data-id="antebraco"
  d="M186,240 L190,318 C190,328 182,334 170,332 L156,330 C148,326 144,316 146,306 L146,240 Z"/>

<!-- ABDÔMEN — 6 sections -->
<path class="m" data-id="abdomen" d="M80,142 Q96,138 100,142 L100,162 Q96,159 80,162 Z"/>
<path class="m" data-id="abdomen" d="M120,142 Q104,138 100,142 L100,162 Q104,159 120,162 Z"/>
<path class="m" data-id="abdomen" d="M78,165 Q96,161 100,165 L100,185 Q96,182 78,185 Z"/>
<path class="m" data-id="abdomen" d="M122,165 Q104,161 100,165 L100,185 Q104,182 122,185 Z"/>
<path class="m" data-id="abdomen" d="M76,188 Q96,184 100,188 L100,208 Q96,205 76,208 Z"/>
<path class="m" data-id="abdomen" d="M124,188 Q104,184 100,188 L100,208 Q104,205 124,208 Z"/>

<!-- OBLÍQUOS left -->
<path class="m" data-id="obliquo"
  d="M62,140 C52,165 48,195 50,220 C40,220 38,195 44,165 Z"/>
<!-- OBLÍQUOS right -->
<path class="m" data-id="obliquo"
  d="M138,140 C148,165 152,195 150,220 C160,220 162,195 156,165 Z"/>

<!-- QUADRÍCEPS left (main + teardrop) -->
<path class="m" data-id="quadriceps"
  d="M42,252 C34,275 28,308 30,338 C34,350 50,356 66,348 C76,336 76,310 70,284 C64,264 54,248 46,246 Z"/>
<path class="m" data-id="quadriceps"
  d="M34,330 C28,342 34,354 46,356 C56,356 64,348 62,338 C58,328 44,326 34,330 Z"/>
<!-- QUADRÍCEPS right -->
<path class="m" data-id="quadriceps"
  d="M158,252 C166,275 172,308 170,338 C166,350 150,356 134,348 C124,336 124,310 130,284 C136,264 146,248 154,246 Z"/>
<path class="m" data-id="quadriceps"
  d="M166,330 C172,342 166,354 154,356 C144,356 136,348 138,338 C142,328 156,326 166,330 Z"/>

<!-- TIBIAL ANTERIOR left -->
<path class="m" data-id="tibial"
  d="M34,356 C28,382 28,422 32,438 C40,446 58,444 64,432 C68,418 66,382 60,358 Z"/>
<!-- TIBIAL ANTERIOR right -->
<path class="m" data-id="tibial"
  d="M166,356 C172,382 172,422 168,438 C160,446 142,444 136,432 C132,418 134,382 140,358 Z"/>
</svg>

<!-- ════════════════════════════════════════════════════════ BACK VIEW -->
<svg id="svgB" class="v hidden" viewBox="0 0 200 460" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="skinB" cx="62%" cy="28%" r="72%">
    <stop offset="0%" stop-color="#2c3272"/><stop offset="55%" stop-color="#1c2158"/><stop offset="100%" stop-color="#0e1030"/>
  </radialGradient>
  <radialGradient id="jointB" cx="50%" cy="50%" r="55%">
    <stop offset="0%" stop-color="#252868"/><stop offset="100%" stop-color="#161840"/>
  </radialGradient>
  <linearGradient id="limbB" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#141640"/><stop offset="40%" stop-color="#1c2158"/><stop offset="100%" stop-color="#141640"/>
  </linearGradient>
</defs>

<!-- HEAD back -->
<ellipse cx="100" cy="36" rx="26" ry="31" fill="url(#skinB)" stroke="#32387c" stroke-width="1"/>
<ellipse cx="100" cy="12"  rx="24" ry="15" fill="#181b42"/>

<!-- Neck back -->
<path d="M91,65 L89,86 L111,86 L109,65 Q100,70 91,65Z" fill="url(#skinB)" stroke="#2e3470" stroke-width=".7"/>

<!-- Torso back -->
<path d="M88,86 C68,90 46,102 36,118 C22,132 18,152 18,175 L18,188 C18,204 24,216 34,224 L48,234 L62,238 L138,238 L152,234 L166,224 C176,216 182,204 182,188 L182,175 C182,152 178,132 164,118 C154,102 132,90 112,86 Z"
  fill="url(#skinB)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Arms back -->
<path d="M36,118 C24,132 16,152 14,178 L14,226 C14,234 22,240 32,240 L46,240 C54,236 58,228 56,218 L56,178 C54,152 46,132 40,118 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="35" cy="240" rx="14" ry="9" fill="url(#jointB)" stroke="#222658" stroke-width=".7"/>
<path d="M16,238 L12,318 C12,328 20,334 32,332 L44,330 C52,326 56,318 54,308 L54,238 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M12,328 C10,344 12,358 20,362 L42,364 C50,362 56,350 54,334 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M164,118 C176,132 184,152 186,178 L186,226 C186,234 178,240 168,240 L154,240 C146,236 142,228 144,218 L144,178 C146,152 154,132 160,118 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="165" cy="240" rx="14" ry="9" fill="url(#jointB)" stroke="#222658" stroke-width=".7"/>
<path d="M184,238 L188,318 C188,328 180,334 168,332 L156,330 C148,326 144,318 146,308 L146,238 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M188,328 C190,344 188,358 180,362 L158,364 C150,362 144,350 146,334 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Legs back -->
<path d="M48,240 L40,258 L32,336 C32,346 42,352 56,350 L66,348 C74,344 78,334 74,322 L66,258 L62,240 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="55" cy="352" rx="16" ry="9" fill="url(#jointB)" stroke="#222658" stroke-width=".7"/>
<path d="M32,354 L28,432 C28,442 38,448 52,446 L62,444 C70,440 72,432 70,420 L68,354 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M26,440 C22,454 28,460 44,460 L62,460 C70,458 72,450 68,440 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M152,240 L160,258 L168,336 C168,346 158,352 144,350 L134,348 C126,344 122,334 126,322 L134,258 L138,240 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<ellipse cx="145" cy="352" rx="16" ry="9" fill="url(#jointB)" stroke="#222658" stroke-width=".7"/>
<path d="M168,354 L172,432 C172,442 162,448 148,446 L138,444 C130,440 128,432 130,420 L132,354 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>
<path d="M174,440 C178,454 172,460 156,460 L138,460 C130,458 128,450 132,440 Z"
  fill="url(#limbB)" stroke="#2a2e6a" stroke-width=".7"/>

<!-- Back definition lines -->
<path d="M100,86 L100,238" fill="none" stroke="#32387c" stroke-width=".8" opacity=".55"/>
<path d="M80,105 L78,238" fill="none" stroke="#32387c" stroke-width=".5" opacity=".35"/>
<path d="M120,105 L122,238" fill="none" stroke="#32387c" stroke-width=".5" opacity=".35"/>
<path d="M18,188 Q100,184 182,188" fill="none" stroke="#32387c" stroke-width=".6" opacity=".35"/>
<path d="M50,258 L48,348" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>
<path d="M150,258 L152,348" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>
<path d="M44,258 L42,348" fill="none" stroke="#32387c" stroke-width=".5" opacity=".25"/>
<path d="M22,155 L20,228" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>
<path d="M178,155 L180,228" fill="none" stroke="#32387c" stroke-width=".5" opacity=".3"/>

<!-- ── MUSCLE REGIONS (back) ───────────────────────────────── -->
<!-- TRAPÉZIO large diamond -->
<path class="m" data-id="trapezio"
  d="M90,86 Q100,80 110,86 L130,108 Q140,130 136,150 Q118,158 100,154 Q82,158 64,150 Q60,130 70,108 Z"/>

<!-- DELTOIDES POST left -->
<path class="m" data-id="deltoides_post"
  d="M36,118 C26,130 20,148 24,164 C28,176 44,180 56,170 C66,154 66,136 58,120 Z"/>
<!-- DELTOIDES POST right -->
<path class="m" data-id="deltoides_post"
  d="M164,118 C174,130 180,148 176,164 C172,176 156,180 144,170 C134,154 134,136 142,120 Z"/>

<!-- DORSAIS left (lats — wide V) -->
<path class="m" data-id="dorsais"
  d="M64,150 C50,165 42,188 42,210 C42,226 56,232 68,228 C78,222 80,205 78,185 C76,165 70,152 64,150 Z"/>
<!-- DORSAIS right -->
<path class="m" data-id="dorsais"
  d="M136,150 C150,165 158,188 158,210 C158,226 144,232 132,228 C122,222 120,205 122,185 C124,165 130,152 136,150 Z"/>

<!-- TRÍCEPS left (full back view) -->
<path class="m" data-id="triceps"
  d="M20,164 C12,182 12,212 16,228 C22,238 38,240 48,230 C56,214 56,184 50,166 Z"/>
<!-- TRÍCEPS right -->
<path class="m" data-id="triceps"
  d="M180,164 C188,182 188,212 184,228 C178,238 162,240 152,230 C144,214 144,184 150,166 Z"/>

<!-- ANTEBRAÇO back left -->
<path class="m" data-id="antebraco"
  d="M14,240 L10,318 C10,328 18,334 30,332 L44,330 C52,326 56,316 54,306 L54,240 Z"/>
<!-- ANTEBRAÇO back right -->
<path class="m" data-id="antebraco"
  d="M186,240 L190,318 C190,328 182,334 170,332 L156,330 C148,326 144,316 146,306 L146,240 Z"/>

<!-- LOMBAR left -->
<path class="m" data-id="lombar"
  d="M78,190 C72,210 72,232 76,244 L88,244 L90,190 Z"/>
<!-- LOMBAR right -->
<path class="m" data-id="lombar"
  d="M122,190 C128,210 128,232 124,244 L112,244 L110,190 Z"/>

<!-- GLÚTEOS left -->
<path class="m" data-id="gluteos"
  d="M40,238 C28,258 26,290 32,312 C38,328 58,334 72,322 C84,308 84,278 76,256 C70,240 54,234 40,238 Z"/>
<!-- GLÚTEOS right -->
<path class="m" data-id="gluteos"
  d="M160,238 C172,258 174,290 168,312 C162,328 142,334 128,322 C116,308 116,278 124,256 C130,240 146,234 160,238 Z"/>

<!-- ISQUIOTIBIAIS left -->
<path class="m" data-id="isquiotibiais"
  d="M36,320 C28,344 26,388 30,422 C36,434 52,438 64,428 C72,414 72,375 66,348 C60,330 46,316 36,320 Z"/>
<!-- ISQUIOTIBIAIS right -->
<path class="m" data-id="isquiotibiais"
  d="M164,320 C172,344 174,388 170,422 C164,434 148,438 136,428 C128,414 128,375 134,348 C140,330 154,316 164,320 Z"/>

<!-- PANTURRILHA left -->
<path class="m" data-id="panturrilha"
  d="M32,354 C26,378 26,415 30,432 C38,440 54,440 62,430 C68,418 66,385 60,358 Z"/>
<!-- PANTURRILHA right -->
<path class="m" data-id="panturrilha"
  d="M168,354 C174,378 174,415 170,432 C162,440 146,440 138,430 C132,418 134,385 140,358 Z"/>
</svg>

  </div><!-- end bodyWrap -->
  <div id="tags"></div>
</div>

<script>
var curView = 'f';
var curPrim = [], curSec = [];
var LABELS = ${JSON.stringify(LABELS)};

function setView(v) {
  curView = v;
  document.getElementById('svgF').className = 'v' + (v==='f'?'':' hidden');
  document.getElementById('svgB').className = 'v' + (v==='b'?'':' hidden');
  document.getElementById('btnF').className = 'tog' + (v==='f'?' on':'');
  document.getElementById('btnB').className = 'tog' + (v==='b'?' on':'');
}

function updateMuscles(prim, sec, nome) {
  curPrim = prim; curSec = sec;
  document.getElementById('titleBar').textContent = nome || '';
  var all = document.querySelectorAll('.m');
  all.forEach(function(el) {
    var id = el.getAttribute('data-id');
    el.classList.remove('prim','sec');
    if(prim.includes(id)) el.classList.add('prim');
    else if(sec.includes(id)) el.classList.add('sec');
  });
  // Tags
  var tags = document.getElementById('tags');
  tags.innerHTML = '';
  prim.forEach(function(id) {
    var d = document.createElement('div'); d.className = 'tag';
    d.style.cssText = 'color:#e94560;border-color:#e94560;background:rgba(233,69,96,.18)';
    d.textContent = LABELS[id]||id; tags.appendChild(d);
  });
  sec.forEach(function(id) {
    var d = document.createElement('div'); d.className = 'tag';
    d.style.cssText = 'color:#f5a623;border-color:#f5a623;background:rgba(245,166,35,.18)';
    d.textContent = LABELS[id]||id; tags.appendChild(d);
  });
  // Auto-switch view to show highlighted muscles
  var backIds=['trapezio','deltoides_post','dorsais','triceps','lombar','gluteos','isquiotibiais','panturrilha'];
  var hasBack = prim.some(function(x){return backIds.includes(x);});
  var hasFront = prim.some(function(x){return !backIds.includes(x);});
  if(hasBack && !hasFront) setView('b');
  else setView('f');
}

function onMsg(raw) {
  try {
    var d = JSON.parse(raw);
    if(d.type==='muscles') updateMuscles(d.primarios||[], d.secundarios||[], d.nome||'');
  } catch(e){}
}
document.addEventListener('message', function(e){ onMsg(e.data); });
window.addEventListener('message',   function(e){ onMsg(e.data); });
</script>
</body>
</html>`;

export default function Avatar3D({ primarios = [], secundarios = [], nome = '', style }) {
  const ref = useRef(null);
  const loaded = useRef(false);

  function inject(p, s, n) {
    if (!ref.current || !loaded.current) return;
    ref.current.injectJavaScript(
      `if(typeof updateMuscles==='function'){updateMuscles(${JSON.stringify(p)},${JSON.stringify(s)},${JSON.stringify(n)});}true;`
    );
  }

  useEffect(() => { inject(primarios, secundarios, nome); }, [primarios.join(','), secundarios.join(','), nome]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={ref}
        source={{ html: HTML }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        scrollEnabled={false}
        bounces={false}
        onLoad={() => { loaded.current = true; setTimeout(() => inject(primarios, secundarios, nome), 150); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 420, backgroundColor: '#0d0d1a', borderRadius: 18, overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
