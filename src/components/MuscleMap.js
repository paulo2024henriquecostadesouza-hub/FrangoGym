import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Ellipse, Rect, G, Circle } from 'react-native-svg';

// Cores por estado do músculo
const COR_INATIVO = '#2a2a3e';
const COR_BORDA_INATIVO = '#3a3a5e';
const COR_PRIMARIO = '#e94560';    // músculo principal
const COR_SECUNDARIO = '#f39c12'; // músculo secundário/auxiliar
const COR_BORDA_ATIVO = '#fff';

// Mapeamento: grupo muscular -> músculos específicos
export const MUSCULOS = {
  // Masculino e feminino
  peitoral:        { label: 'Peitoral',        regiao: 'frente' },
  peitoral_sup:    { label: 'Peitoral Sup.',   regiao: 'frente' },
  deltoides:       { label: 'Deltoides',       regiao: 'frente' },
  deltoides_post:  { label: 'Deltoides Post.', regiao: 'costas' },
  biceps:          { label: 'Bíceps',          regiao: 'frente' },
  triceps:         { label: 'Tríceps',         regiao: 'costas' },
  antebraco:       { label: 'Antebraço',       regiao: 'frente' },
  abdomen:         { label: 'Abdômen',         regiao: 'frente' },
  obliquo:         { label: 'Oblíquos',        regiao: 'frente' },
  quadriceps:      { label: 'Quadríceps',      regiao: 'frente' },
  tibial:          { label: 'Tibial',          regiao: 'frente' },
  dorsais:         { label: 'Dorsais',         regiao: 'costas' },
  trapezio:        { label: 'Trapézio',        regiao: 'costas' },
  lombar:          { label: 'Lombar',          regiao: 'costas' },
  gluteos:         { label: 'Glúteos',         regiao: 'costas' },
  isquiotibiais:   { label: 'Isquiotibiais',   regiao: 'costas' },
  panturrilha:     { label: 'Panturrilha',     regiao: 'costas' },
};

// Mapeamento exercício -> músculos [primários], [secundários]
export const EXERCICIO_MUSCULOS = {
  1:  { primarios: ['peitoral'],       secundarios: ['deltoides', 'triceps'] },        // Supino Reto
  2:  { primarios: ['peitoral_sup'],   secundarios: ['deltoides', 'triceps'] },        // Supino Inclinado
  3:  { primarios: ['peitoral'],       secundarios: ['deltoides', 'biceps'] },         // Crucifixo
  4:  { primarios: ['dorsais'],        secundarios: ['biceps', 'trapezio'] },          // Barra Fixa
  5:  { primarios: ['dorsais'],        secundarios: ['biceps', 'lombar', 'trapezio'] },// Remada Curvada
  6:  { primarios: ['dorsais'],        secundarios: ['biceps', 'deltoides_post'] },    // Puxada Alta
  7:  { primarios: ['quadriceps', 'gluteos'], secundarios: ['isquiotibiais', 'lombar'] }, // Agachamento
  8:  { primarios: ['quadriceps'],     secundarios: ['gluteos', 'isquiotibiais'] },    // Leg Press
  9:  { primarios: ['quadriceps'],     secundarios: [] },                              // Cadeira Extensora
  10: { primarios: ['deltoides'],      secundarios: ['triceps', 'trapezio'] },         // Desenvolvimento
  11: { primarios: ['deltoides'],      secundarios: ['trapezio'] },                    // Elevação Lateral
  12: { primarios: ['biceps'],         secundarios: ['antebraco'] },                   // Rosca Direta
  13: { primarios: ['biceps'],         secundarios: ['antebraco'] },                   // Rosca Martelo
  14: { primarios: ['triceps'],        secundarios: ['deltoides_post'] },              // Tríceps Corda
  15: { primarios: ['triceps'],        secundarios: ['peitoral'] },                    // Tríceps Testa
  16: { primarios: ['abdomen'],        secundarios: ['obliquo'] },                     // Abdominal Crunch
  17: { primarios: ['abdomen', 'lombar'], secundarios: ['obliquo', 'gluteos'] },       // Prancha
  18: { primarios: ['quadriceps', 'isquiotibiais'], secundarios: ['gluteos', 'panturrilha', 'abdomen'] }, // Corrida
  19: { primarios: ['panturrilha'],    secundarios: ['quadriceps', 'abdomen'] },       // Pular Corda
};

