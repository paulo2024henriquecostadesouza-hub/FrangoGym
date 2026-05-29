import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path, Ellipse, Rect, G,
  Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

// ─── Paleta base ──────────────────────────────────────────────────────────────
const SKIN   = '#1e1e32';
const SKIN_H = '#2e2e48'; // highlight
const SKIN_S = '#0e0e1e'; // shadow
const SKIN_B = '#3a3a56';

// por estado do músculo
const STATES = {
  inactive:  { d: '#18182e', m: '#2a2a46', l: '#3a3a5a', s: '#404060', sw: 0.7 },
  primary:   { d: '#8a0020', m: '#d02040', l: '#ff7080', s: '#ff4060', sw: 1.4 },
  secondary: { d: '#7a3800', m: '#c07000', l: '#ffbe40', s: '#ffa000', sw: 1.2 },
};

function stateOf(id, p, s) {
  if (p.includes(id)) return 'primary';
  if (s.includes(id)) return 'secondary';
  return 'inactive';
}

// ─── Definições de gradientes ─────────────────────────────────────────────────
function GradDefs({ allIds, primarios, secundarios }) {
  return (
    <Defs>
      {/* Gradiente pele */}
      <RadialGradient id="gSkin" cx="40%" cy="30%" r="70%">
        <Stop offset="0%"   stopColor={SKIN_H}/>
        <Stop offset="60%"  stopColor={SKIN}/>
        <Stop offset="100%" stopColor={SKIN_S}/>
      </RadialGradient>

      {allIds.map(id => {
        const st = stateOf(id, primarios, secundarios);
        const c  = STATES[st];
        return (
          <G key={id}>
            <RadialGradient id={`gm_${id}`} cx="38%" cy="28%" r="68%">
              <Stop offset="0%"   stopColor={c.l}/>
              <Stop offset="55%"  stopColor={c.m}/>
              <Stop offset="100%" stopColor={c.d}/>
            </RadialGradient>
            {/* Especular (reflexo de luz) */}
            <RadialGradient id={`gsp_${id}`} cx="35%" cy="25%" r="45%">
              <Stop offset="0%"   stopColor={c.l} stopOpacity="0.7"/>
              <Stop offset="100%" stopColor={c.l} stopOpacity="0"/>
            </RadialGradient>
          </G>
        );
      })}
    </Defs>
  );
}

