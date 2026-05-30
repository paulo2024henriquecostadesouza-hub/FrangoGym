import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, Modal, Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXERCICIOS, GRUPOS, PLANOS, MUSCLE_IMAGES } from '../data/exercises';
import { salvar, carregar, KEYS, atualizarStreak } from '../utils/storage';
import { EXERCICIO_MUSCULOS } from '../components/MuscleMap';
import { carregar as carregarStorage } from '../utils/storage';

// ─── Cor por grupo muscular ───────────────────────────────────────────────────
const GRUPO_COR = {
  'Peito':   '#e94560', 'Costas':  '#3a7bd5', 'Pernas':  '#00c853',
  'Ombros':  '#ff9800', 'Bíceps':  '#9c27b0', 'Tríceps': '#00bcd4',
  'Abdômen': '#ff5722', 'Cardio':  '#f44336',
};

// ─── Imagem de músculo com fallback ──────────────────────────────────────────
function MuscleImg({ id, style }) {
  const [erro, setErro] = useState(false);
  const src = !erro && MUSCLE_IMAGES[id] ? MUSCLE_IMAGES[id] : null;
  if (!src) return <View style={[styles.imgPlaceholder, style]}><Text style={styles.imgPlaceholderTxt}>💪</Text></View>;
  return (
    <Image
      source={src}
      style={[styles.muscleImg, style]}
      resizeMode="contain"
      onError={() => setErro(true)}
    />
  );
}

