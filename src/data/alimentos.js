// Todos os valores nutricionais são por 100g ou 100ml
export const CATEGORIAS_ALIMENTO = [
  'Proteínas', 'Carboidratos', 'Laticínios', 'Frutas',
  'Vegetais', 'Gorduras', 'Bebidas', 'Lanches',
];

export const BANCO_ALIMENTOS = [
  // ── PROTEÍNAS ───────────────────────────────────────────────────
  { id: 1,  nome: 'Frango grelhado',       cat: 'Proteínas',    unidade: 'g',  cal: 165, prot: 31.0, carb: 0.0,  gord: 3.6,  fibra: 0.0 },
  { id: 2,  nome: 'Peito de frango cru',   cat: 'Proteínas',    unidade: 'g',  cal: 110, prot: 23.0, carb: 0.0,  gord: 1.2,  fibra: 0.0 },
  { id: 3,  nome: 'Atum em lata (água)',   cat: 'Proteínas',    unidade: 'g',  cal: 116, prot: 25.5, carb: 0.0,  gord: 0.8,  fibra: 0.0 },
  { id: 4,  nome: 'Carne bovina magra',    cat: 'Proteínas',    unidade: 'g',  cal: 187, prot: 26.0, carb: 0.0,  gord: 9.0,  fibra: 0.0 },
  { id: 5,  nome: 'Ovo inteiro',           cat: 'Proteínas',    unidade: 'un', cal: 78,  prot: 6.3,  carb: 0.6,  gord: 5.3,  fibra: 0.0 },
  { id: 6,  nome: 'Clara de ovo',          cat: 'Proteínas',    unidade: 'un', cal: 17,  prot: 3.6,  carb: 0.2,  gord: 0.1,  fibra: 0.0 },
  { id: 7,  nome: 'Whey Protein',          cat: 'Proteínas',    unidade: 'g',  cal: 400, prot: 80.0, carb: 10.0, gord: 5.0,  fibra: 0.0 },
  { id: 8,  nome: 'Tilápia grelhada',      cat: 'Proteínas',    unidade: 'g',  cal: 96,  prot: 20.0, carb: 0.0,  gord: 1.7,  fibra: 0.0 },
  { id: 9,  nome: 'Salmão grelhado',       cat: 'Proteínas',    unidade: 'g',  cal: 208, prot: 20.0, carb: 0.0,  gord: 13.0, fibra: 0.0 },
  { id: 10, nome: 'Carne suína magra',     cat: 'Proteínas',    unidade: 'g',  cal: 143, prot: 21.0, carb: 0.0,  gord: 6.0,  fibra: 0.0 },

  // ── CARBOIDRATOS ────────────────────────────────────────────────
  { id: 11, nome: 'Arroz branco cozido',   cat: 'Carboidratos', unidade: 'g',  cal: 130, prot: 2.7,  carb: 28.0, gord: 0.3,  fibra: 0.4 },
  { id: 12, nome: 'Arroz integral cozido', cat: 'Carboidratos', unidade: 'g',  cal: 123, prot: 2.6,  carb: 25.6, gord: 0.9,  fibra: 1.8 },
  { id: 13, nome: 'Batata doce cozida',    cat: 'Carboidratos', unidade: 'g',  cal: 86,  prot: 1.6,  carb: 20.0, gord: 0.1,  fibra: 2.5 },
  { id: 14, nome: 'Batata inglesa cozida', cat: 'Carboidratos', unidade: 'g',  cal: 77,  prot: 2.0,  carb: 17.0, gord: 0.1,  fibra: 1.8 },
  { id: 15, nome: 'Macarrão cozido',       cat: 'Carboidratos', unidade: 'g',  cal: 158, prot: 5.8,  carb: 30.0, gord: 0.9,  fibra: 1.8 },
  { id: 16, nome: 'Aveia em flocos',       cat: 'Carboidratos', unidade: 'g',  cal: 370, prot: 13.0, carb: 67.0, gord: 7.0,  fibra: 10.0 },
  { id: 17, nome: 'Pão integral (fatia)',  cat: 'Carboidratos', unidade: 'un', cal: 69,  prot: 3.0,  carb: 13.0, gord: 1.0,  fibra: 1.9 },
  { id: 18, nome: 'Feijão preto cozido',   cat: 'Carboidratos', unidade: 'g',  cal: 77,  prot: 5.0,  carb: 14.0, gord: 0.5,  fibra: 6.0 },
  { id: 19, nome: 'Lentilha cozida',       cat: 'Carboidratos', unidade: 'g',  cal: 116, prot: 9.0,  carb: 20.0, gord: 0.4,  fibra: 7.9 },
  { id: 20, nome: 'Mandioca cozida',       cat: 'Carboidratos', unidade: 'g',  cal: 125, prot: 1.0,  carb: 30.0, gord: 0.3,  fibra: 1.9 },

  // ── LATICÍNIOS ──────────────────────────────────────────────────
  { id: 21, nome: 'Leite desnatado',       cat: 'Laticínios',   unidade: 'ml', cal: 35,  prot: 3.4,  carb: 4.8,  gord: 0.1,  fibra: 0.0 },
  { id: 22, nome: 'Iogurte grego natural', cat: 'Laticínios',   unidade: 'g',  cal: 97,  prot: 9.0,  carb: 3.6,  gord: 5.0,  fibra: 0.0 },
  { id: 23, nome: 'Queijo cottage',        cat: 'Laticínios',   unidade: 'g',  cal: 98,  prot: 11.0, carb: 3.4,  gord: 4.3,  fibra: 0.0 },
  { id: 24, nome: 'Queijo mussarela',      cat: 'Laticínios',   unidade: 'g',  cal: 280, prot: 19.0, carb: 2.2,  gord: 22.0, fibra: 0.0 },
  { id: 25, nome: 'Requeijão light',       cat: 'Laticínios',   unidade: 'g',  cal: 160, prot: 8.0,  carb: 4.0,  gord: 12.0, fibra: 0.0 },

  // ── FRUTAS ──────────────────────────────────────────────────────
  { id: 26, nome: 'Banana prata',          cat: 'Frutas',       unidade: 'un', cal: 89,  prot: 1.1,  carb: 23.0, gord: 0.3,  fibra: 2.6 },
  { id: 27, nome: 'Maçã',                  cat: 'Frutas',       unidade: 'un', cal: 52,  prot: 0.3,  carb: 14.0, gord: 0.2,  fibra: 2.4 },
  { id: 28, nome: 'Manga',                 cat: 'Frutas',       unidade: 'g',  cal: 60,  prot: 0.8,  carb: 15.0, gord: 0.4,  fibra: 1.6 },
  { id: 29, nome: 'Morango',               cat: 'Frutas',       unidade: 'g',  cal: 32,  prot: 0.7,  carb: 7.7,  gord: 0.3,  fibra: 2.0 },
  { id: 30, nome: 'Abacate',               cat: 'Frutas',       unidade: 'g',  cal: 160, prot: 2.0,  carb: 9.0,  gord: 15.0, fibra: 6.7 },

  // ── VEGETAIS ────────────────────────────────────────────────────
  { id: 31, nome: 'Brócolis cozido',       cat: 'Vegetais',     unidade: 'g',  cal: 35,  prot: 2.4,  carb: 7.2,  gord: 0.4,  fibra: 2.6 },
  { id: 32, nome: 'Espinafre cru',         cat: 'Vegetais',     unidade: 'g',  cal: 23,  prot: 2.9,  carb: 3.6,  gord: 0.4,  fibra: 2.2 },
  { id: 33, nome: 'Cenoura crua',          cat: 'Vegetais',     unidade: 'g',  cal: 41,  prot: 0.9,  carb: 10.0, gord: 0.2,  fibra: 2.8 },
  { id: 34, nome: 'Alface',                cat: 'Vegetais',     unidade: 'g',  cal: 15,  prot: 1.4,  carb: 2.9,  gord: 0.2,  fibra: 1.3 },
  { id: 35, nome: 'Tomate',                cat: 'Vegetais',     unidade: 'g',  cal: 18,  prot: 0.9,  carb: 3.9,  gord: 0.2,  fibra: 1.2 },

  // ── GORDURAS BOAS ───────────────────────────────────────────────
  { id: 36, nome: 'Azeite de oliva',       cat: 'Gorduras',     unidade: 'ml', cal: 884, prot: 0.0,  carb: 0.0,  gord: 100.0,fibra: 0.0 },
  { id: 37, nome: 'Amendoim torrado',      cat: 'Gorduras',     unidade: 'g',  cal: 567, prot: 25.8, carb: 16.1, gord: 49.2, fibra: 8.5 },
  { id: 38, nome: 'Pasta de amendoim',     cat: 'Gorduras',     unidade: 'g',  cal: 590, prot: 25.0, carb: 20.0, gord: 50.0, fibra: 5.0 },
  { id: 39, nome: 'Castanha-do-Pará',      cat: 'Gorduras',     unidade: 'un', cal: 33,  prot: 0.7,  carb: 0.6,  gord: 3.4,  fibra: 0.3 },
  { id: 40, nome: 'Azeite de coco',        cat: 'Gorduras',     unidade: 'ml', cal: 862, prot: 0.0,  carb: 0.0,  gord: 100.0,fibra: 0.0 },

  // ── BEBIDAS ─────────────────────────────────────────────────────
  { id: 41, nome: 'Água',                  cat: 'Bebidas',      unidade: 'ml', cal: 0,   prot: 0.0,  carb: 0.0,  gord: 0.0,  fibra: 0.0 },
  { id: 42, nome: 'Suco de laranja natural',cat: 'Bebidas',     unidade: 'ml', cal: 45,  prot: 0.7,  carb: 10.4, gord: 0.2,  fibra: 0.2 },
  { id: 43, nome: 'Café preto sem açúcar', cat: 'Bebidas',      unidade: 'ml', cal: 2,   prot: 0.3,  carb: 0.0,  gord: 0.0,  fibra: 0.0 },
  { id: 44, nome: 'Chá verde',             cat: 'Bebidas',      unidade: 'ml', cal: 1,   prot: 0.0,  carb: 0.2,  gord: 0.0,  fibra: 0.0 },

  // ── LANCHES ─────────────────────────────────────────────────────
  { id: 45, nome: 'Granola (sem açúcar)',  cat: 'Lanches',      unidade: 'g',  cal: 450, prot: 11.0, carb: 60.0, gord: 18.0, fibra: 7.0 },
  { id: 46, nome: 'Tapioca (média)',       cat: 'Lanches',      unidade: 'un', cal: 150, prot: 0.5,  carb: 37.0, gord: 0.2,  fibra: 0.4 },
  { id: 47, nome: 'Barrinha de proteína',  cat: 'Lanches',      unidade: 'un', cal: 200, prot: 20.0, carb: 22.0, gord: 5.0,  fibra: 3.0 },
  { id: 48, nome: 'Biscoito de arroz',     cat: 'Lanches',      unidade: 'un', cal: 35,  prot: 0.7,  carb: 7.5,  gord: 0.3,  fibra: 0.3 },
];

export const REFEICOES_TIPO = [
  { id: 'cafe',      emoji: '🌅', nome: 'Café da manhã',    horario: '07:00' },
  { id: 'lanche1',   emoji: '🍎', nome: 'Lanche da manhã',  horario: '10:00' },
  { id: 'almoco',    emoji: '🍽️', nome: 'Almoço',           horario: '12:30' },
  { id: 'lanche2',   emoji: '🥪', nome: 'Lanche da tarde',  horario: '15:30' },
  { id: 'janta',     emoji: '🌙', nome: 'Jantar',           horario: '19:00' },
  { id: 'ceia',      emoji: '🌃', nome: 'Ceia',             horario: '21:30' },
];
