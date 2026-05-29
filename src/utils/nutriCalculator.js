// Calorias por grama de cada macro
const KCAL = { prot: 4, carb: 4, gord: 9, fibra: 2 };

// Valores padrão por 100g quando NADA é informado (médias reais por categoria)
const PADRAO_CATEGORIA = {
  'Proteínas':    { cal: 165, prot: 30.0, carb: 1.0,  gord: 4.5,  fibra: 0.0 },
  'Carboidratos': { cal: 130, prot: 2.5,  carb: 28.0, gord: 0.5,  fibra: 2.0 },
  'Laticínios':   { cal: 100, prot: 8.0,  carb: 8.0,  gord: 4.5,  fibra: 0.0 },
  'Frutas':       { cal: 60,  prot: 0.8,  carb: 14.0, gord: 0.3,  fibra: 2.0 },
  'Vegetais':     { cal: 30,  prot: 2.0,  carb: 5.5,  gord: 0.3,  fibra: 2.5 },
  'Gorduras':     { cal: 700, prot: 1.0,  carb: 2.0,  gord: 75.0, fibra: 0.0 },
  'Bebidas':      { cal: 40,  prot: 0.8,  carb: 9.0,  gord: 0.3,  fibra: 0.0 },
  'Lanches':      { cal: 400, prot: 8.0,  carb: 50.0, gord: 18.0, fibra: 3.0 },
  'Personalizado':{ cal: 150, prot: 8.0,  carb: 20.0, gord: 4.0,  fibra: 1.5 },
  'default':      { cal: 150, prot: 8.0,  carb: 20.0, gord: 4.0,  fibra: 1.5 },
};

// Distribuição calórica % por categoria (para estimar macros a partir de calorias)
const PERFIL_CATEGORIA = {
  'Proteínas':    { prot: 0.55, carb: 0.05, gord: 0.40 },
  'Carboidratos': { prot: 0.08, carb: 0.82, gord: 0.10 },
  'Laticínios':   { prot: 0.30, carb: 0.25, gord: 0.45 },
  'Frutas':       { prot: 0.05, carb: 0.90, gord: 0.05 },
  'Vegetais':     { prot: 0.25, carb: 0.65, gord: 0.10 },
  'Gorduras':     { prot: 0.02, carb: 0.03, gord: 0.95 },
  'Bebidas':      { prot: 0.10, carb: 0.80, gord: 0.10 },
  'Lanches':      { prot: 0.12, carb: 0.60, gord: 0.28 },
  'Personalizado':{ prot: 0.20, carb: 0.50, gord: 0.30 },
  'default':      { prot: 0.20, carb: 0.50, gord: 0.30 },
};

/**
 * Estima SEMPRE todos os nutrientes, mesmo com entrada vazia.
 * Regras:
 *   - Se tudo vazio → usa padrão da categoria
 *   - Se só calorias → distribui pelos macros via perfil da categoria
 *   - Se calorias + alguns macros → distribui calorias restantes nos macros faltando
 *   - Se só macros (sem calorias) → calcula calorias a partir dos macros
 *   - Campos estimados ficam marcados em _estimado
 */
