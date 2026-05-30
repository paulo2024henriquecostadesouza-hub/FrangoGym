import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, Modal, Animated, Image,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXERCICIOS, GRUPOS, PLANOS, MUSCLE_IMAGES } from '../data/exercises';
import { salvar, carregar, KEYS, atualizarStreak } from '../utils/storage';
import { EXERCICIO_MUSCULOS } from '../components/MuscleMap';
import { carregar as carregarStorage } from '../utils/storage';

// ─── Todos os músculos disponíveis para mapeamento ───────────────────────────
const TODOS_MUSCULOS = [
  'peitoral','peitoral_sup','deltoides','deltoides_post',
  'biceps','triceps','antebraco',
  'abdomen','obliquo',
  'dorsais','trapezio','lombar',
  'gluteos','quadriceps','isquiotibiais',
  'tibial','panturrilha',
];
const MUSCULO_LABEL = {
  peitoral:'Peitoral', peitoral_sup:'Peitoral Sup.', deltoides:'Deltoides',
  deltoides_post:'Deltoides Post.', biceps:'Bíceps', triceps:'Tríceps',
  antebraco:'Antebraço', abdomen:'Abdômen', obliquo:'Oblíquos',
  dorsais:'Dorsais', trapezio:'Trapézio', lombar:'Lombar',
  gluteos:'Glúteos', quadriceps:'Quadríceps', isquiotibiais:'Isquiotibiais',
  tibial:'Tibial', panturrilha:'Panturrilha',
};

