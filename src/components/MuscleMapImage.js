import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, G } from 'react-native-svg';

// Tamanho fixo de exibição da imagem
const IMG_W = 320;
const IMG_H = 560;

// Cores de highlight com transparência
const COR_PRIMARIO   = 'rgba(233, 69, 96, 0.55)';
const COR_SECUNDARIO = 'rgba(243, 156, 18, 0.50)';
const COR_BORDA_P    = 'rgba(255, 100, 120, 0.9)';
const COR_BORDA_S    = 'rgba(255, 200, 60, 0.9)';

function fillMuscle(id, primarios, secundarios) {
  if (primarios.includes(id))   return { fill: COR_PRIMARIO,   stroke: COR_BORDA_P, sw: 1.5 };
  if (secundarios.includes(id)) return { fill: COR_SECUNDARIO, stroke: COR_BORDA_S, sw: 1.2 };
  return { fill: 'transparent', stroke: 'transparent', sw: 0 };
}

// ─── Overlay SVG com regiões musculares ──────────────────────────────────────
// A imagem tem frente (lado esquerdo) e costas (lado direito)
// Coordenadas calibradas para 320x560px
function MuscleOverlay({ primarios, secundarios }) {
  const m = id => fillMuscle(id, primarios, secundarios);

  return (
    <Svg
      width={IMG_W}
      height={IMG_H}
      viewBox={`0 0 ${IMG_W} ${IMG_H}`}
      style={StyleSheet.absoluteFillObject}
    >
      {/* ════════════════════════════════════════════════
          FRENTE — lado esquerdo da imagem (~x: 0-155)
          ════════════════════════════════════════════════ */}

      {/* Trapézio frente */}
      <Path d="M42 66 Q77 58 112 66 L106 84 Q77 78 48 84 Z"
        fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth={m('trapezio').sw}/>

      {/* Deltoides anterior esquerdo */}
      <Path d="M22 68 Q14 76 14 92 Q20 98 30 94 Q36 82 38 70 Z"
        fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth={m('deltoides').sw}/>
      {/* Deltoides anterior direito */}
      <Path d="M116 68 Q124 76 124 92 Q118 98 108 94 Q102 82 100 70 Z"
        fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth={m('deltoides').sw}/>

      {/* Peitoral esquerdo */}
      <Path d="M46 84 Q60 78 77 82 Q77 100 74 110 Q62 108 46 98 Z"
        fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth={m('peitoral').sw}/>
      {/* Peitoral direito */}
      <Path d="M108 84 Q94 78 77 82 Q77 100 80 110 Q92 108 108 98 Z"
        fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth={m('peitoral').sw}/>
      {/* Peitoral superior */}
      {(primarios.includes('peitoral_sup') || secundarios.includes('peitoral_sup')) && <>
        <Path d="M47 84 Q62 78 77 82 Q68 88 50 87 Z"
          fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth={m('peitoral_sup').sw}/>
        <Path d="M107 84 Q92 78 77 82 Q86 88 104 87 Z"
          fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth={m('peitoral_sup').sw}/>
      </>}

      {/* Bíceps esquerdo */}
      <Path d="M13 92 Q8 108 10 126 Q16 130 24 126 Q28 110 28 94 Z"
        fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth={m('biceps').sw}/>
      {/* Bíceps direito */}
      <Path d="M141 92 Q146 108 144 126 Q138 130 130 126 Q126 110 126 94 Z"
        fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth={m('biceps').sw}/>

      {/* Antebraço esquerdo */}
      <Path d="M10 128 Q6 148 7 168 Q12 172 20 168 Q24 148 24 128 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth={m('antebraco').sw}/>
      {/* Antebraço direito */}
      <Path d="M144 128 Q148 148 147 168 Q142 172 134 168 Q130 148 130 128 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth={m('antebraco').sw}/>

      {/* Abdômen */}
      <Path d="M54 110 Q66 106 77 110 Q88 106 100 110 L100 170 Q88 174 77 170 Q66 174 54 170 Z"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth={m('abdomen').sw}/>

      {/* Oblíquos */}
      <Path d="M44 98 Q40 118 42 148 Q38 146 40 116 Z"
        fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth={m('obliquo').sw}/>
      <Path d="M110 98 Q114 118 112 148 Q116 146 114 116 Z"
        fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth={m('obliquo').sw}/>

      {/* Quadríceps esquerdo */}
      <Path d="M42 182 Q36 210 38 252 Q46 258 56 252 Q60 218 58 182 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth={m('quadriceps').sw}/>
      {/* Quadríceps direito */}
      <Path d="M112 182 Q118 210 116 252 Q108 258 98 252 Q94 218 96 182 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth={m('quadriceps').sw}/>

      {/* Tibial anterior esquerdo */}
      <Path d="M38 266 Q34 292 36 318 Q42 322 48 318 Q52 292 50 266 Z"
        fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth={m('tibial').sw}/>
      {/* Tibial anterior direito */}
      <Path d="M116 266 Q120 292 118 318 Q112 322 106 318 Q102 292 104 266 Z"
        fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth={m('tibial').sw}/>

      {/* ════════════════════════════════════════════════
          COSTAS — lado direito da imagem (~x: 165-320)
          ════════════════════════════════════════════════ */}

      {/* Trapézio costas */}
      <Path d="M178 62 Q242 54 306 62 L298 84 Q242 76 186 84 Z"
        fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth={m('trapezio').sw}/>

      {/* Deltoides posterior esquerdo */}
      <Path d="M170 68 Q160 76 160 92 Q166 98 178 94 Q184 82 184 70 Z"
        fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth={m('deltoides_post').sw}/>
      {/* Deltoides posterior direito */}
      <Path d="M314 68 Q320 76 320 92 Q314 98 302 94 Q296 82 296 70 Z"
        fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth={m('deltoides_post').sw}/>

      {/* Dorsais esquerdo (latíssimo) */}
      <Path d="M184 84 Q178 108 182 148 Q196 158 210 148 Q210 118 206 84 Z"
        fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth={m('dorsais').sw}/>
      {/* Dorsais direito */}
      <Path d="M300 84 Q306 108 302 148 Q288 158 274 148 Q274 118 278 84 Z"
        fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth={m('dorsais').sw}/>

      {/* Tríceps esquerdo */}
      <Path d="M160 90 Q154 108 156 126 Q162 130 170 126 Q174 108 176 92 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth={m('triceps').sw}/>
      {/* Tríceps direito */}
      <Path d="M320 90 Q326 108 324 126 Q318 130 310 126 Q306 108 304 92 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth={m('triceps').sw}/>

      {/* Lombar / Eretor */}
      <Path d="M226 148 Q222 168 224 188 Q232 194 242 188 Q242 168 240 148 Z"
        fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth={m('lombar').sw}/>
      <Path d="M258 148 Q262 168 260 188 Q252 194 244 188 Q244 168 244 148 Z"
        fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth={m('lombar').sw}/>

      {/* Glúteos */}
      <Path d="M188 192 Q182 220 188 242 Q206 256 242 248 Q242 220 240 192 Z"
        fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth={m('gluteos').sw}/>
      <Path d="M296 192 Q302 220 296 242 Q278 256 244 248 Q244 220 244 192 Z"
        fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth={m('gluteos').sw}/>

      {/* Isquiotibiais esquerdo */}
      <Path d="M186 254 Q180 280 182 318 Q192 324 204 318 Q208 284 206 254 Z"
        fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth={m('isquiotibiais').sw}/>
      {/* Isquiotibiais direito */}
      <Path d="M298 254 Q304 280 302 318 Q292 324 280 318 Q276 284 278 254 Z"
        fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth={m('isquiotibiais').sw}/>

      {/* Panturrilha esquerda */}
      <Path d="M184 328 Q178 356 180 388 Q190 396 202 390 Q208 360 206 328 Z"
        fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth={m('panturrilha').sw}/>
      {/* Panturrilha direita */}
      <Path d="M300 328 Q306 356 304 388 Q294 396 282 390 Q276 360 278 328 Z"
        fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth={m('panturrilha').sw}/>

    </Svg>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function MuscleMapImage({
  primarios   = [],
  secundarios = [],
  escala      = 1,
  mostrarLegenda = true,
}) {
  const largura  = IMG_W * escala;
  const altura   = IMG_H * escala;

  const todos = [...new Set([...primarios, ...secundarios])];
  const P_L = '#ff5070';
  const S_L = '#ffc040';
  const P_D = '#c01030';
  const S_D = '#b06000';

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { width: largura, height: altura }]}>
        <Image
          source={require('../../assets/avatar_masculino.jpg')}
          style={{ width: largura, height: altura }}
          resizeMode="contain"
        />
        <View style={[StyleSheet.absoluteFillObject, { transform: [{ scale: escala }], transformOrigin: 'top left' }]}>
          <MuscleOverlay primarios={primarios} secundarios={secundarios} />
        </View>
      </View>

      {mostrarLegenda && todos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.dot, { backgroundColor: P_L }]}/>
            <Text style={styles.legendaText}>Principal</Text>
            <View style={[styles.dot, { backgroundColor: S_L, marginLeft: 14 }]}/>
            <Text style={styles.legendaText}>Auxiliar</Text>
          </View>
          <View style={styles.tags}>
            {primarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: P_L, backgroundColor: P_D + '33' }]}>
                <Text style={[styles.tagText, { color: P_L }]}>{id.replace(/_/g, ' ')}</Text>
              </View>
            ))}
            {secundarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: S_L, backgroundColor: S_D + '33' }]}>
                <Text style={[styles.tagText, { color: S_L }]}>{id.replace(/_/g, ' ')}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container:      { alignItems: 'center' },
  imageContainer: { position: 'relative', overflow: 'hidden' },
  legenda:        { marginTop: 10, width: '100%' },
  legendaRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' },
  dot:            { width: 9, height: 9, borderRadius: 5, marginRight: 5 },
  legendaText:    { color: '#888', fontSize: 11 },
  tags:           { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' },
  tag:            { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  tagText:        { fontSize: 10, fontWeight: '700' },
});
