// Calorias por grama de cada macro
const KCAL = { prot: 4, carb: 4, gord: 9, fibra: 2 };

// Perfis médios por categoria (distribuição calórica %)
const PERFIL_CATEGORIA = {
  'Proteínas':    { prot: 0.55, carb: 0.05, gord: 0.40 },
  'Carboidratos': { prot: 0.08, carb: 0.82, gord: 0.10 },
  'Laticínios':   { prot: 0.30, carb: 0.25, gord: 0.45 },
  'Frutas':       { prot: 0.05, carb: 0.90, gord: 0.05 },
  'Vegetais':     { prot: 0.25, carb: 0.65, gord: 0.10 },
  'Gorduras':     { prot: 0.02, carb: 0.03, gord: 0.95 },
  'Bebidas':      { prot: 0.10, carb: 0.80, gord: 0.10 },
  'Lanches':      { prot: 0.12, carb: 0.60, gord: 0.28 },
  'default':      { prot: 0.20, carb: 0.50, gord: 0.30 },
};

/**
 * Estima nutrientes faltantes com base nos disponíveis.
 * Entrada: valores por 100g (podem ser null/undefined).
 * Saída: valores completos por 100g.
 */
export function estimarNutrientes(entrada, categoria = 'default') {
  const { cal, prot, carb, gord, fibra } = {
    cal: null, prot: null, carb: null, gord: null, fibra: null,
    ...entrada,
  };

  // 1. Calcular calorias dos macros conhecidos
  const calConhecida =
    (prot  != null ? prot  * KCAL.prot  : 0) +
    (carb  != null ? carb  * KCAL.carb  : 0) +
    (gord  != null ? gord  * KCAL.gord  : 0) +
    (fibra != null ? fibra * KCAL.fibra : 0);

  // 2. Calorias totais: usa a declarada ou a calculada
  const calTotal = cal != null ? Math.max(cal, calConhecida) : calConhecida;

  // 3. Calorias ainda não explicadas pelos macros conhecidos
  const calRestante = Math.max(0, calTotal - calConhecida);

  // 4. Perfil para distribuir calorias restantes
  const perfil = PERFIL_CATEGORIA[categoria] || PERFIL_CATEGORIA['default'];

  // Normalizar perfil apenas para macros desconhecidos
  const macrosFaltando = [
    prot  == null ? 'prot'  : null,
    carb  == null ? 'carb'  : null,
    gord  == null ? 'gord'  : null,
  ].filter(Boolean);

  const somaPerfil = macrosFaltando.reduce((s, m) => s + perfil[m], 0) || 1;

  // 5. Estimar macros faltando
  const protFinal  = prot  != null ? prot  : (calRestante * (perfil.prot  / somaPerfil)) / KCAL.prot;
  const carbFinal  = carb  != null ? carb  : (calRestante * (perfil.carb  / somaPerfil)) / KCAL.carb;
  const gordFinal  = gord  != null ? gord  : (calRestante * (perfil.gord  / somaPerfil)) / KCAL.gord;
  const fibraFinal = fibra != null ? fibra : carbFinal * 0.06; // ~6% dos carbs = fibra estimada

  // 6. Calorias finais (recalcula para consistência)
  const calFinal = cal != null
    ? cal
    : +(protFinal * KCAL.prot + carbFinal * KCAL.carb + gordFinal * KCAL.gord + fibraFinal * KCAL.fibra).toFixed(1);

  return {
    cal:   +calFinal.toFixed(1),
    prot:  +protFinal.toFixed(1),
    carb:  +carbFinal.toFixed(1),
    gord:  +gordFinal.toFixed(1),
    fibra: +fibraFinal.toFixed(1),
    // Flags para saber o que foi estimado vs informado
    _estimado: {
      cal:   cal   == null,
      prot:  prot  == null,
      carb:  carb  == null,
      gord:  gord  == null,
      fibra: fibra == null,
    },
  };
}

/**
 * Calcula nutrientes para uma quantidade consumida.
 * Suporta gramas, ml e medidas caseiras.
 */
export function calcularPorcao(alimento, quantidade, unidadeSelecionada, medidaCaseiraNome = null) {
  let gramas = quantidade;

  // Converter medida caseira para gramas
  if (medidaCaseiraNome && alimento.medidas_caseiras?.length) {
    const medida = alimento.medidas_caseiras.find(m => m.nome_medida === medidaCaseiraNome);
    if (medida) gramas = quantidade * medida.peso_em_gramas;
  }

  const fator = gramas / 100;
  const base = alimento.valores_base_100g;

  return {
    cal:   +(base.cal   * fator).toFixed(1),
    prot:  +(base.prot  * fator).toFixed(1),
    carb:  +(base.carb  * fator).toFixed(1),
    gord:  +(base.gord  * fator).toFixed(1),
    fibra: +(base.fibra * fator).toFixed(1),
    gramas_consumidas: +gramas.toFixed(1),
  };
}

/** Verifica se um alimento tem nutrientes incompletos */
export function temNutrientesIncompletos(valores) {
  return valores.cal == null || valores.prot == null ||
         valores.carb == null || valores.gord == null;
}
