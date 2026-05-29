import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Rect, Defs, RadialGradient, LinearGradient, Stop, G } from 'react-native-svg';

// ─── Cores base ───────────────────────────────────────────────────────────────
const SKIN     = '#252538';
const SKIN_B   = '#353550';
const MUSC_D   = '#1c1c30';   // músculo inativo escuro
const MUSC_L   = '#2e2e4e';   // músculo inativo claro
const MUSC_B   = '#3a3a5e';   // borda inativa
const P_D      = '#c01030';   // primário escuro
const P_L      = '#ff5070';   // primário claro
const S_D      = '#b06000';   // secundário escuro
const S_L      = '#ffc040';   // secundário claro

// ─── Retorna cores de fill/stroke por estado ──────────────────────────────────
function mc(id, p, s) {
  const isPrim = p.includes(id);
  const isSec  = s.includes(id);
  return {
    fill:   isPrim ? `url(#gp_${id})` : isSec ? `url(#gs_${id})` : `url(#gi_${id})`,
    stroke: isPrim ? P_L              : isSec ? S_L              : MUSC_B,
    sw:     isPrim || isSec ? 1.2 : 0.7,
  };
}

// ─── Gradientes SVG inline ────────────────────────────────────────────────────
function Gradients({ muscIds, primarios, secundarios }) {
  return (
    <Defs>
      {muscIds.map(id => {
        const isPrim = primarios.includes(id);
        const isSec  = secundarios.includes(id);
        return (
          <G key={id}>
            <RadialGradient id={`gp_${id}`} cx="45%" cy="35%" r="65%">
              <Stop offset="0%" stopColor={P_L}/>
              <Stop offset="100%" stopColor={P_D}/>
            </RadialGradient>
            <RadialGradient id={`gs_${id}`} cx="45%" cy="35%" r="65%">
              <Stop offset="0%" stopColor={S_L}/>
              <Stop offset="100%" stopColor={S_D}/>
            </RadialGradient>
            <RadialGradient id={`gi_${id}`} cx="45%" cy="35%" r="65%">
              <Stop offset="0%" stopColor={MUSC_L}/>
              <Stop offset="100%" stopColor={MUSC_D}/>
            </RadialGradient>
          </G>
        );
      })}
      <RadialGradient id="gSkin" cx="50%" cy="30%" r="70%">
        <Stop offset="0%" stopColor={SKIN_B}/>
        <Stop offset="100%" stopColor={SKIN}/>
      </RadialGradient>
    </Defs>
  );
}

const TODOS_MUSCULOS = [
  'trapezio','deltoides','deltoides_post','peitoral','peitoral_sup',
  'biceps','triceps','antebraco','abdomen','obliquo','dorsais',
  'lombar','gluteos','quadriceps','isquiotibiais','tibial','panturrilha',
];

