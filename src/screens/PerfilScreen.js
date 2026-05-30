import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Image, Alert, Switch, Modal, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { carregar, salvar } from '../utils/storage';
import { PLANOS } from '../data/exercises';

const { width } = Dimensions.get('window');

// ─── Constantes ───────────────────────────────────────────────────────────────
const OBJETIVOS = [
  { id: 'emagrecer', emoji: '🔥', titulo: 'Emagrecer',    cor: '#e74c3c' },
  { id: 'massa',     emoji: '💪', titulo: 'Ganhar Massa', cor: '#3498db' },
  { id: 'definir',   emoji: '⚡', titulo: 'Definir',      cor: '#f39c12' },
  { id: 'saude',     emoji: '❤️', titulo: 'Saúde Geral',  cor: '#2ecc71' },
];

const BIOTIPOS = {
  ectomorfo:   { nome: 'Ectomorfo',   emoji: '🦴', cor: '#3498db' },
  mesomorfo:   { nome: 'Mesomorfo',   emoji: '💪', cor: '#2ecc71' },
  endomorfo:   { nome: 'Endomorfo',   emoji: '🔥', cor: '#e74c3c' },
  ectomorfa:   { nome: 'Ectomorfa',   emoji: '🦴', cor: '#3498db' },
  mesomorfa:   { nome: 'Mesomorfa',   emoji: '💪', cor: '#2ecc71' },
  endomorfa:   { nome: 'Endomorfa',   emoji: '🔥', cor: '#e74c3c' },
  ampulheta:   { nome: 'Ampulheta',   emoji: '⌛', cor: '#9b59b6' },
  pera:        { nome: 'Pêra',        emoji: '🍐', cor: '#f39c12' },
  maca:        { nome: 'Maçã',        emoji: '🍎', cor: '#e67e22' },
  retangular:  { nome: 'Retangular',  emoji: '🟨', cor: '#1abc9c' },
};

const NIVEL_ATIVIDADE = [
  { id: 'sedentario',  label: 'Sedentário',    fator: 1.2  },
  { id: 'leve',        label: 'Leve (1-3x/sem)',  fator: 1.375 },
  { id: 'moderado',    label: 'Moderado (3-5x)', fator: 1.55  },
  { id: 'intenso',     label: 'Intenso (6-7x)',  fator: 1.725 },
];

// ─── Cálculo nutricional ─────────────────────────────────────────────────────
function calcularNutricao(perfil) {
  const peso = parseFloat(perfil.peso) || 70;
  const altura = parseFloat(perfil.altura) || 170;
  const idade = parseFloat(perfil.idade) || 25;
  const sexo = perfil.sexo || 'masculino';
  const objetivo = perfil.objetivo || 'saude';
  const biotipo = perfil.biotipo || 'mesomorfo';
  const atividade = perfil.nivelAtividade || 'moderado';

  // BMR Harris-Benedict
  const bmr = sexo === 'feminino'
    ? 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * idade
    : 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade;

  const fator = NIVEL_ATIVIDADE.find(n => n.id === atividade)?.fator || 1.55;
  const tdee = Math.round(bmr * fator);

  const ajuste = { emagrecer: -500, massa: 400, definir: -200, saude: 0 }[objetivo] || 0;
  const calorias = tdee + ajuste;

  // Macros
  const splits = {
    emagrecer: { c: 0.35, p: 0.40, g: 0.25 },
    massa:     { c: 0.50, p: 0.30, g: 0.20 },
    definir:   { c: 0.38, p: 0.40, g: 0.22 },
    saude:     { c: 0.45, p: 0.30, g: 0.25 },
  };
  const split = splits[objetivo] || splits.saude;
  const proteina = Math.round((calorias * split.p) / 4);
  const carbo    = Math.round((calorias * split.c) / 4);
  const gordura  = Math.round((calorias * split.g) / 9);

  // Refeições sugeridas
  const refeicoes = gerarRefeicoes(objetivo, biotipo, calorias);

  return { bmr: Math.round(bmr), tdee, calorias, proteina, carbo, gordura, refeicoes };
}

