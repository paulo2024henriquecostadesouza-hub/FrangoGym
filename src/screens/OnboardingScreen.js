import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ScrollView, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { salvar } from '../utils/storage';

const { width } = Dimensions.get('window');

const BIOTIPOS = {
  ectomorfo: {
    nome: 'Ectomorfo',
    emoji: '🦴',
    cor: '#3498db',
    pulso: 'Seus dedos se sobrepõem',
    caracteristicas: [
      'Metabolismo muito rápido',
      'Dificuldade em ganhar peso e massa',
      'Corpo naturalmente magro e ossos finos',
      'Pouca gordura corporal mesmo sem dieta',
      'Precisa de alta ingestão calórica para crescer',
    ],
    treino: 'Foco em treinos pesados com menos volume. Priorize compostos (agachamento, supino, terra). Descanso entre séries mais longo.',
    nutricao: 'Superávit calórico é essencial. Coma mais carboidratos complexos e proteínas. 5-6 refeições por dia.',
    facilidade: 'Definição muscular',
    dificuldade: 'Ganho de massa e peso',
  },
  mesomorfo: {
    nome: 'Mesomorfo',
    emoji: '💪',
    cor: '#2ecc71',
    pulso: 'Seus dedos se encostam exatamente',
    caracteristicas: [
      'Metabolismo equilibrado',
      'Ganha músculo com facilidade',
      'Estrutura óssea média e atlética',
      'Responde bem a qualquer tipo de treino',
      'Equilibrio natural entre músculo e gordura',
    ],
    treino: 'Responde bem a qualquer programa. Pode variar entre força, hipertrofia e resistência. Ótimo para treinos PPL e Full Body.',
    nutricao: 'Dieta equilibrada funciona bem. Ajuste calorias conforme o objetivo (superávit para massa, déficit para emagrecer).',
    facilidade: 'Ganho de massa muscular',
    dificuldade: 'Manter consistência sem exagerar na gordura',
  },
  endomorfo: {
    nome: 'Endomorfo',
    emoji: '🔥',
    cor: '#e74c3c',
    pulso: 'Seus dedos não se alcançam',
    caracteristicas: [
      'Metabolismo mais lento',
      'Tendência natural a acumular gordura',
      'Ossos mais grossos e estrutura robusta',
      'Ganha massa muscular com facilidade',
      'Maior força natural',
    ],
    treino: 'Combine musculação com cardio. Treinos de alta intensidade (HIIT) são ótimos. Menos descanso entre séries para acelerar metabolismo.',
    nutricao: 'Controle de carboidratos é importante. Priorize proteínas e gorduras boas. Déficit calórico moderado se quiser emagrecer.',
    facilidade: 'Ganho de força e massa',
    dificuldade: 'Perda de gordura e definição',
  },
};

const OBJETIVOS = [
  { id: 'emagrecer', emoji: '🔥', titulo: 'Emagrecer', desc: 'Perder gordura e reduzir peso' },
  { id: 'massa', emoji: '💪', titulo: 'Ganhar Massa', desc: 'Aumentar músculo e volume' },
  { id: 'definir', emoji: '⚡', titulo: 'Definir', desc: 'Reduzir gordura mantendo músculo' },
  { id: 'saude', emoji: '❤️', titulo: 'Saúde Geral', desc: 'Melhorar condicionamento e bem-estar' },
];

function calcularIMC(peso, altura) {
  const alturaM = altura / 100;
  const imc = peso / (alturaM * alturaM);
  return imc.toFixed(1);
}

function classificarIMC(imc) {
  const v = parseFloat(imc);
  if (v < 18.5) return { texto: 'Abaixo do peso', cor: '#3498db' };
  if (v < 25) return { texto: 'Peso normal', cor: '#2ecc71' };
  if (v < 30) return { texto: 'Sobrepeso', cor: '#f39c12' };
  return { texto: 'Obesidade', cor: '#e74c3c' };
}

