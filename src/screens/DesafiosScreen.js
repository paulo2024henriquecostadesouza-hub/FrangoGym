import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { carregar, salvar, KEYS } from '../utils/storage';

const CONQUISTAS_DEF = [
  { id: 'primeiro_treino', emoji: '🥇', nome: 'Primeiro Passo', desc: 'Complete seu primeiro treino', meta: 1, chave: 'total_treinos' },
  { id: 'semana_completa', emoji: '🔥', nome: 'Semana de Fogo', desc: 'Complete 5 treinos em uma semana', meta: 5, chave: 'semana_max' },
  { id: 'dez_treinos', emoji: '💪', nome: 'Dedicado', desc: 'Complete 10 treinos no total', meta: 10, chave: 'total_treinos' },
  { id: 'streak_7', emoji: '⚡', nome: 'Imparável', desc: 'Mantenha um streak de 7 dias', meta: 7, chave: 'streak' },
  { id: 'trinta_treinos', emoji: '🏆', nome: 'Atleta', desc: 'Complete 30 treinos no total', meta: 30, chave: 'total_treinos' },
  { id: 'streak_30', emoji: '👑', nome: 'Lenda', desc: 'Mantenha um streak de 30 dias', meta: 30, chave: 'streak' },
  { id: 'peso_registrado', emoji: '⚖️', nome: 'Consciente', desc: 'Registre seu peso pela primeira vez', meta: 1, chave: 'total_pesos' },
  { id: 'nutricao_3', emoji: '🥗', nome: 'Nutricionista', desc: 'Registre alimentação por 3 dias', meta: 3, chave: 'dias_nutricao' },
  { id: 'cinquenta_treinos', emoji: '🌟', nome: 'Lendário', desc: 'Complete 50 treinos no total', meta: 50, chave: 'total_treinos' },
];

const DESAFIOS_SEMANA = [
  { id: 'd1', titulo: '3 treinos esta semana', emoji: '💪', pontos: 50, meta: 3, chave: 'semana_treinos' },
  { id: 'd2', titulo: 'Registre 5 refeições', emoji: '🥗', pontos: 30, meta: 5, chave: 'semana_refeicoes' },
  { id: 'd3', titulo: 'Beba 2L de água hoje', emoji: '💧', pontos: 20, meta: 1, chave: 'agua_hoje' },
  { id: 'd4', titulo: 'Faça um treino de 45min', emoji: '⏱', pontos: 40, meta: 1, chave: 'treino_longo' },
];

