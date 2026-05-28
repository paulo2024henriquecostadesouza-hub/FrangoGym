import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { carregar, KEYS } from '../utils/storage';
import { PLANOS, EXERCICIOS } from '../data/exercises';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [treinosFeitos, setTreinosFeitos] = useState([]);
  const [diaSemana, setDiaSemana] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const s = await carregar(KEYS.STREAK, 0);
    const tf = await carregar(KEYS.TREINOS_FEITOS, []);
    setStreak(s);
    setTreinosFeitos(tf);

    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    setDiaSemana(dias[new Date().getDay()]);
  }

  const plano = PLANOS[0];
  const treinoHoje = plano.treinos.find(t => t.dia === diaSemana);
  const exerciciosHoje = treinoHoje
    ? treinoHoje.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean)
    : [];

  const totalSemana = treinosFeitos.filter(t => {
    const d = new Date(t.data);
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    return d >= inicioSemana;
  }).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.saudacao}>Bom treino! 💪</Text>
        <Text style={styles.data}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{streak}</Text>
            <Text style={styles.statLabel}>🔥 Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalSemana}</Text>
            <Text style={styles.statLabel}>📅 Treinos/semana</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{treinosFeitos.length}</Text>
            <Text style={styles.statLabel}>🏆 Total</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {treinoHoje ? (
          <>
            <Text style={styles.secaoTitulo}>Treino de Hoje</Text>
            <TouchableOpacity
              style={styles.treinoCard}
              onPress={() => navigation.navigate('Treinos', { treinoId: treinoHoje })}
            >
              <LinearGradient colors={['#0f3460', '#533483']} style={styles.treinoGrad}>
                <Text style={styles.treinoNome}>{treinoHoje.nome}</Text>
                <Text style={styles.treinoInfo}>
                  {exerciciosHoje.length} exercícios · {exerciciosHoje.reduce((a, e) => a + e.series, 0)} séries
                </Text>
                <View style={styles.gruposRow}>
                  {[...new Set(exerciciosHoje.map(e => e.grupo))].map(g => (
                    <View key={g} style={styles.grupoTag}>
                      <Text style={styles.grupoTagText}>{g}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.descansCard}>
            <Text style={styles.descansEmoji}>😴</Text>
            <Text style={styles.descansText}>Dia de descanso!</Text>
            <Text style={styles.descansSubtext}>Recuperação é parte do treino.</Text>
          </View>
        )}

        <Text style={styles.secaoTitulo}>Semana</Text>
        <View style={styles.semanaDias}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => {
            const temTreino = plano.dias.includes(dia);
            const feito = treinosFeitos.some(t => {
              const d = new Date(t.data);
              const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
              return dias[d.getDay()] === dia;
            });
            const ehHoje = dia === diaSemana;
            return (
              <View key={dia} style={[
                styles.diaBox,
                ehHoje && styles.diaHoje,
                feito && styles.diaFeito,
              ]}>
                <Text style={[styles.diaNome, (ehHoje || feito) && styles.diaTextoAtivo]}>{dia}</Text>
                <View style={[
                  styles.diaDot,
                  temTreino && styles.diaDotTreino,
                  feito && styles.diaDotFeito,
                ]} />
              </View>
            );
          })}
        </View>

        <Text style={styles.secaoTitulo}>Próximos Treinos</Text>
        {plano.treinos.slice(0, 3).map((t, i) => {
          const exs = t.exercicios.map(id => EXERCICIOS.find(e => e.id === id)).filter(Boolean);
          return (
            <TouchableOpacity key={i} style={styles.proximoCard}
              onPress={() => navigation.navigate('Treinos')}>
              <View style={styles.proximoDia}>
                <Text style={styles.proximoDiaText}>{t.dia}</Text>
              </View>
              <View style={styles.proximoInfo}>
                <Text style={styles.proximoNome}>{t.nome}</Text>
                <Text style={styles.proximoExs}>{exs.length} exercícios</Text>
              </View>
              <Text style={styles.setaDir}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: { padding: 24, paddingTop: 50, paddingBottom: 30 },
  saudacao: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  data: { fontSize: 14, color: '#aaa', marginTop: 4, marginBottom: 20, textTransform: 'capitalize' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: {
    flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, paddingVertical: 14, marginHorizontal: 4,
  },
  statNum: { fontSize: 26, fontWeight: 'bold', color: '#e94560' },
  statLabel: { fontSize: 11, color: '#aaa', marginTop: 2 },
  body: { padding: 16 },
  secaoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 12 },
  treinoCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  treinoGrad: { padding: 20 },
  treinoNome: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  treinoInfo: { color: '#ccc', marginTop: 6, marginBottom: 12 },
  gruposRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  grupoTag: {
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  grupoTagText: { color: '#fff', fontSize: 12 },
  descansCard: {
    backgroundColor: '#1e1e30', borderRadius: 16, padding: 30,
    alignItems: 'center', marginBottom: 8,
  },
  descansEmoji: { fontSize: 40 },
  descansText: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  descansSubtext: { color: '#888', marginTop: 4 },
  semanaDias: { flexDirection: 'row', justifyContent: 'space-between' },
  diaBox: {
    alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6,
    borderRadius: 10, flex: 1, marginHorizontal: 2,
    backgroundColor: '#1e1e30',
  },
  diaHoje: { backgroundColor: '#0f3460', borderWidth: 1, borderColor: '#533483' },
  diaFeito: { backgroundColor: '#1a3a1a' },
  diaNome: { fontSize: 11, color: '#666', fontWeight: '600' },
  diaTextoAtivo: { color: '#fff' },
  diaDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#333', marginTop: 4 },
  diaDotTreino: { backgroundColor: '#533483' },
  diaDotFeito: { backgroundColor: '#4caf50' },
  proximoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30',
    borderRadius: 12, padding: 14, marginBottom: 8,
  },
  proximoDia: {
    backgroundColor: '#533483', width: 44, height: 44,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  proximoDiaText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  proximoInfo: { flex: 1 },
  proximoNome: { color: '#fff', fontWeight: '600', fontSize: 15 },
  proximoExs: { color: '#888', fontSize: 12, marginTop: 2 },
  setaDir: { color: '#555', fontSize: 24 },
});