// ─── Helper: renderiza 1 músculo com efeito 3D ────────────────────────────────
function M({ id, d, spec, p, s, extra = {} }) {
  const st  = stateOf(id, p, s);
  const col = STATES[st];
  const active = st !== 'inactive';
  return (
    <G>
      {/* Sombra de contorno (ambient occlusion) */}
      <Path d={d} fill="none" stroke="#00000060" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Corpo do músculo com gradiente 3D */}
      <Path d={d} fill={`url(#gm_${id})`}
        stroke={col.s} strokeWidth={col.sw} strokeLinejoin="round" {...extra}/>
      {/* Reflexo especular */}
      {spec && (
        <Path d={spec} fill={`url(#gsp_${id})`}/>
      )}
      {/* Brilho extra quando ativo */}
      {active && (
        <Path d={d} fill="none"
          stroke={col.l} strokeWidth="0.5" opacity="0.6" strokeLinejoin="round"/>
      )}
    </G>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FRENTE — 130 × 310
// ═══════════════════════════════════════════════════════════════════════════════
function Frente({ p, s }) {
  return (
    <G>
      {/* ── Silhueta corpo ── */}
      <Path d="M65 28 Q80 28 82 40 L88 46 L100 50 L112 60 L116 74
               L114 90 L118 110 L120 130 L116 148
               L108 156 L104 180 L106 222 L104 260
               L100 280 L96 298 L94 308
               L80 308 L78 298 L76 286 L74 270 L72 252
               L70 240 L70 220 L68 200
               Q65 196 62 200 L60 220 L60 240 L58 252
               L56 270 L54 286 L52 298 L50 308
               L36 308 L34 298 L30 280 L26 260 L24 222
               L20 180 L16 156 L10 148 L6 130 L8 110
               L10 90 L8 74 L14 60 L26 50 L38 46 L44 40 Z"
        fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>

      {/* ── TRAPÉZIO (frente) ── */}
      <M id="trapezio" p={p} s={s}
        d="M46 40 Q65 34 84 40 L80 56 Q65 50 50 56 Z"
        spec="M54 38 Q65 34 76 38 Q70 44 60 43 Z"/>

      {/* ── DELTOIDES ANTERIOR esq ── */}
      <M id="deltoides" p={p} s={s}
        d="M26 48 Q14 56 12 72 Q16 82 28 78 Q38 66 40 50 Z"
        spec="M18 52 Q13 60 14 70 Q18 62 26 56 Z"/>
      {/* ── DELTOIDES ANTERIOR dir ── */}
      <M id="deltoides" p={p} s={s}
        d="M104 48 Q116 56 118 72 Q114 82 102 78 Q92 66 90 50 Z"
        spec="M112 52 Q117 60 116 70 Q112 62 104 56 Z"/>

      {/* ── PEITORAL esq ── */}
      <M id="peitoral" p={p} s={s}
        d="M46 56 Q58 48 65 52 Q65 70 62 80 Q52 78 44 66 Z"
        spec="M48 56 Q57 50 64 53 Q61 60 50 62 Z"/>
      {/* ── PEITORAL dir ── */}
      <M id="peitoral" p={p} s={s}
        d="M84 56 Q72 48 65 52 Q65 70 68 80 Q78 78 86 66 Z"
        spec="M82 56 Q73 50 66 53 Q69 60 80 62 Z"/>
      {/* Peitoral superior */}
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <M id="peitoral_sup" p={p} s={s}
          d="M47 56 Q57 49 65 52 Q58 58 48 57 Z" spec={null}/>
        <M id="peitoral_sup" p={p} s={s}
          d="M83 56 Q73 49 65 52 Q72 58 82 57 Z" spec={null}/>
      </>}

      {/* ── SERRATUS ANTERIOR ── */}
      <Path d={`M43 68 Q39 76 41 88 L46 82 44 74 Z`}
        fill={stateOf('obliquo',p,s)!=='inactive'?STATES[stateOf('obliquo',p,s)].m:'#222238'}
        stroke={SKIN_B} strokeWidth="0.5" opacity="0.8"/>
      <Path d="M87 68 Q91 76 89 88 L84 82 86 74 Z"
        fill={stateOf('obliquo',p,s)!=='inactive'?STATES[stateOf('obliquo',p,s)].m:'#222238'}
        stroke={SKIN_B} strokeWidth="0.5" opacity="0.8"/>

      {/* ── BÍCEPS esq ── */}
      <M id="biceps" p={p} s={s}
        d="M12 70 Q5 86 7 108 Q14 113 22 108 Q27 88 27 72 Z"
        spec="M9 74 Q5 86 7 100 Q11 90 16 78 Z"/>
      {/* ── BÍCEPS dir ── */}
      <M id="biceps" p={p} s={s}
        d="M118 70 Q125 86 123 108 Q116 113 108 108 Q103 88 103 72 Z"
        spec="M121 74 Q125 86 123 100 Q119 90 114 78 Z"/>

      {/* ── Braquialis esq (por baixo do bíceps) ── */}
      <Path d="M10 80 Q6 92 8 104 Q10 100 12 90 Z"
        fill={stateOf('biceps',p,s)!=='inactive'?STATES[stateOf('biceps',p,s)].d:'#161626'}
        stroke="none" opacity="0.6"/>
      <Path d="M120 80 Q124 92 122 104 Q120 100 118 90 Z"
        fill={stateOf('biceps',p,s)!=='inactive'?STATES[stateOf('biceps',p,s)].d:'#161626'}
        stroke="none" opacity="0.6"/>

      {/* ── ANTEBRAÇO esq ── */}
      <M id="antebraco" p={p} s={s}
        d="M7 110 Q2 132 4 158 Q10 163 18 158 Q23 134 22 112 Z"
        spec="M5 114 Q2 128 4 148 Q7 136 12 122 Z"/>
      {/* ── ANTEBRAÇO dir ── */}
      <M id="antebraco" p={p} s={s}
        d="M123 110 Q128 132 126 158 Q120 163 112 158 Q107 134 108 112 Z"
        spec="M125 114 Q128 128 126 148 Q123 136 118 122 Z"/>

      {/* ── ABDÔMEN — 6 pack (3 pares) ── */}
      {/* Linha alba vertical */}
      <Path d="M65 80 L65 122" fill="none"
        stroke={stateOf('abdomen',p,s)!=='inactive'?STATES[stateOf('abdomen',p,s)].s:SKIN_B}
        strokeWidth="0.7" opacity="0.8"/>
      {/* Linhas horizontais */}
      {[92, 104, 116].map(y => (
        <Path key={y} d={`M55 ${y} Q60 ${y-2} 65 ${y} Q70 ${y-2} 75 ${y}`}
          fill="none" stroke={stateOf('abdomen',p,s)!=='inactive'?STATES[stateOf('abdomen',p,s)].s:SKIN_B}
          strokeWidth="0.7" opacity="0.7"/>
      ))}
      {/* Pack 1 */}
      <M id="abdomen" p={p} s={s} d="M56 80 Q61 77 65 80 L65 92 Q60 89 56 92 Z"
        spec="M57 80 Q62 77 65 80 Q62 83 58 83 Z"/>
      <M id="abdomen" p={p} s={s} d="M74 80 Q69 77 65 80 L65 92 Q70 89 74 92 Z"
        spec="M73 80 Q68 77 65 80 Q68 83 72 83 Z"/>
      {/* Pack 2 */}
      <M id="abdomen" p={p} s={s} d="M55 92 Q60 89 65 92 L65 104 Q59 101 55 104 Z"
        spec={null}/>
      <M id="abdomen" p={p} s={s} d="M75 92 Q70 89 65 92 L65 104 Q71 101 75 104 Z"
        spec={null}/>
      {/* Pack 3 */}
      <M id="abdomen" p={p} s={s} d="M54 104 Q59 101 65 104 L65 116 Q58 113 54 116 Z"
        spec={null}/>
      <M id="abdomen" p={p} s={s} d="M76 104 Q71 101 65 104 L65 116 Q72 113 76 116 Z"
        spec={null}/>

      {/* ── OBLÍQUOS ── */}
      <M id="obliquo" p={p} s={s}
        d="M43 70 Q38 88 40 118 Q36 116 37 86 Z" spec={null}/>
      <M id="obliquo" p={p} s={s}
        d="M87 70 Q92 88 90 118 Q94 116 93 86 Z" spec={null}/>

      {/* ── TENSOR FASCIA LATA ── */}
      <Path d="M40 120 Q36 132 38 144 Q42 140 44 128 Z"
        fill={stateOf('quadriceps',p,s)!=='inactive'?STATES[stateOf('quadriceps',p,s)].d:'#1a1a2e'}
        stroke={SKIN_B} strokeWidth="0.5" opacity="0.7"/>
      <Path d="M90 120 Q94 132 92 144 Q88 140 86 128 Z"
        fill={stateOf('quadriceps',p,s)!=='inactive'?STATES[stateOf('quadriceps',p,s)].d:'#1a1a2e'}
        stroke={SKIN_B} strokeWidth="0.5" opacity="0.7"/>

      {/* ── QUADRÍCEPS ── */}
      {/* Vasto lateral esq */}
      <M id="quadriceps" p={p} s={s}
        d="M40 148 Q33 172 35 210 Q43 216 51 210 Q55 182 54 150 Z"
        spec="M37 152 Q33 168 35 200 Q38 184 44 164 Z"/>
      {/* Reto femoral esq */}
      <M id="quadriceps" p={p} s={s}
        d="M54 148 Q50 170 51 208 Q57 213 63 208 Q64 172 64 150 Z"
        spec="M52 150 Q49 166 50 196 Q53 178 58 162 Z"/>
      {/* Vasto medial esq (teardrop) */}
      <M id="quadriceps" p={p} s={s}
        d="M43 206 Q39 218 43 228 Q51 232 59 226 Q62 214 57 208 Z"
        spec="M44 208 Q40 216 43 224 Q48 222 54 218 Z"/>
      {/* Vasto lateral dir */}
      <M id="quadriceps" p={p} s={s}
        d="M90 148 Q97 172 95 210 Q87 216 79 210 Q75 182 76 150 Z"
        spec="M93 152 Q97 168 95 200 Q92 184 86 164 Z"/>
      {/* Reto femoral dir */}
      <M id="quadriceps" p={p} s={s}
        d="M76 148 Q80 170 79 208 Q73 213 67 208 Q66 172 66 150 Z"
        spec="M78 150 Q81 166 80 196 Q77 178 72 162 Z"/>
      {/* Vasto medial dir */}
      <M id="quadriceps" p={p} s={s}
        d="M87 206 Q91 218 87 228 Q79 232 71 226 Q68 214 73 208 Z"
        spec={null}/>

      {/* ── TIBIAL ANTERIOR ── */}
      <M id="tibial" p={p} s={s}
        d="M35 232 Q29 256 31 286 Q38 292 46 286 Q50 260 48 234 Z"
        spec="M33 236 Q29 254 31 278 Q34 262 40 248 Z"/>
      <M id="tibial" p={p} s={s}
        d="M95 232 Q101 256 99 286 Q92 292 84 286 Q80 260 82 234 Z"
        spec={null}/>

      {/* ── Gastrocnêmio borda frontal ── */}
      <Path d="M30 288 Q27 302 28 316 Q31 310 34 296 Z"
        fill={stateOf('panturrilha',p,s)!=='inactive'?STATES[stateOf('panturrilha',p,s)].m:'#202030'}
        stroke="none" opacity="0.6"/>
      <Path d="M100 288 Q103 302 102 316 Q99 310 96 296 Z"
        fill={stateOf('panturrilha',p,s)!=='inactive'?STATES[stateOf('panturrilha',p,s)].m:'#202030'}
        stroke="none" opacity="0.6"/>
    </G>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  COSTAS — 130 × 310
// ═══════════════════════════════════════════════════════════════════════════════
function Costas({ p, s }) {
  return (
    <G>
      {/* ── Silhueta corpo costas ── */}
      <Path d="M65 28 Q80 28 82 40 L88 46 L100 50 L114 60 L118 76
               L116 92 L120 112 L118 132 L114 150
               L106 158 L102 182 L104 222 L102 260
               L98 280 L94 308
               L80 308 L78 298 L76 284 L74 266
               L70 240 Q65 230 60 240 L56 266
               L54 284 L52 298 L50 308
               L36 308 L32 280 L28 260 L26 222 L28 182
               L24 158 L16 150 L12 132 L10 112 L14 92
               L12 76 L16 60 L30 50 L42 46 L48 40 Z"
        fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>

      {/* ── TRAPÉZIO ── */}
      <M id="trapezio" p={p} s={s}
        d="M44 38 Q65 32 86 38 L82 66 Q65 58 48 66 Z"
        spec="M52 36 Q65 32 78 36 Q72 44 58 44 Z"/>
      {/* Linha divisória */}
      <Path d="M65 34 L65 64" fill="none"
        stroke={stateOf('trapezio',p,s)!=='inactive'?STATES[stateOf('trapezio',p,s)].s:SKIN_B}
        strokeWidth="0.6" opacity="0.6"/>

      {/* ── DELTOIDES POSTERIOR esq ── */}
      <M id="deltoides_post" p={p} s={s}
        d="M28 46 Q14 56 14 74 Q18 82 32 78 Q42 66 44 50 Z"
        spec="M20 50 Q14 60 15 72 Q18 64 26 56 Z"/>
      {/* ── DELTOIDES POSTERIOR dir ── */}
      <M id="deltoides_post" p={p} s={s}
        d="M102 46 Q116 56 116 74 Q112 82 98 78 Q88 66 86 50 Z"
        spec="M110 50 Q116 60 115 72 Q112 64 104 56 Z"/>

      {/* ── INFRAESPINHAL / TERES ── */}
      <Path d="M44 66 Q40 78 43 92 Q50 98 57 92 Q56 80 53 66 Z"
        fill={stateOf('dorsais',p,s)!=='inactive'?STATES[stateOf('dorsais',p,s)].d:'#1a1a2e'}
        stroke={stateOf('dorsais',p,s)!=='inactive'?STATES[stateOf('dorsais',p,s)].s:SKIN_B}
        strokeWidth="0.7" opacity="0.9"/>
      <Path d="M86 66 Q90 78 87 92 Q80 98 73 92 Q74 80 77 66 Z"
        fill={stateOf('dorsais',p,s)!=='inactive'?STATES[stateOf('dorsais',p,s)].d:'#1a1a2e'}
        stroke={stateOf('dorsais',p,s)!=='inactive'?STATES[stateOf('dorsais',p,s)].s:SKIN_B}
        strokeWidth="0.7" opacity="0.9"/>

      {/* ── LATÍSSIMOS (dorsais) ── */}
      <M id="dorsais" p={p} s={s}
        d="M44 66 Q38 84 40 118 Q50 128 60 118 Q60 94 57 66 Z"
        spec="M42 70 Q38 86 40 110 Q44 94 50 78 Z"/>
      <M id="dorsais" p={p} s={s}
        d="M86 66 Q92 84 90 118 Q80 128 70 118 Q70 94 73 66 Z"
        spec="M88 70 Q92 86 90 110 Q86 94 80 78 Z"/>

      {/* ── TRÍCEPS ── */}
      {/* Cabeça longa esq */}
      <M id="triceps" p={p} s={s}
        d="M14 74 Q7 92 9 114 Q16 119 24 114 Q28 94 28 76 Z"
        spec="M11 78 Q7 92 9 108 Q12 94 18 82 Z"/>
      {/* Cabeça longa dir */}
      <M id="triceps" p={p} s={s}
        d="M116 74 Q123 92 121 114 Q114 119 106 114 Q102 94 102 76 Z"
        spec="M119 78 Q123 92 121 108 Q118 94 112 82 Z"/>
      {/* Cabeça lateral esq */}
      <Path d="M12 82 Q8 94 10 108 Q12 104 15 92 Z"
        fill={stateOf('triceps',p,s)!=='inactive'?STATES[stateOf('triceps',p,s)].d:'#141420'}
        stroke="none" opacity="0.7"/>
      <Path d="M118 82 Q122 94 120 108 Q118 104 115 92 Z"
        fill={stateOf('triceps',p,s)!=='inactive'?STATES[stateOf('triceps',p,s)].d:'#141420'}
        stroke="none" opacity="0.7"/>

      {/* ── ANTEBRAÇO costas ── */}
      <M id="antebraco" p={p} s={s}
        d="M9 116 Q4 138 6 164 Q12 169 20 164 Q25 140 24 118 Z"
        spec="M7 120 Q4 134 6 156 Q9 142 14 128 Z"/>
      <M id="antebraco" p={p} s={s}
        d="M121 116 Q126 138 124 164 Q118 169 110 164 Q105 140 106 118 Z"
        spec={null}/>

      {/* ── ERETOR ESPINHAL / LOMBAR ── */}
      <M id="lombar" p={p} s={s}
        d="M57 118 L55 152 Q60 158 65 152 L64 118 Z"
        spec="M57 120 L55 144 Q58 138 62 126 Z"/>
      <M id="lombar" p={p} s={s}
        d="M73 118 L75 152 Q70 158 65 152 L66 118 Z"
        spec={null}/>
      {/* Coluna vertebral */}
      <Path d="M65 38 L65 156" fill="none" stroke={SKIN_B} strokeWidth="0.8" opacity="0.4"/>

      {/* ── GLÚTEOS ── */}
      <M id="gluteos" p={p} s={s}
        d="M43 156 Q37 180 41 202 Q54 214 65 206 Q65 182 64 156 Z"
        spec="M40 160 Q37 176 40 194 Q44 182 50 168 Z"/>
      <M id="gluteos" p={p} s={s}
        d="M87 156 Q93 180 89 202 Q76 214 65 206 Q65 182 66 156 Z"
        spec="M90 160 Q93 176 90 194 Q86 182 80 168 Z"/>
      {/* Glúteo médio */}
      <Path d="M42 156 Q36 164 38 176 Q44 172 46 162 Z"
        fill={stateOf('gluteos',p,s)!=='inactive'?STATES[stateOf('gluteos',p,s)].d:'#151525'}
        stroke="none" opacity="0.7"/>
      <Path d="M88 156 Q94 164 92 176 Q86 172 84 162 Z"
        fill={stateOf('gluteos',p,s)!=='inactive'?STATES[stateOf('gluteos',p,s)].d:'#151525'}
        stroke="none" opacity="0.7"/>

      {/* ── ISQUIOTIBIAIS ── */}
      {/* Bíceps femoral esq */}
      <M id="isquiotibiais" p={p} s={s}
        d="M40 208 Q34 232 36 268 Q43 274 51 268 Q55 240 53 210 Z"
        spec="M37 212 Q33 230 35 258 Q38 242 44 226 Z"/>
      {/* Semimembranosus esq */}
      <M id="isquiotibiais" p={p} s={s}
        d="M53 208 Q49 230 50 266 Q57 272 63 266 Q64 238 64 210 Z"
        spec={null}/>
      {/* Bíceps femoral dir */}
      <M id="isquiotibiais" p={p} s={s}
        d="M90 208 Q96 232 94 268 Q87 274 79 268 Q75 240 77 210 Z"
        spec="M93 212 Q97 230 95 258 Q92 242 86 226 Z"/>
      {/* Semimembranosus dir */}
      <M id="isquiotibiais" p={p} s={s}
        d="M77 208 Q81 230 80 266 Q73 272 67 266 Q66 238 66 210 Z"
        spec={null}/>

      {/* ── PANTURRILHA ── */}
      {/* Gastrocnêmio medial esq */}
      <M id="panturrilha" p={p} s={s}
        d="M36 272 Q30 296 32 322 Q40 330 48 324 Q52 298 50 274 Z"
        spec="M34 276 Q30 294 32 314 Q35 298 41 284 Z"/>
      {/* Gastrocnêmio lateral esq */}
      <M id="panturrilha" p={p} s={s}
        d="M50 274 Q46 296 48 322 Q55 328 62 322 Q64 298 64 276 Z"
        spec={null}/>
      {/* Solear esq */}
      <Path d="M36 316 Q32 334 34 352 Q39 350 44 344 Q46 328 44 320 Z"
        fill={stateOf('panturrilha',p,s)!=='inactive'?STATES[stateOf('panturrilha',p,s)].d:'#161626'}
        stroke={stateOf('panturrilha',p,s)!=='inactive'?STATES[stateOf('panturrilha',p,s)].s:SKIN_B}
        strokeWidth="0.6" opacity="0.85"/>
      {/* Gastrocnêmio medial dir */}
      <M id="panturrilha" p={p} s={s}
        d="M94 272 Q100 296 98 322 Q90 330 82 324 Q78 298 80 274 Z"
        spec={null}/>
      {/* Gastrocnêmio lateral dir */}
      <M id="panturrilha" p={p} s={s}
        d="M80 274 Q84 296 82 322 Q75 328 68 322 Q66 298 66 276 Z"
        spec={null}/>
      {/* Solear dir */}
      <Path d="M94 316 Q98 334 96 352 Q91 350 86 344 Q84 328 86 320 Z"
        fill={stateOf('panturrilha',p,s)!=='inactive'?STATES[stateOf('panturrilha',p,s)].d:'#161626'}
        stroke={stateOf('panturrilha',p,s)!=='inactive'?STATES[stateOf('panturrilha',p,s)].s:SKIN_B}
        strokeWidth="0.6" opacity="0.85"/>
    </G>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CABEÇA & PESCOÇO (compartilhado)
// ═══════════════════════════════════════════════════════════════════════════════
function CabecaPescoco() {
  return (
    <G>
      <Ellipse cx="65" cy="16" rx="14" ry="15" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.2"/>
      <Rect x="59" y="29" width="12" height="10" rx="3" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.8"/>
    </G>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
const ALL_IDS = [
  'trapezio','deltoides','deltoides_post','peitoral','peitoral_sup',
  'biceps','triceps','antebraco','abdomen','obliquo','dorsais',
  'lombar','gluteos','quadriceps','isquiotibiais','tibial','panturrilha',
];

export default function MuscleMap3D({
  primarios    = [],
  secundarios  = [],
  escala       = 1,
  mostrarLegenda = true,
}) {
  const W = 130 * escala;
  const H = 320 * escala;
  const todos = [...new Set([...primarios, ...secundarios])];

  const gradDefs = useMemo(() => (
    <GradDefs allIds={ALL_IDS} primarios={primarios} secundarios={secundarios}/>
  ), [primarios.join(), secundarios.join()]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* FRENTE */}
        <View style={styles.col}>
          <Text style={styles.lbl}>FRENTE</Text>
          <Svg width={W} height={H} viewBox="0 0 130 320">
            <Defs>
              <GradDefs allIds={ALL_IDS} primarios={primarios} secundarios={secundarios}/>
            </Defs>
            <CabecaPescoco/>
            <Frente p={primarios} s={secundarios}/>
          </Svg>
        </View>

        {/* COSTAS */}
        <View style={styles.col}>
          <Text style={styles.lbl}>COSTAS</Text>
          <Svg width={W} height={H} viewBox="0 0 130 320">
            <Defs>
              <GradDefs allIds={ALL_IDS} primarios={primarios} secundarios={secundarios}/>
            </Defs>
            <CabecaPescoco/>
            <Costas p={primarios} s={secundarios}/>
          </Svg>
        </View>
      </View>

      {mostrarLegenda && todos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.dot, { backgroundColor: '#ff7080' }]}/>
            <Text style={styles.legendaTxt}>Principal</Text>
            <View style={[styles.dot, { backgroundColor: '#ffbe40', marginLeft: 14 }]}/>
            <Text style={styles.legendaTxt}>Auxiliar</Text>
          </View>
          <View style={styles.tags}>
            {primarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: '#ff5060', backgroundColor: '#90001520' }]}>
                <Text style={[styles.tagTxt, { color: '#ff7080' }]}>{id.replace(/_/g,' ')}</Text>
              </View>
            ))}
            {secundarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: '#ffa000', backgroundColor: '#80400020' }]}>
                <Text style={[styles.tagTxt, { color: '#ffbe40' }]}>{id.replace(/_/g,' ')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { alignItems: 'center' },
  row:        { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  col:        { alignItems: 'center' },
  lbl:        { color: '#555', fontSize: 9, letterSpacing: 1.5, fontWeight: '700', marginBottom: 4 },
  legenda:    { marginTop: 10, width: '100%' },
  legendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' },
  dot:        { width: 9, height: 9, borderRadius: 5, marginRight: 5 },
  legendaTxt: { color: '#888', fontSize: 11 },
  tags:       { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' },
  tag:        { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  tagTxt:     { fontSize: 10, fontWeight: '700' },
});
