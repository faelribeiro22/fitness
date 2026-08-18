import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { exercises } from '@/data/exercises';
import { initialWorkout, type WorkoutDay, type WorkoutExercise } from '@/data/workouts';

export default function WorkoutBuilderScreen() {
  const [planName, setPlanName] = useState(initialWorkout.name);
  const [days, setDays] = useState(initialWorkout.days);
  const [selectedDayId, setSelectedDayId] = useState(days[0].id);
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const exerciseById = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), []);

  function updateDay(nextDay: WorkoutDay) { setDays((current) => current.map((day) => day.id === nextDay.id ? nextDay : day)); }
  function reorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= selectedDay.exercises.length) return;
    const reordered = [...selectedDay.exercises];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    updateDay({ ...selectedDay, exercises: reordered });
  }
  function duplicateDay() {
    const copy: WorkoutDay = { ...selectedDay, id: `${selectedDay.id}-${Date.now()}`, weekday: `${selectedDay.weekday} (cópia)`, exercises: selectedDay.exercises.map((item) => ({ ...item, id: `${item.id}-${Date.now()}` })) };
    setDays((current) => [...current, copy]); setSelectedDayId(copy.id);
  }
  function removeDay() {
    if (days.length === 1) return;
    Alert.alert('Remover treino?', `Remover ${selectedDay.weekday} da rotina?`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Remover', style: 'destructive', onPress: () => { const next = days.filter((day) => day.id !== selectedDay.id); setDays(next); setSelectedDayId(next[0].id); } }]);
  }
  function addExercise() {
    const available = exercises.find((exercise) => !selectedDay.exercises.some((item) => item.exerciseId === exercise.id));
    if (!available) return;
    const item: WorkoutExercise = { id: `${available.id}-${Date.now()}`, exerciseId: available.id, sets: 3, reps: '8-12' };
    updateDay({ ...selectedDay, isRest: false, exercises: [...selectedDay.exercises, item] });
  }

  return <SafeAreaView style={styles.safeArea}><View style={styles.page}>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Exercícios</Text></Pressable><Text style={styles.wordmark}>VITAL</Text></View>
    <TextInput value={planName} onChangeText={setPlanName} style={styles.titleInput} placeholder="Nome da rotina" placeholderTextColor="#7B8088" />
    <Text style={styles.subtitle}>Organize sua semana e ajuste cada treino.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayTabs}>{days.map((day) => <Pressable key={day.id} onPress={() => setSelectedDayId(day.id)} style={[styles.dayTab, selectedDay.id === day.id && styles.dayTabActive]}><Text style={[styles.dayTabName, selectedDay.id === day.id && styles.dayTabTextActive]}>{day.weekday.replace(' (cópia)', '')}</Text><Text style={[styles.dayTabFocus, selectedDay.id === day.id && styles.dayTabTextActive]}>{day.isRest ? 'Descanso' : day.focus.join(' · ')}</Text></Pressable>)}</ScrollView>
    <View style={styles.actionRow}><Pressable onPress={duplicateDay} style={styles.secondaryButton}><Text style={styles.secondaryText}>Duplicar</Text></Pressable><Pressable onPress={removeDay} style={styles.secondaryButton}><Text style={styles.deleteText}>Remover</Text></Pressable></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.dayHeading}><View><Text style={styles.dayTitle}>{selectedDay.weekday}</Text><Text style={styles.daySubtitle}>{selectedDay.isRest ? 'Dia de recuperação' : selectedDay.focus.join(' + ')}</Text></View><Pressable onPress={() => updateDay({ ...selectedDay, isRest: !selectedDay.isRest, exercises: !selectedDay.isRest ? [] : selectedDay.exercises })} style={[styles.restToggle, selectedDay.isRest && styles.restToggleActive]}><Text style={[styles.restToggleText, selectedDay.isRest && styles.restToggleTextActive]}>{selectedDay.isRest ? 'Descanso' : 'Treino'}</Text></Pressable></View>
      {selectedDay.isRest ? <View style={styles.restCard}><Text style={styles.restIcon}>☾</Text><Text style={styles.restTitle}>Descanso programado</Text><Text style={styles.restCopy}>Recuperação também faz parte do progresso.</Text></View> : <>
        <Text style={styles.sectionTitle}>EXERCÍCIOS · SEGURE E ARRASTE PARA REORDENAR</Text>
        <View style={styles.exerciseList}>{selectedDay.exercises.map((item, index) => { const exercise = exerciseById.get(item.exerciseId); return <View key={item.id} style={styles.exerciseCard}><Text style={styles.drag}>⠿</Text><View style={styles.exerciseMain}><Text style={styles.exerciseName}>{exercise?.name ?? 'Exercício'}</Text><Text style={styles.exerciseSets}>{item.sets} séries · {item.reps} reps</Text></View><View style={styles.orderButtons}><Pressable disabled={index === 0} onPress={() => reorder(index, -1)}><Text style={[styles.order, index === 0 && styles.orderDisabled]}>↑</Text></Pressable><Pressable disabled={index === selectedDay.exercises.length - 1} onPress={() => reorder(index, 1)}><Text style={[styles.order, index === selectedDay.exercises.length - 1 && styles.orderDisabled]}>↓</Text></Pressable></View></View>; })}</View>
        <Pressable onPress={addExercise} style={styles.addButton}><Text style={styles.addText}>+ Adicionar exercício</Text></Pressable>
      </>}
      <View style={styles.focusSection}><Text style={styles.sectionTitle}>FOCOS DO DIA</Text><View style={styles.focusChips}>{(selectedDay.focus.length ? selectedDay.focus : ['Descanso']).map((focus) => <View style={styles.focusChip} key={focus}><Text style={styles.focusChipText}>{focus}</Text></View>)}</View></View>
    </ScrollView>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#FAFAF8', flex: 1 }, page: { alignSelf: 'center', flex: 1, maxWidth: 680, width: '100%' }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12 }, back: { color: '#5C626B', fontSize: 14, fontWeight: '800' }, wordmark: { color: '#181B22', fontSize: 17, fontWeight: '900', letterSpacing: 3 },
  titleInput: { color: '#1D2027', fontSize: 31, fontWeight: '800', letterSpacing: -1, marginHorizontal: 20, marginTop: 28, padding: 0 }, subtitle: { color: '#717781', fontSize: 15, marginHorizontal: 20, marginTop: 6 }, dayTabs: { gap: 9, paddingHorizontal: 20, paddingVertical: 22 }, dayTab: { backgroundColor: '#F0F1EE', borderRadius: 14, minWidth: 96, padding: 11 }, dayTabActive: { backgroundColor: '#78B63A' }, dayTabName: { color: '#444A52', fontSize: 13, fontWeight: '900' }, dayTabFocus: { color: '#717780', fontSize: 11, fontWeight: '600', marginTop: 4 }, dayTabTextActive: { color: '#FFFFFF' },
  actionRow: { flexDirection: 'row', gap: 9, paddingHorizontal: 20 }, secondaryButton: { borderColor: '#DADD D6'.replace(' ', ''), borderRadius: 10, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 }, secondaryText: { color: '#50565E', fontSize: 13, fontWeight: '800' }, deleteText: { color: '#B6544D', fontSize: 13, fontWeight: '800' }, content: { padding: 20, paddingBottom: 42 }, dayHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, dayTitle: { color: '#20232A', fontSize: 25, fontWeight: '800' }, daySubtitle: { color: '#717781', fontSize: 14, marginTop: 4 }, restToggle: { backgroundColor: '#EDF0EA', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 }, restToggleActive: { backgroundColor: '#EAF3DE' }, restToggleText: { color: '#5C626B', fontSize: 12, fontWeight: '800' }, restToggleTextActive: { color: '#628F2D' },
  sectionTitle: { color: '#747A83', fontSize: 10, fontWeight: '900', letterSpacing: .8, marginTop: 27 }, exerciseList: { gap: 9, marginTop: 11 }, exerciseCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E7E9E4', borderRadius: 14, borderWidth: 1, flexDirection: 'row', minHeight: 70, paddingHorizontal: 12 }, drag: { color: '#A5AAA4', fontSize: 22 }, exerciseMain: { flex: 1, marginLeft: 12 }, exerciseName: { color: '#262930', fontSize: 15, fontWeight: '800' }, exerciseSets: { color: '#777D85', fontSize: 12, marginTop: 4 }, orderButtons: { flexDirection: 'row', gap: 14 }, order: { color: '#60942B', fontSize: 19, fontWeight: '800' }, orderDisabled: { color: '#D4D8D1' }, addButton: { alignItems: 'center', borderColor: '#8BBC4D', borderRadius: 13, borderStyle: 'dashed', borderWidth: 1.3, marginTop: 11, paddingVertical: 14 }, addText: { color: '#5B9126', fontSize: 14, fontWeight: '800' }, focusSection: { marginTop: 5 }, focusChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }, focusChip: { backgroundColor: '#EAF4DD', borderRadius: 99, paddingHorizontal: 11, paddingVertical: 7 }, focusChipText: { color: '#5F8F2B', fontSize: 12, fontWeight: '800' },
  restCard: { alignItems: 'center', backgroundColor: '#F0F4EC', borderRadius: 18, marginTop: 24, padding: 28 }, restIcon: { color: '#6C9A38', fontSize: 30 }, restTitle: { color: '#2C3036', fontSize: 17, fontWeight: '800', marginTop: 9 }, restCopy: { color: '#737980', fontSize: 13, marginTop: 5 },
});
