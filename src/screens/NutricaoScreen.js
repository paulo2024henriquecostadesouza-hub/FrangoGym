import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { carregar, salvar, KEYS } from '../utils/storage';
import { BANCO_ALIMENTOS, CATEGORIAS_ALIMENTO, REFEICOES_TIPO } from '../data/alimentos';
import { estimarNutrientes, calcularPorcao } from '../utils/nutriCalculator';

const META = { cal: 2200, prot: 160, carb: 250, gord: 70, fibra: 25 };

// ─── BARRA DE MACRO ───────────────────────────────────────────────────────────
function BarraMacro({ label, valor, meta, cor }) {
  const pct = Math.min((valor / meta) * 100, 100);
  return (
    <View style={styles.macroItem}>
      <View style={styles.macroTopo}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={[styles.macroValor, valor >= meta * 0.9 && { color: '#2ecc71' }]}>
          {Math.round(valor)}g / {meta}g
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${pct}%`, backgroundColor: cor }]} />
      </View>
    </View>
  );
}

// ─── MODAL CADASTRAR ALIMENTO CUSTOM ─────────────────────────────────────────
function ModalCadastrarAlimento({ visivel, onFechar, onSalvar }) {
  const [nome, setNome] = useState('');
  const [tipoLiquido, setTipoLiquido] = useState(false);
  const [cal, setCal] = useState('');
  const [prot, setProt] = useState('');
  const [carb, setCarb] = useState('');
  const [gord, setGord] = useState('');
  const [fibra, setFibra] = useState('');
  const [publico, setPublico] = useState(false);
  const [medidas, setMedidas] = useState([]);
  const [nomeMedida, setNomeMedida] = useState('');
  const [pesoMedida, setPesoMedida] = useState('');
  const [preview, setPreview] = useState(null);

  function calcularPreview() {
    const entrada = {
      cal:  cal  ? parseFloat(cal)  : null,
      prot: prot ? parseFloat(prot) : null,
      carb: carb ? parseFloat(carb) : null,
      gord: gord ? parseFloat(gord) : null,
      fibra: fibra ? parseFloat(fibra) : null,
    };
    const result = estimarNutrientes(entrada, 'default');
    setPreview(result);
  }

  function adicionarMedida() {
    if (!nomeMedida.trim() || !pesoMedida) return;
    setMedidas([...medidas, { nome_medida: nomeMedida.trim(), peso_em_gramas: parseFloat(pesoMedida) }]);
    setNomeMedida('');
    setPesoMedida('');
  }

  function removerMedida(i) {
    setMedidas(medidas.filter((_, idx) => idx !== i));
  }

  async function salvarAlimento() {
    if (!nome.trim()) return;
    const entrada = {
      cal:  cal  ? parseFloat(cal)  : null,
      prot: prot ? parseFloat(prot) : null,
      carb: carb ? parseFloat(carb) : null,
      gord: gord ? parseFloat(gord) : null,
      fibra: fibra ? parseFloat(fibra) : null,
    };
    const nutrientes = estimarNutrientes(entrada, 'default');
    const alimento = {
      id: `custom_${Date.now()}`,
      nome: nome.trim(),
      cat: 'Personalizado',
      tipo: tipoLiquido ? 'ml' : 'g',
      unidade: tipoLiquido ? 'ml' : 'g',
      publico,
      valores_base_100g: nutrientes,
      medidas_caseiras: medidas,
      // Compat com banco existente
      cal:   nutrientes.cal,
      prot:  nutrientes.prot,
      carb:  nutrientes.carb,
      gord:  nutrientes.gord,
      fibra: nutrientes.fibra,
      criadoEm: new Date().toISOString(),
    };
    const existentes = await carregar(KEYS.ALIMENTOS_CUSTOM, []);
    await salvar(KEYS.ALIMENTOS_CUSTOM, [...existentes, alimento]);
    onSalvar(alimento);
    resetar();
  }

  function resetar() {
    setNome(''); setTipoLiquido(false); setCal(''); setProt('');
    setCarb(''); setGord(''); setFibra(''); setPublico(false);
    setMedidas([]); setNomeMedida(''); setPesoMedida(''); setPreview(null);
  }

  const unid = tipoLiquido ? 'ml' : 'g';

  return (
    <Modal visible={visivel} animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { resetar(); onFechar(); }}>
              <Text style={styles.modalBack}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>Cadastrar alimento</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalScroll}>
            {/* ── BLOCO 1: IDENTIFICAÇÃO ── */}
            <View style={styles.bloco}>
              <Text style={styles.blocoTitulo}>1. Identificação</Text>
              <Text style={styles.blocoLabel}>Nome do alimento *</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome}
                placeholder="Ex: Frango Grelhado da Mamãe" placeholderTextColor="#555" />
              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, !tipoLiquido && styles.toggleAtivo]}>Sólido (g)</Text>
                <Switch value={tipoLiquido} onValueChange={setTipoLiquido}
                  trackColor={{ false: '#533483', true: '#3498db' }}
                  thumbColor="#fff" />
                <Text style={[styles.toggleLabel, tipoLiquido && styles.toggleAtivo]}>Líquido (ml)</Text>
              </View>
            </View>

            {/* ── BLOCO 2: INFORMAÇÃO NUTRICIONAL ── */}
            <View style={styles.bloco}>
              <Text style={styles.blocoTitulo}>2. Informação Nutricional</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📋 Insira os valores por <Text style={{ color: '#e94560', fontWeight: 'bold' }}>100{unid}</Text> do produto (conforme o rótulo).
                  Campos em branco serão <Text style={{ color: '#f39c12', fontWeight: 'bold' }}>estimados automaticamente</Text>.
                </Text>
              </View>
              <View style={styles.nutriGrid}>
                {[
                  { l: `Calorias (kcal)`, v: cal, fn: setCal, c: '#e94560', icon: '🔥' },
                  { l: `Carboidratos (g)`, v: carb, fn: setCarb, c: '#f39c12', icon: '🍚' },
                  { l: `Proteínas (g)`, v: prot, fn: setProt, c: '#3498db', icon: '🥩' },
                  { l: `Gorduras (g)`, v: gord, fn: setGord, c: '#9b59b6', icon: '🫙' },
                  { l: `Fibras (g)`, v: fibra, fn: setFibra, c: '#2ecc71', icon: '🌿' },
                ].map(n => (
                  <View key={n.l} style={styles.nutriItem}>
                    <Text style={styles.nutriIcon}>{n.icon}</Text>
                    <Text style={styles.nutriLabel}>{n.l}</Text>
                    <TextInput
                      style={[styles.nutriInput, n.v && { borderColor: n.c }]}
                      value={n.v} onChangeText={n.fn}
                      keyboardType="decimal-pad"
                      placeholder="—"
                      placeholderTextColor="#444"
                      onBlur={calcularPreview}
                    />
                  </View>
                ))}
              </View>

              {/* Preview estimado */}
              {preview && (
                <View style={styles.previewCard}>
                  <Text style={styles.previewTitulo}>✨ Preview por 100{unid}</Text>
                  <View style={styles.previewGrid}>
                    {[
                      { l: 'Calorias', v: preview.cal, u: 'kcal', c: '#e94560', est: preview._estimado?.cal },
                      { l: 'Proteína', v: preview.prot, u: 'g', c: '#3498db', est: preview._estimado?.prot },
                      { l: 'Carb', v: preview.carb, u: 'g', c: '#f39c12', est: preview._estimado?.carb },
                      { l: 'Gordura', v: preview.gord, u: 'g', c: '#9b59b6', est: preview._estimado?.gord },
                      { l: 'Fibra', v: preview.fibra, u: 'g', c: '#2ecc71', est: preview._estimado?.fibra },
                    ].map(n => (
                      <View key={n.l} style={styles.previewItem}>
                        <Text style={[styles.previewVal, { color: n.c }]}>{n.v}</Text>
                        <Text style={styles.previewUnid}>{n.u}</Text>
                        <Text style={styles.previewLabel}>{n.l}</Text>
                        {n.est && <Text style={styles.previewEst}>~est.</Text>}
                      </View>
                    ))}
                  </View>
                  <Text style={styles.previewAviso}>
                    🔸 Valores com "~est." foram calculados automaticamente.
                  </Text>
                </View>
              )}
            </View>

            {/* ── BLOCO 3: MEDIDAS CASEIRAS ── */}
            <View style={styles.bloco}>
              <Text style={styles.blocoTitulo}>3. Medidas Caseiras (Opcional)</Text>
              <Text style={styles.blocoSub}>
                Facilite o registro adicionando medidas do dia a dia como "filé médio" ou "colher de sopa".
              </Text>

              {medidas.map((m, i) => (
                <View key={i} style={styles.medidaItem}>
                  <Text style={styles.medidaNome}>{m.nome_medida}</Text>
                  <Text style={styles.medidaPeso}>≈ {m.peso_em_gramas}g</Text>
                  <TouchableOpacity onPress={() => removerMedida(i)}>
                    <Text style={styles.medidaRemover}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.medidaAddRow}>
                <TextInput style={[styles.input, { flex: 2, marginBottom: 0 }]}
                  value={nomeMedida} onChangeText={setNomeMedida}
                  placeholder="Ex: Filé médio" placeholderTextColor="#555" />
                <TextInput style={[styles.input, { flex: 1, marginBottom: 0, marginLeft: 8 }]}
                  value={pesoMedida} onChangeText={setPesoMedida}
                  placeholder="120g" placeholderTextColor="#555"
                  keyboardType="decimal-pad" />
                <TouchableOpacity style={styles.medidaAddBtn} onPress={adicionarMedida}>
                  <Text style={styles.medidaAddText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── BLOCO 4: PRIVACIDADE ── */}
            <View style={styles.bloco}>
              <Text style={styles.blocoTitulo}>4. Privacidade</Text>
              <View style={styles.privacidadeRow}>
                <View style={styles.privacidadeInfo}>
                  <Text style={styles.privacidadeLabel}>
                    {publico ? '🌐 Compartilhar com a comunidade' : '🔒 Apenas para mim'}
                  </Text>
                  <Text style={styles.privacidadeSub}>
                    {publico
                      ? 'Outros usuários poderão encontrar este alimento.'
                      : 'Alimento visível somente no seu perfil.'}
                  </Text>
                </View>
                <Switch value={publico} onValueChange={setPublico}
                  trackColor={{ false: '#2a2a3e', true: '#533483' }}
                  thumbColor="#fff" />
              </View>
            </View>

            <TouchableOpacity style={styles.salvarBtn} onPress={salvarAlimento}
              disabled={!nome.trim()}>
              <LinearGradient colors={nome.trim() ? ['#533483', '#e94560'] : ['#333', '#333']}
                style={styles.salvarGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.salvarText}>💾 Salvar alimento</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── MODAL REGISTRAR CONSUMO ──────────────────────────────────────────────────
function ModalRegistrarConsumo({ visivel, onFechar, onAdicionar, refeicaoTipo, alimentosCustom }) {
  const [etapa, setEtapa] = useState('busca');
  const [busca, setBusca] = useState('');
  const [catFiltro, setCatFiltro] = useState('Todos');
  const [selecionado, setSelecionado] = useState(null);
  const [modoMedida, setModoMedida] = useState('gramas'); // 'gramas' | 'caseira'
  const [quantidade, setQuantidade] = useState('100');
  const [medidaSelecionada, setMedidaSelecionada] = useState(null);
  const [qtdMedida, setQtdMedida] = useState('1');
  const [horario, setHorario] = useState(refeicaoTipo?.horario || '12:00');

  function resetar() {
    setEtapa('busca'); setBusca(''); setSelecionado(null);
    setModoMedida('gramas'); setQuantidade('100');
    setMedidaSelecionada(null); setQtdMedida('1');
  }

  // Converter alimento do banco para formato unificado
  function normalizarAlimento(alimento) {
    if (alimento.valores_base_100g) return alimento;
    return {
      ...alimento,
      valores_base_100g: {
        cal: alimento.cal, prot: alimento.prot,
        carb: alimento.carb, gord: alimento.gord, fibra: alimento.fibra || 0,
      },
      medidas_caseiras: [],
    };
  }

  function calcNutrientesRegistro() {
    if (!selecionado) return null;
    const alim = normalizarAlimento(selecionado);
    if (modoMedida === 'caseira' && medidaSelecionada) {
      return calcularPorcao(alim, parseFloat(qtdMedida) || 1, alim.tipo, medidaSelecionada);
    }
    return calcularPorcao(alim, parseFloat(quantidade) || 100, alim.tipo);
  }

  function confirmar() {
    const nutrientes = calcNutrientesRegistro();
    if (!nutrientes) return;
    onAdicionar({
      nome: selecionado.nome,
      quantidade: modoMedida === 'caseira'
        ? `${qtdMedida}x ${medidaSelecionada} (≈${nutrientes.gramas_consumidas}g)`
        : `${quantidade}${selecionado.unidade || 'g'}`,
      horario,
      refeicaoId: refeicaoTipo?.id || 'almoco',
      refeicaoNome: refeicaoTipo?.nome || 'Refeição',
      ...nutrientes,
      id: Date.now(),
    });
    resetar();
  }

  const todosAlimentos = [
    ...BANCO_ALIMENTOS,
    ...alimentosCustom.map(a => ({ ...a, isCustom: true })),
  ];

  const filtrados = todosAlimentos.filter(a => {
    const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = catFiltro === 'Todos' || a.cat === catFiltro ||
      (catFiltro === 'Meus' && a.isCustom);
    return matchBusca && matchCat;
  });

  const nutriPreview = calcNutrientesRegistro();
  const temMedidas = selecionado?.medidas_caseiras?.length > 0;

  return (
    <Modal visible={visivel} animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.modalBg}>
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
              {refeicaoTipo?.emoji} {refeicaoTipo?.nome}
            </Text>
            <View style={{ width: 60 }} />
          </View>

          {/* ── BUSCA ── */}
          {etapa === 'busca' && (
            <>
              <TextInput style={styles.buscaInput} placeholder="Buscar alimento..."
                placeholderTextColor="#555" value={busca} onChangeText={setBusca} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {['Todos', 'Meus', ...CATEGORIAS_ALIMENTO].map(c => (
                  <TouchableOpacity key={c}
                    style={[styles.catChip, catFiltro === c && styles.catChipAtivo]}
                    onPress={() => setCatFiltro(c)}>
                    <Text style={[styles.catChipText, catFiltro === c && styles.catChipTextAtivo]}>
                      {c === 'Meus' ? '⭐ Meus' : c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <FlatList
                data={filtrados}
                keyExtractor={i => String(i.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.alimentoItem}
                    onPress={() => {
                      setSelecionado(item);
                      setMedidaSelecionada(null);
                      setQuantidade(item.unidade === 'un' ? '1' : '100');
                      setEtapa('detalhe');
                    }}>
                    <View style={styles.alimentoItemInfo}>
                      <View style={styles.alimentoItemNomeRow}>
                        <Text style={styles.alimentoItemNome}>{item.nome}</Text>
                        {item.isCustom && <Text style={styles.customBadge}>Meu</Text>}
                      </View>
                      <Text style={styles.alimentoItemCat}>
                        {item.cat} · {item.medidas_caseiras?.length > 0 ? `${item.medidas_caseiras.length} medida(s) caseira(s)` : `por 100${item.unidade || 'g'}`}
                      </Text>
                    </View>
                    <View style={styles.alimentoItemRight}>
                      <Text style={styles.alimentoItemCal}>{item.cal || item.valores_base_100g?.cal}</Text>
                      <Text style={styles.alimentoItemCalLabel}>kcal/100{item.unidade || 'g'}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* ── DETALHE / REGISTRAR ── */}
          {etapa === 'detalhe' && selecionado && (
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.detalheNome}>{selecionado.nome}</Text>

              {/* Horário */}
              <Text style={styles.blocoLabel}>⏰ Horário</Text>
              <TextInput style={styles.input} value={horario} onChangeText={setHorario}
                placeholder="HH:MM" placeholderTextColor="#555"
                keyboardType="numbers-and-punctuation" />

              {/* Modo de medida */}
              <Text style={styles.blocoLabel}>📏 Como medir?</Text>
              <View style={styles.modoRow}>
                <TouchableOpacity
                  style={[styles.modoBtn, modoMedida === 'gramas' && styles.modoBtnAtivo]}
                  onPress={() => setModoMedida('gramas')}>
                  <Text style={[styles.modoBtnText, modoMedida === 'gramas' && styles.modoBtnTextAtivo]}>
                    ⚖️ {selecionado.tipo === 'ml' || selecionado.unidade === 'ml' ? 'Mililitros (ml)' : 'Gramas (g)'}
                  </Text>
                </TouchableOpacity>
                {temMedidas && (
                  <TouchableOpacity
                    style={[styles.modoBtn, modoMedida === 'caseira' && styles.modoBtnAtivo]}
                    onPress={() => setModoMedida('caseira')}>
                    <Text style={[styles.modoBtnText, modoMedida === 'caseira' && styles.modoBtnTextAtivo]}>
                      🥄 Medida caseira
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {modoMedida === 'gramas' && (
                <>
                  <Text style={styles.blocoLabel}>
                    Quantidade ({selecionado.tipo === 'ml' || selecionado.unidade === 'ml' ? 'ml' : 'g'})
                  </Text>
                  <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade}
                    keyboardType="decimal-pad" selectTextOnFocus />
                </>
              )}

              {modoMedida === 'caseira' && temMedidas && (
                <>
                  <Text style={styles.blocoLabel}>Selecione a medida</Text>
                  {selecionado.medidas_caseiras.map((m, i) => (
                    <TouchableOpacity key={i}
                      style={[styles.medidaOpcao, medidaSelecionada === m.nome_medida && styles.medidaOpcaoAtiva]}
                      onPress={() => setMedidaSelecionada(m.nome_medida)}>
                      <Text style={styles.medidaOpcaoNome}>{m.nome_medida}</Text>
                      <Text style={styles.medidaOpcaoPeso}>≈ {m.peso_em_gramas}g cada</Text>
                    </TouchableOpacity>
                  ))}
                  {medidaSelecionada && (
                    <>
                      <Text style={styles.blocoLabel}>Quantas unidades?</Text>
                      <TextInput style={styles.input} value={qtdMedida} onChangeText={setQtdMedida}
                        keyboardType="decimal-pad" selectTextOnFocus />
                    </>
                  )}
                </>
              )}

              {/* Preview nutricional calculado */}
              {nutriPreview && (
                <View style={styles.previewCard}>
                  <Text style={styles.previewTitulo}>🔢 Nutrientes calculados</Text>
                  <View style={styles.previewGrid}>
                    {[
                      { l: 'Calorias', v: nutriPreview.cal, u: 'kcal', c: '#e94560' },
                      { l: 'Proteína', v: nutriPreview.prot, u: 'g', c: '#3498db' },
                      { l: 'Carb', v: nutriPreview.carb, u: 'g', c: '#f39c12' },
                      { l: 'Gordura', v: nutriPreview.gord, u: 'g', c: '#9b59b6' },
                      { l: 'Fibra', v: nutriPreview.fibra, u: 'g', c: '#2ecc71' },
                    ].map(n => (
                      <View key={n.l} style={styles.previewItem}>
                        <Text style={[styles.previewVal, { color: n.c }]}>{n.v}</Text>
                        <Text style={styles.previewUnid}>{n.u}</Text>
                        <Text style={styles.previewLabel}>{n.l}</Text>
                      </View>
                    ))}
                  </View>
                  {nutriPreview.gramas_consumidas && (
                    <Text style={styles.gramасConsumidasText}>
                      Total: {nutriPreview.gramas_consumidas}g consumidos
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity style={styles.salvarBtn} onPress={confirmar}>
                <LinearGradient colors={['#533483', '#e94560']} style={styles.salvarGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.salvarText}>✓ Adicionar à refeição</Text>
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
  const [alimentosCustom, setAlimentosCustom] = useState([]);
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalCadastrar, setModalCadastrar] = useState(false);
  const [refeicaoAtiva, setRefeicaoAtiva] = useState(null);
  const hoje = new Date().toDateString();

  useEffect(() => { carregar_dados(); }, []);

  async function carregar_dados() {
    const d = await carregar(KEYS.REFEICOES, {});
    const dHoje = d[hoje] || {};
    setDiario(Array.isArray(dHoje) ? {} : dHoje);
    const custom = await carregar(KEYS.ALIMENTOS_CUSTOM, []);
    setAlimentosCustom(custom);
  }

  async function adicionarAlimento(item) {
    const atual = { ...diario };
    if (!atual[item.refeicaoId]) atual[item.refeicaoId] = [];
    atual[item.refeicaoId].push(item);
    setDiario(atual);
    const todas = await carregar(KEYS.REFEICOES, {});
    todas[hoje] = atual;
    await salvar(KEYS.REFEICOES, todas);
    setModalRegistrar(false);
  }

  async function removerAlimento(refeicaoId, itemId) {
    const atual = { ...diario };
    atual[refeicaoId] = (atual[refeicaoId] || []).filter(i => i.id !== itemId);
    setDiario(atual);
    const todas = await carregar(KEYS.REFEICOES, {});
    todas[hoje] = atual;
    await salvar(KEYS.REFEICOES, todas);
  }

  function onAlimentoCadastrado(alimento) {
    setAlimentosCustom(prev => [...prev, alimento]);
    setModalCadastrar(false);
  }

  const todosItens = Object.values(diario).flat();
  const totais = todosItens.reduce((a, i) => ({
    cal: a.cal + (i.cal || 0), prot: a.prot + (i.prot || 0),
    carb: a.carb + (i.carb || 0), gord: a.gord + (i.gord || 0),
    fibra: a.fibra + (i.fibra || 0),
  }), { cal: 0, prot: 0, carb: 0, gord: 0, fibra: 0 });

  const pctCal = Math.min((totais.cal / META.cal) * 100, 100);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.titulo}>Nutrição</Text>
              <Text style={styles.data}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <TouchableOpacity style={styles.cadastrarBtn} onPress={() => setModalCadastrar(true)}>
              <Text style={styles.cadastrarBtnText}>+ Cadastrar{'\n'}alimento</Text>
            </TouchableOpacity>
          </View>

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
                <Text style={styles.calMacroItem}>🥩 {Math.round(totais.prot)}g</Text>
                <Text style={styles.calMacroItem}>🍚 {Math.round(totais.carb)}g</Text>
                <Text style={styles.calMacroItem}>🫙 {Math.round(totais.gord)}g</Text>
                <Text style={styles.calMacroItem}>🌿 {Math.round(totais.fibra)}g</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Macronutrientes do dia</Text>
            <BarraMacro label="Proteína" valor={totais.prot} meta={META.prot} cor="#e94560" />
            <BarraMacro label="Carboidrato" valor={totais.carb} meta={META.carb} cor="#f39c12" />
            <BarraMacro label="Gordura" valor={totais.gord} meta={META.gord} cor="#9b59b6" />
            <BarraMacro label="Fibra" valor={totais.fibra} meta={META.fibra} cor="#2ecc71" />
          </View>

          <Text style={styles.secaoTitulo}>Refeições de hoje</Text>
          {REFEICOES_TIPO.map(ref => {
            const itens = diario[ref.id] || [];
            const totalRef = itens.reduce((a, i) => ({ cal: a.cal + (i.cal || 0), prot: a.prot + (i.prot || 0) }), { cal: 0, prot: 0 });
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
                      onPress={() => { setRefeicaoAtiva(ref); setModalRegistrar(true); }}>
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
                        <Text style={styles.itemDetalhe}>{item.quantidade} · ⏰ {item.horario}</Text>
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

          {todosItens.length > 0 && (
            <View style={styles.resumoCard}>
              <Text style={styles.cardTitulo}>Resumo do dia</Text>
              {[
                { l: 'Alimentos registrados', v: todosItens.length, u: 'itens', c: '#888' },
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

      <ModalRegistrarConsumo
        visivel={modalRegistrar}
        onFechar={() => setModalRegistrar(false)}
        onAdicionar={adicionarAlimento}
        refeicaoTipo={refeicaoAtiva}
        alimentosCustom={alimentosCustom}
      />

      <ModalCadastrarAlimento
        visivel={modalCadastrar}
        onFechar={() => setModalCadastrar(false)}
        onSalvar={onAlimentoCadastrado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: { padding: 24, paddingTop: 50 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  data: { color: '#aaa', fontSize: 13, marginTop: 4, textTransform: 'capitalize' },
  cadastrarBtn: { backgroundColor: '#533483', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  cadastrarBtnText: { color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  calArea: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  calRing: { width: 110, height: 110, borderRadius: 55, borderWidth: 6, borderColor: '#e94560', alignItems: 'center', justifyContent: 'center' },
  calNum: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  calUnid: { color: '#aaa', fontSize: 12 },
  calMeta: { color: '#666', fontSize: 11 },
  calInfo: { flex: 1 },
  calBarTrack: { height: 6, backgroundColor: '#1e1e30', borderRadius: 3, marginBottom: 6 },
  calBarFill: { height: 6, backgroundColor: '#e94560', borderRadius: 3 },
  calRestante: { color: '#aaa', fontSize: 12, marginBottom: 8 },
  calMacroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  // Modal compartilhado
  modalBg: { flex: 1, backgroundColor: '#0d0d1a' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#1a1a2e' },
  modalBack: { color: '#e94560', fontSize: 15 },
  modalTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalScroll: { padding: 16 },
  buscaInput: { backgroundColor: '#1e1e30', margin: 16, marginBottom: 8, borderRadius: 12, padding: 14, color: '#fff', fontSize: 15 },
  catScroll: { paddingLeft: 16, maxHeight: 44, marginBottom: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e1e30', marginRight: 8 },
  catChipAtivo: { backgroundColor: '#533483' },
  catChipText: { color: '#888', fontSize: 13 },
  catChipTextAtivo: { color: '#fff' },
  alimentoItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1e1e30' },
  alimentoItemInfo: { flex: 1 },
  alimentoItemNomeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alimentoItemNome: { color: '#fff', fontWeight: '600' },
  customBadge: { backgroundColor: '#53348340', color: '#a78bfa', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#533483' },
  alimentoItemCat: { color: '#888', fontSize: 12, marginTop: 2 },
  alimentoItemRight: { alignItems: 'flex-end' },
  alimentoItemCal: { color: '#e94560', fontWeight: 'bold', fontSize: 18 },
  alimentoItemCalLabel: { color: '#888', fontSize: 10 },
  // Bloco cadastro
  bloco: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, marginBottom: 12 },
  blocoTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  blocoSub: { color: '#888', fontSize: 13, marginBottom: 12 },
  blocoLabel: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: '#0d0d1a', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a3e' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  toggleLabel: { color: '#666', fontSize: 14 },
  toggleAtivo: { color: '#fff', fontWeight: 'bold' },
  infoBox: { backgroundColor: '#0d0d1a', borderRadius: 10, padding: 12, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#f39c12' },
  infoText: { color: '#aaa', fontSize: 13, lineHeight: 20 },
  nutriGrid: { gap: 8 },
  nutriItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nutriIcon: { fontSize: 18, width: 24 },
  nutriLabel: { color: '#ccc', fontSize: 13, flex: 1 },
  nutriInput: { backgroundColor: '#0d0d1a', borderRadius: 8, padding: 10, color: '#fff', fontSize: 15, width: 80, textAlign: 'center', borderWidth: 1, borderColor: '#2a2a3e' },
  previewCard: { backgroundColor: '#0d0d1a', borderRadius: 14, padding: 14, marginTop: 12 },
  previewTitulo: { color: '#fff', fontWeight: 'bold', marginBottom: 10, fontSize: 14 },
  previewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  previewItem: { alignItems: 'center', backgroundColor: '#1e1e30', borderRadius: 10, padding: 10, minWidth: 55, flex: 1 },
  previewVal: { fontSize: 18, fontWeight: 'bold' },
  previewUnid: { color: '#888', fontSize: 10 },
  previewLabel: { color: '#aaa', fontSize: 10, marginTop: 2, textAlign: 'center' },
  previewEst: { color: '#f39c12', fontSize: 9, marginTop: 2 },
  previewAviso: { color: '#f39c12', fontSize: 11, marginTop: 8, textAlign: 'center' },
  medidaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d1a', borderRadius: 10, padding: 12, marginBottom: 6 },
  medidaNome: { color: '#fff', flex: 1 },
  medidaPeso: { color: '#888', marginRight: 12 },
  medidaRemover: { color: '#e94560' },
  medidaAddRow: { flexDirection: 'row', alignItems: 'center', gap: 0, marginTop: 8 },
  medidaAddBtn: { backgroundColor: '#533483', width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  medidaAddText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  privacidadeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  privacidadeInfo: { flex: 1 },
  privacidadeLabel: { color: '#fff', fontWeight: '600' },
  privacidadeSub: { color: '#888', fontSize: 12, marginTop: 2 },
  salvarBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 30, marginTop: 8 },
  salvarGrad: { padding: 18, alignItems: 'center' },
  salvarText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  detalheNome: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  modoRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  modoBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#1e1e30', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a3e' },
  modoBtnAtivo: { borderColor: '#533483', backgroundColor: '#53348320' },
  modoBtnText: { color: '#888', fontSize: 13 },
  modoBtnTextAtivo: { color: '#fff', fontWeight: '600' },
  medidaOpcao: { backgroundColor: '#1e1e30', borderRadius: 10, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: '#2a2a3e' },
  medidaOpcaoAtiva: { borderColor: '#533483', backgroundColor: '#53348320' },
  medidaOpcaoNome: { color: '#fff', fontWeight: '600' },
  medidaOpcaoPeso: { color: '#888', fontSize: 12, marginTop: 2 },
  gramасConsumidasText: { color: '#888', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