function gerarRefeicoes(objetivo, biotipo, calorias) {
  const base = {
    emagrecer: [
      { hora: '07:00', nome: 'Café da manhã', itens: ['2 ovos mexidos', 'Pão integral (1 fatia)', 'Café preto ou chá'], cal: Math.round(calorias * 0.22) },
      { hora: '10:00', nome: 'Lanche manhã',  itens: ['1 fruta (banana ou maçã)', '10 castanhas'], cal: Math.round(calorias * 0.10) },
      { hora: '13:00', nome: 'Almoço',        itens: ['Frango grelhado (150g)', 'Arroz integral (4 col)', 'Salada verde à vontade', 'Feijão (2 col)'], cal: Math.round(calorias * 0.32) },
      { hora: '16:00', nome: 'Pré-treino',    itens: ['Whey Protein (1 dose)', 'Banana'], cal: Math.round(calorias * 0.14) },
      { hora: '19:30', nome: 'Jantar',        itens: ['Peixe ou ovo (200g)', 'Legumes no vapor', 'Batata doce (80g)'], cal: Math.round(calorias * 0.22) },
    ],
    massa: [
      { hora: '07:00', nome: 'Café da manhã', itens: ['Omelete (3 ovos)', 'Aveia (50g) com leite', 'Banana'], cal: Math.round(calorias * 0.20) },
      { hora: '10:00', nome: 'Lanche manhã',  itens: ['Whey + pasta de amendoim', 'Pão integral (2 fatias)'], cal: Math.round(calorias * 0.15) },
      { hora: '13:00', nome: 'Almoço',        itens: ['Frango ou carne (200g)', 'Arroz branco (6 col)', 'Feijão (3 col)', 'Salada'], cal: Math.round(calorias * 0.30) },
      { hora: '16:30', nome: 'Pré-treino',    itens: ['Batata doce (150g)', 'Frango (100g)'], cal: Math.round(calorias * 0.15) },
      { hora: '20:00', nome: 'Pós-treino',    itens: ['Whey Protein (2 doses)', 'Banana (2)', 'Amendoim (30g)'], cal: Math.round(calorias * 0.20) },
    ],
    definir: [
      { hora: '07:00', nome: 'Café da manhã', itens: ['3 claras + 1 ovo inteiro', 'Aveia (40g)', '1 fruta'], cal: Math.round(calorias * 0.22) },
      { hora: '10:30', nome: 'Lanche manhã',  itens: ['Iogurte grego (170g)', '1 fruta pequena'], cal: Math.round(calorias * 0.12) },
      { hora: '13:00', nome: 'Almoço',        itens: ['Frango grelhado (180g)', 'Arroz integral (4 col)', 'Legumes variados', 'Feijão (2 col)'], cal: Math.round(calorias * 0.30) },
      { hora: '16:00', nome: 'Pré-treino',    itens: ['Whey Protein', 'Banana pequena'], cal: Math.round(calorias * 0.14) },
      { hora: '19:30', nome: 'Jantar',        itens: ['Tilápia ou frango (180g)', 'Batata doce (100g)', 'Salada verde'], cal: Math.round(calorias * 0.22) },
    ],
    saude: [
      { hora: '07:00', nome: 'Café da manhã', itens: ['2 ovos', 'Pão integral (2 fatias)', 'Queijo branco', 'Suco natural'], cal: Math.round(calorias * 0.22) },
      { hora: '10:00', nome: 'Lanche manhã',  itens: ['Fruta + iogurte natural'], cal: Math.round(calorias * 0.12) },
      { hora: '13:00', nome: 'Almoço',        itens: ['Proteína magra (150g)', 'Arroz + feijão', 'Salada colorida', 'Legumes'], cal: Math.round(calorias * 0.32) },
      { hora: '16:00', nome: 'Lanche tarde',  itens: ['Mix de castanhas (30g)', '1 fruta'], cal: Math.round(calorias * 0.12) },
      { hora: '19:30', nome: 'Jantar',        itens: ['Proteína + vegetais', 'Carboidrato moderado'], cal: Math.round(calorias * 0.22) },
    ],
  };
  return base[objetivo] || base.saude;
}

function calcularIMC(peso, altura) {
  if (!peso || !altura) return null;
  return (parseFloat(peso) / Math.pow(parseFloat(altura) / 100, 2)).toFixed(1);
}