export default function OnboardingScreen({ onConcluir }) {
  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState({
    nome: '', idade: '', sexo: '', peso: '', altura: '',
    objetivo: '', diasTreino: 3, biotipo: '',
  });
  const [biotipoSelecionado, setBiotipoSelecionado] = useState(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const totalEtapas = 7;

  function avancar() {
    const novaEtapa = etapa + 1;
    setEtapa(novaEtapa);
    Animated.timing(progressAnim, {
      toValue: novaEtapa / (totalEtapas - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  function voltar() {
    if (etapa === 0) return;
    const novaEtapa = etapa - 1;
    setEtapa(novaEtapa);
    Animated.timing(progressAnim, {
      toValue: novaEtapa / (totalEtapas - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  async function concluir() {
    const perfil = {
      ...dados,
      biotipo: biotipoSelecionado,
      imc: calcularIMC(parseFloat(dados.peso), parseFloat(dados.altura)),
      cadastradoEm: new Date().toISOString(),
    };
    await salvar('perfil_usuario', perfil);
    onConcluir(perfil);
  }

  const imc = dados.peso && dados.altura
    ? calcularIMC(parseFloat(dados.peso), parseFloat(dados.altura))
    : null;
  const imcInfo = imc ? classificarIMC(imc) : null;

  const podAvancar = () => {
    if (etapa === 0) return dados.nome.trim().length > 1;
    if (etapa === 1) return dados.idade && dados.sexo;
    if (etapa === 2) return dados.peso && dados.altura;
    if (etapa === 3) return dados.objetivo;
    if (etapa === 4) return true;
    if (etapa === 5) return true;
    if (etapa === 6) return biotipoSelecionado;
    return true;
  };

  return (
    <LinearGradient colors={['#0d0d1a', '#1a1a2e']} style={styles.container}>
      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, {
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
          }]} />
        </View>
        <Text style={styles.progressText}>{etapa + 1} / {totalEtapas}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ETAPA 0 — Nome */}
        {etapa === 0 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.titulo}>Olá! Vamos começar.</Text>
            <Text style={styles.subtitulo}>
              Vou criar um plano personalizado para você. Primeiro, qual é o seu nome?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome"
              placeholderTextColor="#555"
              value={dados.nome}
              onChangeText={v => setDados({ ...dados, nome: v })}
              autoFocus
            />
          </View>
        )}

        {/* ETAPA 1 — Idade e Sexo */}
        {etapa === 1 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>📋</Text>
            <Text style={styles.titulo}>Olá, {dados.nome}!</Text>
            <Text style={styles.subtitulo}>Agora preciso de algumas informações básicas.</Text>

            <Text style={styles.label}>Idade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 25"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={dados.idade}
              onChangeText={v => setDados({ ...dados, idade: v })}
            />

            <Text style={styles.label}>Sexo</Text>
            <View style={styles.opcoesDuplas}>
              {[
                { id: 'masculino', emoji: '♂️', label: 'Masculino' },
                { id: 'feminino', emoji: '♀️', label: 'Feminino' },
              ].map(op => (
                <TouchableOpacity
                  key={op.id}
                  style={[styles.opcaoCard, dados.sexo === op.id && styles.opcaoSelecionada]}
                  onPress={() => setDados({ ...dados, sexo: op.id })}>
                  <Text style={styles.opcaoEmoji}>{op.emoji}</Text>
                  <Text style={[styles.opcaoLabel, dados.sexo === op.id && styles.opcaoLabelAtiva]}>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ETAPA 2 — Peso, Altura e IMC */}
        {etapa === 2 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>⚖️</Text>
            <Text style={styles.titulo}>Medidas corporais</Text>
            <Text style={styles.subtitulo}>Isso me ajuda a calcular seu IMC e criar seu plano.</Text>

            <Text style={styles.label}>Peso atual (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 75"
              placeholderTextColor="#555"
              keyboardType="decimal-pad"
              value={dados.peso}
              onChangeText={v => setDados({ ...dados, peso: v })}
            />

            <Text style={styles.label}>Altura (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 175"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={dados.altura}
              onChangeText={v => setDados({ ...dados, altura: v })}
            />

            {imc && (
              <View style={[styles.imcCard, { borderColor: imcInfo.cor }]}>
                <Text style={styles.imcLabel}>Seu IMC</Text>
                <Text style={[styles.imcValor, { color: imcInfo.cor }]}>{imc}</Text>
                <Text style={[styles.imcClassificacao, { color: imcInfo.cor }]}>
                  {imcInfo.texto}
                </Text>
                <View style={styles.imcEscala}>
                  {[
                    { faixa: '< 18.5', label: 'Abaixo', cor: '#3498db' },
                    { faixa: '18.5–24.9', label: 'Normal', cor: '#2ecc71' },
                    { faixa: '25–29.9', label: 'Sobrepeso', cor: '#f39c12' },
                    { faixa: '≥ 30', label: 'Obesidade', cor: '#e74c3c' },
                  ].map((f, i) => (
                    <View key={i} style={styles.imcFaixa}>
                      <View style={[styles.imcFaixaDot, { backgroundColor: f.cor }]} />
                      <Text style={styles.imcFaixaText}>{f.label}</Text>
                      <Text style={styles.imcFaixaNum}>{f.faixa}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* ETAPA 3 — Objetivo */}
        {etapa === 3 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.titulo}>Qual é o seu objetivo?</Text>
            <Text style={styles.subtitulo}>Vou montar seu treino e dieta com base nisso.</Text>

            {OBJETIVOS.map(obj => (
              <TouchableOpacity
                key={obj.id}
                style={[styles.objetivoCard, dados.objetivo === obj.id && styles.objetivoSelecionado]}
                onPress={() => setDados({ ...dados, objetivo: obj.id })}>
                <Text style={styles.objetivoEmoji}>{obj.emoji}</Text>
                <View style={styles.objetivoInfo}>
                  <Text style={[styles.objetivoTitulo, dados.objetivo === obj.id && { color: '#fff' }]}>
                    {obj.titulo}
                  </Text>
                  <Text style={styles.objetivoDesc}>{obj.desc}</Text>
                </View>
                {dados.objetivo === obj.id && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ETAPA 4 — Dias por semana */}
        {etapa === 4 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>📅</Text>
            <Text style={styles.titulo}>Quantos dias por semana?</Text>
            <Text style={styles.subtitulo}>
              Quantos dias você pode ou deseja treinar por semana?
            </Text>

            <View style={styles.diasGrid}>
              {[2, 3, 4, 5, 6].map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.diaCircle, dados.diasTreino === d && styles.diaCircleAtivo]}
                  onPress={() => setDados({ ...dados, diasTreino: d })}>
                  <Text style={[styles.diaNum, dados.diasTreino === d && styles.diaNumAtivo]}>{d}</Text>
                  <Text style={[styles.diaSub, dados.diasTreino === d && styles.diaNumAtivo]}>dias</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.diasDica}>
              {dados.diasTreino <= 3 && (
                <Text style={styles.dicaText}>
                  ✅ Ótimo para iniciantes — tempo de recuperação adequado entre os treinos.
                </Text>
              )}
              {dados.diasTreino === 4 && (
                <Text style={styles.dicaText}>
                  ✅ Frequência intermediária — boa para treinos Upper/Lower ou PPL adaptado.
                </Text>
              )}
              {dados.diasTreino >= 5 && (
                <Text style={styles.dicaText}>
                  ✅ Alta frequência — ideal para treinos divididos por grupos musculares.
                </Text>
              )}
            </View>
          </View>
        )}

        {/* ETAPA 5 — Como identificar o biotipo */}
        {etapa === 5 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>🔍</Text>
            <Text style={styles.titulo}>Descubra seu biotipo</Text>
            <Text style={styles.subtitulo}>
              Seu biotipo influencia diretamente como você treina e come. Vamos fazer um teste rápido!
            </Text>

            <View style={styles.testeCard}>
              <Text style={styles.testeTitulo}>🤏 Teste do Pulso</Text>
              <Text style={styles.testeInstrucao}>
                Circule o pulso da mão não dominante com o dedo indicador e o polegar da outra mão, logo abaixo do osso saliente.
              </Text>

              <View style={styles.testePassos}>
                <View style={styles.testePasso}>
                  <View style={styles.testeNumero}><Text style={styles.testeNumeroText}>1</Text></View>
                  <Text style={styles.testePassoText}>Estique o braço não dominante à sua frente, palma para cima</Text>
                </View>
                <View style={styles.testePasso}>
                  <View style={styles.testeNumero}><Text style={styles.testeNumeroText}>2</Text></View>
                  <Text style={styles.testePassoText}>Com a outra mão, envolva o pulso com o polegar e o dedo do meio</Text>
                </View>
                <View style={styles.testePasso}>
                  <View style={styles.testeNumero}><Text style={styles.testeNumeroText}>3</Text></View>
                  <Text style={styles.testePassoText}>Observe se os dedos se sobrepõem, se encostam ou não se alcançam</Text>
                </View>
              </View>
            </View>

            <View style={styles.resultadosPrevia}>
              {Object.entries(BIOTIPOS).map(([key, bio]) => (
                <View key={key} style={[styles.previaItem, { borderLeftColor: bio.cor }]}>
                  <Text style={styles.previaEmoji}>{bio.emoji}</Text>
                  <View style={styles.previaInfo}>
                    <Text style={[styles.previaNome, { color: bio.cor }]}>{bio.nome}</Text>
                    <Text style={styles.previaDesc}>{bio.pulso}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ETAPA 6 — Seleção e explicação do biotipo */}
        {etapa === 6 && (
          <View style={styles.etapa}>
            <Text style={styles.emoji}>💡</Text>
            <Text style={styles.titulo}>Qual foi o seu resultado?</Text>
            <Text style={styles.subtitulo}>Selecione o biotipo que corresponde ao seu teste:</Text>

            {Object.entries(BIOTIPOS).map(([key, bio]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.biotipoCard,
                  { borderColor: biotipoSelecionado === key ? bio.cor : '#2a2a3e' },
                  biotipoSelecionado === key && { backgroundColor: bio.cor + '15' },
                ]}
                onPress={() => setBiotipoSelecionado(key)}>

                <View style={styles.biotipoHeader}>
                  <Text style={styles.biotipoEmoji}>{bio.emoji}</Text>
                  <View style={styles.biotipoTitleArea}>
                    <Text style={[styles.biotipoNome, { color: bio.cor }]}>{bio.nome}</Text>
                    <Text style={styles.biotipoPulso}>📍 {bio.pulso}</Text>
                  </View>
                  {biotipoSelecionado === key && (
                    <View style={[styles.biotipoCheck, { backgroundColor: bio.cor }]}>
                      <Text style={styles.biotipoCheckText}>✓</Text>
                    </View>
                  )}
                </View>

                <View style={styles.biotipoDivider} />

                <Text style={styles.biotipoSecao}>Características:</Text>
                {bio.caracteristicas.map((c, i) => (
                  <View key={i} style={styles.biotipoItem}>
                    <Text style={[styles.biotipoDot, { color: bio.cor }]}>•</Text>
                    <Text style={styles.biotipoItemText}>{c}</Text>
                  </View>
                ))}

                <View style={styles.biotipoBadgesRow}>
                  <View style={[styles.biotipoBadge, { backgroundColor: '#2ecc7120' }]}>
                    <Text style={styles.biotipoBadgeLabel}>Facilidade</Text>
                    <Text style={styles.biotipoBadgeVal}>✅ {bio.facilidade}</Text>
                  </View>
                  <View style={[styles.biotipoBadge, { backgroundColor: '#e74c3c20' }]}>
                    <Text style={styles.biotipoBadgeLabel}>Desafio</Text>
                    <Text style={styles.biotipoBadgeVal}>⚠️ {bio.dificuldade}</Text>
                  </View>
                </View>

                <View style={styles.biotipoRecomendacao}>
                  <Text style={styles.biotipoRecTitulo}>🏋️ Treino recomendado:</Text>
                  <Text style={styles.biotipoRecText}>{bio.treino}</Text>
                </View>
                <View style={styles.biotipoRecomendacao}>
                  <Text style={styles.biotipoRecTitulo}>🥗 Nutrição recomendada:</Text>
                  <Text style={styles.biotipoRecText}>{bio.nutricao}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Botões de navegação */}
      <View style={styles.botoes}>
        {etapa > 0 && (
          <TouchableOpacity style={styles.btnVoltar} onPress={voltar}>
            <Text style={styles.btnVoltarText}>← Voltar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.btnAvancar,
            !podAvancar() && styles.btnDesabilitado,
            etapa === 0 && { flex: 1 },
          ]}
          onPress={etapa === totalEtapas - 1 ? concluir : avancar}
          disabled={!podAvancar()}>
          <LinearGradient
            colors={podAvancar() ? ['#533483', '#e94560'] : ['#333', '#333']}
            style={styles.btnGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.btnAvancarText}>
              {etapa === totalEtapas - 1 ? '🚀 Começar!' : 'Continuar →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, gap: 12 },
  progressTrack: { flex: 1, height: 4, backgroundColor: '#2a2a3e', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#e94560', borderRadius: 2 },
  progressText: { color: '#888', fontSize: 12 },
  scroll: { padding: 20, paddingBottom: 10 },
  etapa: { paddingBottom: 20 },
  emoji: { fontSize: 48, marginBottom: 16 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitulo: { fontSize: 15, color: '#aaa', marginBottom: 24, lineHeight: 22 },
  label: { color: '#ccc', fontSize: 14, marginBottom: 8, marginTop: 8 },
  input: {
    backgroundColor: '#1e1e30', borderRadius: 12, padding: 16,
    color: '#fff', fontSize: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#2a2a3e',
  },
  opcoesDuplas: { flexDirection: 'row', gap: 12, marginTop: 4 },
  opcaoCard: {
    flex: 1, backgroundColor: '#1e1e30', borderRadius: 14, padding: 20,
    alignItems: 'center', borderWidth: 2, borderColor: '#2a2a3e',
  },
  opcaoSelecionada: { borderColor: '#533483', backgroundColor: '#53348320' },
  opcaoEmoji: { fontSize: 30, marginBottom: 8 },
  opcaoLabel: { color: '#888', fontWeight: '600' },
  opcaoLabelAtiva: { color: '#fff' },
  imcCard: {
    backgroundColor: '#1e1e30', borderRadius: 16, padding: 20,
    alignItems: 'center', borderWidth: 2, marginTop: 8,
  },
  imcLabel: { color: '#aaa', fontSize: 13 },
  imcValor: { fontSize: 52, fontWeight: 'bold', marginVertical: 4 },
  imcClassificacao: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  imcEscala: { width: '100%', gap: 6 },
  imcFaixa: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  imcFaixaDot: { width: 10, height: 10, borderRadius: 5 },
  imcFaixaText: { color: '#ccc', flex: 1, fontSize: 13 },
  imcFaixaNum: { color: '#666', fontSize: 12 },
  objetivoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30',
    borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 2, borderColor: '#2a2a3e',
  },
  objetivoSelecionado: { borderColor: '#e94560', backgroundColor: '#e9456015' },
  objetivoEmoji: { fontSize: 28, marginRight: 14 },
  objetivoInfo: { flex: 1 },
  objetivoTitulo: { color: '#ccc', fontWeight: 'bold', fontSize: 16 },
  objetivoDesc: { color: '#666', fontSize: 13, marginTop: 2 },
  checkmark: { color: '#e94560', fontSize: 20, fontWeight: 'bold' },
  diasGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  diaCircle: {
    width: (width - 80) / 5, aspectRatio: 1, borderRadius: 999,
    backgroundColor: '#1e1e30', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#2a2a3e',
  },
  diaCircleAtivo: { borderColor: '#e94560', backgroundColor: '#e9456020' },
  diaNum: { color: '#888', fontSize: 20, fontWeight: 'bold' },
  diaNumAtivo: { color: '#fff' },
  diaSub: { color: '#555', fontSize: 10 },
  diasDica: { backgroundColor: '#1e1e30', borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: '#533483' },
  dicaText: { color: '#ccc', lineHeight: 20 },
  testeCard: { backgroundColor: '#1e1e30', borderRadius: 16, padding: 18, marginBottom: 16 },
  testeTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  testeInstrucao: { color: '#aaa', lineHeight: 22, marginBottom: 16 },
  testePassos: { gap: 12 },
  testePasso: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  testeNumero: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#533483',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
  },
  testeNumeroText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  testePassoText: { color: '#ccc', flex: 1, lineHeight: 20 },
  resultadosPrevia: { gap: 10 },
  previaItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e30',
    borderRadius: 12, padding: 14, borderLeftWidth: 4, gap: 12,
  },
  previaEmoji: { fontSize: 24 },
  previaInfo: { flex: 1 },
  previaNome: { fontWeight: 'bold', fontSize: 15 },
  previaDesc: { color: '#888', fontSize: 13, marginTop: 2 },
  biotipoCard: {
    backgroundColor: '#1e1e30', borderRadius: 16, padding: 18,
    marginBottom: 14, borderWidth: 2,
  },
  biotipoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  biotipoEmoji: { fontSize: 32 },
  biotipoTitleArea: { flex: 1 },
  biotipoNome: { fontSize: 20, fontWeight: 'bold' },
  biotipoPulso: { color: '#888', fontSize: 12, marginTop: 2 },
  biotipoCheck: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  biotipoCheckText: { color: '#fff', fontWeight: 'bold' },
  biotipoDivider: { height: 1, backgroundColor: '#2a2a3e', marginBottom: 12 },
  biotipoSecao: { color: '#aaa', fontSize: 13, marginBottom: 8 },
  biotipoItem: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  biotipoDot: { fontSize: 16, lineHeight: 20 },
  biotipoItemText: { color: '#ccc', flex: 1, lineHeight: 20, fontSize: 14 },
  biotipoBadgesRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 12 },
  biotipoBadge: { flex: 1, padding: 10, borderRadius: 10 },
  biotipoBadgeLabel: { color: '#888', fontSize: 11, marginBottom: 4 },
  biotipoBadgeVal: { color: '#fff', fontSize: 12, fontWeight: '600' },
  biotipoRecomendacao: { backgroundColor: '#0d0d1a', borderRadius: 10, padding: 12, marginBottom: 8 },
  biotipoRecTitulo: { color: '#fff', fontWeight: 'bold', marginBottom: 4, fontSize: 13 },
  biotipoRecText: { color: '#aaa', fontSize: 13, lineHeight: 20 },
  botoes: { flexDirection: 'row', padding: 20, paddingTop: 10, gap: 10 },
  btnVoltar: {
    paddingHorizontal: 20, justifyContent: 'center',
    backgroundColor: '#1e1e30', borderRadius: 14, paddingVertical: 16,
  },
  btnVoltarText: { color: '#888', fontWeight: '600' },
  btnAvancar: { flex: 2, borderRadius: 14, overflow: 'hidden' },
  btnDesabilitado: { opacity: 0.4 },
  btnGrad: { padding: 18, alignItems: 'center' },
  btnAvancarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