export function estimarNutrientes(entrada, categoria = 'default') {
  const padrao = PADRAO_CATEGORIA[categoria] || PADRAO_CATEGORIA['default'];
  const perfil  = PERFIL_CATEGORIA[categoria]  || PERFIL_CATEGORIA['default'];

  const raw = {
    cal:   entrada?.cal   != null && entrada.cal   !== '' ? parseFloat(entrada.cal)   : null,
    prot:  entrada?.prot  != null && entrada.prot  !== '' ? parseFloat(entrada.prot)  : null,
    carb:  entrada?.carb  != null && entrada.carb  !== '' ? parseFloat(entrada.carb)  : null,
    gord:  entrada?.gord  != null && entrada.gord  !== '' ? parseFloat(entrada.gord)  : null,
    fibra: entrada?.fibra != null && entrada.fibra !== '' ? parseFloat(entrada.fibra) : null,
  };

  const tudoVazio = Object.values(raw).every(v => v == null);

  // ── CASO 1: Nada informado → usa padrão da categoria ──────────────────────
  if (tudoVazio) {
    return {
      cal:   padrao.cal,
      prot:  padrao.prot,
      carb:  padrao.carb,
      gord:  padrao.gord,
      fibra: padrao.fibra,
      _estimado: { cal: true, prot: true, carb: true, gord: true, fibra: true },
    };
  }

  // ── CASO 2: Só macros → calcula calorias ──────────────────────────────────
  const calDosMacros =
    (raw.prot  != null ? raw.prot  * KCAL.prot  : 0) +
    (raw.carb  != null ? raw.carb  * KCAL.carb  : 0) +
    (raw.gord  != null ? raw.gord  * KCAL.gord  : 0) +
    (raw.fibra != null ? raw.fibra * KCAL.fibra : 0);

  const calBase = raw.cal != null
    ? Math.max(raw.cal, calDosMacros)
    : (calDosMacros > 0 ? calDosMacros : padrao.cal);

  // Calorias não explicadas pelos macros já informados
  const calRestante = Math.max(0, calBase - calDosMacros);

  // Macros que precisam ser estimados
  const faltando = ['prot', 'carb', 'gord'].filter(m => raw[m] == null);
  const somaPerfil = faltando.reduce((s, m) => s + perfil[m], 0) || 1;

  // ── ESTIMAR macros faltando ───────────────────────────────────────────────
  const protFinal = raw.prot != null
    ? raw.prot
    : faltando.includes('prot')
      ? (calRestante > 0
          ? (calRestante * (perfil.prot / somaPerfil)) / KCAL.prot
          : padrao.prot)
      : 0;

  const carbFinal = raw.carb != null
    ? raw.carb
    : faltando.includes('carb')
      ? (calRestante > 0
          ? (calRestante * (perfil.carb / somaPerfil)) / KCAL.carb
          : padrao.carb)
      : 0;

  const gordFinal = raw.gord != null
    ? raw.gord
    : faltando.includes('gord')
      ? (calRestante > 0
          ? (calRestante * (perfil.gord / somaPerfil)) / KCAL.gord
          : padrao.gord)
      : 0;

  // Fibra: informada > estimada (6% dos carbs) > padrão
  const fibraFinal = raw.fibra != null
    ? raw.fibra
    : carbFinal > 0
      ? +(carbFinal * 0.06).toFixed(1)
      : padrao.fibra;

  // Calorias finais
  const calFinal = raw.cal != null
    ? raw.cal
    : +(protFinal * KCAL.prot + carbFinal * KCAL.carb + gordFinal * KCAL.gord + fibraFinal * KCAL.fibra).toFixed(1);

  return {
    cal:   +calFinal.toFixed(1),
    prot:  +protFinal.toFixed(1),
    carb:  +carbFinal.toFixed(1),
    gord:  +gordFinal.toFixed(1),
    fibra: +fibraFinal.toFixed(1),
    _estimado: {
      cal:   raw.cal   == null,
      prot:  raw.prot  == null,
      carb:  raw.carb  == null,
      gord:  raw.gord  == null,
      fibra: raw.fibra == null,
    },
  };
}

/**
 * Calcula nutrientes para uma quantidade consumida.
 * Suporta gramas, ml e medidas caseiras.
 */
export function calcularPorcao(alimento, quantidade, unidadeSelecionada, medidaCaseiraNome = null) {
  let gramas = quantidade;

  if (medidaCaseiraNome && alimento.medidas_caseiras?.length) {
    const medida = alimento.medidas_caseiras.find(m => m.nome_medida === medidaCaseiraNome);
    if (medida) gramas = quantidade * medida.peso_em_gramas;
  }

  const fator = gramas / 100;
  const base  = alimento.valores_base_100g;

  return {
    cal:   +(( base.cal   || 0) * fator).toFixed(1),
    prot:  +(( base.prot  || 0) * fator).toFixed(1),
    carb:  +(( base.carb  || 0) * fator).toFixed(1),
    gord:  +(( base.gord  || 0) * fator).toFixed(1),
    fibra: +(( base.fibra || 0) * fator).toFixed(1),
    gramas_consumidas: +gramas.toFixed(1),
  };
}
