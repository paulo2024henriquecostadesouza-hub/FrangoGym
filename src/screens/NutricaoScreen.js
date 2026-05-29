import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, TextInput, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { carregar, salvar, KEYS } from '../utils/storage';
import { BANCO_ALIMENTOS, CATEGORIAS_ALIMENTO, REFEICOES_TIPO } from '../data/alimentos';

const META = { cal: 2200, prot: 160, carb: 250, gord: 70, fibra: 25 };

// ─── BARRA DE MACRO ──────────────────────────────────────────────────────────
function BarraMacro({ label, valor, meta, cor, unidade = 'g' }) {
  const pct = Math.min((valor / meta) * 100, 100);
  const ok = valor >= meta * 0.9;
  return (
    <View style={styles.macroItem}>
      <View style={styles.macroTopo}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={[styles.macroValor, ok && { color: '#2ecc71' }]}>
          {Math.round(valor)}{unidade} / {meta}{unidade}
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${pct}%`, backgroundColor: cor }]} />
      </View>
    </View>
  );
}

// ─── MODAL DE ADICIONAR ALIMENTO ─────────────────────────────────────────────
function ModalAdicionarAlimento({ visivel, onFechar, onAdicionar, refeicaoTipo }) {
  const [etapa, setEtapa] = useState('busca'); // 'busca' | 'detalhe' | 'custom'
  const [busca, setBusca] = useState('');
  const [catFiltro, setCatFiltro] = useState('Todos');
  const [selecionado, setSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('100');
  const [horario, setHorario] = useState(refeicaoTipo?.horario || '12:00');
  // Custom food
  const [customNome, setCustomNome] = useState('');
  const [customCal, setCustomCal] = useState('');
  const [customProt, setCustomProt] = useState('');
  const [customCarb, setCustomCarb] = useState('');
  const [customGord, setCustomGord] = useState('');
  const [customFibra, setCustomFibra] = useState('');
  const [customUnidade, setCustomUnidade] = useState('g');
  const [customQtd, setCustomQtd] = useState('100');

  function resetar() {
    setEtapa('busca'); setBusca(''); setSelecionado(null);
    setQuantidade('100'); setCatFiltro('Todos');
    setCustomNome(''); setCustomCal(''); setCustomProt('');
    setCustomCarb(''); setCustomGord(''); setCustomFibra('');
  }

  function calcNutrientes(alimento, qtd) {
    const fator = alimento.unidade === 'un' ? qtd : qtd / 100;
    return {
      cal:   +(alimento.cal   * fator).toFixed(1),
      prot:  +(alimento.prot  * fator).toFixed(1),
      carb:  +(alimento.carb  * fator).toFixed(1),
      gord:  +(alimento.gord  * fator).toFixed(1),
      fibra: +(alimento.fibra * fator).toFixed(1),
    };
  }

  function confirmar() {
    const qtd = parseFloat(quantidade) || 1;
    const n = calcNutrientes(selecionado, qtd);
    onAdicionar({
      nome: selecionado.nome,
      quantidade: qtd,
      unidade: selecionado.unidade,
      horario,
      refeicaoId: refeicaoTipo?.id || 'almoco',
      refeicaoNome: refeicaoTipo?.nome || 'Refeição',
      ...n,
    });
    resetar();
  }

  function confirmarCustom() {
    const qtd = parseFloat(customQtd) || 100;
    const fator = customUnidade === 'un' ? qtd : qtd / 100;
    onAdicionar({
      nome: customNome || 'Alimento personalizado',
      quantidade: qtd,
      unidade: customUnidade,
      horario,
      refeicaoId: refeicaoTipo?.id || 'almoco',
      refeicaoNome: refeicaoTipo?.nome || 'Refeição',
      cal:   +((parseFloat(customCal)  || 0) * fator).toFixed(1),
      prot:  +((parseFloat(customProt) || 0) * fator).toFixed(1),
      carb:  +((parseFloat(customCarb) || 0) * fator).toFixed(1),
      gord:  +((parseFloat(customGord) || 0) * fator).toFixed(1),
      fibra: +((parseFloat(customFibra)|| 0) * fator).toFixed(1),
    });
    resetar();
  }

  const alimentosFiltrados = BANCO_ALIMENTOS.filter(a => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = catFiltro === 'Todos' || a.cat === catFiltro;
    return matchBusca && matchCat;
  });

  const qtdNum = parseFloat(quantidade) || 1;
  const preview = selecionado ? calcNutrientes(selecionado, qtdNum) : null;

  return (
    <Modal visible={visivel} animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.modalBg}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            {etapa !== 'busca' ? (
              <TouchableOpacity onPress={() => setEtapa('busca')}>
                <Text style={styles.modalBack}>← Voltar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => { resetar(); onFechar(); }}>
                <Text style={styles.modalBack}>✕ Fechar</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.modalTitulo}>
              {etapa === 'busca' ? `${refeicaoTipo?.emoji || '🍽️'} ${refeicaoTipo?.nome || 'Refeição'}` :
               etapa === 'detalhe' ? 'Detalhes' : '+ Alimento próprio'}
            </Text>
            {etapa === 'busca' && (
              <TouchableOpacity onPress={() => setEtapa('custom')}>
                <Text style={styles.customBtn}>+ Custom</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── ETAPA: BUSCA ── */}
          {etapa === 'busca' && (
            <>
              <TextInput
                style={styles.buscaInput}
                placeholder="Buscar alimento..."
                placeholderTextColor="#555"
                value={busca}
                onChangeText={setBusca}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {['Todos', ...CATEGORIAS_ALIMENTO].map(c => (
                  <TouchableOpacity key={c}
                    style={[styles.catChip, catFiltro === c && styles.catChipAtivo]}
                    onPress={() => setCatFiltro(c)}>
                    <Text style={[styles.catChipText, catFiltro === c && styles.catChipTextAtivo]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <FlatList
                data={alimentosFiltrados}
                keyExtractor={i => String(i.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.alimentoItem}
                    onPress={() => { setSelecionado(item); setQuantidade(item.unidade === 'un' ? '1' : '100'); setEtapa('detalhe'); }}>
                    <View style={styles.alimentoItemInfo}>
                      <Text style={styles.alimentoItemNome}>{item.nome}</Text>
                      <Text style={styles.alimentoItemCat}>{item.cat} · por {item.unidade === 'un' ? '1 unidade' : `100${item.unidade}`}</Text>
                    </View>
                    <View style={styles.alimentoItemRight}>
                      <Text style={styles.alimentoItemCal}>{item.cal}</Text>
                      <Text style={styles.alimentoItemCalLabel}>kcal</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* ── ETAPA: DETALHE ── */}
          {etapa === 'detalhe' && selecionado && (
            <ScrollView style={styles.detalheScroll}>
              <Text style={styles.detalheNome}>{selecionado.nome}</Text>

              {/* Horário */}
              <Text style={styles.detalheLabel}>Horário</Text>
              <TextInput
                style={styles.detalheInput}
                value={horario}
                onChangeText={setHorario}
                placeholder="HH:MM"
                placeholderTextColor="#555"
                keyboardType="numbers-and-punctuation"
              />

              {/* Quantidade */}
              <Text style={styles.detalheLabel}>
                Quantidade ({selecionado.unidade === 'un' ? 'unidades' : selecionado.unidade})
              </Text>
              <TextInput
                style={styles.detalheInput}
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />

              {/* Preview nutricional */}
              {preview && (
                <View style={styles.previewCard}>
                  <Text style={styles.previewTitulo}>Nutrientes calculados</Text>
                  <View style={styles.previewGrid}>
                    {[
                      { l: 'Calorias', v: preview.cal, u: 'kcal', c: '#e94560' },
                      { l: 'Proteína', v: preview.prot, u: 'g', c: '#3498db' },
                      { l: 'Carboidrato', v: preview.carb, u: 'g', c: '#f39c12' },
                      { l: 'Gordura', v: preview.gord, u: 'g', c: '#9b59b6' },
                      { l: 'Fibra', v: preview.fibra, u: 'g', c: '#2ecc71' },
                    ].map(n => (
                      <View key={n.l} style={styles.previewItem}>
                        <Text style={[styles.previewVal, { color: n.c }]}>{n.v}</Text>
                        <Text style={styles.previewUnid}>{n.u}</Text>
                        <Text style={styles.previewLabel}>{n.l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Tabela nutricional base */}
              <View style={styles.tabelaCard}>
                <Text style={styles.previewTitulo}>
                  Tabela nutricional (por {selecionado.unidade === 'un' ? '1 unidade' : `100${selecionado.unidade}`})
                </Text>
                {[
                  ['Calorias', selecionado.cal, 'kcal'],
                  ['Proteína', selecionado.prot, 'g'],
                  ['Carboidrato', selecionado.carb, 'g'],
                  ['Gordura', selecionado.gord, 'g'],
                  ['Fibra', selecionado.fibra, 'g'],
                ].map(([l, v, u]) => (
                  <View key={l} style={styles.tabelaRow}>
                    <Text style={styles.tabelaLabel}>{l}</Text>
                    <Text style={styles.tabelaVal}>{v}{u}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.confirmarBtn} onPress={confirmar}>
                <LinearGradient colors={['#533483', '#e94560']} style={styles.confirmarGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.confirmarText}>✓ Adicionar à refeição</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ── ETAPA: CUSTOM ── */}
          {etapa === 'custom' && (
            <ScrollView style={styles.detalheScroll}>
              <Text style={styles.customInfo}>
                Não encontrou o alimento? Cadastre manualmente com os nutrientes do rótulo.
              </Text>
              <Text style={styles.detalheLabel}>Nome do alimento *</Text>
              <TextInput style={styles.detalheInput} value={customNome} onChangeText={setCustomNome}
                placeholder="Ex: Bolo de cenoura" placeholderTextColor="#555" />

              <Text style={styles.detalheLabel}>Unidade de medida</Text>
              <View style={styles.unidadeRow}>
                {['g', 'ml', 'un'].map(u => (
                  <TouchableOpacity key={u}
                    style={[styles.unidadeChip, customUnidade === u && styles.unidadeAtivo]}
                    onPress={() => setCustomUnidade(u)}>
                    <Text style={[styles.unidadeText, customUnidade === u && styles.unidadeTextAtivo]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.detalheLabel}>Quantidade</Text>
              <TextInput style={styles.detalheInput} value={customQtd} onChangeText={setCustomQtd}
                keyboardType="decimal-pad" placeholder="100" placeholderTextColor="#555" />

              <Text style={styles.detalheLabel}>Horário</Text>
              <TextInput style={styles.detalheInput} value={horario} onChangeText={setHorario}
                placeholder="HH:MM" placeholderTextColor="#555" keyboardType="numbers-and-punctuation" />

              <Text style={styles.secaoCustom}>Informações nutricionais (por {customUnidade === 'un' ? '1 unidade' : `100${customUnidade}`})</Text>
              {[
                ['Calorias (kcal)', customCal, setCustomCal],
                ['Proteína (g)', customProt, setCustomProt],
                ['Carboidrato (g)', customCarb, setCustomCarb],
                ['Gordura (g)', customGord, setCustomGord],
                ['Fibra (g)', customFibra, setCustomFibra],
              ].map(([l, v, fn]) => (
                <View key={l}>
                  <Text style={styles.detalheLabel}>{l}</Text>
                  <TextInput style={styles.detalheInput} value={v} onChangeText={fn}
                    keyboardType="decimal-pad" placeholder="0" placeholderTextColor="#555" />
                </View>
              ))}

              <TouchableOpacity style={styles.confirmarBtn} onPress={confirmarCustom}>
                <LinearGradient colors={['#533483', '#e94560']} style={styles.confirmarGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.confirmarText}>✓ Adicionar alimento</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── TELA PRINCIPAL ───────────────────────────────────────────────────────────
export default function NutricaoScreen() {
  const [diario, setDiario] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [refeicaoAtiva, setRefeicaoAtiva] = useState(null);
  const hoje = new Date().toDateString();

  useEffect(() => { carregarDiario(); }, []);

  async function carregarDiario() {
    const d = await carregar(KEYS.REFEICOES, {});
    setDiario(d[hoje] || {});
  }

  async function adicionarAlimento(item) {
    const atual = { ...diario };
    const rid = item.refeicaoId;
    if (!atual[rid]) atual[rid] = [];
    atual[rid].push({ ...item, id: Date.now() });
    setDiario(atual);
    const todas = await carregar(KEYS.REFEICOES, {});
    todas[hoje] = atual;
    await salvar(KEYS.REFEICOES, todas);
    setModalAberto(false);
  }

  async function removerAlimento(refeicaoId, itemId) {
    const atual = { ...diario };
    atual[refeicaoId] = (atual[refeicaoId] || []).filter(i => i.id !== itemId);
    setDiario(atual);
    const todas = await carregar(KEYS.REFEICOES, {});
    todas[hoje] = atual;
    await salvar(KEYS.REFEICOES, todas);
  }

  // Totais do dia
  const todosItens = Object.values(diario).flat();
  const totais = todosItens.reduce((a, i) => ({
    cal: a.cal + i.cal, prot: a.prot + i.prot,
    carb: a.carb + i.carb, gord: a.gord + i.gord, fibra: a.fibra + (i.fibra || 0),
  }), { cal: 0, prot: 0, carb: 0, gord: 0, fibra: 0 });

  const pctCal = Math.min((totais.cal / META.cal) * 100, 100);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── HEADER ── */}
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
          <Text style={styles.titulo}>Nutrição</Text>
          <Text style={styles.data}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>

          {/* Anel de calorias */}
          <View style={styles.calArea}>
            <View style={styles.calRing}>
              <Text style={styles.calNum}>{Math.round(totais.cal)}</Text>
              <Text style={styles.calUnid}>kcal</Text>
              <Text style={styles.calMeta}>/ {META.cal}</Text>
            </View>
            <View style={styles.calInfo}>
              <View style={styles.calBarTrack}>
                <View style={[styles.calBarFill, { width: `${pctCal}%` }]} />
              </View>
              <Text style={styles.calRestante}>
                {Math.max(0, META.cal - Math.round(totais.cal))} kcal restantes
              </Text>
              <View style={styles.calMacroRow}>
                <Text style={styles.calMacroItem}>🥩 {Math.round(totais.prot)}g prot</Text>
                <Text style={styles.calMacroItem}>🍚 {Math.round(totais.carb)}g carb</Text>
                <Text style={styles.calMacroItem}>🫙 {Math.round(totais.gord)}g gord</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* ── MACROS ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Macronutrientes do dia</Text>
            <BarraMacro label="Proteína" valor={totais.prot} meta={META.prot} cor="#e94560" />
            <BarraMacro label="Carboidrato" valor={totais.carb} meta={META.carb} cor="#f39c12" />
            <BarraMacro label="Gordura" valor={totais.gord} meta={META.gord} cor="#9b59b6" />
            <BarraMacro label="Fibra" valor={totais.fibra} meta={META.fibra} cor="#2ecc71" />
          </View>

          {/* ── REFEIÇÕES ── */}
          <Text style={styles.secaoTitulo}>Refeições de hoje</Text>
          {REFEICOES_TIPO.map(ref => {
            const itens = diario[ref.id] || [];
            const totalRef = itens.reduce((a, i) => ({ cal: a.cal + i.cal, prot: a.prot + i.prot }), { cal: 0, prot: 0 });
            return (
              <View key={ref.id} style={styles.refeicaoCard}>
                <View style={styles.refeicaoHeader}>
                  <View style={styles.refeicaoTitleRow}>
                    <Text style={styles.refeicaoEmoji}>{ref.emoji}</Text>
                    <View>
                      <Text style={styles.refeicaoNome}>{ref.nome}</Text>
                      <Text style={styles.refeicaoHorario}>⏰ {ref.horario}</Text>
                    </View>
                  </View>
                  <View style={styles.refeicaoRight}>
                    {itens.length > 0 && (
                      <Text style={styles.refeicaoTotal}>{Math.round(totalRef.cal)} kcal</Text>
                    )}
                    <TouchableOpacity style={styles.addRefeicaoBtn}
                      onPress={() => { setRefeicaoAtiva(ref); setModalAberto(true); }}>
                      <Text style={styles.addRefeicaoText}>+ Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {itens.length === 0 ? (
                  <Text style={styles.refVazio}>Nenhum alimento registrado</Text>
                ) : (
                  itens.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemNome}>{item.nome}</Text>
                        <Text style={styles.itemDetalhe}>
                          {item.quantidade}{item.unidade} · ⏰ {item.horario}
                        </Text>
                        <View style={styles.itemNutrRow}>
                          <Text style={styles.itemNutr}>🔥 {item.cal}kcal</Text>
                          <Text style={styles.itemNutr}>🥩 {item.prot}g</Text>
                          <Text style={styles.itemNutr}>🍚 {item.carb}g</Text>
                          <Text style={styles.itemNutr}>🫙 {item.gord}g</Text>
                          {item.fibra > 0 && <Text style={styles.itemNutr}>🌿 {item.fibra}g</Text>}
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => removerAlimento(ref.id, item.id)}>
                        <Text style={styles.itemRemover}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            );
          })}

          {/* ── RESUMO DO DIA ── */}
          {todosItens.length > 0 && (
            <View style={styles.resumoCard}>
              <Text style={styles.cardTitulo}>Resumo do dia</Text>
              {[
                { l: 'Total de alimentos', v: todosItens.length, u: 'itens', c: '#888' },
                { l: 'Calorias', v: Math.round(totais.cal), u: 'kcal', c: '#e94560' },
                { l: 'Proteína', v: Math.round(totais.prot), u: 'g', c: '#3498db' },
                { l: 'Carboidrato', v: Math.round(totais.carb), u: 'g', c: '#f39c12' },
                { l: 'Gordura', v: Math.round(totais.gord), u: 'g', c: '#9b59b6' },
                { l: 'Fibra', v: Math.round(totais.fibra), u: 'g', c: '#2ecc71' },
              ].map(r => (
                <View key={r.l} style={styles.resumoRow}>
                  <Text style={styles.resumoLabel}>{r.l}</Text>
                  <Text style={[styles.resumoVal, { color: r.c }]}>{r.v} {r.u}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <ModalAdicionarAlimento
        visivel={modalAberto}
        onFechar={() => setModalAberto(false)}
        onAdicionar={adicionarAlimento}
        refeicaoTipo={refeicaoAtiva}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: { padding: 24, paddingTop: 50 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  data: { color: '#aaa', fontSize: 13, marginBottom: 16, textTransform: 'capitalize' },
  calArea: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  calRing: {
    width: 110, height: 110, borderRadius: 55, borderWidth: 6,
    borderColor: '#e94560', alignItems: 'center', justifyContent: 'center',
  },
  calNum: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  calUnid: { color: '#aaa', fontSize: 12 },
  calMeta: { color: '#666', fontSize: 11 },
  calInfo: { flex: 1 },
  calBarTrack: { height: 6, backgroundColor: '#1e1e30', borderRadius: 3, marginBottom: 6 },
  calBarFill: { height: 6, backgroundColor: '#e94560', borderRadius: 3 },
  calRestante: { color: '#aaa', fontSize: 12, marginBottom: 8 },
  calMacroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calMacroItem: { color: '#ccc', fontSize: 11 },
  body: { padding: 16 },
  card: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 12 },
  macroItem: { marginBottom: 10 },
  macroTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroLabel: { color: '#ccc', fontSize: 13 },
  macroValor: { color: '#888', fontSize: 13 },
  macroTrack: { height: 6, backgroundColor: '#2a2a3e', borderRadius: 3 },
  macroFill: { height: 6, borderRadius: 3 },
  secaoTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 17, marginBottom: 10 },
  refeicaoCard: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 14, marginBottom: 10 },
  refeicaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  refeicaoTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  refeicaoEmoji: { fontSize: 24 },
  refeicaoNome: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  refeicaoHorario: { color: '#888', fontSize: 12, marginTop: 2 },
  refeicaoRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  refeicaoTotal: { color: '#e94560', fontWeight: 'bold', fontSize: 13 },
  addRefeicaoBtn: { backgroundColor: '#533483', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addRefeicaoText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  refVazio: { color: '#444', fontSize: 13, textAlign: 'center', paddingVertical: 8 },
  itemCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#0d0d1a', borderRadius: 10, padding: 10, marginBottom: 6 },
  itemInfo: { flex: 1 },
  itemNome: { color: '#fff', fontWeight: '600', fontSize: 14 },
  itemDetalhe: { color: '#888', fontSize: 12, marginTop: 2 },
  itemNutrRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  itemNutr: { color: '#aaa', fontSize: 11 },
  itemRemover: { color: '#e94560', fontSize: 16, paddingLeft: 10 },
  resumoCard: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 30 },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
  resumoLabel: { color: '#ccc' },
  resumoVal: { fontWeight: 'bold' },
  // Modal
  modalBg: { flex: 1, backgroundColor: '#0d0d1a' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#1a1a2e' },
  modalBack: { color: '#e94560', fontSize: 15 },
  modalTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  customBtn: { color: '#533483', fontSize: 14, fontWeight: '600' },
  buscaInput: { backgroundColor: '#1e1e30', margin: 16, marginBottom: 8, borderRadius: 12, padding: 14, color: '#fff', fontSize: 15 },
  catScroll: { paddingLeft: 16, maxHeight: 44, marginBottom: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e1e30', marginRight: 8 },
  catChipAtivo: { backgroundColor: '#533483' },
  catChipText: { color: '#888', fontSize: 13 },
  catChipTextAtivo: { color: '#fff' },
  alimentoItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1e1e30' },
  alimentoItemInfo: { flex: 1 },
  alimentoItemNome: { color: '#fff', fontWeight: '600' },
  alimentoItemCat: { color: '#888', fontSize: 12, marginTop: 2 },
  alimentoItemRight: { alignItems: 'flex-end' },
  alimentoItemCal: { color: '#e94560', fontWeight: 'bold', fontSize: 18 },
  alimentoItemCalLabel: { color: '#888', fontSize: 11 },
  detalheScroll: { padding: 16 },
  detalheNome: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  detalheLabel: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 8 },
  detalheInput: { backgroundColor: '#1e1e30', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16, marginBottom: 4 },
  previewCard: { backgroundColor: '#1e1e30', borderRadius: 14, padding: 16, marginVertical: 16 },
  previewTitulo: { color: '#fff', fontWeight: 'bold', marginBottom: 12 },
  previewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  previewItem: { alignItems: 'center', backgroundColor: '#0d0d1a', borderRadius: 10, padding: 10, minWidth: 60, flex: 1 },
  previewVal: { fontSize: 20, fontWeight: 'bold' },
  previewUnid: { color: '#888', fontSize: 11 },
  previewLabel: { color: '#aaa', fontSize: 11, marginTop: 2, textAlign: 'center' },
  tabelaCard: { backgroundColor: '#1e1e30', borderRadius: 14, padding: 14, marginBottom: 16 },
  tabelaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
  tabelaLabel: { color: '#ccc' },
  tabelaVal: { color: '#fff', fontWeight: '600' },
  confirmarBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 30 },
  confirmarGrad: { padding: 18, alignItems: 'center' },
  confirmarText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  customInfo: { color: '#aaa', fontSize: 13, lineHeight: 20, marginBottom: 12, backgroundColor: '#1e1e30', borderRadius: 10, padding: 12 },
  secaoCustom: { color: '#fff', fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  unidadeRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  unidadeChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1e1e30', borderWidth: 1, borderColor: '#2a2a3e' },
  unidadeAtivo: { borderColor: '#533483', backgroundColor: '#53348320' },
  unidadeText: { color: '#888', fontWeight: '600' },
  unidadeTextAtivo: { color: '#fff' },
});
