import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Tamanho de exibição (mantém ratio 467:800 da imagem original)
const IMG_W = 310;
const IMG_H = 530;

// Cores overlay
const P_FILL   = 'rgba(233, 69, 96,  0.62)';
const P_STROKE = '#ff5070';
const S_FILL   = 'rgba(243, 156, 18,  0.58)';
const S_STROKE = '#ffc040';

function ov(id, p, s) {
  if (p.includes(id)) return { fill: P_FILL,        stroke: P_STROKE, sw: 1.8 };
  if (s.includes(id)) return { fill: S_FILL,        stroke: S_STROKE, sw: 1.4 };
  return               { fill: 'transparent', stroke: 'none',   sw: 0   };
}

// ─── Overlay com coordenadas calibradas visualmente sobre 310x530 ─────────────
// FRENTE = figura esquerda da imagem
// COSTAS = figura direita da imagem
function MuscleOverlay({ p, s }) {
  const m = id => ov(id, p, s);
  return (
    <Svg width={IMG_W} height={IMG_H} viewBox={`0 0 ${IMG_W} ${IMG_H}`}
      style={StyleSheet.absoluteFillObject} pointerEvents="none">

      {/* ══════════ FRENTE ══════════ */}

      {/* Trapézio (frente) — triângulo pescoço→ombros */}
      <Path d="M52 67 Q78 60 110 67 L105 94 Q78 87 54 94 Z"
        fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth={m('trapezio').sw} strokeLinejoin="round"/>

      {/* Deltoides anterior esquerdo */}
      <Path d="M36 70 Q24 80 22 96 Q27 107 39 103 Q47 90 49 72 Z"
        fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth={m('deltoides').sw} strokeLinejoin="round"/>
      {/* Deltoides anterior direito */}
      <Path d="M108 70 Q120 80 122 96 Q117 107 105 103 Q97 90 95 72 Z"
        fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth={m('deltoides').sw} strokeLinejoin="round"/>

      {/* Peitoral esquerdo */}
      <Path d="M52 94 Q64 86 78 91 Q79 116 76 128 Q62 127 50 113 Z"
        fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth={m('peitoral').sw} strokeLinejoin="round"/>
      {/* Peitoral direito */}
      <Path d="M104 94 Q92 86 78 91 Q77 116 80 128 Q94 127 106 113 Z"
        fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth={m('peitoral').sw} strokeLinejoin="round"/>
      {/* Peitoral superior */}
      {(p.includes('peitoral_sup')||s.includes('peitoral_sup')) && <>
        <Path d="M53 94 Q66 86 78 90 Q68 99 54 98 Z"
          fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth="1.2" strokeLinejoin="round"/>
        <Path d="M103 94 Q90 86 78 90 Q88 99 102 98 Z"
          fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      </>}

      {/* Bíceps esquerdo */}
      <Path d="M20 100 Q13 118 15 142 Q22 147 31 142 Q35 120 34 102 Z"
        fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth={m('biceps').sw} strokeLinejoin="round"/>
      {/* Bíceps direito */}
      <Path d="M124 100 Q131 118 129 142 Q122 147 113 142 Q109 120 110 102 Z"
        fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth={m('biceps').sw} strokeLinejoin="round"/>

      {/* Antebraço esquerdo */}
      <Path d="M13 144 Q8 166 10 191 Q17 196 25 191 Q29 168 28 146 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth={m('antebraco').sw} strokeLinejoin="round"/>
      {/* Antebraço direito */}
      <Path d="M131 144 Q136 166 134 191 Q127 196 119 191 Q115 168 116 146 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth={m('antebraco').sw} strokeLinejoin="round"/>

      {/* Abdômen (reto abdominal) */}
      <Path d="M60 128 Q69 122 78 126 Q87 122 96 128 L96 208 Q87 213 78 209 Q69 213 60 208 Z"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth={m('abdomen').sw} strokeLinejoin="round"/>

      {/* Oblíquo esquerdo */}
      <Path d="M47 110 Q41 132 43 170 Q39 168 39 130 Z"
        fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth={m('obliquo').sw}/>
      {/* Oblíquo direito */}
      <Path d="M109 110 Q115 132 113 170 Q117 168 117 130 Z"
        fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth={m('obliquo').sw}/>

      {/* Quadríceps esquerdo */}
      <Path d="M49 222 Q41 256 43 308 Q52 316 62 310 Q66 268 64 222 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth={m('quadriceps').sw} strokeLinejoin="round"/>
      {/* Quadríceps direito */}
      <Path d="M107 222 Q115 256 113 308 Q104 316 94 310 Q90 268 92 222 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth={m('quadriceps').sw} strokeLinejoin="round"/>
      {/* Vasto medial esq (teardrop) */}
      <Path d="M50 300 Q46 316 50 326 Q58 330 65 324 Q67 312 62 302 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth={m('quadriceps').sw}/>
      <Path d="M106 300 Q110 316 106 326 Q98 330 91 324 Q89 312 94 302 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth={m('quadriceps').sw}/>

      {/* Tibial anterior esquerdo */}
      <Path d="M46 332 Q40 358 42 390 Q49 395 56 390 Q60 360 58 332 Z"
        fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth={m('tibial').sw} strokeLinejoin="round"/>
      {/* Tibial anterior direito */}
      <Path d="M110 332 Q116 358 114 390 Q107 395 100 390 Q96 360 98 332 Z"
        fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth={m('tibial').sw} strokeLinejoin="round"/>

      {/* ══════════ COSTAS ══════════ */}

      {/* Trapézio costas */}
      <Path d="M176 66 Q233 56 290 66 L282 128 Q233 114 184 128 Z"
        fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth={m('trapezio').sw} strokeLinejoin="round"/>

      {/* Deltoides posterior esquerdo */}
      <Path d="M166 74 Q154 84 154 102 Q160 110 172 106 Q181 92 182 76 Z"
        fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth={m('deltoides_post').sw} strokeLinejoin="round"/>
      {/* Deltoides posterior direito */}
      <Path d="M300 74 Q312 84 312 102 Q306 110 294 106 Q285 92 284 76 Z"
        fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth={m('deltoides_post').sw} strokeLinejoin="round"/>

      {/* Latíssimo esquerdo (dorsais) */}
      <Path d="M182 128 Q174 162 178 214 Q193 226 210 216 Q213 174 208 128 Z"
        fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth={m('dorsais').sw} strokeLinejoin="round"/>
      {/* Latíssimo direito (dorsais) */}
      <Path d="M284 128 Q292 162 288 214 Q273 226 256 216 Q253 174 258 128 Z"
        fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth={m('dorsais').sw} strokeLinejoin="round"/>

      {/* Tríceps esquerdo */}
      <Path d="M154 102 Q146 122 148 146 Q155 152 164 147 Q168 124 170 104 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth={m('triceps').sw} strokeLinejoin="round"/>
      {/* Tríceps direito */}
      <Path d="M312 102 Q320 122 318 146 Q311 152 302 147 Q298 124 296 104 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth={m('triceps').sw} strokeLinejoin="round"/>

      {/* Antebraço costas esquerdo */}
      <Path d="M146 148 Q140 170 142 196 Q149 200 157 196 Q161 172 162 150 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth={m('antebraco').sw} strokeLinejoin="round"/>
      {/* Antebraço costas direito */}
      <Path d="M320 148 Q326 170 324 196 Q317 200 309 196 Q305 172 304 150 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth={m('antebraco').sw} strokeLinejoin="round"/>

      {/* Eretor espinhal / Lombar */}
      <Path d="M218 212 Q214 238 216 264 Q224 270 234 264 Q234 238 231 212 Z"
        fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth={m('lombar').sw} strokeLinejoin="round"/>
      <Path d="M248 212 Q252 238 250 264 Q242 270 236 264 Q236 238 237 212 Z"
        fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth={m('lombar').sw} strokeLinejoin="round"/>

      {/* Glúteos esquerdo */}
      <Path d="M186 264 Q180 294 186 322 Q202 336 233 326 Q233 296 231 264 Z"
        fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth={m('gluteos').sw} strokeLinejoin="round"/>
      {/* Glúteos direito */}
      <Path d="M280 264 Q286 294 280 322 Q264 336 237 326 Q237 296 235 264 Z"
        fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth={m('gluteos').sw} strokeLinejoin="round"/>

      {/* Isquiotibiais esquerdo */}
      <Path d="M184 330 Q178 364 180 406 Q191 414 203 408 Q208 372 207 330 Z"
        fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth={m('isquiotibiais').sw} strokeLinejoin="round"/>
      {/* Isquiotibiais direito */}
      <Path d="M282 330 Q288 364 286 406 Q275 414 263 408 Q258 372 259 330 Z"
        fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth={m('isquiotibiais').sw} strokeLinejoin="round"/>

      {/* Panturrilha esquerda */}
      <Path d="M182 412 Q176 440 178 468 Q189 476 200 470 Q206 444 204 412 Z"
        fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth={m('panturrilha').sw} strokeLinejoin="round"/>
      {/* Panturrilha direita */}
      <Path d="M284 412 Q290 440 288 468 Q277 476 266 470 Q260 444 262 412 Z"
        fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth={m('panturrilha').sw} strokeLinejoin="round"/>

    </Svg>
  );
}