export default function TreinosScreen() {
  const [aba, setAba]                   = useState('planos');
  const [grupoFiltro, setGrupoFiltro]   = useState('Todos');
  const [treinoAtivo, setTreinoAtivo]   = useState(null);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [serieAtual, setSerieAtual]     = useState(1);
  const [descansando, setDescansando]   = useState(false);
  const [tempo, setTempo]               = useState(60);
  const timerRef   = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => () => clearInterval(timerRef.current), []);

  function iniciarDescanso() {
    setDescansando(true); setTempo(60);
    progressAnim.setValue(1);
    Animated.timing(progressAnim, { toValue: 0, duration: 60000, useNativeDriver: false }).start();
    timerRef.current = setInterval(() => {
      setTempo(t => {
        if (t <= 1) { clearInterval(timerRef.current); setDescansando(false); return 60; }
        return t - 1;
      });
    }, 1000);
  }

  async function proximaSerie() {
    const ex = exsAtivos;
    if (serieAtual < ex[exercicioAtual].series) {
      setSerieAtual(s => s + 1); iniciarDescanso();
    } else if (exercicioAtual < ex.length - 1) {
      setExercicioAtual(i => i + 1); setSerieAtual(1); iniciarDescanso();
    } else {
      await concluirTreino();
    }
  }

  async function concluirTreino() {
    const feitos = await carregar(KEYS.TREINOS_FEITOS, []);
    feitos.push({ data: new Date().toISOString(), nome: treinoAtivo.nome });
    await salvar(KEYS.TREINOS_FEITOS, feitos);
    await atualizarStreak();
    setTreinoAtivo(null); setExercicioAtual(0); setSerieAtual(1);
  }

  const exerciciosFiltrados = grupoFiltro === 'Todos'
    ? EXERCICIOS : EXERCICIOS.filter(e => e.grupo === grupoFiltro);

  const exsAtivos = treinoAtivo
    ? treinoAtivo.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean)
    : [];

  const exAtual = exsAtivos[exercicioAtual];
  const isFim = exAtual && exercicioAtual === exsAtivos.length - 1 && serieAtual === exAtual.series;

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerArea}>
        <Text style={styles.titulo}>Treinos</Text>
        <View style={styles.abas}>
          {['planos', 'exercicios'].map(a => (
            <TouchableOpacity key={a} style={[styles.aba, aba === a && styles.abaAtiva]} onPress={() => setAba(a)}>
              <Text style={[styles.abaText, aba === a && styles.abaTextAtiva]}>
                {a === 'planos' ? 'Planos' : 'Exercícios'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── ABA PLANOS ──────────────────────────────────────────────────────── */}
      {aba === 'planos' ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {PLANOS.map(plano => (
            <View key={plano.id} style={styles.planoCard}>
              <LinearGradient colors={['#1e1e35', '#16162a']} style={styles.planoHeaderGrad}>
                <View>
                  <Text style={styles.planoNome}>{plano.nome}</Text>
                  <View style={styles.nivelBadge}><Text style={styles.nivelText}>{plano.nivel}</Text></View>
                </View>
                <Text style={styles.planoDias}>{plano.dias.length}x/sem</Text>
              </LinearGradient>

              {plano.treinos.map((t, i) => {
                const exs = t.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean);
                const primeiroId = exs[0]?.id;
                return (
                  <TouchableOpacity key={i} style={styles.treinoItem}
                    onPress={() => { setTreinoAtivo(t); setExercicioAtual(0); setSerieAtual(1); }}>

                    {/* Miniatura do primeiro exercício */}
                    <View style={styles.treinoThumbWrap}>
                      <MuscleImg id={primeiroId} style={styles.treinoThumb} />
                    </View>

                    <View style={styles.treinoInfo}>
                      <View style={styles.diaRow}>
                        <View style={styles.diaCircle}><Text style={styles.diaText}>{t.dia}</Text></View>
                        <Text style={styles.treinoNome}>{t.nome}</Text>
                      </View>
                      <Text style={styles.treinoExs}>
                        {exs.length} exercícios · {exs.reduce((a, e) => a + e.series, 0)} séries
                      </Text>
                      {/* Grupos musculares */}
                      <View style={styles.gruposRow}>
                        {[...new Set(exs.map(e => e.grupo))].map(g => (
                          <View key={g} style={[styles.grupoTag, { borderColor: GRUPO_COR[g] || '#555' }]}>
                            <Text style={[styles.grupoTagTxt, { color: GRUPO_COR[g] || '#aaa' }]}>{g}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <Text style={styles.playBtn}>▶</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

      ) : (
      /* ── ABA EXERCÍCIOS ───────────────────────────────────────────────────── */
        <View style={styles.scroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
            {['Todos', ...GRUPOS].map(g => (
              <TouchableOpacity key={g}
                style={[styles.filtroChip, grupoFiltro === g && styles.filtroAtivo]}
                onPress={() => setGrupoFiltro(g)}>
                <Text style={[styles.filtroText, grupoFiltro === g && styles.filtroTextAtivo]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={exerciciosFiltrados}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.exCard}>
                {/* Barra colorida lateral */}
                <View style={[styles.exColorBar, { backgroundColor: GRUPO_COR[item.grupo] || '#533483' }]} />

                {/* Info */}
                <View style={styles.exInfo}>
                  <Text style={styles.exNome}>{item.nome}</Text>
                  <Text style={[styles.exGrupo, { color: GRUPO_COR[item.grupo] || '#e94560' }]}>{item.grupo}</Text>
                  <Text style={styles.exDesc}>{item.desc}</Text>
                  <Text style={styles.exSeries}>{item.series} séries · {item.reps} reps</Text>
                </View>

                {/* Imagem muscular */}
                <View style={styles.exImgWrap}>
                  <MuscleImg id={item.id} style={styles.exImg} />
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* ── MODAL TREINO ATIVO ─────────────────────────────────────────────── */}
      <Modal visible={!!treinoAtivo} animationType="slide">
        <View style={styles.modalBg}>
          {/* Top bar */}
          <View style={styles.modalTop}>
            <View style={styles.modalTitleWrap}>
              <Text style={styles.modalTreinoNome}>{treinoAtivo?.nome}</Text>
              <Text style={styles.progressoText}>
                {exercicioAtual + 1} / {exsAtivos.length} exercícios
              </Text>
            </View>
            <TouchableOpacity style={styles.fecharBtn} onPress={() => setTreinoAtivo(null)}>
              <Text style={styles.fecharText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de progresso */}
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill,
              { width: `${((exercicioAtual) / Math.max(exsAtivos.length, 1)) * 100}%` }]} />
          </View>

          {exAtual && (
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* ── IMAGEM MUSCULAR DO EXERCÍCIO ── */}
              <View style={styles.muscleImgCard}>
                <MuscleImg id={exAtual.id} style={styles.muscleImgGrande} />
                <LinearGradient
                  colors={['transparent', 'rgba(13,13,26,0.95)']}
                  style={styles.muscleImgOverlay}
                />
                <View style={styles.muscleImgLabels}>
                  <Text style={[styles.exAtivoGrupo, { color: GRUPO_COR[exAtual.grupo] || '#e94560' }]}>
                    {exAtual.grupo}
                  </Text>
                  <Text style={styles.exAtivoNome}>{exAtual.nome}</Text>
                </View>
              </View>

              {/* Músculos trabalhados (tags) */}
              {EXERCICIO_MUSCULOS[exAtual.id] && (
                <View style={styles.musculosTags}>
                  {EXERCICIO_MUSCULOS[exAtual.id].primarios.map(m => (
                    <View key={m} style={styles.tagPrim}>
                      <Text style={styles.tagPrimTxt}>{m.replace(/_/g,' ')}</Text>
                    </View>
                  ))}
                  {EXERCICIO_MUSCULOS[exAtual.id].secundarios.map(m => (
                    <View key={m} style={styles.tagSec}>
                      <Text style={styles.tagSecTxt}>{m.replace(/_/g,' ')}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Descrição */}
              <Text style={styles.exAtivoDesc}>{exAtual.desc}</Text>

              {/* Séries */}
              <View style={styles.serieInfo}>
                <View style={styles.serieBox}>
                  <Text style={styles.serieNum}>{serieAtual}</Text>
                  <Text style={styles.serieLabel}>Série</Text>
                </View>
                <Text style={styles.serieSep}>de</Text>
                <View style={styles.serieBox}>
                  <Text style={styles.serieNum}>{exAtual.series}</Text>
                  <Text style={styles.serieLabel}>Total</Text>
                </View>
                <View style={[styles.serieBox, styles.serieBoxReps]}>
                  <Text style={styles.serieNum}>{exAtual.reps}</Text>
                  <Text style={styles.serieLabel}>Reps</Text>
                </View>
              </View>

              {/* Descanso ou botão concluir */}
              {descansando ? (
                <View style={styles.descansArea}>
                  <Text style={styles.descansLabel}>⏱ Descansando...</Text>
                  <Text style={styles.descansTimer}>{tempo}s</Text>
                  <View style={styles.descansBarBg}>
                    <Animated.View style={[styles.descansBar, {
                      width: progressAnim.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] })
                    }]} />
                  </View>
                  <TouchableOpacity style={styles.pularBtn}
                    onPress={() => { clearInterval(timerRef.current); setDescansando(false); }}>
                    <Text style={styles.pularText}>Pular descanso →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.feito} onPress={proximaSerie}>
                  <LinearGradient
                    colors={isFim ? ['#f5a623','#e67e22'] : ['#e94560','#c0392b']}
                    style={styles.feitoGrad}
                  >
                    <Text style={styles.feitoText}>
                      {isFim ? '🏆 Concluir Treino' : '✓ Série Concluída'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}

          {/* Lista horizontal de exercícios */}
          <ScrollView horizontal style={styles.listaExs} showsHorizontalScrollIndicator={false}>
            {exsAtivos.map((e, i) => (
              <TouchableOpacity key={i}
                style={[styles.exMini, i === exercicioAtual && styles.exMiniAtivo, i < exercicioAtual && styles.exMiniFeito]}
                onPress={() => { if (i > exercicioAtual) return; setExercicioAtual(i); setSerieAtual(1); }}
              >
                <View style={styles.exMiniImgWrap}>
                  <MuscleImg id={e.id} style={styles.exMiniImg} />
                </View>
                <Text style={styles.exMiniNome} numberOfLines={1}>{e.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#0d0d1a' },
  headerArea:       { padding: 20, paddingTop: 50, backgroundColor: '#1a1a2e' },
  titulo:           { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  abas:             { flexDirection: 'row', backgroundColor: '#0d0d1a', borderRadius: 10, padding: 4 },
  aba:              { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  abaAtiva:         { backgroundColor: '#533483' },
  abaText:          { color: '#666', fontWeight: '600' },
  abaTextAtiva:     { color: '#fff' },
  scroll:           { flex: 1, padding: 16 },

  // Filtros
  filtros:          { maxHeight: 44, marginBottom: 12 },
  filtroChip:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e1e30', marginRight: 8 },
  filtroAtivo:      { backgroundColor: '#533483' },
  filtroText:       { color: '#888', fontSize: 13 },
  filtroTextAtivo:  { color: '#fff' },

  // Plano card
  planoCard:        { backgroundColor: '#1a1a2e', borderRadius: 18, marginBottom: 20, overflow: 'hidden' },
  planoHeaderGrad:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16 },
  planoNome:        { color: '#fff', fontSize: 16, fontWeight: 'bold', maxWidth: '82%' },
  nivelBadge:       { backgroundColor: '#533483', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  nivelText:        { color: '#fff', fontSize: 11 },
  planoDias:        { color: '#e94560', fontWeight: 'bold', fontSize: 18 },

  treinoItem:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: '#22223a' },
  treinoThumbWrap:  { width: 62, height: 72, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', marginRight: 12 },
  treinoThumb:      { width: 62, height: 72 },
  treinoInfo:       { flex: 1 },
  diaRow:           { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  diaCircle:        { width: 30, height: 30, borderRadius: 15, backgroundColor: '#0f3460', alignItems: 'center', justifyContent: 'center' },
  diaText:          { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  treinoNome:       { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1 },
  treinoExs:        { color: '#888', fontSize: 12, marginBottom: 6 },
  gruposRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  grupoTag:         { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  grupoTagTxt:      { fontSize: 10, fontWeight: '700' },
  playBtn:          { color: '#e94560', fontSize: 22, marginLeft: 8 },

  // Exercício card
  exCard:           { flexDirection: 'row', backgroundColor: '#1e1e30', borderRadius: 14, marginBottom: 12, overflow: 'hidden' },
  exColorBar:       { width: 4 },
  exInfo:           { flex: 1, padding: 14 },
  exNome:           { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  exGrupo:          { fontSize: 12, marginTop: 2, fontWeight: '700' },
  exDesc:           { color: '#888', fontSize: 12, marginTop: 5, lineHeight: 17 },
  exSeries:         { color: '#aaa', fontSize: 12, marginTop: 6 },
  exImgWrap:        { width: 110, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  exImg:            { width: 110, height: 140 },
  imgPlaceholder:   { alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1e35' },
  imgPlaceholderTxt:{ fontSize: 32 },
  muscleImg:        { backgroundColor: '#fff' },

  // Modal
  modalBg:          { flex: 1, backgroundColor: '#0d0d1a' },
  modalTop:         { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 52, paddingHorizontal: 20, paddingBottom: 10 },
  modalTitleWrap:   { flex: 1 },
  modalTreinoNome:  { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  progressoText:    { color: '#888', fontSize: 12, marginTop: 2 },
  fecharBtn:        { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#1e1e30', borderRadius: 20, marginLeft: 12 },
  fecharText:       { color: '#e94560', fontSize: 14, fontWeight: '700' },
  progressBar:      { height: 3, backgroundColor: '#1e1e30', marginHorizontal: 20, borderRadius: 2, marginBottom: 4 },
  progressFill:     { height: 3, backgroundColor: '#e94560', borderRadius: 2 },

  modalScroll:      { flex: 1 },
  modalScrollContent: { paddingHorizontal: 16, paddingBottom: 20 },

  // Imagem grande no modal
  muscleImgCard:    { borderRadius: 20, overflow: 'hidden', height: 320, backgroundColor: '#fff', marginBottom: 14, marginTop: 6 },
  muscleImgGrande:  { width: '100%', height: '100%' },
  muscleImgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  muscleImgLabels:  { position: 'absolute', bottom: 14, left: 16 },
  exAtivoGrupo:     { fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, fontWeight: '700' },
  exAtivoNome:      { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 2, textShadowColor: '#000', textShadowOffset: {width:0,height:1}, textShadowRadius: 4 },

  // Tags de músculos
  musculosTags:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tagPrim:          { backgroundColor: 'rgba(233,69,96,.18)', borderWidth: 1, borderColor: '#e94560', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagPrimTxt:       { color: '#e94560', fontSize: 11, fontWeight: '700' },
  tagSec:           { backgroundColor: 'rgba(245,166,35,.18)', borderWidth: 1, borderColor: '#f5a623', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagSecTxt:        { color: '#f5a623', fontSize: 11, fontWeight: '700' },

  exAtivoDesc:      { color: '#aaa', lineHeight: 20, marginBottom: 20, fontSize: 13 },
  serieInfo:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 },
  serieBox:         { alignItems: 'center', backgroundColor: '#1e1e30', padding: 16, borderRadius: 14, minWidth: 72 },
  serieBoxReps:     { backgroundColor: '#16213e' },
  serieNum:         { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  serieLabel:       { color: '#888', fontSize: 11, marginTop: 2 },
  serieSep:         { color: '#555', fontSize: 13 },

  descansArea:      { alignItems: 'center', marginBottom: 20 },
  descansLabel:     { color: '#aaa', fontSize: 14 },
  descansTimer:     { color: '#fff', fontSize: 52, fontWeight: 'bold', marginTop: 4 },
  descansBarBg:     { width: '100%', height: 4, backgroundColor: '#1e1e30', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  descansBar:       { height: 4, backgroundColor: '#533483', borderRadius: 2 },
  pularBtn:         { marginTop: 14 },
  pularText:        { color: '#e94560', fontWeight: '600', fontSize: 14 },

  feito:            { borderRadius: 16, overflow: 'hidden', marginBottom: 10 },
  feitoGrad:        { padding: 18, alignItems: 'center' },
  feitoText:        { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Lista horizontal de exercícios
  listaExs:         { maxHeight: 100, paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#1e1e30' },
  exMini:           { alignItems: 'center', marginRight: 10, opacity: 0.6, width: 68 },
  exMiniAtivo:      { opacity: 1 },
  exMiniFeito:      { opacity: 0.4 },
  exMiniImgWrap:    { width: 52, height: 60, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', marginBottom: 4 },
  exMiniImg:        { width: 52, height: 60 },
  exMiniNome:       { color: '#ccc', fontSize: 9, textAlign: 'center', width: 68 },
});
