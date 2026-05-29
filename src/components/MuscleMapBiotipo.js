import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Rect, G, Defs, RadialGradient, Stop } from 'react-native-svg';

const PELE        = '#2c2c3e';
const PELE_BORDA  = '#4a4a6a';
const MUSCULO_IN  = '#1e2040';
const MUSCULO_BD  = '#2e3060';
const PRIMARIO    = '#e94560';
const SECUNDARIO  = '#f39c12';
const BORDA_AT    = '#ffffff';

function c(id, p, s) {
  if (p.includes(id)) return { fill: PRIMARIO,   stroke: BORDA_AT,   sw: 1.2, op: 1   };
  if (s.includes(id)) return { fill: SECUNDARIO, stroke: BORDA_AT,   sw: 1.0, op: 0.9 };
  return               { fill: MUSCULO_IN,   stroke: MUSCULO_BD, sw: 0.8, op: 1   };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MASCULINO ENDOMORFO — frente (robusto, quadril e ombros largos)
// ═══════════════════════════════════════════════════════════════════════════════
function EndomorfoFrente({ p, s }) {
  const m = id => c(id, p, s);
  return (
    <Svg width="110" height="280" viewBox="0 0 110 280">
      {/* Cabeça */}
      <Ellipse cx="55" cy="16" rx="15" ry="15" fill={PELE} stroke={PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="49" y="29" width="12" height="9" rx="3" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      {/* Trapézio */}
      <Path d="M36 38 Q55 32 74 38 L68 52 Q55 47 42 52 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      {/* Deltoides */}
      <Path d="M27 48 Q20 52 19 64 Q22 70 30 68 Q36 60 37 50 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M83 48 Q90 52 91 64 Q88 70 80 68 Q74 60 73 50 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      {/* Peitoral esq */}
      <Path d="M41 52 Q48 48 55 52 Q55 64 53 70 Q46 68 41 62 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      {/* Peitoral dir */}
      <Path d="M69 52 Q62 48 55 52 Q55 64 57 70 Q64 68 69 62 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      {/* Peitoral sup highlight */}
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <Path d="M42 52 Q48 48 55 51 Q50 56 43 55 Z" {...m('peitoral_sup')} strokeWidth="1"/>
        <Path d="M68 52 Q62 48 55 51 Q60 56 67 55 Z" {...m('peitoral_sup')} strokeWidth="1"/>
      </>}
      {/* Bíceps */}
      <Path d="M20 64 Q15 74 17 86 Q22 89 27 86 Q30 75 30 66 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M90 64 Q95 74 93 86 Q88 89 83 86 Q80 75 80 66 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      {/* Tríceps (frente, leve) */}
      <Path d="M19 65 Q16 70 16 78 Q14 77 15 68 Z" {...m('triceps')} strokeWidth="0.8" opacity="0.5"/>
      <Path d="M91 65 Q94 70 94 78 Q96 77 95 68 Z" {...m('triceps')} strokeWidth="0.8" opacity="0.5"/>
      {/* Antebraço */}
      <Path d="M17 88 Q13 100 14 112 Q18 115 23 112 Q26 100 27 88 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M93 88 Q97 100 96 112 Q92 115 87 112 Q84 100 83 88 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      {/* Tronco */}
      <Path d="M40 52 L70 52 L74 118 L36 118 Z" fill={PELE} stroke={PELE_BORDA} strokeWidth="0.8"/>
      {/* Abdômen 6 pack */}
      <Rect x="46" y="67" width="8" height="7" rx="2" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="56" y="67" width="8" height="7" rx="2" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="45" y="76" width="8" height="7" rx="2" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.85"/>
      <Rect x="57" y="76" width="8" height="7" rx="2" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.85"/>
      <Rect x="44" y="85" width="8" height="6" rx="2" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.7"/>
      <Rect x="58" y="85" width="8" height="6" rx="2" {...m('abdomen')} strokeWidth={m('abdomen').sw} opacity="0.7"/>
      {/* Oblíquos */}
      <Path d="M38 56 Q35 72 34 98 Q31 97 33 70 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M72 56 Q75 72 76 98 Q79 97 77 70 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      {/* Quadril */}
      <Path d="M34 116 Q30 126 29 140 L81 140 Q80 126 76 116 Z" fill={PELE} stroke={PELE_BORDA} strokeWidth="0.8"/>
      {/* Quadríceps esq */}
      <Path d="M29 140 Q26 158 27 185 Q33 190 40 186 Q43 162 43 140 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      {/* Quadríceps dir */}
      <Path d="M81 140 Q84 158 83 185 Q77 190 70 186 Q67 162 67 140 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      {/* Detalhe vasto interno */}
      <Path d="M30 158 Q28 170 29 182 Q31 184 34 180 Q35 168 33 158 Z" fill={p.includes('quadriceps')?PRIMARIO:s.includes('quadriceps')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.7"/>
      <Path d="M80 158 Q82 170 81 182 Q79 184 76 180 Q75 168 77 158 Z" fill={p.includes('quadriceps')?PRIMARIO:s.includes('quadriceps')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.7"/>
      {/* Joelhos */}
      <Ellipse cx="35" cy="191" rx="9" ry="7" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="75" cy="191" rx="9" ry="7" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      {/* Tibial */}
      <Path d="M27 198 Q24 218 25 238 Q30 241 36 238 Q39 218 38 198 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Path d="M83 198 Q86 218 85 238 Q80 241 74 238 Q71 218 72 198 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      {/* Pés */}
      <Ellipse cx="32" cy="244" rx="11" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="78" cy="244" rx="11" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

function EndomorfoCostas({ p, s }) {
  const m = id => c(id, p, s);
  return (
    <Svg width="110" height="280" viewBox="0 0 110 280">
      <Ellipse cx="55" cy="16" rx="15" ry="15" fill={PELE} stroke={PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="49" y="29" width="12" height="9" rx="3" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      {/* Trapézio */}
      <Path d="M36 38 Q55 31 74 38 L70 62 Q55 55 40 62 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      {/* Deltoides post */}
      <Path d="M27 50 Q19 55 19 66 Q22 72 30 70 Q37 62 37 52 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M83 50 Q91 55 91 66 Q88 72 80 70 Q73 62 73 52 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      {/* Dorsais esq */}
      <Path d="M40 62 Q37 76 39 102 Q46 108 52 102 Q52 82 50 62 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      {/* Dorsais dir */}
      <Path d="M70 62 Q73 76 71 102 Q64 108 58 102 Q58 82 60 62 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      {/* Detalhe teres/infra */}
      <Path d="M39 64 Q36 72 38 82 Q42 78 43 68 Z" fill={p.includes('dorsais')?PRIMARIO:s.includes('dorsais')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.8"/>
      <Path d="M71 64 Q74 72 72 82 Q68 78 67 68 Z" fill={p.includes('dorsais')?PRIMARIO:s.includes('dorsais')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.8"/>
      {/* Tríceps */}
      <Path d="M20 52 Q15 64 17 78 Q22 82 28 78 Q30 66 30 54 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M90 52 Q95 64 93 78 Q88 82 82 78 Q80 66 80 54 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      {/* Antebraço */}
      <Path d="M17 80 Q13 92 14 104 Q18 107 23 104 Q26 92 28 80 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M93 80 Q97 92 96 104 Q92 107 87 104 Q84 92 82 80 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      {/* Lombar */}
      <Path d="M48 102 Q51 108 55 112 Q59 108 62 102 L65 122 Q55 127 45 122 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      {/* Glúteos */}
      <Path d="M32 124 Q32 142 36 154 Q44 160 55 154 Q55 138 54 124 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M78 124 Q78 142 74 154 Q66 160 55 154 Q55 138 56 124 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      {/* Detalhe glúteo médio */}
      <Path d="M32 124 Q30 132 33 140 Q38 136 40 126 Z" fill={p.includes('gluteos')?PRIMARIO:s.includes('gluteos')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.7"/>
      <Path d="M78 124 Q80 132 77 140 Q72 136 70 126 Z" fill={p.includes('gluteos')?PRIMARIO:s.includes('gluteos')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.7"/>
      {/* Isquiotibiais */}
      <Path d="M30 156 Q26 174 28 196 Q34 200 41 196 Q44 176 43 156 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M80 156 Q84 174 82 196 Q76 200 69 196 Q66 176 67 156 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      {/* Joelhos */}
      <Ellipse cx="36" cy="200" rx="8" ry="6" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="74" cy="200" rx="8" ry="6" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      {/* Panturrilha */}
      <Path d="M28 206 Q24 224 26 242 Q32 246 38 242 Q41 224 40 206 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M82 206 Q86 224 84 242 Q78 246 72 242 Q69 224 70 206 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      {/* Detalhe solear */}
      <Path d="M28 218 Q26 230 28 240 Q30 238 32 228 Z" fill={p.includes('panturrilha')?PRIMARIO:s.includes('panturrilha')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.6"/>
      <Path d="M82 218 Q84 230 82 240 Q80 238 78 228 Z" fill={p.includes('panturrilha')?PRIMARIO:s.includes('panturrilha')?SECUNDARIO:MUSCULO_IN} stroke={MUSCULO_BD} strokeWidth="0.6" opacity="0.6"/>
      <Ellipse cx="34" cy="248" rx="11" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="76" cy="248" rx="11" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MASCULINO ECTOMORFO — frente (magro, linear, membros finos)
// ═══════════════════════════════════════════════════════════════════════════════
function EctomorfoFrente({ p, s }) {
  const m = id => c(id, p, s);
  return (
    <Svg width="100" height="280" viewBox="0 0 100 280">
      <Ellipse cx="50" cy="15" rx="12" ry="13" fill={PELE} stroke={PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="44" y="26" width="12" height="9" rx="3" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M40 35 Q50 31 60 35 L57 44 Q50 41 43 44 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M30 44 Q24 50 24 60 Q27 66 34 63 Q38 55 39 46 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M70 44 Q76 50 76 60 Q73 66 66 63 Q62 55 61 46 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M42 44 Q47 41 50 44 Q50 56 47 61 Q42 57 42 50 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M58 44 Q53 41 50 44 Q50 56 53 61 Q58 57 58 50 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <Path d="M42 44 Q47 41 50 43 Q46 48 43 47 Z" {...m('peitoral_sup')} strokeWidth="1"/>
        <Path d="M58 44 Q53 41 50 43 Q54 48 57 47 Z" {...m('peitoral_sup')} strokeWidth="1"/>
      </>}
      <Path d="M22 58 Q18 68 19 80 Q23 83 28 80 Q30 70 30 60 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M78 58 Q82 68 81 80 Q77 83 72 80 Q70 70 70 60 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M19 82 Q15 94 16 106 Q20 109 25 106 Q27 94 28 82 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M81 82 Q85 94 84 106 Q80 109 75 106 Q73 94 72 82 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M41 44 L59 44 L62 114 L38 114 Z" fill={PELE} stroke={PELE_BORDA} strokeWidth="0.8"/>
      <Rect x="44" y="60" width="6" height="6" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="51" y="60" width="6" height="6" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="43" y="68" width="6" height="6" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="51" y="68" width="6" height="6" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="43" y="76" width="6" height="5" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="51" y="76" width="6" height="5" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M40 50 Q38 64 38 88 Q36 87 37 62 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M60 50 Q62 64 62 88 Q64 87 63 62 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M38 112 Q36 120 35 132 L65 132 Q64 120 62 112 Z" fill={PELE} stroke={PELE_BORDA} strokeWidth="0.8"/>
      <Path d="M35 132 Q32 150 33 178 Q38 182 44 178 Q46 154 46 132 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Path d="M65 132 Q68 150 67 178 Q62 182 56 178 Q54 154 54 132 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Ellipse cx="39" cy="183" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="61" cy="183" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M33 188 Q30 208 31 228 Q36 231 42 228 Q44 208 44 188 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Path d="M67 188 Q70 208 69 228 Q64 231 58 228 Q56 208 56 188 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Ellipse cx="37" cy="234" rx="10" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="63" cy="234" rx="10" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

function EctomorfoCostas({ p, s }) {
  const m = id => c(id, p, s);
  return (
    <Svg width="100" height="280" viewBox="0 0 100 280">
      <Ellipse cx="50" cy="15" rx="12" ry="13" fill={PELE} stroke={PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="44" y="26" width="12" height="9" rx="3" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M40 35 Q50 30 60 35 L58 52 Q50 48 42 52 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M30 46 Q23 52 23 62 Q26 68 33 65 Q38 57 39 48 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M70 46 Q77 52 77 62 Q74 68 67 65 Q62 57 61 48 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M41 52 Q38 66 40 90 Q46 96 50 90 Q50 72 49 52 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M59 52 Q62 66 60 90 Q54 96 50 90 Q50 72 51 52 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M22 48 Q17 60 18 74 Q23 77 28 74 Q30 62 30 50 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M78 48 Q83 60 82 74 Q77 77 72 74 Q70 62 70 50 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M18 76 Q14 88 15 100 Q19 103 24 100 Q26 88 28 76 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M82 76 Q86 88 85 100 Q81 103 76 100 Q74 88 72 76 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M46 90 Q48 96 50 100 Q52 96 54 90 L57 112 Q50 116 43 112 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      <Path d="M36 114 Q36 130 39 142 Q46 148 50 142 Q50 128 50 114 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M64 114 Q64 130 61 142 Q54 148 50 142 Q50 128 50 114 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M34 144 Q30 162 32 182 Q37 186 43 182 Q45 164 44 144 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M66 144 Q70 162 68 182 Q63 186 57 182 Q55 164 56 144 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Ellipse cx="38" cy="187" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="62" cy="187" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M31 192 Q28 212 30 230 Q35 234 41 230 Q43 212 43 192 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M69 192 Q72 212 70 230 Q65 234 59 230 Q57 212 57 192 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Ellipse cx="37" cy="236" rx="10" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="63" cy="236" rx="10" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FEMININO AMPULHETA — cintura definida, busto/quadril equilibrados
// ═══════════════════════════════════════════════════════════════════════════════
function AmpulhetaFrente({ p, s }) {
  const m = id => c(id, p, s);
  return (
    <Svg width="100" height="280" viewBox="0 0 100 280">
      <Ellipse cx="50" cy="14" rx="11" ry="12" fill={PELE} stroke={PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="45" y="24" width="10" height="8" rx="3" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M40 32 Q50 28 60 32 L57 40 Q50 38 43 40 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M30 40 Q24 46 25 56 Q28 62 35 59 Q39 51 40 42 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      <Path d="M70 40 Q76 46 75 56 Q72 62 65 59 Q61 51 60 42 Z" {...m('deltoides')} strokeWidth={m('deltoides').sw}/>
      {/* Peitoral feminino (curvas) */}
      <Path d="M40 40 Q46 37 50 40 Q52 52 49 58 Q43 55 40 48 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M60 40 Q54 37 50 40 Q48 52 51 58 Q57 55 60 48 Z" {...m('peitoral')} strokeWidth={m('peitoral').sw}/>
      <Path d="M23 54 Q19 64 21 74 Q25 77 30 74 Q32 64 30 56 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M77 54 Q81 64 79 74 Q75 77 70 74 Q68 64 70 56 Z" {...m('biceps')} strokeWidth={m('biceps').sw}/>
      <Path d="M21 76 Q17 86 18 96 Q22 99 26 96 Q28 86 30 76 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M79 76 Q83 86 82 96 Q78 99 74 96 Q72 86 70 76 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      {/* Cintura fina */}
      <Path d="M40 40 L60 40 L58 108 L42 108 Z" fill={PELE} stroke={PELE_BORDA} strokeWidth="0.8"/>
      <Rect x="44" y="58" width="5" height="5" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="51" y="58" width="5" height="5" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="44" y="65" width="5" height="5" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Rect x="51" y="65" width="5" height="5" rx="1.5" {...m('abdomen')} strokeWidth={m('abdomen').sw}/>
      <Path d="M40 46 Q38 58 42 78 Q40 77 39 58 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      <Path d="M60 46 Q62 58 58 78 Q60 77 61 58 Z" {...m('obliquo')} strokeWidth={m('obliquo').sw}/>
      {/* Quadril mais largo */}
      <Path d="M42 106 Q36 112 34 126 L66 126 Q64 112 58 106 Z" fill={PELE} stroke={PELE_BORDA} strokeWidth="0.8"/>
      <Path d="M34 126 Q31 144 32 168 Q37 172 43 168 Q45 148 45 126 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Path d="M66 126 Q69 144 68 168 Q63 172 57 168 Q55 148 55 126 Z" {...m('quadriceps')} strokeWidth={m('quadriceps').sw}/>
      <Ellipse cx="38" cy="173" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="62" cy="173" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M32 178 Q29 198 30 218 Q35 221 41 218 Q43 198 43 178 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Path d="M68 178 Q71 198 70 218 Q65 221 59 218 Q57 198 57 178 Z" {...m('tibial')} strokeWidth={m('tibial').sw}/>
      <Ellipse cx="36" cy="224" rx="9" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="64" cy="224" rx="9" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

function AmpulhetaCostas({ p, s }) {
  const m = id => c(id, p, s);
  return (
    <Svg width="100" height="280" viewBox="0 0 100 280">
      <Ellipse cx="50" cy="14" rx="11" ry="12" fill={PELE} stroke={PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="45" y="24" width="10" height="8" rx="3" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M40 32 Q50 27 60 32 L58 50 Q50 46 42 50 Z" {...m('trapezio')} strokeWidth={m('trapezio').sw}/>
      <Path d="M30 42 Q23 48 24 58 Q27 64 34 61 Q39 53 40 44 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M70 42 Q77 48 76 58 Q73 64 66 61 Q61 53 60 44 Z" {...m('deltoides_post')} strokeWidth={m('deltoides_post').sw}/>
      <Path d="M41 50 Q38 64 40 86 Q46 92 50 86 Q50 68 49 50 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M59 50 Q62 64 60 86 Q54 92 50 86 Q50 68 51 50 Z" {...m('dorsais')} strokeWidth={m('dorsais').sw}/>
      <Path d="M23 44 Q18 56 19 70 Q24 73 29 70 Q31 58 30 46 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M77 44 Q82 56 81 70 Q76 73 71 70 Q69 58 70 46 Z" {...m('triceps')} strokeWidth={m('triceps').sw}/>
      <Path d="M19 72 Q15 84 16 96 Q20 99 25 96 Q27 84 29 72 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M81 72 Q85 84 84 96 Q80 99 75 96 Q73 84 71 72 Z" {...m('antebraco')} strokeWidth={m('antebraco').sw}/>
      <Path d="M46 86 Q48 92 50 96 Q52 92 54 86 L56 108 Q50 112 44 108 Z" {...m('lombar')} strokeWidth={m('lombar').sw}/>
      {/* Glúteos femininos */}
      <Path d="M34 110 Q34 126 38 138 Q45 145 50 138 Q50 124 50 110 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M66 110 Q66 126 62 138 Q55 145 50 138 Q50 124 50 110 Z" {...m('gluteos')} strokeWidth={m('gluteos').sw}/>
      <Path d="M32 140 Q28 158 30 178 Q35 182 41 178 Q43 160 42 140 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Path d="M68 140 Q72 158 70 178 Q65 182 59 178 Q57 160 58 140 Z" {...m('isquiotibiais')} strokeWidth={m('isquiotibiais').sw}/>
      <Ellipse cx="36" cy="183" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="64" cy="183" rx="7" ry="5" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Path d="M29 188 Q26 208 28 226 Q33 230 39 226 Q41 208 41 188 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Path d="M71 188 Q74 208 72 226 Q67 230 61 226 Q59 208 59 188 Z" {...m('panturrilha')} strokeWidth={m('panturrilha').sw}/>
      <Ellipse cx="35" cy="232" rx="9" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="65" cy="232" rx="9" ry="4" fill={PELE} stroke={PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

// ─── Mapa de biotipos ─────────────────────────────────────────────────────────
const SILHUETAS = {
  ectomorfo:  { F: EctomorfoFrente, C: EctomorfoCostas },
  mesomorfo:  { F: EctomorfoFrente, C: EctomorfoCostas },
  endomorfo:  { F: EndomorfoFrente, C: EndomorfoCostas },
  ectomorfa:  { F: EctomorfoFrente, C: EctomorfoCostas },
  mesomorfa:  { F: AmpulhetaFrente, C: AmpulhetaCostas },
  endomorfa:  { F: EndomorfoFrente, C: EndomorfoCostas },
  ampulheta:  { F: AmpulhetaFrente, C: AmpulhetaCostas },
  pera:       { F: AmpulhetaFrente, C: AmpulhetaCostas },
  maca:       { F: EndomorfoFrente, C: EndomorfoCostas },
  retangular: { F: EctomorfoFrente, C: EctomorfoCostas },
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function MuscleMapBiotipo({
  primarios    = [],
  secundarios  = [],
  biotipo      = 'mesomorfo',
  escala       = 1,
  mostrarLegenda = true,
}) {
  const silhueta = SILHUETAS[biotipo] || SILHUETAS['mesomorfo'];
  const Frente = silhueta.F;
  const Costas = silhueta.C;
  const todos  = [...new Set([...primarios, ...secundarios])];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.lbl}>Frente</Text>
          <View style={{ transform: [{ scale: escala }] }}>
            <Frente p={primarios} s={secundarios} />
          </View>
        </View>
        <View style={styles.col}>
          <Text style={styles.lbl}>Costas</Text>
          <View style={{ transform: [{ scale: escala }] }}>
            <Costas p={primarios} s={secundarios} />
          </View>
        </View>
      </View>

      {mostrarLegenda && todos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.dot, { backgroundColor: PRIMARIO }]} />
            <Text style={styles.legendaText}>Principal</Text>
            <View style={[styles.dot, { backgroundColor: SECUNDARIO, marginLeft: 14 }]} />
            <Text style={styles.legendaText}>Auxiliar</Text>
          </View>
          <View style={styles.tags}>
            {primarios.map(m => (
              <View key={m} style={[styles.tag, { borderColor: PRIMARIO }]}>
                <Text style={[styles.tagText, { color: PRIMARIO }]}>{m.replace(/_/g, ' ')}</Text>
              </View>
            ))}
            {secundarios.map(m => (
              <View key={m} style={[styles.tag, { borderColor: SECUNDARIO }]}>
                <Text style={[styles.tagText, { color: SECUNDARIO }]}>{m.replace(/_/g, ' ')}</Text>
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
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  col: { alignItems: 'center' },
  lbl: { color: '#666', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  legenda: { marginTop: 8, width: '100%' },
  legendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: 5 },
  legendaText: { color: '#888', fontSize: 11 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' },
  tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 10, fontWeight: '600' },
});
