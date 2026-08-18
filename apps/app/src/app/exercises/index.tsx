import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { equipmentOptions, exercises, muscleGroups, typeOptions } from '@/data/exercises';

type FilterKind = 'muscle' | 'equipment' | 'type';

export default function ExerciseLibraryScreen() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('Todos');
  const [equipment, setEquipment] = useState('Todos');
  const [type, setType] = useState('Todos');
  const [openFilter, setOpenFilter] = useState<FilterKind | null>(null);

  const filteredExercises = useMemo(() => exercises.filter((exercise) => {
    const searchable = `${exercise.name} ${exercise.muscleGroup} ${exercise.equipment}`.toLocaleLowerCase();
    return searchable.includes(query.trim().toLocaleLowerCase())
      && (muscle === 'Todos' || exercise.muscleGroup === muscle)
      && (equipment === 'Todos' || exercise.equipment === equipment)
      && (type === 'Todos' || exercise.type === type);
  }), [equipment, muscle, query, type]);

  const filters: { key: FilterKind; label: string; value: string; options: string[]; setValue: (value: string) => void }[] = [
    { key: 'muscle', label: 'Grupo muscular', value: muscle, options: muscleGroups, setValue: setMuscle },
    { key: 'equipment', label: 'Equipamento', value: equipment, options: equipmentOptions, setValue: setEquipment },
    { key: 'type', label: 'Tipo', value: type, options: typeOptions, setValue: setType },
  ];

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.page}>
      <View style={styles.header}><Text style={styles.wordmark}>VITAL</Text><Pressable onPress={() => router.push('/workouts')}><Text style={styles.headerLink}>Meus treinos</Text></Pressable></View>
      <Text style={styles.title}>Exercícios</Text>
      <Text style={styles.subtitle}>Encontre o movimento ideal para o seu treino.</Text>
      <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Buscar exercício" placeholderTextColor="#90959E" style={styles.searchInput} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{filters.map((filter) => <Pressable key={filter.key} style={[styles.filterButton, filter.value !== 'Todos' && styles.filterButtonSelected]} onPress={() => setOpenFilter(openFilter === filter.key ? null : filter.key)}><Text style={[styles.filterText, filter.value !== 'Todos' && styles.filterTextSelected]}>{filter.value === 'Todos' ? filter.label : filter.value}</Text><Text style={[styles.chevron, filter.value !== 'Todos' && styles.filterTextSelected]}>⌄</Text></Pressable>)}</ScrollView>
      {openFilter && <View style={styles.filterPanel}>{filters.filter((filter) => filter.key === openFilter).map((filter) => <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRow} key={filter.key}>{filter.options.map((option) => <Pressable key={option} onPress={() => { filter.setValue(option); setOpenFilter(null); }} style={[styles.option, filter.value === option && styles.optionSelected]}><Text style={[styles.optionText, filter.value === option && styles.optionTextSelected]}>{option}</Text></Pressable>)}</ScrollView>)}</View>}
      <View style={styles.resultHeader}><Text style={styles.resultCount}>{filteredExercises.length} exercícios</Text><Pressable onPress={() => { setMuscle('Todos'); setEquipment('Todos'); setType('Todos'); setQuery(''); }}><Text style={styles.clearText}>Limpar filtros</Text></Pressable></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>{filteredExercises.map((exercise) => <Pressable key={exercise.id} onPress={() => router.push({ pathname: '/exercises/[id]', params: { id: exercise.id } })} style={styles.card}><View style={styles.illustration}><Text style={styles.illustrationText}>{exercise.image}</Text></View><View style={styles.cardText}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.exerciseMeta}>{exercise.muscleGroup} · {exercise.equipment}</Text><View style={styles.tag}><Text style={styles.tagText}>{exercise.type}</Text></View></View><Text style={styles.arrow}>›</Text></Pressable>)}</ScrollView>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FAFAF8', flex: 1 }, page: { flex: 1, maxWidth: 640, width: '100%', alignSelf: 'center', paddingHorizontal: 20 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 }, wordmark: { color: '#181B22', fontSize: 18, fontWeight: '900', letterSpacing: 3 }, headerLink: { color: '#717581', fontSize: 13, fontWeight: '700' },
  title: { color: '#181B22', fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 32 }, subtitle: { color: '#737782', fontSize: 15, lineHeight: 22, marginTop: 6 },
  search: { alignItems: 'center', backgroundColor: '#F0F1EE', borderRadius: 14, flexDirection: 'row', height: 52, marginTop: 24, paddingHorizontal: 15 }, searchIcon: { color: '#656B73', fontSize: 25, lineHeight: 25, marginRight: 9 }, searchInput: { color: '#1B1E24', flex: 1, fontSize: 16, fontWeight: '600' },
  filterRow: { gap: 9, paddingVertical: 16 }, filterButton: { alignItems: 'center', borderColor: '#DDE0DA', borderRadius: 99, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 13, paddingVertical: 9 }, filterButtonSelected: { backgroundColor: '#EAF5DD', borderColor: '#8ABD4C' }, filterText: { color: '#575D66', fontSize: 13, fontWeight: '700' }, filterTextSelected: { color: '#4C7E20' }, chevron: { color: '#6B7078', fontSize: 15 },
  filterPanel: { backgroundColor: '#FFFFFF', borderColor: '#E5E6E1', borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 10 }, optionRow: { gap: 8 }, option: { borderColor: '#DEE1DA', borderRadius: 99, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 }, optionSelected: { backgroundColor: '#78B63A', borderColor: '#78B63A' }, optionText: { color: '#5A6069', fontSize: 13, fontWeight: '700' }, optionTextSelected: { color: '#FFFFFF' },
  resultHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, resultCount: { color: '#464C55', fontSize: 14, fontWeight: '800' }, clearText: { color: '#699E2C', fontSize: 13, fontWeight: '800' },
  list: { gap: 11, paddingBottom: 28 }, card: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E8E9E5', borderRadius: 17, borderWidth: 1, flexDirection: 'row', minHeight: 88, padding: 12 }, illustration: { alignItems: 'center', backgroundColor: '#F0F4E9', borderRadius: 13, height: 62, justifyContent: 'center', width: 62 }, illustrationText: { fontSize: 29 }, cardText: { flex: 1, marginLeft: 13 }, exerciseName: { color: '#20232A', fontSize: 15, fontWeight: '800' }, exerciseMeta: { color: '#777C85', fontSize: 13, marginTop: 4 }, tag: { alignSelf: 'flex-start', backgroundColor: '#F1F2EF', borderRadius: 99, marginTop: 7, paddingHorizontal: 8, paddingVertical: 3 }, tagText: { color: '#6A7078', fontSize: 10, fontWeight: '800' }, arrow: { color: '#858A91', fontSize: 29, fontWeight: '300', marginLeft: 9 },
});