// ─── Modal: Cadastrar exercício customizado ───────────────────────────────────
function ModalCadastrarExercicio({ visivel, onFechar, onSalvar }) {
  const [nome, setNome]       = useState('');
  const [grupo, setGrupo]     = useState('');
  const [series, setSeries]   = useState('3');
  const [reps, setReps]       = useState('12');
  const [desc, setDesc]       = useState('');
  const [primarios, setPrimarios]   = useState([]);
  const [secundarios, setSecundarios] = useState([]);

  function toggleMusculo(id, tipo) {
    if (tipo === 'prim') {
      setPrimarios(p => p.includes(id) ? p.filter(x => x !== id) : [...p.filter(x => x !== id), id]);
      setSecundarios(s => s.filter(x => x !== id));
    } else {
      setSecundarios(s => s.includes(id) ? s.filter(x => x !== id) : [...s.filter(x => x !== id), id]);
      setPrimarios(p => p.filter(x => x !== id));
    }
  }

  async function salvar_exercicio() {
    if (!nome.trim() || !grupo) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e o grupo muscular.');
      return;
    }
    const exercicio = {
      id: `custom_${Date.now()}`,
      nome: nome.trim(),
      grupo,
      series: parseInt(series) || 3,
      reps,
      desc: desc.trim() || `Execute ${nome.trim()} com boa forma.`,
      isCustom: true,
      musculos: { primarios, secundarios },
    };
    const existentes = await carregar(KEYS.EXERCICIOS_CUSTOM, []);
    await salvar(KEYS.EXERCICIOS_CUSTOM, [...existentes, exercicio]);
    onSalvar(exercicio);
    resetar();
  }

  function resetar() {
    setNome(''); setGrupo(''); setSeries('3'); setReps('12');
    setDesc(''); setPrimarios([]); setSecundarios([]);
  }

  return (
    <Modal visible={visivel} animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={stylesModal.bg}>
          {/* Header */}
          <View style={stylesModal.header}>
            <TouchableOpacity onPress={() => { resetar(); onFechar(); }}>
              <Text style={stylesModal.fechar}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={stylesModal.titulo}>Novo Exercício</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={stylesModal.scroll} showsVerticalScrollIndicator={false}>
            {/* Nome */}
            <View style={stylesModal.bloco}>
              <Text style={stylesModal.blocoTitulo}>📝 Identificação</Text>
              <Text style={stylesModal.label}>Nome do exercício *</Text>
              <TextInput style={stylesModal.input} value={nome} onChangeText={setNome}
                placeholder="Ex: Rosca Concentrada" placeholderTextColor="#555" />

              <Text style={stylesModal.label}>Grupo muscular *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {[...GRUPOS, 'Funcional', 'Mobilidade'].map(g => (
                  <TouchableOpacity key={g}
                    style={[stylesModal.chip, grupo === g && stylesModal.chipAtivo]}
                    onPress={() => setGrupo(g)}>
                    <Text style={[stylesModal.chipTxt, grupo === g && stylesModal.chipTxtAtivo]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Séries e reps */}
            <View style={stylesModal.bloco}>
              <Text style={stylesModal.blocoTitulo}>⚙️ Volume</Text>
              <View style={stylesModal.rowDupla}>
                <View style={{ flex: 1 }}>
                  <Text style={stylesModal.label}>Séries</Text>
                  <TextInput style={stylesModal.input} value={series} onChangeText={setSeries}
                    keyboardType="numeric" placeholder="3" placeholderTextColor="#555" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={stylesModal.label}>Repetições</Text>
                  <TextInput style={stylesModal.input} value={reps} onChangeText={setReps}
                    placeholder="8-12" placeholderTextColor="#555" />
                </View>
              </View>
            </View>

            {/* Descrição */}
            <View style={stylesModal.bloco}>
              <Text style={stylesModal.blocoTitulo}>📋 Descrição</Text>
              <TextInput style={[stylesModal.input, { height: 90, textAlignVertical: 'top' }]}
                value={desc} onChangeText={setDesc} multiline
                placeholder="Como executar o exercício corretamente..."
                placeholderTextColor="#555" />
            </View>

            {/* Músculos */}
            <View style={stylesModal.bloco}>
              <Text style={stylesModal.blocoTitulo}>💪 Músculos Trabalhados</Text>
              <Text style={stylesModal.sub}>Toque 1x para principal (vermelho), 2x para auxiliar (laranja), 3x para remover.</Text>

              <View style={stylesModal.musculosGrid}>
                {TODOS_MUSCULOS.map(id => {
                  const isPrim = primarios.includes(id);
                  const isSec  = secundarios.includes(id);
                  return (
                    <TouchableOpacity key={id}
                      style={[
                        stylesModal.musculoTag,
                        isPrim && stylesModal.musculoPrim,
                        isSec  && stylesModal.musculoSec,
                      ]}
                      onPress={() => {
                        if (!isPrim && !isSec) toggleMusculo(id, 'prim');
                        else if (isPrim) toggleMusculo(id, 'sec');
                        else { setPrimarios(p => p.filter(x => x !== id)); setSecundarios(s => s.filter(x => x !== id)); }
                      }}>
                      <Text style={[
                        stylesModal.musculoTxt,
                        isPrim && { color: '#fff' },
                        isSec  && { color: '#fff' },
                      ]}>{MUSCULO_LABEL[id]}</Text>
                      {isPrim && <Text style={stylesModal.musculoIndicador}>●</Text>}
                      {isSec  && <Text style={[stylesModal.musculoIndicador, { color: '#f5a623' }]}>●</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {(primarios.length > 0 || secundarios.length > 0) && (
                <View style={stylesModal.legendaWrap}>
                  {primarios.length > 0 && (
                    <Text style={stylesModal.legendaPrim}>🔴 Principal: {primarios.map(id => MUSCULO_LABEL[id]).join(', ')}</Text>
                  )}
                  {secundarios.length > 0 && (
                    <Text style={stylesModal.legendaSec}>🟠 Auxiliar: {secundarios.map(id => MUSCULO_LABEL[id]).join(', ')}</Text>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity style={stylesModal.salvarBtn} onPress={salvar_exercicio}>
              <LinearGradient colors={['#533483', '#e94560']} style={stylesModal.salvarGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={stylesModal.salvarTxt}>💾 Salvar Exercício</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const stylesModal = StyleSheet.create({
  bg:       { flex: 1, backgroundColor: '#0d0d1a' },
  header:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#1a1a2e' },
  fechar:   { color: '#e94560', fontSize: 15 },
  titulo:   { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  scroll:   { padding: 16 },
  bloco:    { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 12 },
  blocoTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 12 },
  label:    { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 4 },
  sub:      { color: '#666', fontSize: 12, marginBottom: 12, lineHeight: 18 },
  input:    { backgroundColor: '#0d0d1a', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, marginBottom: 4, borderWidth: 1, borderColor: '#2a2a3e' },
  rowDupla: { flexDirection: 'row' },
  chip:     { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#0d0d1a', marginRight: 8, borderWidth: 1, borderColor: '#2a2a3e' },
  chipAtivo:{ backgroundColor: '#533483', borderColor: '#533483' },
  chipTxt:  { color: '#888', fontSize: 13 },
  chipTxtAtivo: { color: '#fff', fontWeight: '700' },
  musculosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  musculoTag:   { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#0d0d1a', borderWidth: 1, borderColor: '#2a2a3e', flexDirection: 'row', alignItems: 'center', gap: 4 },
  musculoPrim:  { backgroundColor: '#e94560', borderColor: '#e94560' },
  musculoSec:   { backgroundColor: '#f5a623', borderColor: '#f5a623' },
  musculoTxt:   { color: '#aaa', fontSize: 12, fontWeight: '600' },
  musculoIndicador: { color: '#fff', fontSize: 10 },
  legendaWrap:  { backgroundColor: '#0d0d1a', borderRadius: 10, padding: 10, marginTop: 10, gap: 4 },
  legendaPrim:  { color: '#e94560', fontSize: 12 },
  legendaSec:   { color: '#f5a623', fontSize: 12 },
  salvarBtn:    { borderRadius: 14, overflow: 'hidden', marginBottom: 40, marginTop: 8 },
  salvarGrad:   { padding: 18, alignItems: 'center' },
  salvarTxt:    { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});

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
  const [exerciciosCustom, setExerciciosCustom] = useState([]);
  const [modalCadastrar, setModalCadastrar]     = useState(false);
  const timerRef   = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    carregarCustom();
    return () => clearInterval(timerRef.current);
  }, []);

  async function carregarCustom() {
    const custom = await carregar(KEYS.EXERCICIOS_CUSTOM, []);
    setExerciciosCustom(custom);
  }

  function onExercicioCadastrado(ex) {
    setExerciciosCustom(prev => [...prev, ex]);
    setModalCadastrar(false);
  }

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

  // Mescla exercícios do sistema com os customizados
  const todosExercicios = [
    ...EXERCICIOS,
    ...exerciciosCustom.map(e => ({ ...e, id: e.id })),
  ];

  const exerciciosFiltrados = grupoFiltro === 'Todos'
    ? todosExercicios
    : grupoFiltro === 'Meus'
      ? exerciciosCustom
      : todosExercicios.filter(e => e.grupo === grupoFiltro);

  // Para o EXERCICIO_MUSCULOS, inclui os customizados
  const musculosPorId = {
    ...EXERCICIO_MUSCULOS,
    ...Object.fromEntries(exerciciosCustom.map(e => [e.id, e.musculos || { primarios: [], secundarios: [] }])),
  };

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
          <View style={styles.filtrosRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
              {['Todos', 'Meus', ...GRUPOS].map(g => (
                <TouchableOpacity key={g}
                  style={[styles.filtroChip, grupoFiltro === g && styles.filtroAtivo]}
                  onPress={() => setGrupoFiltro(g)}>
                  <Text style={[styles.filtroText, grupoFiltro === g && styles.filtroTextAtivo]}>
                    {g === 'Meus' ? `⭐ Meus (${exerciciosCustom.length})` : g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.addExBtn} onPress={() => setModalCadastrar(true)}>
              <Text style={styles.addExBtnTxt}>+ Novo</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={exerciciosFiltrados}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.exCard}>
                {/* Barra colorida lateral */}
                <View style={[styles.exColorBar, { backgroundColor: GRUPO_COR[item.grupo] || '#533483' }]} />

                {/* Info */}
                <View style={styles.exInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Text style={styles.exNome}>{item.nome}</Text>
                    {item.isCustom && (
                      <View style={styles.customBadge}><Text style={styles.customBadgeTxt}>⭐ Meu</Text></View>
                    )}
                  </View>
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

      {/* ── MODAL CADASTRAR EXERCÍCIO ─────────────────────────────────────── */}
      <ModalCadastrarExercicio
        visivel={modalCadastrar}
        onFechar={() => setModalCadastrar(false)}
        onSalvar={onExercicioCadastrado}
      />

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
              {musculosPorId[exAtual.id] && (
                <View style={styles.musculosTags}>
                  {musculosPorId[exAtual.id].primarios.map(m => (
                    <View key={m} style={styles.tagPrim}>
                      <Text style={styles.tagPrimTxt}>{m.replace(/_/g,' ')}</Text>
                    </View>
                  ))}
                  {musculosPorId[exAtual.id].secundarios.map(m => (
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
  filtrosRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addExBtn:         { backgroundColor: '#e94560', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginLeft: 8, marginRight: 4 },
  addExBtnTxt:      { color: '#fff', fontWeight: '700', fontSize: 13 },
  customBadge:      { backgroundColor: '#53348330', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: '#533483' },
  customBadgeTxt:   { color: '#a78bfa', fontSize: 10, fontWeight: '700' },
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
