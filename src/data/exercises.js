export const GRUPOS = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps', 'Abdômen', 'Cardio'];

// Imagens em assets/muscles/exercicio_[id].png
export const MUSCLE_IMAGES = {
  1:  require('../../assets/muscles/exercicio_1.png'),
  2:  require('../../assets/muscles/exercicio_2.png'),
  3:  require('../../assets/muscles/exercicio_3.png'),
  4:  require('../../assets/muscles/exercicio_4.png'),
  5:  require('../../assets/muscles/exercicio_5.png'),
  6:  require('../../assets/muscles/exercicio_6.png'),
  7:  require('../../assets/muscles/exercicio_7.png'),
  8:  require('../../assets/muscles/exercicio_8.png'),
  9:  require('../../assets/muscles/exercicio_9.png'),
  10: require('../../assets/muscles/exercicio_10.png'),
  11: require('../../assets/muscles/exercicio_11.png'),
  12: require('../../assets/muscles/exercicio_12.png'),
  13: require('../../assets/muscles/exercicio_13.png'),
  14: require('../../assets/muscles/exercicio_14.png'),
  15: require('../../assets/muscles/exercicio_15.png'),
  16: require('../../assets/muscles/exercicio_16.png'),
  17: require('../../assets/muscles/exercicio_17.png'),
  18: require('../../assets/muscles/exercicio_18.png'),
  19: require('../../assets/muscles/exercicio_19.png'),
};

export const EXERCICIOS = [
  { id: 1,  nome: 'Supino Reto',        grupo: 'Peito',   series: 4, reps: '8-12',    desc: 'Deite no banco, empurre a barra para cima com os braços estendidos.' },
  { id: 2,  nome: 'Supino Inclinado',   grupo: 'Peito',   series: 3, reps: '10-12',   desc: 'Banco a 45°, foca na parte superior do peitoral.' },
  { id: 3,  nome: 'Crucifixo',          grupo: 'Peito',   series: 3, reps: '12-15',   desc: 'Abre os braços com leve flexão de cotovelo.' },
  { id: 4,  nome: 'Barra Fixa',         grupo: 'Costas',  series: 4, reps: '6-10',    desc: 'Puxe o corpo até o queixo ultrapassar a barra.' },
  { id: 5,  nome: 'Remada Curvada',     grupo: 'Costas',  series: 4, reps: '8-12',    desc: 'Incline o tronco, puxe a barra em direção ao abdômen.' },
  { id: 6,  nome: 'Puxada Alta',        grupo: 'Costas',  series: 3, reps: '10-12',   desc: 'Na polia alta, puxe até a barra tocar o peitoral.' },
  { id: 7,  nome: 'Agachamento',        grupo: 'Pernas',  series: 4, reps: '8-12',    desc: 'Pés na largura dos ombros, desça até a coxa paralela ao chão.' },
  { id: 8,  nome: 'Leg Press',          grupo: 'Pernas',  series: 4, reps: '10-15',   desc: 'Empurre a plataforma com os pés afastados na largura dos ombros.' },
  { id: 9,  nome: 'Cadeira Extensora',  grupo: 'Pernas',  series: 3, reps: '12-15',   desc: 'Estenda as pernas completamente, contraindo o quadríceps.' },
  { id: 10, nome: 'Desenvolvimento',    grupo: 'Ombros',  series: 4, reps: '8-12',    desc: 'Empurre os halteres acima da cabeça.' },
  { id: 11, nome: 'Elevação Lateral',   grupo: 'Ombros',  series: 3, reps: '12-15',   desc: 'Eleve os braços até a altura dos ombros.' },
  { id: 12, nome: 'Rosca Direta',       grupo: 'Bíceps',  series: 3, reps: '10-12',   desc: 'Flexione os cotovelos trazendo a barra até os ombros.' },
  { id: 13, nome: 'Rosca Martelo',      grupo: 'Bíceps',  series: 3, reps: '10-12',   desc: 'Halteres em pegada neutra, suba alternando os braços.' },
  { id: 14, nome: 'Tríceps Corda',      grupo: 'Tríceps', series: 3, reps: '12-15',   desc: 'Na polia, empurre a corda para baixo abrindo as pontas.' },
  { id: 15, nome: 'Tríceps Testa',      grupo: 'Tríceps', series: 3, reps: '10-12',   desc: 'Deite no banco, desca a barra até a testa e estenda.' },
  { id: 16, nome: 'Abdominal Crunch',   grupo: 'Abdômen', series: 3, reps: '20',       desc: 'Contraia o abdômen elevando os ombros do chão.' },
  { id: 17, nome: 'Prancha',            grupo: 'Abdômen', series: 3, reps: '30-60s',   desc: 'Mantenha o corpo reto apoiado nos antebraços.' },
  { id: 18, nome: 'Corrida',            grupo: 'Cardio',  series: 1, reps: '20-30min', desc: 'Ritmo moderado, frequência cardíaca entre 120-150bpm.' },
  { id: 19, nome: 'Pular Corda',        grupo: 'Cardio',  series: 5, reps: '1min',     desc: 'Descanse 30s entre as séries.' },
];