function getCorMusculo(musculo, primarios = [], secundarios = []) {
  if (primarios.includes(musculo)) return { fill: COR_PRIMARIO, stroke: COR_BORDA_ATIVO };
  if (secundarios.includes(musculo)) return { fill: COR_SECUNDARIO, stroke: COR_BORDA_ATIVO };
  return { fill: COR_INATIVO, stroke: COR_BORDA_INATIVO };
}

// ─── CORPO FRONTAL ────────────────────────────────────────────────────────────
function CorpoFrente({ primarios, secundarios, escala = 1 }) {
  const m = (id) => getCorMusculo(id, primarios, secundarios);
  const w = 120 * escala;
  const h = 280 * escala;
  const s = escala;

  return (
    <Svg width={w} height={h} viewBox="0 0 120 280">
      {/* ── CABEÇA ── */}
      <Ellipse cx="60" cy="16" rx="14" ry="17" fill="#1e1e30" stroke="#3a3a5e" strokeWidth="1.5" />

      {/* ── PESCOÇO ── */}
      <Rect x="54" y="31" width="12" height="10" rx="3" fill="#1e1e30" stroke="#3a3a5e" strokeWidth="1" />

      {/* ── TRAPÉZIO FRONTAL ── */}
      <Path d="M41 41 Q54 38 60 41 Q66 38 79 41 L74 52 Q60 48 46 52 Z"
        fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1" />

      {/* ── DELTOIDES ESQUERDO ── */}
      <Ellipse cx="34" cy="57" rx="10" ry="12"
        fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1.2" />
      {/* ── DELTOIDES DIREITO ── */}
      <Ellipse cx="86" cy="57" rx="10" ry="12"
        fill={m('deltoides').fill} stroke={m('deltoides').stroke} strokeWidth="1.2" />

      {/* ── PEITORAL ESQUERDO ── */}
      <Path d="M46 52 Q53 50 60 54 Q60 66 52 70 Q44 67 43 58 Z"
        fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1.2" />
      {/* ── PEITORAL DIREITO ── */}
      <Path d="M74 52 Q67 50 60 54 Q60 66 68 70 Q76 67 77 58 Z"
        fill={m('peitoral').fill} stroke={m('peitoral').stroke} strokeWidth="1.2" />

      {/* ── PEITORAL SUPERIOR (highlight) ── */}
      {(primarios.includes('peitoral_sup') || secundarios.includes('peitoral_sup')) && (
        <>
          <Path d="M46 52 Q53 50 60 53 Q54 57 48 55 Z"
            fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth="1" opacity="0.8" />
          <Path d="M74 52 Q67 50 60 53 Q66 57 72 55 Z"
            fill={m('peitoral_sup').fill} stroke={m('peitoral_sup').stroke} strokeWidth="1" opacity="0.8" />
        </>
      )}

      {/* ── BÍCEPS ESQUERDO ── */}
      <Path d="M26 58 Q22 66 23 78 Q27 80 31 78 Q33 68 34 58 Z"
        fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1.2" />
      {/* ── BÍCEPS DIREITO ── */}
      <Path d="M94 58 Q98 66 97 78 Q93 80 89 78 Q87 68 86 58 Z"
        fill={m('biceps').fill} stroke={m('biceps').stroke} strokeWidth="1.2" />

      {/* ── TRÍCEPS FRONTAL (pequeno) ── */}
      <Path d="M26 58 Q24 60 24 68 Q22 68 22 60 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1" opacity="0.6" />
      <Path d="M94 58 Q96 60 96 68 Q98 68 98 60 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1" opacity="0.6" />

      {/* ── ANTEBRAÇO ESQUERDO ── */}
      <Path d="M23 80 Q20 90 21 102 Q25 104 28 102 Q30 90 31 80 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1" />
      {/* ── ANTEBRAÇO DIREITO ── */}
      <Path d="M97 80 Q100 90 99 102 Q95 104 92 102 Q90 90 89 80 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1" />

      {/* ── TRONCO (base) ── */}
      <Path d="M44 52 L76 52 L80 120 L40 120 Z"
        fill="#1a1a2e" stroke="#2a2a3e" strokeWidth="1" />

      {/* ── ABDÔMEN ── */}
      <Rect x="50" y="70" width="9" height="8" rx="2"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" />
      <Rect x="61" y="70" width="9" height="8" rx="2"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" />
      <Rect x="50" y="80" width="9" height="8" rx="2"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" />
      <Rect x="61" y="80" width="9" height="8" rx="2"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" />
      <Rect x="50" y="90" width="9" height="8" rx="2"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" />
      <Rect x="61" y="90" width="9" height="8" rx="2"
        fill={m('abdomen').fill} stroke={m('abdomen').stroke} strokeWidth="1" />

      {/* ── OBLÍQUOS ── */}
      <Path d="M44 65 Q46 80 43 100 Q40 100 40 80 Z"
        fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1" />
      <Path d="M76 65 Q74 80 77 100 Q80 100 80 80 Z"
        fill={m('obliquo').fill} stroke={m('obliquo').stroke} strokeWidth="1" />

      {/* ── CINTURA/QUADRIL ── */}
      <Path d="M40 118 Q38 125 36 140 L84 140 Q82 125 80 118 Z"
        fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />

      {/* ── QUADRÍCEPS ESQUERDO ── */}
      <Path d="M36 140 Q33 155 34 185 Q40 188 45 185 Q47 160 46 140 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1.2" />
      {/* ── QUADRÍCEPS DIREITO ── */}
      <Path d="M84 140 Q87 155 86 185 Q80 188 75 185 Q73 160 74 140 Z"
        fill={m('quadriceps').fill} stroke={m('quadriceps').stroke} strokeWidth="1.2" />

      {/* ── JOELHOS ── */}
      <Ellipse cx="40" cy="190" rx="8" ry="6" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />
      <Ellipse cx="80" cy="190" rx="8" ry="6" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />

      {/* ── TIBIAL ESQUERDO ── */}
      <Path d="M35 196 Q33 215 34 235 Q38 237 42 235 Q44 215 45 196 Z"
        fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1" />
      {/* ── TIBIAL DIREITO ── */}
      <Path d="M85 196 Q87 215 86 235 Q82 237 78 235 Q76 215 75 196 Z"
        fill={m('tibial').fill} stroke={m('tibial').stroke} strokeWidth="1" />

      {/* ── PÉS ── */}
      <Ellipse cx="39" cy="242" rx="10" ry="5" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />
      <Ellipse cx="81" cy="242" rx="10" ry="5" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />
    </Svg>
  );
}