// ═══════════════════════════════════════════════════════════════════════════════
//  MESOMORFO / ECTOMORFO — FRENTE  (V-taper atlético)
// ═══════════════════════════════════════════════════════════════════════════════
function MesomorfoFrente({ p, s }) {
  const m = id => mc(id, p, s);
  return (
    <Svg width="130" height="300" viewBox="0 0 130 300">
      <Gradients muscIds={TODOS_MUSCULOS} primarios={p} secundarios={s}/>

      {/* Silhueta base */}
      <Path d="M65 5 Q80 5 80 20 Q80 32 65 32 Q50 32 50 20 Q50 5 65 5 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.5"/>
      <Rect x="59" y="30" width="12" height="10" rx="3" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>

      {/* ── TRAPÉZIO ── */}
      <Path d="M42 40 Q65 34 88 40 L82 56 Q65 50 48 56 Z"
        {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      {/* Linha divisória trapézio */}
      <Path d="M55 38 Q65 52 75 38" fill="none" stroke={MUSC_B} strokeWidth="0.5" opacity="0.6"/>

      {/* ── DELTOIDES ── */}
      <Path d="M28 46 Q18 52 17 66 Q20 74 30 71 Q38 62 40 50 Z"
        {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M102 46 Q112 52 113 66 Q110 74 100 71 Q92 62 90 50 Z"
        {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      {/* Detalhe cabeça anterior deltoides */}
      <Path d="M30 48 Q26 56 28 66 Q30 60 34 52 Z"
        fill={p.includes('deltoides')?P_D:s.includes('deltoides')?S_D:MUSC_D} stroke="none" opacity="0.5"/>
      <Path d="M100 48 Q104 56 102 66 Q100 60 96 52 Z"
        fill={p.includes('deltoides')?P_D:s.includes('deltoides')?S_D:MUSC_D} stroke="none" opacity="0.5"/>

      {/* ── PEITORAL ESQUERDO ── */}
      <Path d="M47 56 Q55 50 65 54 Q65 70 62 76 Q54 73 47 65 Z"
        {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      {/* ── PEITORAL DIREITO ── */}
      <Path d="M83 56 Q75 50 65 54 Q65 70 68 76 Q76 73 83 65 Z"
        {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      {/* Linha esternal */}
      <Path d="M65 54 L65 76" fill="none" stroke={MUSC_B} strokeWidth="0.6" opacity="0.7"/>
      {/* Peitoral superior */}
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <Path d="M48 56 Q56 50 65 53 Q58 58 50 57 Z" {...m('peitoral_sup')} strokeWidth="1"/>
        <Path d="M82 56 Q74 50 65 53 Q72 58 80 57 Z" {...m('peitoral_sup')} strokeWidth="1"/>
      </>}

      {/* ── SERRATUS ── */}
      <Path d="M44 66 Q41 72 42 80 L46 76 L44 70 Z" fill={p.includes('obliquo')?P_D:s.includes('obliquo')?S_D:MUSC_D} stroke={MUSC_B} strokeWidth="0.5" opacity="0.7"/>
      <Path d="M86 66 Q89 72 88 80 L84 76 L86 70 Z" fill={p.includes('obliquo')?P_D:s.includes('obliquo')?S_D:MUSC_D} stroke={MUSC_B} strokeWidth="0.5" opacity="0.7"/>

      {/* ── BÍCEPS ── */}
      <Path d="M18 66 Q13 78 15 92 Q20 96 27 92 Q30 79 30 68 Z"
        {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M112 66 Q117 78 115 92 Q110 96 103 92 Q100 79 100 68 Z"
        {...m('biceps')} strokeWidth={m('biceps').sw}/>
      {/* Braquialis */}
      <Path d="M16 76 Q13 84 14 90 Q17 88 19 80 Z"
        fill={p.includes('biceps')?P_D:s.includes('biceps')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Path d="M114 76 Q117 84 116 90 Q113 88 111 80 Z"
        fill={p.includes('biceps')?P_D:s.includes('biceps')?S_D:MUSC_D} stroke="none" opacity="0.6"/>

      {/* ── TRÍCEPS (vista frontal – leve) ── */}
      <Path d="M17 67 Q14 73 15 80 Q12 79 13 71 Z"
        {...m('triceps')} strokeWidth="0.7" opacity="0.5"/>
      <Path d="M113 67 Q116 73 115 80 Q118 79 117 71 Z"
        {...m('triceps')} strokeWidth="0.7" opacity="0.5"/>

      {/* ── ANTEBRAÇO ── */}
      <Path d="M15 94 Q11 108 12 122 Q17 126 23 122 Q26 108 27 94 Z"
        {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M115 94 Q119 108 118 122 Q113 126 107 122 Q104 108 103 94 Z"
        {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      {/* Detalhe extensor */}
      <Path d="M13 98 Q11 108 12 116 Q14 112 16 102 Z"
        fill={p.includes('antebraco')?P_D:s.includes('antebraco')?S_D:MUSC_D} stroke="none" opacity="0.5"/>
      <Path d="M117 98 Q119 108 118 116 Q116 112 114 102 Z"
        fill={p.includes('antebraco')?P_D:s.includes('antebraco')?S_D:MUSC_D} stroke="none" opacity="0.5"/>

      {/* ── TRONCO BASE ── */}
      <Path d="M46 56 L84 56 L88 126 L42 126 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.6"/>

      {/* ── ABDÔMEN (6-pack detalhado) ── */}
      {/* Linea alba */}
      <Path d="M65 76 L65 118" fill="none" stroke={MUSC_B} strokeWidth="0.8" opacity="0.8"/>
      {/* Linha horizontal 1 */}
      <Path d="M55 84 Q60 82 65 84 Q70 82 75 84" fill="none" stroke={MUSC_B} strokeWidth="0.7" opacity="0.7"/>
      {/* Linha horizontal 2 */}
      <Path d="M54 94 Q60 92 65 94 Q70 92 76 94" fill="none" stroke={MUSC_B} strokeWidth="0.7" opacity="0.7"/>
      {/* Linha horizontal 3 */}
      <Path d="M53 104 Q59 102 65 104 Q71 102 77 104" fill="none" stroke={MUSC_B} strokeWidth="0.6" opacity="0.6"/>
      {/* Pack 1 */}
      <Path d="M55 76 Q61 74 65 76 L65 84 Q60 82 55 84 Z"
        {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M75 76 Q69 74 65 76 L65 84 Q70 82 75 84 Z"
        {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      {/* Pack 2 */}
      <Path d="M54 84 Q60 82 65 84 L65 94 Q59 92 54 94 Z"
        {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.95"/>
      <Path d="M76 84 Q70 82 65 84 L65 94 Q71 92 76 94 Z"
        {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.95"/>
      {/* Pack 3 */}
      <Path d="M53 94 Q59 92 65 94 L65 104 Q58 102 53 104 Z"
        {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.85"/>
      <Path d="M77 94 Q71 92 65 94 L65 104 Q72 102 77 104 Z"
        {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.85"/>

      {/* ── OBLÍQUOS ── */}
      <Path d="M44 60 Q41 76 42 106 Q39 105 40 74 Z"
        {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M86 60 Q89 76 88 106 Q91 105 90 74 Z"
        {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      {/* Linhas oblíquas */}
      <Path d="M42 78 Q45 82 50 80" fill="none" stroke={p.includes('obliquo')?P_L:s.includes('obliquo')?S_L:MUSC_B} strokeWidth="0.5" opacity="0.6"/>
      <Path d="M88 78 Q85 82 80 80" fill="none" stroke={p.includes('obliquo')?P_L:s.includes('obliquo')?S_L:MUSC_B} strokeWidth="0.5" opacity="0.6"/>

      {/* ── QUADRIL ── */}
      <Path d="M42 124 Q38 134 37 148 L93 148 Q92 134 88 124 Z"
        fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.6"/>

      {/* ── QUADRÍCEPS ── */}
      {/* Vasto lateral esq */}
      <Path d="M36 148 Q32 168 33 196 Q38 200 43 196 Q45 172 46 148 Z"
        {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      {/* Vasto lateral dir */}
      <Path d="M94 148 Q98 168 97 196 Q92 200 87 196 Q85 172 84 148 Z"
        {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      {/* Reto femoral esq (centro) */}
      <Path d="M47 148 Q44 168 45 194 Q49 197 53 194 Q54 170 54 148 Z"
        fill={p.includes('quadriceps')?`url(#gp_quadriceps)`:s.includes('quadriceps')?`url(#gs_quadriceps)`:`url(#gi_quadriceps)`}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      {/* Reto femoral dir */}
      <Path d="M83 148 Q86 168 85 194 Q81 197 77 194 Q76 170 76 148 Z"
        fill={p.includes('quadriceps')?`url(#gp_quadriceps)`:s.includes('quadriceps')?`url(#gs_quadriceps)`:`url(#gi_quadriceps)`}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      {/* Vasto medial esq (teardrop) */}
      <Path d="M44 190 Q41 198 43 204 Q48 206 52 202 Q53 194 50 190 Z"
        fill={p.includes('quadriceps')?P_D:s.includes('quadriceps')?S_D:MUSC_D}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M86 190 Q89 198 87 204 Q82 206 78 202 Q77 194 80 190 Z"
        fill={p.includes('quadriceps')?P_D:s.includes('quadriceps')?S_D:MUSC_D}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>

      {/* ── JOELHOS ── */}
      <Ellipse cx="48" cy="208" rx="9" ry="7" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="82" cy="208" rx="9" ry="7" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>

      {/* ── TIBIAL ANTERIOR ── */}
      <Path d="M40 214 Q37 234 38 256 Q43 260 48 256 Q51 236 51 214 Z"
        {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Path d="M90 214 Q93 234 92 256 Q87 260 82 256 Q79 236 79 214 Z"
        {...m('tibial')} strokeWidth={m('tibial').sw}/>
      {/* Gastrocnêmio lateral (frente) */}
      <Path d="M38 216 Q35 228 36 244 Q39 240 42 226 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.5"/>
      <Path d="M92 216 Q95 228 94 244 Q91 240 88 226 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.5"/>

      {/* ── PÉS ── */}
      <Ellipse cx="44" cy="262" rx="11" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="86" cy="262" rx="11" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MESOMORFO / ECTOMORFO — COSTAS
// ═══════════════════════════════════════════════════════════════════════════════
function MesomorfoCostas({ p, s }) {
  const m = id => mc(id, p, s);
  return (
    <Svg width="130" height="300" viewBox="0 0 130 300">
      <Gradients muscIds={TODOS_MUSCULOS} primarios={p} secundarios={s}/>

      <Path d="M65 5 Q80 5 80 20 Q80 32 65 32 Q50 32 50 20 Q50 5 65 5 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.5"/>
      <Rect x="59" y="30" width="12" height="10" rx="3" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>

      {/* ── TRAPÉZIO ── */}
      <Path d="M42 40 Q65 33 88 40 L84 64 Q65 56 46 64 Z"
        {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      {/* Divisória trapézio */}
      <Path d="M65 36 L65 62" fill="none" stroke={p.includes('trapezio')?P_L:s.includes('trapezio')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.6"/>
      <Path d="M52 44 Q65 56 78 44" fill="none" stroke={p.includes('trapezio')?P_L:s.includes('trapezio')?S_L:MUSC_B} strokeWidth="0.5" opacity="0.5"/>

      {/* ── DELTOIDES POST ── */}
      <Path d="M28 48 Q18 56 18 68 Q22 76 32 72 Q40 62 42 52 Z"
        {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M102 48 Q112 56 112 68 Q108 76 98 72 Q90 62 88 52 Z"
        {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>

      {/* ── INFRAESPINHAL / TERES ── */}
      <Path d="M46 64 Q43 74 45 84 Q52 88 56 82 Q54 72 52 64 Z"
        fill={p.includes('dorsais')?`url(#gp_dorsais)`:s.includes('dorsais')?`url(#gs_dorsais)`:`url(#gi_dorsais)`}
        stroke={p.includes('dorsais')?P_L:s.includes('dorsais')?S_L:MUSC_B} strokeWidth="0.8" opacity="0.85"/>
      <Path d="M84 64 Q87 74 85 84 Q78 88 74 82 Q76 72 78 64 Z"
        fill={p.includes('dorsais')?`url(#gp_dorsais)`:s.includes('dorsais')?`url(#gs_dorsais)`:`url(#gi_dorsais)`}
        stroke={p.includes('dorsais')?P_L:s.includes('dorsais')?S_L:MUSC_B} strokeWidth="0.8" opacity="0.85"/>

      {/* ── DORSAIS (LATÍSSIMOS) ── */}
      <Path d="M46 64 Q42 80 44 104 Q50 112 58 106 Q58 86 56 64 Z"
        {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M84 64 Q88 80 86 104 Q80 112 72 106 Q72 86 74 64 Z"
        {...m('dorsais')} strokeWidth={m('dorsais').sw}/>

      {/* ── TRÍCEPS ── */}
      <Path d="M18 68 Q13 82 15 98 Q20 102 27 98 Q30 84 30 70 Z"
        {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M112 68 Q117 82 115 98 Q110 102 103 98 Q100 84 100 70 Z"
        {...m('triceps')} strokeWidth={m('triceps').sw}/>
      {/* Cabeça longa tríceps */}
      <Path d="M20 70 Q17 80 18 92 Q21 88 22 78 Z"
        fill={p.includes('triceps')?P_D:s.includes('triceps')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Path d="M110 70 Q113 80 112 92 Q109 88 108 78 Z"
        fill={p.includes('triceps')?P_D:s.includes('triceps')?S_D:MUSC_D} stroke="none" opacity="0.6"/>

      {/* ── ANTEBRAÇO ── */}
      <Path d="M15 100 Q11 114 12 128 Q17 132 23 128 Q26 114 27 100 Z"
        {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M115 100 Q119 114 118 128 Q113 132 107 128 Q104 114 103 100 Z"
        {...m('antebraco')} strokeWidth={m('antebraco').sw}/>

      {/* ── ERETOR ESPINHAL / LOMBAR ── */}
      <Path d="M58 64 L56 116 Q59 120 63 116 L62 64 Z"
        {...m('lombar')} strokeWidth={m('lombar').sw}/>
      <Path d="M72 64 L74 116 Q71 120 67 116 L68 64 Z"
        {...m('lombar')} strokeWidth={m('lombar').sw}/>
      {/* Coluna vertebral */}
      <Path d="M65 38 L65 122" fill="none" stroke={SKIN_B} strokeWidth="0.8" opacity="0.5"/>

      {/* ── TRONCO COSTAS ── */}
      <Path d="M44 64 L86 64 L90 128 L40 128 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.5"/>

      {/* ── GLÚTEOS ── */}
      <Path d="M40 130 Q38 148 42 162 Q50 170 65 164 Q65 146 64 130 Z"
        {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M90 130 Q92 148 88 162 Q80 170 65 164 Q65 146 66 130 Z"
        {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      {/* Glúteo médio */}
      <Path d="M40 130 Q36 138 38 148 Q44 144 46 134 Z"
        fill={p.includes('gluteos')?P_D:s.includes('gluteos')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M90 130 Q94 138 92 148 Q86 144 84 134 Z"
        fill={p.includes('gluteos')?P_D:s.includes('gluteos')?S_D:MUSC_D} stroke="none" opacity="0.7"/>

      {/* ── ISQUIOTIBIAIS ── */}
      {/* Bíceps femoral esq */}
      <Path d="M38 164 Q34 184 36 208 Q41 212 47 208 Q50 186 49 164 Z"
        {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      {/* Bíceps femoral dir */}
      <Path d="M92 164 Q96 184 94 208 Q89 212 83 208 Q80 186 81 164 Z"
        {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      {/* Semitend/semimemb esq */}
      <Path d="M50 164 Q47 184 48 206 Q52 210 57 206 Q58 184 58 164 Z"
        fill={p.includes('isquiotibiais')?`url(#gp_isquiotibiais)`:s.includes('isquiotibiais')?`url(#gs_isquiotibiais)`:`url(#gi_isquiotibiais)`}
        stroke={p.includes('isquiotibiais')?P_L:s.includes('isquiotibiais')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.9"/>
      <Path d="M80 164 Q83 184 82 206 Q78 210 73 206 Q72 184 72 164 Z"
        fill={p.includes('isquiotibiais')?`url(#gp_isquiotibiais)`:s.includes('isquiotibiais')?`url(#gs_isquiotibiais)`:`url(#gi_isquiotibiais)`}
        stroke={p.includes('isquiotibiais')?P_L:s.includes('isquiotibiais')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.9"/>

      {/* ── JOELHOS ── */}
      <Ellipse cx="43" cy="213" rx="8" ry="6" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="87" cy="213" rx="8" ry="6" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>

      {/* ── PANTURRILHA ── */}
      {/* Gastrocnêmio medial + lateral esq */}
      <Path d="M35 218 Q31 238 33 258 Q38 262 44 258 Q47 238 46 218 Z"
        {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M95 218 Q99 238 97 258 Q92 262 86 258 Q83 238 84 218 Z"
        {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      {/* Divisória gast med/lat */}
      <Path d="M40 220 Q38 236 39 254" fill="none" stroke={p.includes('panturrilha')?P_L:s.includes('panturrilha')?S_L:MUSC_B} strokeWidth="0.5" opacity="0.6"/>
      <Path d="M90 220 Q92 236 91 254" fill="none" stroke={p.includes('panturrilha')?P_L:s.includes('panturrilha')?S_L:MUSC_B} strokeWidth="0.5" opacity="0.6"/>
      {/* Solear */}
      <Path d="M34 240 Q32 252 33 260 Q36 258 38 248 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Path d="M96 240 Q98 252 97 260 Q94 258 92 248 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.6"/>

      <Ellipse cx="40" cy="264" rx="11" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="90" cy="264" rx="11" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ENDOMORFO — FRENTE  (mais robusto, cintura menos definida)
// ═══════════════════════════════════════════════════════════════════════════════
function EndomorfoFrente({ p, s }) {
  const m = id => mc(id, p, s);
  return (
    <Svg width="140" height="300" viewBox="0 0 140 300">
      <Gradients muscIds={TODOS_MUSCULOS} primarios={p} secundarios={s}/>
      <Ellipse cx="70" cy="16" rx="15" ry="15" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.5"/>
      <Rect x="63" y="29" width="14" height="11" rx="4" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M44 40 Q70 33 96 40 L90 58 Q70 52 50 58 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      {/* Deltoides — muito largos */}
      <Path d="M26 48 Q14 56 14 72 Q18 80 30 76 Q40 66 44 54 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M114 48 Q126 56 126 72 Q122 80 110 76 Q100 66 96 54 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M48 58 Q55 52 70 56 Q70 70 67 78 Q58 75 48 66 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M92 58 Q85 52 70 56 Q70 70 73 78 Q82 75 92 66 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M70 56 L70 78" fill="none" stroke={MUSC_B} strokeWidth="0.6" opacity="0.7"/>
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <Path d="M49 58 Q58 52 70 55 Q62 60 52 59 Z" {...m('peitoral_sup')} strokeWidth="1"/>
        <Path d="M91 58 Q82 52 70 55 Q78 60 88 59 Z" {...m('peitoral_sup')} strokeWidth="1"/>
      </>}
      <Path d="M16 70 Q10 84 12 100 Q18 104 26 100 Q30 86 30 72 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M124 70 Q130 84 128 100 Q122 104 114 100 Q110 86 110 72 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M12 102 Q8 118 9 132 Q14 136 20 132 Q23 118 26 102 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M128 102 Q132 118 131 132 Q126 136 120 132 Q117 118 114 102 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      {/* Tronco largo */}
      <Path d="M48 58 L92 58 L98 128 L42 128 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.6"/>
      {/* Abs menos definidos no endomorfo */}
      <Path d="M70 78 L70 118" fill="none" stroke={MUSC_B} strokeWidth="0.7" opacity="0.5"/>
      <Path d="M57 86 Q63 84 70 86 Q77 84 83 86" fill="none" stroke={MUSC_B} strokeWidth="0.6" opacity="0.5"/>
      <Path d="M56 98 Q62 96 70 98 Q78 96 84 98" fill="none" stroke={MUSC_B} strokeWidth="0.5" opacity="0.4"/>
      <Path d="M57 78 Q63 76 70 78 L70 86 Q63 84 57 86 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M83 78 Q77 76 70 78 L70 86 Q77 84 83 86 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M56 86 Q62 84 70 86 L70 98 Q62 96 56 98 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.85"/>
      <Path d="M84 86 Q78 84 70 86 L70 98 Q78 96 84 98 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.85"/>
      <Path d="M44 62 Q40 78 42 108 Q39 107 40 76 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M96 62 Q100 78 98 108 Q101 107 100 76 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      {/* Quadril + largo */}
      <Path d="M42 126 Q36 136 34 152 L106 152 Q104 136 98 126 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.6"/>
      <Path d="M34 152 Q30 172 32 200 Q38 206 46 200 Q50 176 50 152 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Path d="M106 152 Q110 172 108 200 Q102 206 94 200 Q90 176 90 152 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Path d="M50 152 Q47 172 48 198 Q53 202 58 198 Q60 174 60 152 Z"
        fill={p.includes('quadriceps')?`url(#gp_quadriceps)`:s.includes('quadriceps')?`url(#gs_quadriceps)`:`url(#gi_quadriceps)`}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M90 152 Q93 172 92 198 Q87 202 82 198 Q80 174 80 152 Z"
        fill={p.includes('quadriceps')?`url(#gp_quadriceps)`:s.includes('quadriceps')?`url(#gs_quadriceps)`:`url(#gi_quadriceps)`}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M48 198 Q44 208 46 214 Q52 217 58 212 Q60 202 56 198 Z"
        fill={p.includes('quadriceps')?P_D:s.includes('quadriceps')?S_D:MUSC_D}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M92 198 Q96 208 94 214 Q88 217 82 212 Q80 202 84 198 Z"
        fill={p.includes('quadriceps')?P_D:s.includes('quadriceps')?S_D:MUSC_D}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Ellipse cx="46" cy="219" rx="10" ry="7" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="94" cy="219" rx="10" ry="7" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M36 225 Q32 246 34 264 Q40 268 47 264 Q50 244 50 225 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Path d="M104 225 Q108 246 106 264 Q100 268 93 264 Q90 244 90 225 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Ellipse cx="43" cy="270" rx="12" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="97" cy="270" rx="12" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
    </Svg>
  );
}

function EndomorfoCostas({ p, s }) {
  const m = id => mc(id, p, s);
  return (
    <Svg width="140" height="300" viewBox="0 0 140 300">
      <Gradients muscIds={TODOS_MUSCULOS} primarios={p} secundarios={s}/>
      <Ellipse cx="70" cy="16" rx="15" ry="15" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.5"/>
      <Rect x="63" y="29" width="14" height="11" rx="4" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M44 40 Q70 33 96 40 L92 66 Q70 58 48 66 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M70 36 L70 64" fill="none" stroke={p.includes('trapezio')?P_L:s.includes('trapezio')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.5"/>
      <Path d="M26 50 Q14 58 14 72 Q18 80 30 76 Q40 66 44 56 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M114 50 Q126 58 126 72 Q122 80 110 76 Q100 66 96 56 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M48 66 Q44 82 46 108 Q54 116 62 108 Q62 88 60 66 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M92 66 Q96 82 94 108 Q86 116 78 108 Q78 88 80 66 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M46 68 Q42 78 44 90 Q50 86 52 76 Z"
        fill={p.includes('dorsais')?P_D:s.includes('dorsais')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M94 68 Q98 78 96 90 Q90 86 88 76 Z"
        fill={p.includes('dorsais')?P_D:s.includes('dorsais')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M16 72 Q10 88 12 106 Q18 110 26 106 Q30 90 30 74 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M124 72 Q130 88 128 106 Q122 110 114 106 Q110 90 110 74 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M12 108 Q8 122 9 136 Q14 140 20 136 Q23 122 26 108 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M128 108 Q132 122 131 136 Q126 140 120 136 Q117 122 114 108 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M62 108 L60 130 Q64 134 68 130 L67 108 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      <Path d="M78 108 L80 130 Q76 134 72 130 L73 108 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      <Path d="M70 38 L70 132" fill="none" stroke={SKIN_B} strokeWidth="0.8" opacity="0.4"/>
      <Path d="M48 66 L92 66 L96 132 L44 132 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.5"/>
      {/* Glúteos grandes */}
      <Path d="M42 134 Q40 154 44 168 Q54 178 70 170 Q70 152 69 134 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M98 134 Q100 154 96 168 Q86 178 70 170 Q70 152 71 134 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M42 134 Q38 144 40 156 Q47 150 50 138 Z"
        fill={p.includes('gluteos')?P_D:s.includes('gluteos')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M98 134 Q102 144 100 156 Q93 150 90 138 Z"
        fill={p.includes('gluteos')?P_D:s.includes('gluteos')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M38 170 Q34 192 36 214 Q43 218 50 214 Q54 194 53 170 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M102 170 Q106 192 104 214 Q97 218 90 214 Q86 194 87 170 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M54 170 Q51 192 52 212 Q57 216 63 212 Q64 192 64 170 Z"
        fill={p.includes('isquiotibiais')?`url(#gp_isquiotibiais)`:s.includes('isquiotibiais')?`url(#gs_isquiotibiais)`:`url(#gi_isquiotibiais)`}
        stroke={p.includes('isquiotibiais')?P_L:s.includes('isquiotibiais')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.9"/>
      <Path d="M86 170 Q89 192 88 212 Q83 216 77 212 Q76 192 76 170 Z"
        fill={p.includes('isquiotibiais')?`url(#gp_isquiotibiais)`:s.includes('isquiotibiais')?`url(#gs_isquiotibiais)`:`url(#gi_isquiotibiais)`}
        stroke={p.includes('isquiotibiais')?P_L:s.includes('isquiotibiais')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.9"/>
      <Ellipse cx="45" cy="219" rx="9" ry="7" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="95" cy="219" rx="9" ry="7" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M34 225 Q30 246 32 264 Q38 268 45 264 Q48 244 47 225 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M106 225 Q110 246 108 264 Q102 268 95 264 Q92 244 93 225 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M43 228 Q41 242 42 258 Q45 254 47 240 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Path d="M97 228 Q99 242 98 258 Q95 254 93 240 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Ellipse cx="41" cy="270" rx="12" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="99" cy="270" rx="12" ry="5" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FEMININO — FRENTE (ampulheta/pêra, cintura definida)
// ═══════════════════════════════════════════════════════════════════════════════
function FemininoFrente({ p, s }) {
  const m = id => mc(id, p, s);
  return (
    <Svg width="120" height="300" viewBox="0 0 120 300">
      <Gradients muscIds={TODOS_MUSCULOS} primarios={p} secundarios={s}/>
      <Ellipse cx="60" cy="14" rx="12" ry="13" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.5"/>
      <Rect x="54" y="25" width="12" height="9" rx="3" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M40 33 Q60 27 80 33 L76 44 Q60 40 44 44 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M28 42 Q20 50 20 60 Q24 68 33 64 Q39 56 40 46 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M92 42 Q100 50 100 60 Q96 68 87 64 Q81 56 80 46 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      {/* Peitoral feminino com curva */}
      <Path d="M40 44 Q48 40 60 44 Q62 56 59 64 Q51 62 40 54 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M80 44 Q72 40 60 44 Q58 56 61 64 Q69 62 80 54 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M60 44 L60 64" fill="none" stroke={MUSC_B} strokeWidth="0.5" opacity="0.5"/>
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <Path d="M41 44 Q50 39 60 43 Q53 48 44 47 Z" {...m('peitoral_sup')} strokeWidth="1"/>
        <Path d="M79 44 Q70 39 60 43 Q67 48 76 47 Z" {...m('peitoral_sup')} strokeWidth="1"/>
      </>}
      <Path d="M19 58 Q14 70 16 82 Q20 86 26 82 Q29 70 28 60 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M101 58 Q106 70 104 82 Q100 86 94 82 Q91 70 92 60 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M16 84 Q12 96 13 108 Q17 111 22 108 Q25 96 26 84 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M104 84 Q108 96 107 108 Q103 111 98 108 Q95 96 94 84 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      {/* Cintura fina */}
      <Path d="M40 44 L80 44 L78 114 L42 114 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.6"/>
      <Path d="M60 64 L60 110" fill="none" stroke={MUSC_B} strokeWidth="0.6" opacity="0.5"/>
      <Path d="M51 72 Q56 70 60 72 Q64 70 69 72" fill="none" stroke={MUSC_B} strokeWidth="0.5" opacity="0.5"/>
      <Path d="M50 82 Q56 80 60 82 Q64 80 70 82" fill="none" stroke={MUSC_B} strokeWidth="0.5" opacity="0.4"/>
      <Path d="M51 64 Q56 62 60 64 L60 72 Q56 70 51 72 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M69 64 Q64 62 60 64 L60 72 Q64 70 69 72 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M50 72 Q56 70 60 72 L60 82 Q55 80 50 82 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.9"/>
      <Path d="M70 72 Q64 70 60 72 L60 82 Q65 80 70 82 Z" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.9"/>
      <Path d="M40 48 Q37 62 41 86 Q39 85 39 60 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M80 48 Q83 62 79 86 Q81 85 81 60 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      {/* Quadril mais largo — feminino */}
      <Path d="M42 112 Q36 120 34 136 L86 136 Q84 120 78 112 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.6"/>
      <Path d="M34 136 Q30 156 31 182 Q37 186 44 182 Q47 160 46 136 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Path d="M86 136 Q90 156 89 182 Q83 186 76 182 Q73 160 74 136 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Path d="M46 136 Q43 156 44 180 Q49 184 54 180 Q56 158 56 136 Z"
        fill={p.includes('quadriceps')?`url(#gp_quadriceps)`:s.includes('quadriceps')?`url(#gs_quadriceps)`:`url(#gi_quadriceps)`}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M74 136 Q77 156 76 180 Q71 184 66 180 Q64 158 64 136 Z"
        fill={p.includes('quadriceps')?`url(#gp_quadriceps)`:s.includes('quadriceps')?`url(#gs_quadriceps)`:`url(#gi_quadriceps)`}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M44 178 Q41 188 43 194 Q48 197 53 193 Q55 184 52 178 Z"
        fill={p.includes('quadriceps')?P_D:s.includes('quadriceps')?S_D:MUSC_D}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Path d="M76 178 Q79 188 77 194 Q72 197 67 193 Q65 184 68 178 Z"
        fill={p.includes('quadriceps')?P_D:s.includes('quadriceps')?S_D:MUSC_D}
        stroke={p.includes('quadriceps')?P_L:s.includes('quadriceps')?S_L:MUSC_B} strokeWidth="0.7"/>
      <Ellipse cx="40" cy="198" rx="8" ry="6" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="80" cy="198" rx="8" ry="6" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M32 204 Q29 224 30 244 Q35 248 42 244 Q44 224 44 204 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Path d="M88 204 Q91 224 90 244 Q85 248 78 244 Q76 224 76 204 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Ellipse cx="37" cy="250" rx="10" ry="4" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="83" cy="250" rx="10" ry="4" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
    </Svg>
  );
}

function FemininoCostas({ p, s }) {
  const m = id => mc(id, p, s);
  return (
    <Svg width="120" height="300" viewBox="0 0 120 300">
      <Gradients muscIds={TODOS_MUSCULOS} primarios={p} secundarios={s}/>
      <Ellipse cx="60" cy="14" rx="12" ry="13" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1.5"/>
      <Rect x="54" y="25" width="12" height="9" rx="3" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M40 33 Q60 27 80 33 L76 52 Q60 46 44 52 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M60 30 L60 50" fill="none" stroke={p.includes('trapezio')?P_L:s.includes('trapezio')?S_L:MUSC_B} strokeWidth="0.6" opacity="0.5"/>
      <Path d="M28 42 Q20 50 20 62 Q24 70 33 66 Q39 58 40 48 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M92 42 Q100 50 100 62 Q96 70 87 66 Q81 58 80 48 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M44 52 Q40 66 42 88 Q49 95 56 88 Q56 70 54 52 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M76 52 Q80 66 78 88 Q71 95 64 88 Q64 70 66 52 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M20 60 Q15 74 17 90 Q22 94 28 90 Q31 76 30 62 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M100 60 Q105 74 103 90 Q98 94 92 90 Q89 76 90 62 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M17 92 Q13 104 14 116 Q18 119 23 116 Q26 104 28 92 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M103 92 Q107 104 106 116 Q102 119 97 116 Q94 104 92 92 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M55 88 L53 110 Q57 114 61 110 L60 88 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      <Path d="M65 88 L67 110 Q63 114 59 110 L60 88 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      <Path d="M60 30 L60 112" fill="none" stroke={SKIN_B} strokeWidth="0.8" opacity="0.4"/>
      <Path d="M44 52 L76 52 L80 112 L40 112 Z" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="0.5"/>
      {/* Glúteos femininos bem definidos */}
      <Path d="M38 114 Q36 132 40 146 Q49 156 60 148 Q60 132 59 114 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M82 114 Q84 132 80 146 Q71 156 60 148 Q60 132 61 114 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M37 116 Q34 126 36 138 Q42 133 44 122 Z"
        fill={p.includes('gluteos')?P_D:s.includes('gluteos')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M83 116 Q86 126 84 138 Q78 133 76 122 Z"
        fill={p.includes('gluteos')?P_D:s.includes('gluteos')?S_D:MUSC_D} stroke="none" opacity="0.7"/>
      <Path d="M36 148 Q32 168 34 190 Q40 194 47 190 Q50 172 49 148 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M84 148 Q88 168 86 190 Q80 194 73 190 Q70 172 71 148 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M50 148 Q47 168 48 188 Q53 192 58 188 Q60 170 60 148 Z"
        fill={p.includes('isquiotibiais')?`url(#gp_isquiotibiais)`:s.includes('isquiotibiais')?`url(#gs_isquiotibiais)`:`url(#gi_isquiotibiais)`}
        stroke={p.includes('isquiotibiais')?P_L:s.includes('isquiotibiais')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.9"/>
      <Path d="M70 148 Q73 168 72 188 Q67 192 62 188 Q60 170 60 148 Z"
        fill={p.includes('isquiotibiais')?`url(#gp_isquiotibiais)`:s.includes('isquiotibiais')?`url(#gs_isquiotibiais)`:`url(#gi_isquiotibiais)`}
        stroke={p.includes('isquiotibiais')?P_L:s.includes('isquiotibiais')?S_L:MUSC_B} strokeWidth="0.7" opacity="0.9"/>
      <Ellipse cx="42" cy="195" rx="8" ry="6" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="78" cy="195" rx="8" ry="6" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Path d="M33 201 Q29 222 31 242 Q37 246 43 242 Q46 222 45 201 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M87 201 Q91 222 89 242 Q83 246 77 242 Q74 222 75 201 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M41 204 Q39 218 40 236 Q43 232 45 218 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Path d="M79 204 Q81 218 80 236 Q77 232 75 218 Z"
        fill={p.includes('panturrilha')?P_D:s.includes('panturrilha')?S_D:MUSC_D} stroke="none" opacity="0.6"/>
      <Ellipse cx="39" cy="248" rx="10" ry="4" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
      <Ellipse cx="81" cy="248" rx="10" ry="4" fill="url(#gSkin)" stroke={SKIN_B} strokeWidth="1"/>
    </Svg>
  );
}

// ─── Mapeamento biotipos ───────────────────────────────────────────────────────
const SILHUETAS = {
  ectomorfo:  { F: MesomorfoFrente, C: MesomorfoCostas },
  mesomorfo:  { F: MesomorfoFrente, C: MesomorfoCostas },
  endomorfo:  { F: EndomorfoFrente, C: EndomorfoCostas },
  ectomorfa:  { F: FemininoFrente,  C: FemininoCostas  },
  mesomorfa:  { F: FemininoFrente,  C: FemininoCostas  },
  endomorfa:  { F: EndomorfoFrente, C: EndomorfoCostas },
  ampulheta:  { F: FemininoFrente,  C: FemininoCostas  },
  pera:       { F: FemininoFrente,  C: FemininoCostas  },
  maca:       { F: EndomorfoFrente, C: EndomorfoCostas },
  retangular: { F: MesomorfoFrente, C: MesomorfoCostas },
};

// ─── Componente exportado ─────────────────────────────────────────────────────
export default function MuscleMapBiotipo({
  primarios   = [],
  secundarios = [],
  biotipo     = 'mesomorfo',
  escala      = 1,
  mostrarLegenda = true,
}) {
  const silhueta = SILHUETAS[biotipo] || SILHUETAS['mesomorfo'];
  const Frente   = silhueta.F;
  const Costas   = silhueta.C;
  const todos    = [...new Set([...primarios, ...secundarios])];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.lbl}>FRENTE</Text>
          <View style={{ transform: [{ scale: escala }] }}>
            <Frente p={primarios} s={secundarios}/>
          </View>
        </View>
        <View style={styles.col}>
          <Text style={styles.lbl}>COSTAS</Text>
          <View style={{ transform: [{ scale: escala }] }}>
            <Costas p={primarios} s={secundarios}/>
          </View>
        </View>
      </View>

      {mostrarLegenda && todos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.dot, { backgroundColor: P_L }]}/>
            <Text style={styles.legendaText}>Músculo principal</Text>
            <View style={[styles.dot, { backgroundColor: S_L, marginLeft: 14 }]}/>
            <Text style={styles.legendaText}>Auxiliar</Text>
          </View>
          <View style={styles.tags}>
            {primarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: P_L, backgroundColor: P_D+'33' }]}>
                <Text style={[styles.tagText, { color: P_L }]}>{id.replace(/_/g,' ')}</Text>
              </View>
            ))}
            {secundarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: S_L, backgroundColor: S_D+'33' }]}>
                <Text style={[styles.tagText, { color: S_L }]}>{id.replace(/_/g,' ')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'flex-start' },
  col: { alignItems: 'center' },
  lbl: { color: '#555', fontSize: 9, marginBottom: 4, letterSpacing: 1.5, fontWeight: '600' },
  legenda: { marginTop: 10, width: '100%' },
  legendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: 5 },
  legendaText: { color: '#888', fontSize: 11 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' },
  tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 10, fontWeight: '700' },
});