export default function DesafiosScreen() {
  const [stats, setStats] = useState({ total_treinos: 0, streak: 0, semana_max: 0, total_pesos: 0, dias_nutricao: 0, semana_treinos: 0, semana_refeicoes: 0 });
  const [conquistasDesbloqueadas, setConquistasDesbloqueadas] = useState([]);
  const [pontos, setPontos] = useState(0);

  useEffect(() => { carregarStats(); }, []);

  async function carregarStats() {
    const treinos = await carregar(KEYS.TREINOS_FEITOS, []);
    const pesos = await carregar(KEYS.HISTORICO_PESO, []);
    const refeicoes = await carregar(KEYS.REFEICOES, {});
    const streak = await carregar(KEYS.STREAK, 0);
    const conquistas = await carregar(KEYS.CONQUISTAS, []);

    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());

    const treinos_semana = treinos.filter(t => new Date(t.data) >= inicioSemana).length;

    const dias_semana_contagem = {};
    treinos.forEach(t => {
      const semana = new Date(t.data);
      semana.setDate(semana.getDate() - semana.getDay());
      const k = semana.toDateString();
      dias_semana_contagem[k] = (dias_semana_contagem[k] || 0) + 1;
    });
    const semana_max = Object.values(dias_semana_contagem).length > 0 ? Math.max(...Object.values(dias_semana_contagem)) : 0;

    const novasStats = {
      total_treinos: treinos.length,
      streak,
      semana_max,
      total_pesos: pesos.length,
      dias_nutricao: Object.keys(refeicoes).filter(k => refeicoes[k].length > 0).length,
      semana_treinos: treinos_semana,
      semana_refeicoes: Object.values(refeicoes).flat().length,
    };
    setStats(novasStats);
    setConquistasDesbloqueadas(conquistas);

    let totalPontos = 0;
    const novasConquistas = [...conquistas];
    CONQUISTAS_DEF.forEach(c => {
      const progresso = novasStats[c.chave] || 0;
      if (progresso >= c.meta && !conquistas.includes(c.id)) {
        novasConquistas.push(c.id);
        totalPontos += 100;
      }
    });
    if (novasConquistas.length !== conquistas.length) {
      await salvar(KEYS.CONQUISTAS, novasConquistas);
      setConquistasDesbloqueadas(novasConquistas);
    }

    const nivel = Math.floor(novasConquistas.length * 100 / 10) * 10;
    setPontos(novasConquistas.length * 100 + nivel);
  }

  const nivel = Math.floor(pontos / 500) + 1;
  const xpNivel = pontos % 500;
  const pctNivel = (xpNivel / 500) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.titulo}>Desafios</Text>

        <View style={styles.nivelCard}>
          <LinearGradient colors={['#f39c12', '#e74c3c']} style={styles.nivelBadge}>
            <Text style={styles.nivelNum}>Nível {nivel}</Text>
          </LinearGradient>
          <View style={styles.nivelInfo}>
            <View style={styles.nivelRow}>
              <Text style={styles.pontosText}>{pontos} XP total</Text>
              <Text style={styles.proximoNivel}>{500 - xpNivel} para nível {nivel + 1}</Text>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${pctNivel}%` }]} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.secaoTitulo}>Desafios da Semana</Text>
        {DESAFIOS_SEMANA.map(d => {
          const progresso = Math.min(stats[d.chave] || 0, d.meta);
          const completo = progresso >= d.meta;
          return (
            <View key={d.id} style={[styles.desafioCard, completo && styles.desafioCompleto]}>
              <Text style={styles.desafioEmoji}>{d.emoji}</Text>
              <View style={styles.desafioInfo}>
                <Text style={styles.desafioTitulo}>{d.titulo}</Text>
                <View style={styles.desafioTrack}>
                  <View style={[styles.desafioFill, { width: `${(progresso / d.meta) * 100}%` }]} />
                </View>
                <Text style={styles.desafioProgresso}>{progresso}/{d.meta}</Text>
              </View>
              <View style={[styles.desafioPontos, completo && styles.desafioConcluidoBadge]}>
                <Text style={styles.desafioPontosText}>{completo ? '✓' : `+${d.pontos}`}</Text>
                <Text style={styles.desafioPontosLabel}>{completo ? 'Feito' : 'XP'}</Text>
              </View>
            </View>
          );
        })}

        <Text style={styles.secaoTitulo}>Conquistas</Text>
        <View style={styles.conquistasGrid}>
          {CONQUISTAS_DEF.map(c => {
            const desbloqueada = conquistasDesbloqueadas.includes(c.id);
            const progresso = stats[c.chave] || 0;
            const pct = Math.min((progresso / c.meta) * 100, 100);
            return (
              <View key={c.id} style={[styles.conquistaCard, !desbloqueada && styles.conquistaBloqueada]}>
                <Text style={[styles.conquistaEmoji, !desbloqueada && { opacity: 0.3 }]}>{c.emoji}</Text>
                <Text style={[styles.conquistaNome, !desbloqueada && styles.conquistaNomeBloq]}>{c.nome}</Text>
                <Text style={styles.conquistaDesc}>{c.desc}</Text>
                {!desbloqueada && (
                  <View style={styles.conquistaProgressBar}>
                    <View style={[styles.conquistaProgressFill, { width: `${pct}%` }]} />
                  </View>
                )}
                {desbloqueada && (
                  <View style={styles.conquistaCheck}>
                    <Text style={styles.conquistaCheckText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.secaoTitulo}>Suas estatísticas</Text>
          {[
            { label: 'Total de treinos', valor: stats.total_treinos, emoji: '💪' },
            { label: 'Streak atual', valor: `${stats.streak} dias 🔥`, emoji: '⚡' },
            { label: 'Melhor semana', valor: `${stats.semana_max} treinos`, emoji: '📅' },
            { label: 'Dias com nutrição', valor: stats.dias_nutricao, emoji: '🥗' },
            { label: 'Conquistas', valor: `${conquistasDesbloqueadas.length}/${CONQUISTAS_DEF.length}`, emoji: '🏆' },
          ].map((s, i) => (
            <View key={i} style={styles.statRow}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValor}>{s.valor}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: { padding: 24, paddingTop: 50 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  nivelCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nivelBadge: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  nivelNum: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  nivelInfo: { flex: 1 },
  nivelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  pontosText: { color: '#fff', fontWeight: '600' },
  proximoNivel: { color: '#aaa', fontSize: 12 },
  xpTrack: { height: 6, backgroundColor: '#1e1e30', borderRadius: 3 },
  xpFill: { height: 6, backgroundColor: '#f39c12', borderRadius: 3 },
  body: { padding: 16 },
  secaoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12, marginTop: 8 },
  desafioCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30', borderRadius: 14, padding: 14, marginBottom: 10, gap: 12 },
  desafioCompleto: { borderWidth: 1, borderColor: '#4caf50' },
  desafioEmoji: { fontSize: 28 },
  desafioInfo: { flex: 1 },
  desafioTitulo: { color: '#fff', fontWeight: '600', marginBottom: 6 },
  desafioTrack: { height: 4, backgroundColor: '#2a2a3e', borderRadius: 2, marginBottom: 4 },
  desafioFill: { height: 4, backgroundColor: '#533483', borderRadius: 2 },
  desafioProgresso: { color: '#888', fontSize: 12 },
  desafioPontos: { backgroundColor: '#2a2a3e', padding: 10, borderRadius: 10, alignItems: 'center', minWidth: 50 },
  desafioConcluidoBadge: { backgroundColor: '#1a3a1a' },
  desafioPontosText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  desafioPontosLabel: { color: '#888', fontSize: 11, marginTop: 2 },
  conquistasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  conquistaCard: {
    width: '47%', backgroundColor: '#1e1e30', borderRadius: 14, padding: 14,
    alignItems: 'center',
  },
  conquistaBloqueada: { opacity: 0.7 },
  conquistaEmoji: { fontSize: 32, marginBottom: 6 },
  conquistaNome: { color: '#fff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  conquistaNomeBloq: { color: '#888' },
  conquistaDesc: { color: '#666', fontSize: 11, textAlign: 'center', marginTop: 4 },
  conquistaProgressBar: { width: '100%', height: 3, backgroundColor: '#2a2a3e', borderRadius: 2, marginTop: 8 },
  conquistaProgressFill: { height: 3, backgroundColor: '#533483', borderRadius: 2 },
  conquistaCheck: { width: 22, height: 22, backgroundColor: '#4caf50', borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  conquistaCheckText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  statsCard: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 30 },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
  statEmoji: { fontSize: 18, marginRight: 12 },
  statLabel: { flex: 1, color: '#ccc' },
  statValor: { color: '#fff', fontWeight: 'bold' },
});
