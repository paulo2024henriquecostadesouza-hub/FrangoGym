import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Rect, G } from 'react-native-svg';

const COR_INATIVO   = '#2a2a3e';
const COR_BORDA_IN  = '#3a3a5e';
const COR_PRIMARIO  = '#e94560';
const COR_SECUNDARIO= '#f39c12';
const COR_BORDA_AT  = '#fff';
const COR_PELE      = '#1e1e30';
const COR_PELE_BORDA= '#3a3a5e';

function cor(id, primarios, secundarios) {
  if (primarios.includes(id))   return { fill: COR_PRIMARIO,   stroke: COR_BORDA_AT };
  if (secundarios.includes(id)) return { fill: COR_SECUNDARIO, stroke: COR_BORDA_AT };
  return { fill: COR_INATIVO, stroke: COR_BORDA_IN };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASCULINO ECTOMORFO — corpo magro, linear, membros longos
// ═══════════════════════════════════════════════════════════════════════════════
function EctomorfoFrente({ primarios, secundarios }) {
  const m = id => cor(id, primarios, secundarios);
  return (
    <Svg width="100" height="260" viewBox="0 0 100 260">
      <Ellipse cx="50" cy="15" rx="11" ry="13" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="45" y="26" width="10" height="9" rx="3" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      {/* Trapézio — estreito */}
      <Path d="M43 35 Q50 32 57 35 L54 44 Q50 42 46 44 Z" fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1"/>
      {/* Deltoides */}
      <Ellipse cx="38" cy="50" rx="7" ry="9" fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1"/>
      <Ellipse cx="62" cy="50" rx="7" ry="9" fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1"/>
      {/* Peitoral — fino */}
      <Path d="M46 44 Q49 42 50 45 Q50 53 47 56 Q43 53 43 47 Z" fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1"/>
      <Path d="M54 44 Q51 42 50 45 Q50 53 53 56 Q57 53 57 47 Z" fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1"/>
      {/* Peitoral superior highlight */}
      {(primarios.includes('peitoral_sup')||secundarios.includes('peitoral_sup')) && <>
        <Path d="M46 44 Q49 42 50 44 Q48 47 46 46 Z" fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth="1"/>
        <Path d="M54 44 Q51 42 50 44 Q52 47 54 46 Z" fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth="1"/>
      </>}
      {/* Bíceps — longos */}
      <Path d="M32 50 Q29 58 30 70 Q33 72 36 70 Q38 58 38 50 Z" fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1"/>
      <Path d="M68 50 Q71 58 70 70 Q67 72 64 70 Q62 58 62 50 Z" fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1"/>
      {/* Tríceps (frontal) */}
      <Path d="M31 51 Q29 55 29 62 Q27 62 28 55 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1" opacity="0.6"/>
      <Path d="M69 51 Q71 55 71 62 Q73 62 72 55 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1" opacity="0.6"/>
      {/* Antebraço */}
      <Path d="M30 72 Q27 82 28 92 Q31 94 34 92 Q36 82 36 72 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M70 72 Q73 82 72 92 Q69 94 66 92 Q64 82 64 72 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      {/* Tronco estreito */}
      <Path d="M43 44 L57 44 L60 105 L40 105 Z" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      {/* Abdômen */}
      <Rect x="44" y="57" width="7" height="6" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="52" y="57" width="7" height="6" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="44" y="65" width="7" height="6" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="52" y="65" width="7" height="6" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="44" y="73" width="7" height="6" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="52" y="73" width="7" height="6" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      {/* Oblíquos */}
      <Path d="M43 52 Q41 65 40 85 Q38 85 39 65 Z" fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1"/>
      <Path d="M57 52 Q59 65 60 85 Q62 85 61 65 Z" fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1"/>
      {/* Quadril estreito */}
      <Path d="M40 103 Q38 110 37 122 L63 122 Q62 110 60 103 Z" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      {/* Quadríceps — longos e finos */}
      <Path d="M37 122 Q35 138 36 165 Q40 168 44 165 Q46 142 45 122 Z" fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1"/>
      <Path d="M63 122 Q65 138 64 165 Q60 168 56 165 Q54 142 55 122 Z" fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1"/>
      {/* Joelhos */}
      <Ellipse cx="40" cy="170" rx="6" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="60" cy="170" rx="6" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      {/* Tibial */}
      <Path d="M36 175 Q34 193 35 210 Q38 212 42 210 Q44 193 44 175 Z" fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1"/>
      <Path d="M64 175 Q66 193 65 210 Q62 212 58 210 Q56 193 56 175 Z" fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1"/>
      <Ellipse cx="39" cy="216" rx="8" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="61" cy="216" rx="8" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

function EctomorfoCostas({ primarios, secundarios }) {
  const m = id => cor(id, primarios, secundarios);
  return (
    <Svg width="100" height="260" viewBox="0 0 100 260">
      <Ellipse cx="50" cy="15" rx="11" ry="13" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="45" y="26" width="10" height="9" rx="3" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M43 35 Q50 31 57 35 L55 52 Q50 48 45 52 Z" fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1"/>
      <Ellipse cx="38" cy="52" rx="7" ry="9" fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1"/>
      <Ellipse cx="62" cy="52" rx="7" ry="9" fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1"/>
      <Path d="M43 52 Q41 65 43 88 Q48 93 50 88 Q50 70 48 52 Z" fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1"/>
      <Path d="M57 52 Q59 65 57 88 Q52 93 50 88 Q50 70 52 52 Z" fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1"/>
      <Path d="M32 52 Q28 62 29 74 Q33 76 37 74 Q38 62 38 52 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1"/>
      <Path d="M68 52 Q72 62 71 74 Q67 76 63 74 Q62 62 62 52 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1"/>
      <Path d="M29 76 Q26 86 27 96 Q30 98 33 96 Q35 86 37 76 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M71 76 Q74 86 73 96 Q70 98 67 96 Q65 86 63 76 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M47 88 Q49 92 50 96 Q51 92 53 88 L55 105 Q50 108 45 105 Z" fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth="1"/>
      <Path d="M38 108 Q39 122 41 132 Q47 136 50 132 Q50 120 50 108 Z" fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1"/>
      <Path d="M62 108 Q61 122 59 132 Q53 136 50 132 Q50 120 50 108 Z" fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1"/>
      <Path d="M37 134 Q34 148 35 168 Q39 171 43 168 Q45 150 44 134 Z" fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1"/>
      <Path d="M63 134 Q66 148 65 168 Q61 171 57 168 Q55 150 56 134 Z" fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1"/>
      <Ellipse cx="40" cy="173" rx="6" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="60" cy="173" rx="6" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M34 177 Q31 194 33 212 Q37 215 42 212 Q44 195 44 177 Z" fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1"/>
      <Path d="M66 177 Q69 194 67 212 Q63 215 58 212 Q56 195 56 177 Z" fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1"/>
      <Ellipse cx="39" cy="218" rx="8" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="61" cy="218" rx="8" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASCULINO ENDOMORFO — robusto, ombros/quadril largos, barriga presente
// ═══════════════════════════════════════════════════════════════════════════════
function EndomorfoFrente({ primarios, secundarios }) {
  const m = id => cor(id, primarios, secundarios);
  return (
    <Svg width="100" height="260" viewBox="0 0 100 260">
      <Ellipse cx="50" cy="16" rx="14" ry="15" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="44" y="29" width="12" height="9" rx="3" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M38 38 Q50 33 62 38 L58 48 Q50 45 42 48 Z" fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1.2"/>
      <Ellipse cx="31" cy="54" rx="11" ry="12" fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1.2"/>
      <Ellipse cx="69" cy="54" rx="11" ry="12" fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1.2"/>
      <Path d="M41 48 Q47 45 50 49 Q50 63 45 67 Q39 63 38 55 Z" fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1.2"/>
      <Path d="M59 48 Q53 45 50 49 Q50 63 55 67 Q61 63 62 55 Z" fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1.2"/>
      <Path d="M23 54 Q19 64 20 77 Q24 80 29 77 Q31 66 31 54 Z" fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1.2"/>
      <Path d="M77 54 Q81 64 80 77 Q76 80 71 77 Q69 66 69 54 Z" fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1.2"/>
      <Path d="M20 79 Q17 90 18 102 Q22 105 26 102 Q28 90 29 79 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M80 79 Q83 90 82 102 Q78 105 74 102 Q72 90 71 79 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      {/* Tronco mais largo com barriga */}
      <Path d="M38 48 L62 48 L68 115 L32 115 Z" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      {/* Abdômen menos definido no endomorfo */}
      <Rect x="44" y="63" width="7" height="6" rx="2" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" opacity="0.8"/>
      <Rect x="52" y="63" width="7" height="6" rx="2" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" opacity="0.8"/>
      <Rect x="43" y="71" width="7" height="6" rx="2" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" opacity="0.7"/>
      <Rect x="51" y="71" width="7" height="6" rx="2" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" opacity="0.7"/>
      {/* Oblíquos mais largos */}
      <Path d="M38 55 Q35 70 32 95 Q29 95 31 70 Z" fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1"/>
      <Path d="M62 55 Q65 70 68 95 Q71 95 69 70 Z" fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1"/>
      {/* Quadril mais largo */}
      <Path d="M32 113 Q29 122 28 135 L72 135 Q71 122 68 113 Z" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      {/* Quadríceps — mais grossos */}
      <Path d="M28 135 Q25 152 26 178 Q32 182 38 178 Q40 156 40 135 Z" fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1.2"/>
      <Path d="M72 135 Q75 152 74 178 Q68 182 62 178 Q60 156 60 135 Z" fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1.2"/>
      <Ellipse cx="33" cy="183" rx="8" ry="6" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="67" cy="183" rx="8" ry="6" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M27 189 Q24 207 26 225 Q31 228 37 225 Q39 207 39 189 Z" fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1"/>
      <Path d="M73 189 Q76 207 74 225 Q69 228 63 225 Q61 207 61 189 Z" fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1"/>
      <Ellipse cx="33" cy="231" rx="10" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="67" cy="231" rx="10" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

function EndomorfoCostas({ primarios, secundarios }) {
  const m = id => cor(id, primarios, secundarios);
  return (
    <Svg width="100" height="260" viewBox="0 0 100 260">
      <Ellipse cx="50" cy="16" rx="14" ry="15" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="44" y="29" width="12" height="9" rx="3" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M38 38 Q50 32 62 38 L60 58 Q50 53 40 58 Z" fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1.2"/>
      <Ellipse cx="31" cy="56" rx="11" ry="12" fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1.2"/>
      <Ellipse cx="69" cy="56" rx="11" ry="12" fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1.2"/>
      <Path d="M40 58 Q37 72 39 96 Q46 102 50 96 Q50 78 48 58 Z" fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1.2"/>
      <Path d="M60 58 Q63 72 61 96 Q54 102 50 96 Q50 78 52 58 Z" fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1.2"/>
      <Path d="M22 54 Q18 66 19 80 Q24 83 29 80 Q31 68 31 56 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1.2"/>
      <Path d="M78 54 Q82 66 81 80 Q76 83 71 80 Q69 68 69 56 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1.2"/>
      <Path d="M19 82 Q16 94 17 106 Q21 108 25 106 Q27 94 29 82 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M81 82 Q84 94 83 106 Q79 108 75 106 Q73 94 71 82 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M46 96 Q48 102 50 106 Q52 102 54 96 L57 115 Q50 120 43 115 Z" fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth="1.2"/>
      {/* Glúteos mais largos */}
      <Path d="M30 118 Q31 135 34 148 Q42 154 50 148 Q50 133 50 118 Z" fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1.2"/>
      <Path d="M70 118 Q69 135 66 148 Q58 154 50 148 Q50 133 50 118 Z" fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1.2"/>
      <Path d="M28 150 Q25 166 26 186 Q32 190 38 186 Q40 168 40 150 Z" fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1.2"/>
      <Path d="M72 150 Q75 166 74 186 Q68 190 62 186 Q60 168 60 150 Z" fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1.2"/>
      <Ellipse cx="33" cy="191" rx="8" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="67" cy="191" rx="8" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M25 196 Q22 214 24 228 Q29 232 35 228 Q37 215 37 196 Z" fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1.2"/>
      <Path d="M75 196 Q78 214 76 228 Q71 232 65 228 Q63 215 63 196 Z" fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1.2"/>
      <Ellipse cx="31" cy="234" rx="10" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="69" cy="234" rx="10" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEMININO AMPULHETA — busto e quadril equilibrados, cintura definida
// ═══════════════════════════════════════════════════════════════════════════════
function AmpulhetaFrente({ primarios, secundarios }) {
  const m = id => cor(id, primarios, secundarios);
  return (
    <Svg width="100" height="260" viewBox="0 0 100 260">
      <Ellipse cx="50" cy="14" rx="11" ry="13" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="45" y="25" width="10" height="8" rx="3" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M42 33 Q50 30 58 33 L55 42 Q50 40 45 42 Z" fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1"/>
      <Ellipse cx="37" cy="50" rx="9" ry="10" fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1"/>
      <Ellipse cx="63" cy="50" rx="9" ry="10" fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1"/>
      {/* Peitoral feminino */}
      <Path d="M44 42 Q47 40 50 42 Q53 52 48 58 Q43 54 42 48 Z" fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1"/>
      <Path d="M56 42 Q53 40 50 42 Q47 52 52 58 Q57 54 58 48 Z" fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1"/>
      <Path d="M30 50 Q27 58 28 68 Q31 70 34 68 Q36 58 37 50 Z" fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1"/>
      <Path d="M70 50 Q73 58 72 68 Q69 70 66 68 Q64 58 63 50 Z" fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1"/>
      <Path d="M28 70 Q25 80 26 90 Q29 92 32 90 Q34 80 34 70 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M72 70 Q75 80 74 90 Q71 92 68 90 Q66 80 66 70 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      {/* Cintura bem definida */}
      <Path d="M42 42 L58 42 L56 100 L44 100 Z" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Rect x="44" y="60" width="6" height="5" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="51" y="60" width="6" height="5" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="44" y="67" width="6" height="5" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Rect x="51" y="67" width="6" height="5" rx="1.5" fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1"/>
      <Path d="M42 50 Q40 64 44 82 Q42 82 41 64 Z" fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1"/>
      <Path d="M58 50 Q60 64 56 82 Q58 82 59 64 Z" fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1"/>
      {/* Quadril mais largo que a cintura */}
      <Path d="M44 98 Q38 105 36 120 L64 120 Q62 105 56 98 Z" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M36 120 Q33 136 34 162 Q39 165 44 162 Q46 140 45 120 Z" fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1"/>
      <Path d="M64 120 Q67 136 66 162 Q61 165 56 162 Q54 140 55 120 Z" fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1"/>
      <Ellipse cx="39" cy="167" rx="7" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="61" cy="167" rx="7" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M34 172 Q32 190 33 208 Q37 210 42 208 Q44 190 44 172 Z" fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1"/>
      <Path d="M66 172 Q68 190 67 208 Q63 210 58 208 Q56 190 56 172 Z" fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1"/>
      <Ellipse cx="38" cy="214" rx="9" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="62" cy="214" rx="9" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

function AmpulhetaCostas({ primarios, secundarios }) {
  const m = id => cor(id, primarios, secundarios);
  return (
    <Svg width="100" height="260" viewBox="0 0 100 260">
      <Ellipse cx="50" cy="14" rx="11" ry="13" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1.5"/>
      <Rect x="45" y="25" width="10" height="8" rx="3" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M42 33 Q50 29 58 33 L56 50 Q50 46 44 50 Z" fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1"/>
      <Ellipse cx="37" cy="52" rx="9" ry="10" fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1"/>
      <Ellipse cx="63" cy="52" rx="9" ry="10" fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1"/>
      <Path d="M44 50 Q42 63 43 86 Q48 90 50 86 Q50 68 48 50 Z" fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1"/>
      <Path d="M56 50 Q58 63 57 86 Q52 90 50 86 Q50 68 52 50 Z" fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1"/>
      <Path d="M29 50 Q26 60 27 72 Q31 74 35 72 Q36 62 37 52 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1"/>
      <Path d="M71 50 Q74 60 73 72 Q69 74 65 72 Q64 62 63 52 Z" fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1"/>
      <Path d="M27 74 Q24 84 25 94 Q28 96 31 94 Q33 84 35 74 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M73 74 Q76 84 75 94 Q72 96 69 94 Q67 84 65 74 Z" fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1"/>
      <Path d="M46 86 Q48 90 50 94 Q52 90 54 86 L56 102 Q50 106 44 102 Z" fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth="1"/>
      {/* Glúteos femininos */}
      <Path d="M36 106 Q37 120 40 132 Q46 138 50 132 Q50 118 50 106 Z" fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1.2"/>
      <Path d="M64 106 Q63 120 60 132 Q54 138 50 132 Q50 118 50 106 Z" fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1.2"/>
      <Path d="M34 134 Q31 150 32 170 Q37 173 42 170 Q44 153 43 134 Z" fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1"/>
      <Path d="M66 134 Q69 150 68 170 Q63 173 58 170 Q56 153 57 134 Z" fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1"/>
      <Ellipse cx="38" cy="175" rx="7" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="62" cy="175" rx="7" ry="5" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Path d="M32 180 Q29 198 31 215 Q35 218 40 215 Q42 198 42 180 Z" fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1"/>
      <Path d="M68 180 Q71 198 69 215 Q65 218 60 215 Q58 198 58 180 Z" fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1"/>
      <Ellipse cx="37" cy="221" rx="9" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
      <Ellipse cx="63" cy="221" rx="9" ry="4" fill={COR_PELE} stroke={COR_PELE_BORDA} strokeWidth="1"/>
    </Svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAPEAMENTO de biotipo → componente
// ═══════════════════════════════════════════════════════════════════════════════
const SILHUETAS = {
  // Masculino
  ectomorfo:  { frente: EctomorfoFrente,  costas: EctomorfoCostas,  label: 'Ectomorfo' },
  mesomorfo:  { frente: EctomorfoFrente,  costas: EctomorfoCostas,  label: 'Mesomorfo' }, // base similar, mais definido
  endomorfo:  { frente: EndomorfoFrente,  costas: EndomorfoCostas,  label: 'Endomorfo' },
  // Feminino
  ectomorfa:  { frente: EctomorfoFrente,  costas: EctomorfoCostas,  label: 'Ectomorfa' },
  mesomorfa:  { frente: AmpulhetaFrente,  costas: AmpulhetaCostas,  label: 'Mesomorfa' },
  endomorfa:  { frente: EndomorfoFrente,  costas: EndomorfoCostas,  label: 'Endomorfa' },
  ampulheta:  { frente: AmpulhetaFrente,  costas: AmpulhetaCostas,  label: 'Ampulheta' },
  pera:       { frente: AmpulhetaFrente,  costas: AmpulhetaCostas,  label: 'Pêra'      }, // quadril > ombros
  maca:       { frente: EndomorfoFrente,  costas: EndomorfoCostas,  label: 'Maçã'      },
  retangular: { frente: EctomorfoFrente,  costas: EctomorfoCostas,  label: 'Retangular'},
};

export const MUSCULOS_MAP = {
  peitoral: 'frente', peitoral_sup: 'frente', deltoides: 'frente',
  biceps: 'frente', antebraco: 'frente', abdomen: 'frente', obliquo: 'frente',
  quadriceps: 'frente', tibial: 'frente',
  trapezio: 'costas', deltoides_post: 'costas', dorsais: 'costas',
  triceps: 'costas', lombar: 'costas', gluteos: 'costas',
  isquiotibiais: 'costas', panturrilha: 'costas',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function MuscleMapBiotipo({
  primarios = [],
  secundarios = [],
  biotipo = 'mesomorfo',
  escala = 1,
  mostrarLegenda = true,
}) {
  const silhueta = SILHUETAS[biotipo] || SILHUETAS['mesomorfo'];
  const Frente = silhueta.frente;
  const Costas = silhueta.costas;

  const todosMusculos = [...new Set([...primarios, ...secundarios])];

  return (
    <View style={styles.container}>
      <View style={styles.corposRow}>
        <View style={styles.corpoCol}>
          <Text style={styles.label}>Frente</Text>
          <View style={{ transform: [{ scale: escala }], transformOrigin: 'top center' }}>
            <Frente primarios={primarios} secundarios={secundarios} />
          </View>
        </View>
        <View style={styles.corpoCol}>
          <Text style={styles.label}>Costas</Text>
          <View style={{ transform: [{ scale: escala }], transformOrigin: 'top center' }}>
            <Costas primarios={primarios} secundarios={secundarios} />
          </View>
        </View>
      </View>

      {mostrarLegenda && todosMusculos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.dot, { backgroundColor: COR_PRIMARIO }]} />
            <Text style={styles.legendaText}>Principal</Text>
            <View style={[styles.dot, { backgroundColor: COR_SECUNDARIO, marginLeft: 14 }]} />
            <Text style={styles.legendaText}>Auxiliar</Text>
          </View>
          <View style={styles.tags}>
            {primarios.map(m => (
              <View key={m} style={[styles.tag, { borderColor: COR_PRIMARIO }]}>
                <Text style={[styles.tagText, { color: COR_PRIMARIO }]}>{m.replace('_', ' ')}</Text>
              </View>
            ))}
            {secundarios.map(m => (
              <View key={m} style={[styles.tag, { borderColor: COR_SECUNDARIO }]}>
                <Text style={[styles.tagText, { color: COR_SECUNDARIO }]}>{m.replace('_', ' ')}</Text>
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
  corposRow: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  corpoCol: { alignItems: 'center' },
  label: { color: '#888', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  legenda: { marginTop: 10, width: '100%' },
  legendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendaText: { color: '#888', fontSize: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, backgroundColor: 'transparent' },
  tagText: { fontSize: 11, fontWeight: '600' },
});
