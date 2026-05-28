import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { carregar, salvar, KEYS } from '../utils/storage';

const { width } = Dimensions.get('window');

function MiniBarChart({ data, cor = '#533483' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.valor));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 6, paddingTop: 8 }}>
      {data.map((d, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
          <View style={{
            width: '70%', backgroundColor: i === data.length - 1 ? cor : cor + '88',
            borderRadius: 4,
            height: max > 0 ? Math.max((d.valor / max) * 70, 4) : 4,
          }} />
          <Text style={{ color: '#666', fontSize: 10, marginTop: 4 }}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProgressoScreen() {
  const [treinosFeitos, setTreinosFeitos] = useState([]);
  const [histPeso, setHistPeso] = useState([]);
  const [novoPeso, setNovoPeso] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => { carregar_dados(); }, []);

  async function carregar_dados() {
    const tf = await carregar(KEYS.TREINOS_FEITOS, []);
    const hp = await carregar(KEYS.HISTORICO_PESO, []);
    const s = await carregar(KEYS.STREAK, 0);
    setTreinosFeitos(tf);
    setHistPeso(hp);
    setStreak(s);
  }

  async function salvarPeso() {
    const p = parseFloat(novoPeso.replace(',', '.'));
    if (isNaN(p) || p <= 0) return;
    const novo = [...histPeso, { valor: p, data: new Date().toLocaleDateString('pt-BR'), timestamp: Date.now() }];
    await salvar(KEYS.HISTORICO_PESO, novo);
    setHistPeso(novo);
    setNovoPeso('');
  }

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const treinos7Dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = diasSemana[d.getDay()];
    const valor = treinosFeitos.filter(t => {
      const td = new Date(t.data);
      return td.toDateString() === d.toDateString();
    }).length;
    return { label, valor };
  });

  const treinos30Dias = Array.from({ length: 4 }, (_, i) => {
    const semanaInicio = new Date();
    semanaInicio.setDate(semanaInicio.getDate() - (3 - i) * 7);
    const semanaFim = new Date(semanaInicio);
    semanaFim.setDate(semanaFim.getDate() + 6);
    const valor = treinosFeitos.filter(t => {
      const td = new Date(t.data);
      return td >= semanaInicio && td <= semanaFim;
    }).length;
    return { label: `S${i + 1}`, valor };
  });

  const totalMes = treinos30Dias.reduce((a, s) => a + s.valor, 0);
  const melhorSemana = Math.max(...treinos30Dias.map(s => s.valor));
  const pesoAtual = histPeso.length > 0 ? histPeso[histPeso.length - 1].valor : null;
  const pesoInicial = histPeso.length > 0 ? histPeso[0].valor : null;
  const difPeso = pesoAtual && pesoInicial ? (pesoAtual - pesoInicial).toFixed(1) : null;

  const pesoGrafico = histPeso.slice(-7).map((p, i) => ({ label: `${i + 1}`, valor: p.valor }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.titulo}>Progresso</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{treinosFeitos.length}</Text>
            <Text style={styles.statLabel}>Total de treinos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{streak} 🔥</Text>
            <Text style={styles.statLabel}>Streak atual</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalMes}</Text>
            <Text style={styles.statLabel}>Último mês</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Treinos — Última semana</Text>
          <MiniBarChart data={treinos7Dias} cor="#533483" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Treinos — Por semana (último mês)</Text>
          <View style={styles.row}>
            <View style={styles.metaBox}>
              <Text style={styles.metaNum}>{totalMes}</Text>
              <Text style={styles.metaLabel}>Total</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaNum}>{melhorSemana}</Text>
              <Text style={styles.metaLabel}>Melhor semana</Text>
            </View>
          </View>
          <MiniBarChart data={treinos30Dias} cor="#e94560" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Peso Corporal</Text>
          {pesoAtual && (
            <View style={styles.row}>
              <View style={styles.metaBox}>
                <Text style={styles.metaNum}>{pesoAtual} kg</Text>
                <Text style={styles.metaLabel}>Atual</Text>
              </View>
              {difPeso && (
                <View style={styles.metaBox}>
                  <Text style={[styles.metaNum, { color: parseFloat(difPeso) < 0 ? '#4caf50' : '#e94560' }]}>
                    {parseFloat(difPeso) > 0 ? '+' : ''}{difPeso} kg
                  </Text>
                  <Text style={styles.metaLabel}>Desde início</Text>
                </View>
              )}
            </View>
          )}
          {pesoGrafico.length > 1 && <MiniBarChart data={pesoGrafico} cor="#4caf50" />}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 78.5"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
              value={novoPeso}
              onChangeText={setNovoPeso}
            />
            <TouchableOpacity style={styles.addBtn} onPress={salvarPeso}>
              <Text style={styles.addText}>+ Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Histórico de treinos</Text>
        {treinosFeitos.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioText}>Nenhum treino registrado ainda.</Text>
            <Text style={styles.vazioSub}>Complete seu primeiro treino!</Text>
          </View>
        ) : (
          [...treinosFeitos].reverse().slice(0, 20).map((t, i) => (
            <View key={i} style={styles.histItem}>
              <View style={styles.histIcone}>
                <Text style={styles.histIconeText}>💪</Text>
              </View>
              <View style={styles.histInfo}>
                <Text style={styles.histNome}>{t.nome || 'Treino'}</Text>
                <Text style={styles.histData}>
                  {new Date(t.data).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: { padding: 24, paddingTop: 50 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 12, alignItems: 'center',
  },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statLabel: { color: '#888', fontSize: 11, marginTop: 2, textAlign: 'center' },
  body: { padding: 16 },
  card: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  metaBox: { flex: 1, backgroundColor: '#2a2a3e', borderRadius: 10, padding: 12, alignItems: 'center' },
  metaNum: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  metaLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  inputRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  input: {
    flex: 1, backgroundColor: '#2a2a3e', borderRadius: 10,
    padding: 12, color: '#fff', fontSize: 15,
  },
  addBtn: { backgroundColor: '#533483', borderRadius: 10, paddingHorizontal: 16, justifyContent: 'center' },
  addText: { color: '#fff', fontWeight: '600' },
  secaoTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 4 },
  vazio: { alignItems: 'center', padding: 30, backgroundColor: '#1e1e30', borderRadius: 16 },
  vazioText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  vazioSub: { color: '#888', marginTop: 4 },
  histItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30', borderRadius: 12, padding: 14, marginBottom: 8 },
  histIcone: { width: 40, height: 40, backgroundColor: '#2a2a3e', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  histIconeText: { fontSize: 18 },
  histInfo: { flex: 1 },
  histNome: { color: '#fff', fontWeight: '600' },
  histData: { color: '#888', fontSize: 12, marginTop: 2 },
});
