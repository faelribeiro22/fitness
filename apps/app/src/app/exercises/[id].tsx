import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { exercises } from '@/data/exercises';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = exercises.find((item) => item.id === id);
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([Animated.timing(lift, { toValue: 1, duration: 950, useNativeDriver: true }), Animated.timing(lift, { toValue: 0, duration: 950, useNativeDriver: true })]));
    animation.start();
    return () => animation.stop();
  }, [lift]);

  if (!exercise) return <SafeAreaView style={styles.safeArea}><View style={styles.empty}><Text style={styles.emptyTitle}>Exercício não encontrado</Text><Pressable onPress={() => router.back()}><Text style={styles.backLink}>Voltar para a biblioteca</Text></Pressable></View></SafeAreaView>;
  const movement = lift.interpolate({ inputRange: [0, 1], outputRange: [15, -18] });

  return <SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backIcon}>‹</Text><Text style={styles.backText}>Exercícios</Text></Pressable>
    <Text style={styles.title}>{exercise.name}</Text>
    <View style={styles.metaRow}><Badge label={exercise.muscleGroup} /><Badge label={exercise.difficulty} /><Badge label={exercise.equipment} /></View>
    <View style={styles.motionCard}><Text style={styles.motionLabel}>EXECUÇÃO</Text><Animated.View style={[styles.motionFigure, { transform: [{ translateY: movement }] }]}><Text style={styles.motionEmoji}>{exercise.image}</Text></Animated.View><View style={styles.motionFloor} /><Text style={styles.motionCopy}>Animação da execução</Text></View>
    <Text style={styles.sectionTitle}>Sobre o exercício</Text>
    <Text style={styles.body}>Foco principal em {exercise.muscleGroup.toLocaleLowerCase()}. Também trabalha {exercise.secondaryMuscles.join(', ').toLocaleLowerCase()}.</Text>
    <Text style={styles.sectionTitle}>Como executar</Text>
    <View style={styles.instructions}>{exercise.instructions.map((instruction, index) => <View style={styles.instruction} key={instruction}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><Text style={styles.instructionText}>{instruction}</Text></View>)}</View>
  </ScrollView></SafeAreaView>;
}

function Badge({ label }: { label: string }) { return <View style={styles.badge}><Text style={styles.badgeText}>{label}</Text></View>; }

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FAFAF8', flex: 1 }, page: { alignSelf: 'center', maxWidth: 640, padding: 20, paddingBottom: 42, width: '100%' }, back: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 5, marginTop: 7 }, backIcon: { color: '#5B6069', fontSize: 29, lineHeight: 22 }, backText: { color: '#5B6069', fontSize: 14, fontWeight: '800' },
  title: { color: '#1C1F26', fontSize: 32, fontWeight: '800', letterSpacing: -1, lineHeight: 38, marginTop: 27 }, metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 15 }, badge: { backgroundColor: '#EDF5E3', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6 }, badgeText: { color: '#5E8D2B', fontSize: 12, fontWeight: '800' },
  motionCard: { alignItems: 'center', backgroundColor: '#EAF2DF', borderRadius: 22, height: 245, justifyContent: 'center', marginTop: 27, overflow: 'hidden' }, motionLabel: { color: '#5F8A31', fontSize: 11, fontWeight: '900', letterSpacing: 1.3, left: 18, position: 'absolute', top: 17 }, motionFigure: { alignItems: 'center', backgroundColor: '#C9E6A5', borderRadius: 99, height: 102, justifyContent: 'center', width: 102 }, motionEmoji: { fontSize: 51 }, motionFloor: { backgroundColor: '#B6D88D', borderRadius: 99, bottom: 45, height: 7, position: 'absolute', width: 134 }, motionCopy: { bottom: 18, color: '#6F855B', fontSize: 12, fontWeight: '700', position: 'absolute' },
  sectionTitle: { color: '#24272E', fontSize: 19, fontWeight: '800', marginTop: 30 }, body: { color: '#666C75', fontSize: 15, lineHeight: 23, marginTop: 10 }, instructions: { gap: 16, marginTop: 16 }, instruction: { flexDirection: 'row', gap: 13 }, number: { alignItems: 'center', backgroundColor: '#78B63A', borderRadius: 99, height: 25, justifyContent: 'center', marginTop: 1, width: 25 }, numberText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' }, instructionText: { color: '#555B64', flex: 1, fontSize: 15, lineHeight: 22 },
  empty: { alignItems: 'center', flex: 1, justifyContent: 'center' }, emptyTitle: { color: '#1C1F26', fontSize: 21, fontWeight: '800' }, backLink: { color: '#6B9E2E', fontSize: 15, fontWeight: '800', marginTop: 13 },
});