// ─── CORPO DORSAL ─────────────────────────────────────────────────────────────
function CorpoCostas({ primarios, secundarios, escala = 1 }) {
  const m = (id) => getCorMusculo(id, primarios, secundarios);

  return (
    <Svg width={120 * escala} height={280 * escala} viewBox="0 0 120 280">
      {/* ── CABEÇA ── */}
      <Ellipse cx="60" cy="16" rx="14" ry="17" fill="#1e1e30" stroke="#3a3a5e" strokeWidth="1.5" />

      {/* ── PESCOÇO ── */}
      <Rect x="54" y="31" width="12" height="10" rx="3" fill="#1e1e30" stroke="#3a3a5e" strokeWidth="1" />

      {/* ── TRAPÉZIO ── */}
      <Path d="M41 41 Q54 36 60 40 Q66 36 79 41 L76 62 Q60 56 44 62 Z"
        fill={m('trapezio').fill} stroke={m('trapezio').stroke} strokeWidth="1.2" />

      {/* ── DELTOIDES POST. ESQUERDO ── */}
      <Ellipse cx="34" cy="60" rx="10" ry="12"
        fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1.2" />
      {/* ── DELTOIDES POST. DIREITO ── */}
      <Ellipse cx="86" cy="60" rx="10" ry="12"
        fill={m('deltoides_post').fill} stroke={m('deltoides_post').stroke} strokeWidth="1.2" />

      {/* ── DORSAIS ESQUERDO ── */}
      <Path d="M44 62 Q42 75 43 100 Q50 105 58 100 Q58 80 56 62 Z"
        fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1.2" />
      {/* ── DORSAIS DIREITO ── */}
      <Path d="M76 62 Q78 75 77 100 Q70 105 62 100 Q62 80 64 62 Z"
        fill={m('dorsais').fill} stroke={m('dorsais').stroke} strokeWidth="1.2" />

      {/* ── TRÍCEPS ESQUERDO ── */}
      <Path d="M26 58 Q22 70 23 84 Q28 86 32 84 Q34 70 34 60 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1.2" />
      {/* ── TRÍCEPS DIREITO ── */}
      <Path d="M94 58 Q98 70 97 84 Q92 86 88 84 Q86 70 86 60 Z"
        fill={m('triceps').fill} stroke={m('triceps').stroke} strokeWidth="1.2" />

      {/* ── ANTEBRAÇO POSTERIOR ── */}
      <Path d="M23 86 Q20 96 21 108 Q25 110 28 108 Q30 96 32 86 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1" />
      <Path d="M97 86 Q100 96 99 108 Q95 110 92 108 Q90 96 88 86 Z"
        fill={m('antebraco').fill} stroke={m('antebraco').stroke} strokeWidth="1" />

      {/* ── LOMBAR ── */}
      <Path d="M50 100 Q58 104 60 108 Q62 104 70 100 L72 118 Q60 122 48 118 Z"
        fill={m('lombar').fill} stroke={m('lombar').stroke} strokeWidth="1.2" />

      {/* ── GLÚTEOS ── */}
      <Path d="M38 122 Q40 138 42 150 Q50 154 58 150 Q60 138 60 122 Z"
        fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1.2" />
      <Path d="M82 122 Q80 138 78 150 Q70 154 62 150 Q60 138 60 122 Z"
        fill={m('gluteos').fill} stroke={m('gluteos').stroke} strokeWidth="1.2" />

      {/* ── ISQUIOTIBIAIS ESQUERDO ── */}
      <Path d="M36 152 Q33 165 34 188 Q40 191 45 188 Q47 168 46 152 Z"
        fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1.2" />
      {/* ── ISQUIOTIBIAIS DIREITO ── */}
      <Path d="M84 152 Q87 165 86 188 Q80 191 75 188 Q73 168 74 152 Z"
        fill={m('isquiotibiais').fill} stroke={m('isquiotibiais').stroke} strokeWidth="1.2" />

      {/* ── JOELHOS ── */}
      <Ellipse cx="40" cy="193" rx="8" ry="5" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />
      <Ellipse cx="80" cy="193" rx="8" ry="5" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />

      {/* ── PANTURRILHA ESQUERDA ── */}
      <Path d="M34 198 Q31 214 33 235 Q38 238 43 235 Q45 215 45 198 Z"
        fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1.2" />
      {/* ── PANTURRILHA DIREITA ── */}
      <Path d="M86 198 Q89 214 87 235 Q82 238 77 235 Q75 215 75 198 Z"
        fill={m('panturrilha').fill} stroke={m('panturrilha').stroke} strokeWidth="1.2" />

      {/* ── PÉS ── */}
      <Ellipse cx="39" cy="242" rx="10" ry="5" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />
      <Ellipse cx="81" cy="242" rx="10" ry="5" fill="#1e1e30" stroke="#2a2a3e" strokeWidth="1" />
    </Svg>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function MuscleMap({ primarios = [], secundarios = [], escala = 1, mostrarLegenda = true }) {
  const todosMusculos = [...new Set([...primarios, ...secundarios])];
  const musculosFrente = todosMusculos.filter(m => MUSCULOS[m]?.regiao === 'frente');
  const musculosCostas = todosMusculos.filter(m => MUSCULOS[m]?.regiao === 'costas');

  return (
    <View style={styles.container}>
      <View style={styles.corposRow}>
        <View style={styles.corpoCol}>
          <Text style={styles.corpoLabel}>Frente</Text>
          <CorpoFrente primarios={primarios} secundarios={secundarios} escala={escala} />
        </View>
        <View style={styles.corpoCol}>
          <Text style={styles.corpoLabel}>Costas</Text>
          <CorpoCostas primarios={primarios} secundarios={secundarios} escala={escala} />
        </View>
      </View>

      {mostrarLegenda && todosMusculos.length > 0 && (
        <View style={styles.legenda}>
          <View style={styles.legendaRow}>
            <View style={[styles.legendaDot, { backgroundColor: COR_PRIMARIO }]} />
            <Text style={styles.legendaText}>Músculo principal</Text>
            <View style={[styles.legendaDot, { backgroundColor: COR_SECUNDARIO, marginLeft: 16 }]} />
            <Text style={styles.legendaText}>Auxiliar</Text>
          </View>
          <View style={styles.tagsRow}>
            {primarios.map(m => (
              <View key={m} style={[styles.tag, { backgroundColor: COR_PRIMARIO + '30', borderColor: COR_PRIMARIO }]}>
                <Text style={[styles.tagText, { color: COR_PRIMARIO }]}>{MUSCULOS[m]?.label}</Text>
              </View>
            ))}
            {secundarios.map(m => (
              <View key={m} style={[styles.tag, { backgroundColor: COR_SECUNDARIO + '30', borderColor: COR_SECUNDARIO }]}>
                <Text style={[styles.tagText, { color: COR_SECUNDARIO }]}>{MUSCULOS[m]?.label}</Text>
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
  corposRow: { flexDirection: 'row', gap: 20, justifyContent: 'center' },
  corpoCol: { alignItems: 'center' },
  corpoLabel: { color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  legenda: { marginTop: 12, width: '100%' },
  legendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  legendaDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendaText: { color: '#888', fontSize: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '600' },
});
