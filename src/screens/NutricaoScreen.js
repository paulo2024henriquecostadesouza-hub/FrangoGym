import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, Modal, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ALIMENTOS } from '../data/exercises';
import { carregar, salvar, KEYS } from '../utils/storage';

const META_CALORIAS = 2200;
const META_PROT = 160;
const META_CARB = 250;
const META_GORD = 70;

function BarraMacro({ valor, meta, cor, label }) {
  const pct = Math.min((valor / meta) * 100, 100);
  return (
    <View style={styles.macroItem}>
      <View style={styles.macroTopo}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValor}>{Math.round(valor)}g / {meta}g</Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${pct}%`, backgroundColor: cor }]} />
      </View>
    </View>
  );
}

export default function NutricaoScreen() {
  const [refeicoes, setRefeicoes] = useState([]);
  const [modal, setModal] = useState(false);
  const [busca, setBusca] = useState('');
  const [qtdInput, setQtdInput] = useState('1');
  const [selecionado, setSelecionado] = useState(null);

  const hoje = new Date().toDateString();

  useEffect(() => { carregarRefeicoes(); }, []);

  async function carregarRefeicoes() {
    const r = await carregar(KEYS.REFEICOES, {});
    setRefeicoes(r[hoje] || []);
  }

  async function adicionarAlimento() {
    if (!selecionado) return;
    const qtd = parseFloat(qtdInput) || 1;
    const item = { ...selecionado, qtd, cal: selecionado.cal * qtd, prot: selecionado.prot * qtd, carb: selecionado.carb * qtd, gord: selecionado.gord * qtd, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    const novas = [...refeicoes, item];
    setRefeicoes(novas);
    const todas = await carregar(KEYS.REFEICOES, {});
    todas[hoje] = novas;
    await salvar(KEYS.REFEICOES, todas);
    setModal(false);
    setBusca('');
    setSelecionado(null);
    setQtdInput('1');
  }

  async function removerAlimento(idx) {
    const novas = refeicoes.filter((_, i) => i !== idx);
    setRefeicoes(novas);
    const todas = await carregar(KEYS.REFEICOES, {});
    todas[hoje] = novas;
    await salvar(KEYS.REFEICOES, todas);
  }

  const totais = refeicoes.reduce((a, r) => ({
    cal: a.cal + r.cal, prot: a.prot + r.prot,
    carb: a.carb + r.carb, gord: a.gord + r.gord,
  }), { cal: 0, prot: 0, carb: 0, gord: 0 });

  const pctCal = Math.min((totais.cal / META_CALORIAS) * 100, 100);

  const alimentosFiltrados = ALIMENTOS.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <Text style={styles.titulo}>Nutrição</Text>
        <Text style={styles.data}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>

        <View style={styles.calRing}>
          <View style={styles.calInner}>
            <Text style={styles.calNum}>{Math.round(totais.cal)}</Text>
            <Text style={styles.calLabel}>kcal</Text>
            <Text style={styles.calMeta}>meta: {META_CALORIAS}</Text>
          </View>
        </View>
        <View style={styles.calBarTrack}>
          <View style={[styles.calBarFill, { width: `${pctCal}%` }]} />
        </View>
        <Text style={styles.calRestante}>
          {Math.max(0, META_CALORIAS - Math.round(totais.cal))} kcal restantes
        </Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Macronutrientes</Text>
          <BarraMacro valor={totais.prot} meta={META_PROT} cor="#e94560" label="Proteína" />
          <BarraMacro valor={totais.carb} meta={META_CARB} cor="#f39c12" label="Carboidrato" />
          <BarraMacro valor={totais.gord} meta={META_GORD} cor="#3498db" label="Gordura" />
        </View>

        <View style={styles.refeicaoHeader}>
          <Text style={styles.secaoTitulo}>Alimentos de hoje</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
            <Text style={styles.addText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {refeicoes.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🥗</Text>
            <Text style={styles.vazioText}>Nenhum alimento registrado.</Text>
            <Text style={styles.vazioSub}>Toque em "+ Adicionar" para começar.</Text>
          </View>
        ) : (
          refeicoes.map((item, i) => (
            <View key={i} style={styles.alimentoCard}>
              <View style={styles.alimentoInfo}>
                <Text style={styles.alimentoNome}>{item.nome}</Text>
                <Text style={styles.alimentoHora}>{item.hora} · {item.qtd}x</Text>
              </View>
              <View style={styles.alimentoMacros}>
                <Text style={styles.macroChip}>{Math.round(item.cal)} kcal</Text>
                <Text style={[styles.macroChip, { backgroundColor: '#e9456020' }]}>P: {Math.round(item.prot)}g</Text>
              </View>
              <TouchableOpacity onPress={() => removerAlimento(i)}>
                <Text style={styles.remover}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Adicionar alimento</Text>
            <TouchableOpacity onPress={() => { setModal(false); setBusca(''); setSelecionado(null); }}>
              <Text style={styles.fecharText}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.busca}
            placeholder="Buscar alimento..."
            placeholderTextColor="#555"
            value={busca}
            onChangeText={setBusca}
          />

          {selecionado ? (
            <View style={styles.selecionadoArea}>
              <Text style={styles.selecionadoNome}>{selecionado.nome}</Text>
              <Text style={styles.selecionadoInfo}>
                {selecionado.cal} kcal · P:{selecionado.prot}g · C:{selecionado.carb}g · G:{selecionado.gord}g
              </Text>
              <View style={styles.qtdRow}>
                <Text style={styles.qtdLabel}>Quantidade (porções):</Text>
                <TextInput
                  style={styles.qtdInput}
                  value={qtdInput}
                  onChangeText={setQtdInput}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
              </View>
              <TouchableOpacity style={styles.confirmarBtn} onPress={adicionarAlimento}>
                <LinearGradient colors={['#533483', '#e94560']} style={styles.confirmarGrad}>
                  <Text style={styles.confirmarText}>Confirmar</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.voltarBtn} onPress={() => setSelecionado(null)}>
                <Text style={styles.voltarText}>← Voltar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={alimentosFiltrados}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.alimentoItem} onPress={() => setSelecionado(item)}>
                  <View style={styles.alimentoItemInfo}>
                    <Text style={styles.alimentoItemNome}>{item.nome}</Text>
                    <Text style={styles.alimentoItemMacro}>P:{item.prot}g · C:{item.carb}g · G:{item.gord}g</Text>
                  </View>
                  <Text style={styles.alimentoItemCal}>{item.cal} kcal</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: { padding: 24, paddingTop: 50, alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', alignSelf: 'flex-start' },
  data: { color: '#aaa', fontSize: 13, alignSelf: 'flex-start', marginBottom: 20, textTransform: 'capitalize' },
  calRing: { width: 130, height: 130, borderRadius: 65, borderWidth: 8, borderColor: '#533483', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  calInner: { alignItems: 'center' },
  calNum: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  calLabel: { color: '#aaa', fontSize: 12 },
  calMeta: { color: '#666', fontSize: 11, marginTop: 2 },
  calBarTrack: { width: '80%', height: 6, backgroundColor: '#1e1e30', borderRadius: 3, marginBottom: 6 },
  calBarFill: { height: 6, backgroundColor: '#e94560', borderRadius: 3 },
  calRestante: { color: '#aaa', fontSize: 13 },
  body: { padding: 16 },
  card: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 12 },
  macroItem: { marginBottom: 12 },
  macroTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroLabel: { color: '#ccc', fontSize: 13 },
  macroValor: { color: '#888', fontSize: 13 },
  macroTrack: { height: 6, backgroundColor: '#2a2a3e', borderRadius: 3 },
  macroFill: { height: 6, borderRadius: 3 },
  refeicaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secaoTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#533483', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  vazio: { alignItems: 'center', padding: 30, backgroundColor: '#1e1e30', borderRadius: 16 },
  vazioEmoji: { fontSize: 36 },
  vazioText: { color: '#fff', fontSize: 15, fontWeight: '600', marginTop: 8 },
  vazioSub: { color: '#888', marginTop: 4, fontSize: 13 },
  alimentoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30', borderRadius: 12, padding: 12, marginBottom: 8 },
  alimentoInfo: { flex: 1 },
  alimentoNome: { color: '#fff', fontWeight: '600', fontSize: 14 },
  alimentoHora: { color: '#888', fontSize: 12, marginTop: 2 },
  alimentoMacros: { flexDirection: 'row', gap: 6, marginRight: 10 },
  macroChip: { backgroundColor: '#2a2a3e', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, color: '#ccc', fontSize: 12 },
  remover: { color: '#e94560', fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: '#0d0d1a', padding: 20, paddingTop: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitulo: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  fecharText: { color: '#e94560', fontSize: 20 },
  busca: { backgroundColor: '#1e1e30', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, marginBottom: 12 },
  alimentoItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30', borderRadius: 12, padding: 14, marginBottom: 8 },
  alimentoItemInfo: { flex: 1 },
  alimentoItemNome: { color: '#fff', fontWeight: '600' },
  alimentoItemMacro: { color: '#888', fontSize: 12, marginTop: 2 },
  alimentoItemCal: { color: '#e94560', fontWeight: 'bold' },
  selecionadoArea: { padding: 8, alignItems: 'center' },
  selecionadoNome: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  selecionadoInfo: { color: '#aaa', marginTop: 6, textAlign: 'center' },
  qtdRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 12 },
  qtdLabel: { color: '#ccc', fontSize: 15 },
  qtdInput: { backgroundColor: '#1e1e30', color: '#fff', fontSize: 18, fontWeight: 'bold', padding: 10, borderRadius: 10, width: 80, textAlign: 'center' },
  confirmarBtn: { marginTop: 24, width: '100%', borderRadius: 14, overflow: 'hidden' },
  confirmarGrad: { padding: 16, alignItems: 'center' },
  confirmarText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  voltarBtn: { marginTop: 14 },
  voltarText: { color: '#e94560' },
});