// ─── Componente exportado ─────────────────────────────────────────────────────
export default function MuscleMapImage({
  primarios    = [],
  secundarios  = [],
  escala       = 1,
  mostrarLegenda = true,
}) {
  const W = IMG_W * escala;
  const H = IMG_H * escala;
  const todos = [...new Set([...primarios, ...secundarios])];

  return (
    <View style={styles.container}>
      <View style={[styles.card, { width: W, height: H }]}>
        {/* Imagem anatômica base */}
        <Image
          source={require('../../assets/avatar_masculino.jpg')}
          style={{ width: W, height: H, borderRadius: 12 }}
          resizeMode="stretch"
        />
        {/* Overlay muscular SVG (absoluto sobre a imagem) */}
        <View style={[StyleSheet.absoluteFillObject, { transform: [{ scale: escala }], transformOrigin: 'top left' }]}
          pointerEvents="none">
          <MuscleOverlay p={primarios} s={secundarios}/>
        </View>
      </View>

      {mostrarLegenda && todos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.dot, { backgroundColor: '#ff5070' }]}/>
            <Text style={styles.legendaText}>Principal</Text>
            <View style={[styles.dot, { backgroundColor: '#ffc040', marginLeft: 14 }]}/>
            <Text style={styles.legendaText}>Auxiliar</Text>
          </View>
          <View style={styles.tags}>
            {primarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: '#ff5070', backgroundColor: '#c0103033' }]}>
                <Text style={[styles.tagText, { color: '#ff5070' }]}>{id.replace(/_/g,' ')}</Text>
              </View>
            ))}
            {secundarios.map(id => (
              <View key={id} style={[styles.tag, { borderColor: '#ffc040', backgroundColor: '#b0600033' }]}>
                <Text style={[styles.tagText, { color: '#ffc040' }]}>{id.replace(/_/g,' ')}</Text>
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
  card:       { position: 'relative', overflow: 'hidden', borderRadius: 12,
                borderWidth: 1, borderColor: '#2a2a3e' },
  legenda:    { marginTop: 10, width: '100%' },
  legendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' },
  dot:        { width: 9, height: 9, borderRadius: 5, marginRight: 5 },
  legendaText:{ color: '#888', fontSize: 11 },
  tags:       { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' },
  tag:        { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  tagText:    { fontSize: 10, fontWeight: '700' },
});
