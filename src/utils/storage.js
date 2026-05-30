import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  TREINOS_FEITOS:    'treinos_feitos',
  STREAK:            'streak',
  ULTIMO_TREINO:     'ultimo_treino',
  REFEICOES:         'refeicoes',
  CONQUISTAS:        'conquistas',
  HISTORICO_PESO:    'historico_peso',
  ALIMENTOS_CUSTOM:  'alimentos_custom',
  EXERCICIOS_CUSTOM: 'exercicios_custom',
};

export async function salvar(chave, valor) {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function carregar(chave, padrao = null) {
  const raw = await AsyncStorage.getItem(chave);
  return raw ? JSON.parse(raw) : padrao;
}

export async function atualizarStreak() {
  const hoje = new Date().toDateString();
  const ultimoTreino = await carregar(KEYS.ULTIMO_TREINO);
  const streakAtual = await carregar(KEYS.STREAK, 0);

  if (ultimoTreino === hoje) return streakAtual;

  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const novoStreak = ultimoTreino === ontem.toDateString() ? streakAtual + 1 : 1;

  await salvar(KEYS.STREAK, novoStreak);
  await salvar(KEYS.ULTIMO_TREINO, hoje);
  return novoStreak;
}