export const PLANOS = [
  {
    id: 1,
    nome: 'Iniciante — 3x por semana',
    nivel: 'Iniciante',
    dias: ['Seg', 'Qua', 'Sex'],
    treinos: [
      { dia: 'Seg', nome: 'Corpo Inteiro A', exercicios: [7, 1, 5, 10, 12, 14, 16] },
      { dia: 'Qua', nome: 'Corpo Inteiro B', exercicios: [8, 2, 6, 11, 13, 15, 17] },
      { dia: 'Sex', nome: 'Corpo Inteiro C', exercicios: [7, 3, 4, 10, 12, 14, 18] },
    ],
  },
  {
    id: 2,
    nome: 'Intermediário — Push/Pull/Legs',
    nivel: 'Intermediário',
    dias: ['Seg', 'Ter', 'Qua', 'Sex', 'Sáb'],
    treinos: [
      { dia: 'Seg', nome: 'Push (Empurrar)', exercicios: [1, 2, 3, 10, 11, 14, 15] },
      { dia: 'Ter', nome: 'Pull (Puxar)', exercicios: [4, 5, 6, 12, 13] },
      { dia: 'Qua', nome: 'Legs (Pernas)', exercicios: [7, 8, 9, 16, 17] },
      { dia: 'Sex', nome: 'Push II', exercicios: [1, 3, 10, 11, 14] },
      { dia: 'Sáb', nome: 'Pull + Legs', exercicios: [4, 6, 8, 12, 17] },
    ],
  },
];

export const ALIMENTOS = [
  { id: 1, nome: 'Frango grelhado (100g)', cal: 165, prot: 31, carb: 0, gord: 3.6 },
  { id: 2, nome: 'Arroz cozido (100g)', cal: 130, prot: 2.7, carb: 28, gord: 0.3 },
  { id: 3, nome: 'Ovo inteiro', cal: 78, prot: 6, carb: 0.6, gord: 5 },
  { id: 4, nome: 'Batata doce (100g)', cal: 86, prot: 1.6, carb: 20, gord: 0.1 },
  { id: 5, nome: 'Banana', cal: 89, prot: 1.1, carb: 23, gord: 0.3 },
  { id: 6, nome: 'Whey Protein (30g)', cal: 120, prot: 24, carb: 3, gord: 1.5 },
  { id: 7, nome: 'Aveia (40g)', cal: 148, prot: 5, carb: 27, gord: 2.5 },
  { id: 8, nome: 'Atum (100g)', cal: 116, prot: 25.5, carb: 0, gord: 0.8 },
  { id: 9, nome: 'Feijão cozido (100g)', cal: 77, prot: 5, carb: 14, gord: 0.5 },
  { id: 10, nome: 'Leite desnatado (200ml)', cal: 68, prot: 6.6, carb: 9.6, gord: 0.2 },
];
