import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MUSCLE_IMAGES } from '../data/exercises';

export default function MuscleImage({ exercicioId, nome = '', style }) {
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const source = !erro && MUSCLE_IMAGES[exercicioId] ? MUSCLE_IMAGES[exercicioId] : null;

  if (!source) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderIcon}>💪</Text>
        <Text style={styles.placeholderNome}>{nome}</Text>
        <Text style={styles.placeholderSub}>Imagem em breve</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {carregando && (
        <ActivityIndicator style={styles.loader} color="#e94560" size="large" />
      )}
      <Image
        source={source}
        style={[styles.img, carregando && styles.invisible]}
        resizeMode="contain"
        onLoad={() => setCarregando(false)}
        onError={() => { setErro(true); setCarregando(false); }}
      />
      {nome ? <Text style={styles.label}>{nome}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  invisible: { opacity: 0 },
  loader: {
    position: 'absolute',
  },
  label: {
    position: 'absolute',
    bottom: 8,
    left: 0, right: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 4,
  },
  placeholder: {
    backgroundColor: '#1e2040',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderIcon: { fontSize: 38 },
  placeholderNome: { color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center', paddingHorizontal: 12 },
  placeholderSub: { color: '#666', fontSize: 11 },
});