function classificarIMC(imc) {
  const v = parseFloat(imc);
  if (v < 18.5) return { texto: 'Abaixo do peso', cor: '#3498db' };
  if (v < 25)   return { texto: 'Peso normal',    cor: '#2ecc71' };
  if (v < 30)   return { texto: 'Sobrepeso',      cor: '#f39c12' };
  return { texto: 'Obesidade', cor: '#e74c3c' };
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PerfilScreen() {
  const [perfil, setPerfil] = useState(null);
  const [stats, setStats]   = useState({ streak: 0, treinos: 0 });
  const [editModal, setEditModal]   = useState(null); // 'dados' | 'objetivo' | 'biotipo' | 'plano' | 'atividade'
  const [editDados, setEditDados]   = useState({});
  const [nutricao, setNutricao]     = useState(null);
  const [abaAtiva, setAbaAtiva]     = useState('perfil'); // 'perfil' | 'dieta' | 'plano'

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const p  = await carregar('perfil_usuario');
    const s  = await carregar('streak', 0);
    const tf = await carregar('treinos_feitos', []);
    setPerfil(p || {});
    setStats({ streak: s, treinos: tf.length });
    if (p) setNutricao(calcularNutricao(p));
  }

  async function salvarPerfil(novosPerfil) {
    const atualizado = { ...perfil, ...novosPerfil };
    await salvar('perfil_usuario', atualizado);
    setPerfil(atualizado);
    setNutricao(calcularNutricao(atualizado));
  }

  function abrirEdit(tipo) {
    setEditDados({ ...perfil });
    setEditModal(tipo);
  }

  async function confirmarEdit() {
    await salvarPerfil(editDados);
    setEditModal(null);
  }

  async function resetarPerfil() {
    Alert.alert(
      'Resetar Perfil',
      'Isso apagará todos os seus dados. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar', style: 'destructive',
          onPress: async () => {
            await salvar('perfil_usuario', null);
            await salvar('treinos_feitos', []);
            await salvar('streak', 0);
            setPerfil(null);
          },
        },
      ]
    );
  }

  if (!perfil) {
    return (
      <View style={styles.semPerfil}>
        <Text style={styles.semPerfilEmoji}>👤</Text>
        <Text style={styles.semPerfilTxt}>Nenhum perfil encontrado.</Text>
        <Text style={styles.semPerfilSub}>Complete o onboarding para criar seu perfil.</Text>
      </View>
    );
  }

  const imc = calcularIMC(perfil.peso, perfil.altura);
  const imcInfo = imc ? classificarIMC(imc) : null;
  const biotipoInfo = BIOTIPOS[perfil.biotipo] || { nome: perfil.biotipo, emoji: '💪', cor: '#533483' };
  const objetivoInfo = OBJETIVOS.find(o => o.id === perfil.objetivo) || OBJETIVOS[3];
  const planoAtual = PLANOS.find(p => p.id === (perfil.planoId || 1)) || PLANOS[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <LinearGradient colors={['#1a1a2e', '#0d0d1a']} style={styles.header}>
          <View style={styles.headerTop}>
            {/* Avatar */}
            <TouchableOpacity style={styles.avatarWrap} onPress={() => Alert.alert('Em breve', 'Upload de foto em breve!')}>
              <LinearGradient colors={[biotipoInfo.cor + '60', biotipoInfo.cor + '20']} style={styles.avatarGrad}>
                <Text style={styles.avatarLetra}>{(perfil.nome || 'U')[0].toUpperCase()}</Text>
              </LinearGradient>
              <View style={styles.avatarEdit}><Text style={styles.avatarEditTxt}>✏️</Text></View>
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerNome}>{perfil.nome || 'Usuário'}</Text>
              <View style={styles.headerBadgesRow}>
                <View style={[styles.badge, { backgroundColor: biotipoInfo.cor + '25', borderColor: biotipoInfo.cor }]}>
                  <Text style={[styles.badgeTxt, { color: biotipoInfo.cor }]}>{biotipoInfo.emoji} {biotipoInfo.nome}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: objetivoInfo.cor + '25', borderColor: objetivoInfo.cor }]}>
                  <Text style={[styles.badgeTxt, { color: objetivoInfo.cor }]}>{objetivoInfo.emoji} {objetivoInfo.titulo}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.streak}</Text>
              <Text style={styles.statLbl}>🔥 Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats.treinos}</Text>
              <Text style={styles.statLbl}>🏋️ Treinos</Text>
            </View>
            {imc && (
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: imcInfo.cor }]}>{imc}</Text>
                <Text style={styles.statLbl}>⚖️ IMC</Text>
              </View>
            )}
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{perfil.peso || '—'}</Text>
              <Text style={styles.statLbl}>kg Peso</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── ABAS ───────────────────────────────────────────────────────── */}
        <View style={styles.abasWrap}>
          {[
            { id: 'perfil', label: '👤 Perfil' },
            { id: 'dieta',  label: '🥗 Dieta'  },
            { id: 'plano',  label: '💪 Plano'  },
          ].map(a => (
            <TouchableOpacity key={a.id}
              style={[styles.aba, abaAtiva === a.id && styles.abaAtiva]}
              onPress={() => setAbaAtiva(a.id)}>
              <Text style={[styles.abaTxt, abaAtiva === a.id && styles.abaTxtAtiva]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ══════════════════════ ABA PERFIL ══════════════════════════════ */}
        {abaAtiva === 'perfil' && (
          <View style={styles.section}>

            {/* Dados pessoais */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>📋 Dados Pessoais</Text>
                <TouchableOpacity style={styles.editBtn} onPress={() => abrirEdit('dados')}>
                  <Text style={styles.editBtnTxt}>Editar</Text>
                </TouchableOpacity>
              </View>
              <InfoRow label="Nome"    value={perfil.nome || '—'} />
              <InfoRow label="Idade"   value={perfil.idade ? `${perfil.idade} anos` : '—'} />
              <InfoRow label="Sexo"    value={perfil.sexo === 'feminino' ? 'Feminino ♀️' : 'Masculino ♂️'} />
              <InfoRow label="Peso"    value={perfil.peso ? `${perfil.peso} kg` : '—'} />
              <InfoRow label="Altura"  value={perfil.altura ? `${perfil.altura} cm` : '—'} />
              {imc && <InfoRow label="IMC" value={`${imc} — ${imcInfo.texto}`} valueColor={imcInfo.cor} />}
            </View>

            {/* Objetivo */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>🎯 Objetivo</Text>
                <TouchableOpacity style={styles.editBtn} onPress={() => abrirEdit('objetivo')}>
                  <Text style={styles.editBtnTxt}>Alterar</Text>
                </TouchableOpacity>
              </View>
              {OBJETIVOS.map(obj => (
                <TouchableOpacity key={obj.id}
                  style={[styles.objetivoItem, perfil.objetivo === obj.id && { borderColor: obj.cor, backgroundColor: obj.cor + '15' }]}
                  onPress={() => salvarPerfil({ objetivo: obj.id })}>
                  <Text style={styles.objEmoji}>{obj.emoji}</Text>
                  <Text style={[styles.objTxt, perfil.objetivo === obj.id && { color: '#fff', fontWeight: '700' }]}>{obj.titulo}</Text>
                  {perfil.objetivo === obj.id && <Text style={{ color: obj.cor, marginLeft: 'auto', fontWeight: 'bold' }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {/* Biotipo */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>🧬 Biotipo</Text>
                <TouchableOpacity style={styles.editBtn} onPress={() => abrirEdit('biotipo')}>
                  <Text style={styles.editBtnTxt}>Alterar</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.biotipoAtual, { borderColor: biotipoInfo.cor }]}>
                <Text style={styles.biotipoEmoji}>{biotipoInfo.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.biotipoNome, { color: biotipoInfo.cor }]}>{biotipoInfo.nome}</Text>
                  <Text style={styles.biotipoSub}>Toque em "Alterar" para mudar seu biotipo</Text>
                </View>
              </View>
            </View>

            {/* Nível atividade */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitulo}>⚡ Nível de Atividade</Text>
                <TouchableOpacity style={styles.editBtn} onPress={() => abrirEdit('atividade')}>
                  <Text style={styles.editBtnTxt}>Alterar</Text>
                </TouchableOpacity>
              </View>
              {NIVEL_ATIVIDADE.map(n => (
                <TouchableOpacity key={n.id}
                  style={[styles.atividadeItem, (perfil.nivelAtividade || 'moderado') === n.id && styles.atividadeAtiva]}
                  onPress={() => salvarPerfil({ nivelAtividade: n.id })}>
                  <Text style={[styles.atividadeTxt, (perfil.nivelAtividade || 'moderado') === n.id && { color: '#fff' }]}>{n.label}</Text>
                  {(perfil.nivelAtividade || 'moderado') === n.id && <Text style={{ color: '#e94560' }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {/* Dias por semana */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>📅 Dias de Treino por Semana</Text>
              <View style={styles.diasRow}>
                {[2, 3, 4, 5, 6].map(d => (
                  <TouchableOpacity key={d}
                    style={[styles.diaCircle, (perfil.diasTreino || 3) === d && styles.diaCircleAtivo]}
                    onPress={() => salvarPerfil({ diasTreino: d })}>
                    <Text style={[styles.diaNum, (perfil.diasTreino || 3) === d && { color: '#fff' }]}>{d}</Text>
                    <Text style={styles.diaSub}>dias</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Zona perigo */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>⚠️ Zona de Perigo</Text>
              <TouchableOpacity style={styles.btnReset} onPress={resetarPerfil}>
                <Text style={styles.btnResetTxt}>🗑️ Resetar todos os dados</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

        {/* ══════════════════════ ABA DIETA ═══════════════════════════════ */}
        {abaAtiva === 'dieta' && nutricao && (
          <View style={styles.section}>

            {/* Resumo calórico */}
            <LinearGradient colors={['#1a2a1a', '#1e1e30']} style={styles.caloriaCard}>
              <Text style={styles.caloriaTitle}>🎯 Meta Calórica Diária</Text>
              <Text style={styles.caloriaNum}>{nutricao.calorias} kcal</Text>
              <Text style={styles.caloriaSub}>TMB: {nutricao.bmr} kcal · TDEE: {nutricao.tdee} kcal</Text>

              <View style={styles.macrosRow}>
                <MacroBox label="Proteína" val={nutricao.proteina} unit="g" cor="#e94560" />
                <MacroBox label="Carboidrato" val={nutricao.carbo} unit="g" cor="#3498db" />
                <MacroBox label="Gordura" val={nutricao.gordura} unit="g" cor="#f5a623" />
              </View>
            </LinearGradient>

            {/* Plano alimentar */}
            <Text style={styles.sectionTitulo}>🍽️ Plano Alimentar Sugerido</Text>
            <Text style={styles.sectionSub}>Baseado no seu objetivo: <Text style={{ color: objetivoInfo.cor, fontWeight: '700' }}>{objetivoInfo.titulo}</Text></Text>

            {nutricao.refeicoes.map((ref, i) => (
              <View key={i} style={styles.refeicaoCard}>
                <View style={styles.refeicaoHeader}>
                  <View style={styles.refeicaoHoraWrap}>
                    <Text style={styles.refeicaoHora}>{ref.hora}</Text>
                  </View>
                  <Text style={styles.refeicaoNome}>{ref.nome}</Text>
                  <View style={styles.refeicaoCalBox}>
                    <Text style={styles.refeicaoCal}>{ref.cal} kcal</Text>
                  </View>
                </View>
                {ref.itens.map((item, j) => (
                  <View key={j} style={styles.itemRow}>
                    <Text style={styles.itemDot}>•</Text>
                    <Text style={styles.itemTxt}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Dicas por biotipo */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>💡 Dicas para {biotipoInfo.nome}</Text>
              <DicasBiotipo biotipo={perfil.biotipo} objetivo={perfil.objetivo} />
            </View>

            {/* Água */}
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>💧 Hidratação</Text>
              <Text style={styles.aguaNum}>{((parseFloat(perfil.peso) || 70) * 35 / 1000).toFixed(1)} L/dia</Text>
              <Text style={styles.aguaSub}>= {Math.round((parseFloat(perfil.peso) || 70) * 35 / 250)} copos de 250ml por dia</Text>
            </View>

          </View>
        )}

        {/* ══════════════════════ ABA PLANO ════════════════════════════════ */}
        {abaAtiva === 'plano' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitulo}>💪 Plano de Treino</Text>

            {PLANOS.map(plano => {
              const ativo = (perfil.planoId || 1) === plano.id;
              return (
                <TouchableOpacity key={plano.id}
                  style={[styles.planoCard, ativo && styles.planoCardAtivo]}
                  onPress={() => salvarPerfil({ planoId: plano.id })}>
                  <View style={styles.planoCardTop}>
                    <View>
                      <Text style={styles.planoCardNome}>{plano.nome}</Text>
                      <View style={styles.nivelBadge}>
                        <Text style={styles.nivelTxt}>{plano.nivel}</Text>
                      </View>
                    </View>
                    <View style={styles.planoCardRight}>
                      <Text style={styles.planoDias}>{plano.dias.length}x/sem</Text>
                      {ativo && <View style={styles.ativoTag}><Text style={styles.ativoTxt}>✓ Ativo</Text></View>}
                    </View>
                  </View>

                  <View style={styles.planoDiasRow}>
                    {plano.dias.map(d => (
                      <View key={d} style={[styles.diaTag, ativo && styles.diaTagAtiva]}>
                        <Text style={[styles.diaTagTxt, ativo && { color: '#fff' }]}>{d}</Text>
                      </View>
                    ))}
                  </View>

                  {plano.treinos.map((t, i) => (
                    <View key={i} style={styles.treino_row}>
                      <View style={styles.treino_dia}><Text style={styles.treino_dia_txt}>{t.dia}</Text></View>
                      <Text style={styles.treino_nome}>{t.nome}</Text>
                      <Text style={styles.treino_count}>{t.exercicios.length} ex</Text>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>📊 Distribuição Semanal</Text>
              <Text style={styles.distSub}>Com {perfil.diasTreino || 3} dias de treino por semana:</Text>
              {[...planoAtual.treinos].slice(0, perfil.diasTreino || 3).map((t, i) => (
                <View key={i} style={styles.distItem}>
                  <View style={styles.distDia}><Text style={styles.distDiaTxt}>{t.dia}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.distNome}>{t.nome}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══════════════════════ MODAL EDIÇÃO ══════════════════════════════ */}
      <Modal visible={!!editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {editModal === 'dados'     ? '✏️ Editar Dados'
                : editModal === 'objetivo' ? '🎯 Alterar Objetivo'
                : editModal === 'biotipo'  ? '🧬 Alterar Biotipo'
                : editModal === 'atividade'? '⚡ Nível de Atividade'
                : 'Editar'}
              </Text>
              <TouchableOpacity onPress={() => setEditModal(null)}>
                <Text style={styles.modalFechar}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 480 }}>
              {editModal === 'dados' && (
                <View style={styles.modalContent}>
                  {[
                    { key: 'nome',   label: 'Nome',        keyboard: 'default' },
                    { key: 'idade',  label: 'Idade',       keyboard: 'numeric'  },
                    { key: 'peso',   label: 'Peso (kg)',   keyboard: 'decimal-pad' },
                    { key: 'altura', label: 'Altura (cm)', keyboard: 'numeric' },
                  ].map(f => (
                    <View key={f.key} style={styles.fieldWrap}>
                      <Text style={styles.fieldLabel}>{f.label}</Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={String(editDados[f.key] || '')}
                        onChangeText={v => setEditDados(d => ({ ...d, [f.key]: v }))}
                        keyboardType={f.keyboard}
                        placeholderTextColor="#555"
                        placeholder={f.label}
                      />
                    </View>
                  ))}
                </View>
              )}

              {editModal === 'objetivo' && (
                <View style={styles.modalContent}>
                  {OBJETIVOS.map(obj => (
                    <TouchableOpacity key={obj.id}
                      style={[styles.modalItem, editDados.objetivo === obj.id && { borderColor: obj.cor, backgroundColor: obj.cor + '15' }]}
                      onPress={() => setEditDados(d => ({ ...d, objetivo: obj.id }))}>
                      <Text style={styles.modalItemEmoji}>{obj.emoji}</Text>
                      <Text style={[styles.modalItemTxt, editDados.objetivo === obj.id && { color: '#fff' }]}>{obj.titulo}</Text>
                      {editDados.objetivo === obj.id && <Text style={{ color: obj.cor, marginLeft: 'auto' }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {editModal === 'biotipo' && (
                <View style={styles.modalContent}>
                  {Object.entries(BIOTIPOS).map(([key, bio]) => (
                    <TouchableOpacity key={key}
                      style={[styles.modalItem, editDados.biotipo === key && { borderColor: bio.cor, backgroundColor: bio.cor + '15' }]}
                      onPress={() => setEditDados(d => ({ ...d, biotipo: key }))}>
                      <Text style={styles.modalItemEmoji}>{bio.emoji}</Text>
                      <Text style={[styles.modalItemTxt, editDados.biotipo === key && { color: '#fff' }]}>{bio.nome}</Text>
                      {editDados.biotipo === key && <Text style={{ color: bio.cor, marginLeft: 'auto' }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {editModal === 'atividade' && (
                <View style={styles.modalContent}>
                  {NIVEL_ATIVIDADE.map(n => (
                    <TouchableOpacity key={n.id}
                      style={[styles.modalItem, (editDados.nivelAtividade || 'moderado') === n.id && styles.modalItemAtivo]}
                      onPress={() => setEditDados(d => ({ ...d, nivelAtividade: n.id }))}>
                      <Text style={[styles.modalItemTxt, (editDados.nivelAtividade || 'moderado') === n.id && { color: '#fff' }]}>{n.label}</Text>
                      {(editDados.nivelAtividade || 'moderado') === n.id && <Text style={{ color: '#e94560', marginLeft: 'auto' }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.modalSalvar} onPress={confirmarEdit}>
              <LinearGradient colors={['#533483', '#e94560']} style={styles.modalSalvarGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.modalSalvarTxt}>💾 Salvar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function InfoRow({ label, value, valueColor }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

function MacroBox({ label, val, unit, cor }) {
  return (
    <View style={styles.macroBox}>
      <Text style={[styles.macroVal, { color: cor }]}>{val}<Text style={styles.macroUnit}>{unit}</Text></Text>
      <Text style={styles.macroLbl}>{label}</Text>
    </View>
  );
}

function DicasBiotipo({ biotipo, objetivo }) {
  const dicas = {
    ectomorfo: ['Coma a cada 3h para evitar catabolismo', 'Priorize carboidratos complexos no pré-treino', 'Shake de whey + banana pós-treino é essencial', 'Evite cardio excessivo'],
    mesomorfo: ['Ajuste calorias conforme o objetivo', 'Dieta equilibrada com proteína alta', 'Variedade de alimentos funcionam bem', 'Foco em proteína a cada refeição'],
    endomorfo: ['Controle carboidratos simples', 'Prefira carboidratos de baixo índice glicêmico', 'Aumente a frequência de cardio', 'Evite açúcar e alimentos ultraprocessados'],
  };
  const key = biotipo?.replace('a', 'o') || 'mesomorfo';
  const lista = dicas[key] || dicas.mesomorfo;
  return (
    <View style={{ gap: 8 }}>
      {lista.map((d, i) => (
        <View key={i} style={styles.dicaItem}>
          <Text style={styles.dicaDot}>✅</Text>
          <Text style={styles.dicaTxt}>{d}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#0d0d1a' },
  semPerfil:      { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d1a', gap: 10 },
  semPerfilEmoji: { fontSize: 60 },
  semPerfilTxt:   { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  semPerfilSub:   { color: '#888', fontSize: 14 },

  // Header
  header:         { padding: 20, paddingTop: 55, paddingBottom: 20 },
  headerTop:      { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarWrap:     { position: 'relative' },
  avatarGrad:     { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' },
  avatarLetra:    { fontSize: 34, fontWeight: 'bold', color: '#fff' },
  avatarEdit:     { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0d0d1a', borderRadius: 12, padding: 3 },
  avatarEditTxt:  { fontSize: 14 },
  headerInfo:     { flex: 1 },
  headerNome:     { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  headerBadgesRow:{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge:          { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  badgeTxt:       { fontSize: 12, fontWeight: '700' },

  statsRow:       { flexDirection: 'row', gap: 8 },
  statBox:        { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  statNum:        { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLbl:        { color: '#888', fontSize: 10, marginTop: 2 },

  // Abas
  abasWrap:       { flexDirection: 'row', backgroundColor: '#0d0d1a', borderBottomWidth: 1, borderBottomColor: '#1e1e30' },
  aba:            { flex: 1, paddingVertical: 12, alignItems: 'center' },
  abaAtiva:       { borderBottomWidth: 2, borderBottomColor: '#e94560' },
  abaTxt:         { color: '#666', fontSize: 13, fontWeight: '600' },
  abaTxtAtiva:    { color: '#fff' },

  section:        { padding: 16, gap: 14 },
  sectionTitulo:  { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  sectionSub:     { color: '#888', fontSize: 13, marginBottom: 8 },

  // Cards
  card:           { backgroundColor: '#1e1e30', borderRadius: 18, padding: 18, gap: 10 },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  cardTitulo:     { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  editBtn:        { backgroundColor: '#533483', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  editBtnTxt:     { color: '#fff', fontSize: 12, fontWeight: '700' },

  infoRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
  infoLabel:      { color: '#888', fontSize: 14 },
  infoValue:      { color: '#fff', fontSize: 14, fontWeight: '600' },

  objetivoItem:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#2a2a3e', backgroundColor: '#161625' },
  objEmoji:       { fontSize: 22 },
  objTxt:         { color: '#aaa', fontSize: 14, fontWeight: '600' },

  biotipoAtual:   { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  biotipoEmoji:   { fontSize: 30 },
  biotipoNome:    { fontSize: 18, fontWeight: 'bold' },
  biotipoSub:     { color: '#888', fontSize: 12, marginTop: 2 },

  atividadeItem:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2a2a3e', backgroundColor: '#161625' },
  atividadeAtiva: { borderColor: '#e94560', backgroundColor: '#e9456018' },
  atividadeTxt:   { color: '#aaa', fontSize: 14 },

  diasRow:        { flexDirection: 'row', justifyContent: 'space-between' },
  diaCircle:      { width: (width - 100) / 5, aspectRatio: 1, borderRadius: 999, backgroundColor: '#161625', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2a2a3e' },
  diaCircleAtivo: { borderColor: '#e94560', backgroundColor: '#e9456020' },
  diaNum:         { color: '#888', fontSize: 18, fontWeight: 'bold' },
  diaSub:         { color: '#555', fontSize: 9 },

  btnReset:       { backgroundColor: '#e9456020', borderWidth: 1, borderColor: '#e94560', borderRadius: 12, padding: 14, alignItems: 'center' },
  btnResetTxt:    { color: '#e94560', fontWeight: '700' },

  // Dieta
  caloriaCard:    { borderRadius: 20, padding: 20, alignItems: 'center', gap: 4 },
  caloriaTitle:   { color: '#aaa', fontSize: 13 },
  caloriaNum:     { color: '#fff', fontSize: 44, fontWeight: 'bold' },
  caloriaSub:     { color: '#666', fontSize: 12, marginBottom: 16 },
  macrosRow:      { flexDirection: 'row', gap: 12, width: '100%' },
  macroBox:       { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 12, alignItems: 'center' },
  macroVal:       { fontSize: 20, fontWeight: 'bold' },
  macroUnit:      { fontSize: 12 },
  macroLbl:       { color: '#888', fontSize: 11, marginTop: 2 },

  refeicaoCard:   { backgroundColor: '#1e1e30', borderRadius: 16, padding: 16, gap: 8 },
  refeicaoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  refeicaoHoraWrap:{ backgroundColor: '#533483', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  refeicaoHora:   { color: '#fff', fontSize: 12, fontWeight: '700' },
  refeicaoNome:   { color: '#fff', fontWeight: '700', flex: 1, fontSize: 14 },
  refeicaoCalBox: { backgroundColor: '#e9456025', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  refeicaoCal:    { color: '#e94560', fontSize: 11, fontWeight: '700' },
  itemRow:        { flexDirection: 'row', gap: 8 },
  itemDot:        { color: '#533483', fontSize: 14 },
  itemTxt:        { color: '#ccc', fontSize: 13, flex: 1 },

  aguaNum:        { color: '#3498db', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
  aguaSub:        { color: '#888', fontSize: 13, textAlign: 'center' },

  dicaItem:       { flexDirection: 'row', gap: 8 },
  dicaDot:        { fontSize: 14 },
  dicaTxt:        { color: '#ccc', fontSize: 13, flex: 1, lineHeight: 20 },

  // Plano
  planoCard:      { backgroundColor: '#1e1e30', borderRadius: 18, padding: 16, gap: 10, borderWidth: 2, borderColor: '#2a2a3e' },
  planoCardAtivo: { borderColor: '#e94560' },
  planoCardTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planoCardNome:  { color: '#fff', fontSize: 15, fontWeight: 'bold', maxWidth: '75%' },
  nivelBadge:     { backgroundColor: '#533483', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  nivelTxt:       { color: '#fff', fontSize: 11 },
  planoCardRight: { alignItems: 'flex-end', gap: 6 },
  planoDias:      { color: '#e94560', fontWeight: 'bold', fontSize: 18 },
  ativoTag:       { backgroundColor: '#e9456025', borderWidth: 1, borderColor: '#e94560', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  ativoTxt:       { color: '#e94560', fontSize: 11, fontWeight: '700' },
  planoDiasRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  diaTag:         { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#161625', borderWidth: 1, borderColor: '#2a2a3e' },
  diaTagAtiva:    { backgroundColor: '#e9456020', borderColor: '#e94560' },
  diaTagTxt:      { color: '#888', fontSize: 12, fontWeight: '600' },
  treino_row:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#2a2a3e' },
  treino_dia:     { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0f3460', alignItems: 'center', justifyContent: 'center' },
  treino_dia_txt: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  treino_nome:    { color: '#ccc', fontSize: 13, flex: 1 },
  treino_count:   { color: '#888', fontSize: 11 },
  distSub:        { color: '#888', fontSize: 13 },
  distItem:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#2a2a3e' },
  distDia:        { width: 36, height: 36, borderRadius: 18, backgroundColor: '#533483', alignItems: 'center', justifyContent: 'center' },
  distDiaTxt:     { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  distNome:       { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Modal
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalBox:       { backgroundColor: '#1a1a2e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitulo:    { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalFechar:    { color: '#888', fontSize: 20, padding: 4 },
  modalContent:   { gap: 10, paddingBottom: 10 },
  fieldWrap:      { gap: 6 },
  fieldLabel:     { color: '#aaa', fontSize: 13 },
  fieldInput:     { backgroundColor: '#0d0d1a', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a3e' },
  modalItem:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#2a2a3e', backgroundColor: '#161625' },
  modalItemAtivo: { borderColor: '#e94560', backgroundColor: '#e9456015' },
  modalItemEmoji: { fontSize: 22 },
  modalItemTxt:   { color: '#aaa', fontSize: 15, fontWeight: '600' },
  modalSalvar:    { borderRadius: 14, overflow: 'hidden', marginTop: 12 },
  modalSalvarGrad:{ padding: 16, alignItems: 'center' },
  modalSalvarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
