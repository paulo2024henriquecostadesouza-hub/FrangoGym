import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, Modal, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXERCICIOS, GRUPOS, PLANOS } from '../data/exercises';
import { salvar, carregar, KEYS, atualizarStreak } from '../utils/storage';
import MuscleMap, { EXERCICIO_MUSCULOS, MUSCULOS } from '../components/MuscleMap';

export default function TreinosScreen() {
  const [aba, setAba] = useState('planos'); // 'planos' | 'exercicios'
  const [grupoFiltro, setGrupoFiltro] = useState('Todos');
  const [treinoAtivo, setTreinoAtivo] = useState(null);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [serieAtual, setSerieAtual] = useState(1);
  const [descansando, setDescansando] = useState(false);
  const [tempo, setTempo] = useState(60);
  const timerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function iniciarDescanso() {
    setDescansando(true);
    setTempo(60);
    progressAnim.setValue(1);
    Animated.timing(progressAnim, { toValue: 0, duration: 60000, useNativeDriver: false }).start();
    timerRef.current = setInterval(() => {
      setTempo(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setDescansando(false);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function proximaSerie() {
    const ex = treinoAtivo.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean);
    if (serieAtual < ex[exercicioAtual].series) {
      setSerieAtual(s => s + 1);
      iniciarDescanso();
    } else if (exercicioAtual < ex.length - 1) {
      setExercicioAtual(i => i + 1);
      setSerieAtual(1);
      iniciarDescanso();
    } else {
      await concluirTreino();
    }
  }

  async function concluirTreino() {
    const feitos = await carregar(KEYS.TREINOS_FEITOS, []);
    feitos.push({ data: new Date().toISOString(), nome: treinoAtivo.nome });
    await salvar(KEYS.TREINOS_FEITOS, feitos);
    await atualizarStreak();
    setTreinoAtivo(null);
    setExercicioAtual(0);
    setSerieAtual(1);
  }

  const exerciciosFiltrados = grupoFiltro === 'Todos'
    ? EXERCICIOS
    : EXERCICIOS.filter(e => e.grupo === grupoFiltro);

  const exsAtivos = treinoAtivo
    ? treinoAtivo.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean)
    : [];

  // Pré-calcular músculos do treino inteiro (evita IIFE no JSX)
  const todosMusculosP = [...new Set(exsAtivos.flatMap(e => EXERCICIO_MUSCULOS[e.id]?.primarios || []))];
  const todosMusculosS = [...new Set(exsAtivos.flatMap(e => EXERCICIO_MUSCULOS[e.id]?.secundarios || []).filter(m => !todosMusculosP.includes(m)))];
  const musculosExAtual = exsAtivos[exercicioAtual] ? EXERCICIO_MUSCULOS[exsAtivos[exercicioAtual].id] : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.titulo}>Treinos</Text>
        <View style={styles.abas}>
          <TouchableOpacity
            style={[styles.aba, aba === 'planos' && styles.abaAtiva]}
            onPress={() => setAba('planos')}>
            <Text style={[styles.abaText, aba === 'planos' && styles.abaTextAtiva]}>Planos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aba, aba === 'exercicios' && styles.abaAtiva]}
            onPress={() => setAba('exercicios')}>
            <Text style={[styles.abaText, aba === 'exercicios' && styles.abaTextAtiva]}>Exercícios</Text>
          </TouchableOpacity>
        </View>
      </View>

      {aba === 'planos' ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {PLANOS.map(plano => (
            <View key={plano.id} style={styles.planoCard}>
              <View style={styles.planoHeader}>
                <View>
                  <Text style={styles.planoNome}>{plano.nome}</Text>
                  <View style={styles.nivelBadge}>
                    <Text style={styles.nivelText}>{plano.nivel}</Text>
                  </View>
                </View>
                <Text style={styles.planoDias}>{plano.dias.length}x/sem</Text>
              </View>
              {plano.treinos.map((t, i) => {
                const exs = t.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean);
                return (
                  <TouchableOpacity key={i} style={styles.treinoItem}
                    onPress={() => { setTreinoAtivo(t); setExercicioAtual(0); setSerieAtual(1); }}>
                    <View style={styles.diaCircle}>
                      <Text style={styles.diaText}>{t.dia}</Text>
                    </View>
                    <View style={styles.treinoInfo}>
                      <Text style={styles.treinoNome}>{t.nome}</Text>
                      <Text style={styles.treinoExs}>{exs.length} exercícios · {exs.reduce((a, e) => a + e.series, 0)} séries</Text>
                    </View>
                    <Text style={styles.playBtn}>▶</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      ) : (
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
            renderItem={({ item }) => {
              const musculos = EXERCICIO_MUSCULOS[item.id] || { primarios: [], secundarios: [] };
              return (
                <View style={styles.exCard}>
                  <View style={styles.exGrupoBar} />
                  <View style={styles.exInfo}>
                    <Text style={styles.exNome}>{item.nome}</Text>
                    <Text style={styles.exGrupo}>{item.grupo}</Text>
                    <Text style={styles.exDesc}>{item.desc}</Text>
                    <Text style={styles.exSeries}>{item.series} séries · {item.reps} reps</Text>
                    <View style={styles.exMuscleArea}>
                      <MuscleMap
                        primarios={musculos.primarios}
                        secundarios={musculos.secundarios}
                        escala={0.55}
                        mostrarLegenda={true}
                      />
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      <Modal visible={!!treinoAtivo} animationType="slide">
        <LinearGradient colors={['#0d0d1a', '#1a1a2e']} style={styles.modalContainer}>
          <TouchableOpacity style={styles.fecharBtn} onPress={() => setTreinoAtivo(null)}>
            <Text style={styles.fecharText}>✕ Encerrar</Text>
          </TouchableOpacity>

          {exsAtivos.length > 0 && (
            <>
              {exercicioAtual === 0 && !descansando && (
                <View style={styles.treinoResumoMap}>
                  <Text style={styles.treinoResumoTitulo}>💪 Músculos deste treino</Text>
                  <MuscleMap primarios={todosMusculosP} secundarios={todosMusculosS} escala={0.5} mostrarLegenda={true} />
                </View>
              )}
              <Text style={styles.progressoText}>
                Exercício {exercicioAtual + 1} de {exsAtivos.length}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((exercicioAtual) / exsAtivos.length) * 100}%` }]} />
              </View>

              <View style={styles.exAtivo}>
                <Text style={styles.exAtivoGrupo}>{exsAtivos[exercicioAtual].grupo}</Text>
                <Text style={styles.exAtivoNome}>{exsAtivos[exercicioAtual].nome}</Text>
                <Text style={styles.exAtivoDesc}>{exsAtivos[exercicioAtual].desc}</Text>

                {musculosExAtual && (
                  <View style={styles.muscleMapAtivo}>
                    <MuscleMap
                      primarios={musculosExAtual.primarios}
                      secundarios={musculosExAtual.secundarios}
                      escala={0.6}
                      mostrarLegenda={true}
                    />
                  </View>
                )}

                <View style={styles.serieInfo}>
                  <View style={styles.serieBox}>
                    <Text style={styles.serieNum}>{serieAtual}</Text>
                    <Text style={styles.serieLabel}>Série</Text>
                  </View>
                  <Text style={styles.serieSep}>de</Text>
                  <View style={styles.serieBox}>
                    <Text style={styles.serieNum}>{exsAtivos[exercicioAtual].series}</Text>
                    <Text style={styles.serieLabel}>Total</Text>
                  </View>
                  <View style={styles.serieBox}>
                    <Text style={styles.serieNum}>{exsAtivos[exercicioAtual].reps}</Text>
                    <Text style={styles.serieLabel}>Reps</Text>
                  </View>
                </View>

                {descansando ? (
                  <View style={styles.descansArea}>
                    <Text style={styles.descansLabel}>⏱ Descansando...</Text>
                    <Text style={styles.descansTimer}>{tempo}s</Text>
                    <Animated.View style={[styles.descansBar, {
                      width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                    }]} />
                    <TouchableOpacity style={styles.pularBtn} onPress={() => {
                      clearInterval(timerRef.current);
                      setDescansando(false);
                    }}>
                      <Text style={styles.pularText}>Pular descanso</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.feito} onPress={proximaSerie}>
                    <LinearGradient colors={['#e94560', '#c0392b']} style={styles.feitoGrad}>
                      <Text style={styles.feitoText}>
                        {exercicioAtual === exsAtivos.length - 1 && serieAtual === exsAtivos[exercicioAtual].series
                          ? '🏆 Concluir Treino'
                          : '✓ Série Concluída'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView horizontal style={styles.listaExs} showsHorizontalScrollIndicator={false}>
                {exsAtivos.map((e, i) => (
                  <View key={i} style={[styles.exMini, i === exercicioAtual && styles.exMiniAtivo,
                    i < exercicioAtual && styles.exMiniFeito]}>
                    <Text style={styles.exMiniNome}>{e.nome}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  headerArea: { padding: 20, paddingTop: 50, backgroundColor: '#1a1a2e' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  abas: { flexDirection: 'row', backgroundColor: '#0d0d1a', borderRadius: 10, padding: 4 },
  aba: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  abaAtiva: { backgroundColor: '#533483' },
  abaText: { color: '#666', fontWeight: '600' },
  abaTextAtiva: { color: '#fff' },
  scroll: { flex: 1, padding: 16 },
  filtros: { maxHeight: 44, marginBottom: 12 },
  filtroChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#1e1e30', marginRight: 8,
  },
  filtroAtivo: { backgroundColor: '#533483' },
  filtroText: { color: '#888', fontSize: 13 },
  filtroTextAtivo: { color: '#fff' },
  planoCard: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 16 },
  planoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  planoNome: { color: '#fff', fontSize: 16, fontWeight: 'bold', maxWidth: '80%' },
  nivelBadge: { backgroundColor: '#533483', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4, alignSelf: 'flex-start' },
  nivelText: { color: '#fff', fontSize: 11 },
  planoDias: { color: '#e94560', fontWeight: 'bold', fontSize: 16 },
  treinoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#2a2a3e' },
  diaCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#0f3460', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  diaText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  treinoInfo: { flex: 1 },
  treinoNome: { color: '#fff', fontWeight: '600' },
  treinoExs: { color: '#888', fontSize: 12, marginTop: 2 },
  playBtn: { color: '#e94560', fontSize: 20 },
  exCard: { flexDirection: 'row', backgroundColor: '#1e1e30', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  exGrupoBar: { width: 4, backgroundColor: '#533483' },
  exInfo: { flex: 1, padding: 14 },
  exNome: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  exGrupo: { color: '#e94560', fontSize: 12, marginTop: 2 },
  exDesc: { color: '#888', fontSize: 12, marginTop: 4 },
  exSeries: { color: '#aaa', fontSize: 12, marginTop: 6 },
  modalContainer: { flex: 1, padding: 20 },
  fecharBtn: { alignSelf: 'flex-end', marginTop: 40, padding: 10 },
  fecharText: { color: '#e94560', fontSize: 15 },
  progressoText: { color: '#aaa', textAlign: 'center', marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#1e1e30', borderRadius: 2, marginBottom: 30 },
  progressFill: { height: 4, backgroundColor: '#533483', borderRadius: 2 },
  exAtivo: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  exAtivoGrupo: { color: '#e94560', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 },
  exAtivoNome: { color: '#fff', fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
  exAtivoDesc: { color: '#aaa', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  serieInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 30, gap: 16 },
  serieBox: { alignItems: 'center', backgroundColor: '#1e1e30', padding: 16, borderRadius: 14, minWidth: 70 },
  serieNum: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  serieLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  serieSep: { color: '#555', fontSize: 14 },
  descansArea: { width: '100%', alignItems: 'center', marginTop: 24 },
  descansLabel: { color: '#aaa', fontSize: 14 },
  descansTimer: { color: '#fff', fontSize: 48, fontWeight: 'bold', marginTop: 4 },
  descansBar: { height: 4, backgroundColor: '#533483', borderRadius: 2, marginTop: 12 },
  pularBtn: { marginTop: 12 },
  pularText: { color: '#e94560' },
  feito: { marginTop: 30, width: '100%', borderRadius: 14, overflow: 'hidden' },
  feitoGrad: { padding: 18, alignItems: 'center' },
  feitoText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  listaExs: { marginTop: 20 },
  exMini: {
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#1e1e30',
    borderRadius: 20, marginRight: 8,
  },
  exMiniAtivo: { backgroundColor: '#533483' },
  exMiniFeito: { backgroundColor: '#1a3a1a' },
  exMiniNome: { color: '#fff', fontSize: 12 },
  exMuscleArea: { marginTop: 12, alignItems: 'center' },
  muscleMapAtivo: { marginVertical: 12, alignItems: 'center', width: '100%' },
  treinoResumoMap: {
    backgroundColor: '#1e1e30', borderRadius: 16, padding: 14,
    marginBottom: 12, alignItems: 'center',
  },
  treinoResumoTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 10 },
});
