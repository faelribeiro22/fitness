import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';

import { exercises } from '@/data/exercises';
import { type WorkoutDay, type WorkoutPlan } from '@/data/workouts';
import { finishWorkoutSession, getExerciseHistory, getWorkouts, saveExerciseLog, startWorkoutSession, type ExerciseSetLog } from '@/db/workouts';

type RunningWorkout = { workout: WorkoutPlan; day: WorkoutDay; sessionId: string };

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function RunWorkoutScreen() {
  const db = useSQLiteContext();
  const { workoutId, dayId } = useLocalSearchParams<{ workoutId: string; dayId: string }>();
  const [running, setRunning] = useState<RunningWorkout | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [seriesNote, setSeriesNote] = useState('');
  const [note, setNote] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState<ExerciseSetLog[]>([]);
  const [finished, setFinished] = useState(false);
  const exerciseMap = useMemo(() => new Map(exercises.map((exercise) => [exercise.id, exercise])), []);

  useEffect(() => {
    let active = true;
    async function openSession() {
      const plans = await getWorkouts(db);
      const workout = plans.find((item) => item.id === workoutId);
      const day = workout?.days.find((item) => item.id === dayId);
      if (!active || !workout || !day || day.isRest || day.exercises.length === 0) return;
      const sessionId = await startWorkoutSession(db, workout.id, day.id);
      if (active) setRunning({ workout, day, sessionId });
    }
    void openSession();
    return () => { active = false; };
  }, [db, dayId, workoutId]);

  useEffect(() => {
    if (!running || finished || paused) return;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [finished, paused, running]);

  const currentItem = running?.day.exercises[exerciseIndex];
  const currentExercise = currentItem ? exerciseMap.get(currentItem.exerciseId) : undefined;

  useEffect(() => {
    if (!currentItem) return;
    setReps(currentItem.reps.split('-').at(-1) ?? '10');
    setRpe('');
    setSeriesNote('');
    void getExerciseHistory(db, currentItem.exerciseId).then((logs) => {
      setHistory(logs);
      setWeight(logs[0]?.weight ?? '');
    });
  }, [currentItem, db]);

  function advance() {
    if (!running || !currentItem) return;
    const totalSets = Math.max(1, currentItem.sets);
    if (setNumber < totalSets) setSetNumber((value) => value + 1);
    else { setExerciseIndex((value) => value + 1); setSetNumber(1); }
  }

  useEffect(() => {
    if (restSeconds === null || paused) return;
    if (restSeconds === 0) { setRestSeconds(null); advance(); return; }
    const timer = setTimeout(() => setRestSeconds((value) => Math.max(0, (value ?? 1) - 1)), 1000);
    return () => clearTimeout(timer);
  }, [paused, restSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  async function completeSet() {
    if (!running || !currentItem || !currentExercise) return;
    if (!weight.trim() || !reps.trim()) { Alert.alert('Preencha a série', 'Informe peso e repetições antes de concluir.'); return; }
    await saveExerciseLog(db, {
      sessionId: running.sessionId,
      workoutExerciseId: currentItem.id,
      exerciseId: currentItem.exerciseId,
      series: setNumber,
      weight: weight.trim(),
      repetitions: reps.trim(),
      rpe: rpe.trim(),
      durationSeconds: elapsed,
      note: seriesNote.trim(),
    });
    const lastSet = setNumber >= Math.max(1, currentItem.sets);
    const lastExercise = exerciseIndex >= running.day.exercises.length - 1;
    if (lastSet && lastExercise) {
      await finishWorkoutSession(db, running.sessionId, note);
      setFinished(true);
      return;
    }
    setRestSeconds(90);
  }

  if (finished) return <SafeAreaView style={s.safe}><View style={s.complete}><Text style={s.completeIcon}>✓</Text><Text style={s.completeTitle}>Treino concluído!</Text><Text style={s.completeCopy}>Você treinou por {formatTime(elapsed)}. Seu histórico foi salvo localmente.</Text><Pressable style={s.primary} onPress={() => router.replace('/workouts')}><Text style={s.primaryText}>Voltar aos treinos</Text></Pressable></View></SafeAreaView>;
  if (!running || !currentItem || !currentExercise) return <SafeAreaView style={s.safe}><View style={s.loading}><Text style={s.loadingText}>Preparando treino...</Text></View></SafeAreaView>;

  const totalSets = Math.max(1, currentItem.sets);
  return <SafeAreaView style={s.safe}><View style={s.page}>
    <View style={s.header}><Pressable onPress={() => router.back()}><Text style={s.back}>‹ Encerrar</Text></Pressable><View style={s.timerArea}><Text style={s.timer}>◷ {formatTime(elapsed)}</Text><Pressable onPress={() => setPaused((value) => !value)} style={s.pauseButton}><Text style={s.pauseText}>{paused ? 'Retomar' : 'Pausar'}</Text></Pressable></View></View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.eyebrow}>{running.day.weekday.toUpperCase()} · EXERCÍCIO {exerciseIndex + 1} DE {running.day.exercises.length}</Text>
      <Text style={s.exerciseName}>{currentExercise.name}</Text><Text style={s.exerciseInfo}>{currentExercise.muscleGroup} · {currentExercise.equipment}</Text>
      {restSeconds !== null ? <View style={s.restCard}><Text style={s.restLabel}>DESCANSO AUTOMÁTICO</Text><Text style={s.restTime}>{formatTime(restSeconds)}</Text><Text style={s.restCopy}>Prepare-se para a próxima série.</Text><Pressable onPress={() => { setRestSeconds(null); advance(); }}><Text style={s.skip}>Pular descanso</Text></Pressable></View> : <><View style={s.setCard}><Text style={s.setLabel}>SÉRIE {setNumber} DE {totalSets}</Text><View style={s.fields}><View style={s.field}><Text style={s.fieldLabel}>PESO</Text><View style={s.inputLine}><TextInput value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="80" style={s.input} /><Text style={s.unit}>kg</Text></View></View><View style={s.field}><Text style={s.fieldLabel}>REPETIÇÕES</Text><TextInput value={reps} onChangeText={setReps} keyboardType="number-pad" placeholder="10" style={s.input} /></View><View style={s.rpeField}><Text style={s.fieldLabel}>RPE</Text><TextInput value={rpe} onChangeText={setRpe} keyboardType="decimal-pad" maxLength={2} placeholder="8" style={s.input} /></View></View><Text style={s.fieldLabel}>OBSERVAÇÃO DA SÉRIE</Text><TextInput value={seriesNote} onChangeText={setSeriesNote} multiline placeholder="Ex.: última repetição difícil" placeholderTextColor="#999F97" style={s.setNotes} /></View><Pressable style={s.primary} onPress={() => void completeSet()}><Text style={s.primaryText}>✓ Concluir série</Text></Pressable><Pressable style={s.next} onPress={advance}><Text style={s.nextText}>Próximo exercício ›</Text></Pressable></>}
      <Text style={s.section}>OBSERVAÇÕES</Text><TextInput multiline value={note} onChangeText={setNote} placeholder="Como você se sentiu? Algum ajuste para a próxima vez?" placeholderTextColor="#999F97" style={s.notes} />
      <Text style={s.section}>HISTÓRICO DO EXERCÍCIO</Text>{history.length ? history.map((item, index) => <View key={`${item.completedAt}-${index}`} style={s.history}><Text style={s.historyDate}>{new Date(item.completedAt).toLocaleDateString('pt-BR')}</Text><View><Text style={s.historyValue}>Série {item.setNumber} · {item.weight} kg × {item.repetitions}{item.rpe ? ` · RPE ${item.rpe}` : ''}</Text>{item.note ? <Text style={s.historyNote}>{item.note}</Text> : null}</View></View>) : <Text style={s.emptyHistory}>Ainda não há registros para este exercício.</Text>}
    </ScrollView>
  </View></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { backgroundColor: '#FAFAF8', flex: 1 }, page: { alignSelf: 'center', flex: 1, maxWidth: 680, width: '100%' }, header: { alignItems: 'center', flexDirection: 'row', padding: 20, paddingTop: 12, position: 'relative' }, back: { color: '#5C626B', fontSize: 14, fontWeight: '800', zIndex: 1 }, timerArea: { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 12 }, timer: { color: '#273022', fontSize: 15, fontWeight: '900' }, pauseButton: { backgroundColor: '#E9EFE2', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6 }, pauseText: { color: '#597E31', fontSize: 11, fontWeight: '900' }, content: { padding: 20, paddingTop: 24, paddingBottom: 48 }, eyebrow: { color: '#6E9D32', fontSize: 11, fontWeight: '900', letterSpacing: 1.1 }, exerciseName: { color: '#1D2027', fontSize: 34, fontWeight: '900', letterSpacing: -1, marginTop: 12 }, exerciseInfo: { color: '#717781', fontSize: 15, marginTop: 6 }, setCard: { backgroundColor: '#FFFFFF', borderColor: '#E6E9E3', borderRadius: 20, borderWidth: 1, marginTop: 30, padding: 20 }, setLabel: { color: '#6E9D32', fontSize: 12, fontWeight: '900', letterSpacing: 1 }, fields: { flexDirection: 'row', gap: 12, marginTop: 22 }, field: { flex: 1 }, rpeField: { flex: .55 }, fieldLabel: { color: '#777D85', fontSize: 10, fontWeight: '900', letterSpacing: .8, marginTop: 16 }, inputLine: { alignItems: 'center', borderBottomColor: '#BBC2B5', borderBottomWidth: 1.5, flexDirection: 'row', marginTop: 8 }, input: { borderBottomColor: '#BBC2B5', borderBottomWidth: 1.5, color: '#20252A', flex: 1, fontSize: 28, fontWeight: '800', marginTop: 8, paddingBottom: 5 }, unit: { color: '#707680', fontSize: 16, fontWeight: '800', marginLeft: 6 }, setNotes: { backgroundColor: '#F8F9F6', borderColor: '#E3E6DF', borderRadius: 10, borderWidth: 1, color: '#30343A', marginTop: 8, minHeight: 58, padding: 10, textAlignVertical: 'top' }, primary: { alignItems: 'center', backgroundColor: '#78B63A', borderRadius: 14, marginTop: 14, paddingVertical: 16 }, primaryText: { color: '#FFF', fontSize: 16, fontWeight: '900' }, next: { alignItems: 'center', paddingVertical: 17 }, nextText: { color: '#5C9028', fontSize: 14, fontWeight: '900' }, restCard: { alignItems: 'center', backgroundColor: '#EDF5E4', borderRadius: 20, marginTop: 30, padding: 28 }, restLabel: { color: '#5E8C2C', fontSize: 11, fontWeight: '900', letterSpacing: 1 }, restTime: { color: '#30451A', fontSize: 54, fontWeight: '900', marginTop: 8 }, restCopy: { color: '#65735A', fontSize: 14, marginTop: 5 }, skip: { color: '#5B9027', fontSize: 14, fontWeight: '900', marginTop: 22 }, section: { color: '#747A83', fontSize: 10, fontWeight: '900', letterSpacing: .9, marginTop: 26 }, notes: { backgroundColor: '#FFF', borderColor: '#E4E7E1', borderRadius: 14, borderWidth: 1, color: '#30343A', marginTop: 9, minHeight: 88, padding: 13, textAlignVertical: 'top' }, history: { alignItems: 'center', backgroundColor: '#FFF', borderBottomColor: '#E8EAE6', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 }, historyDate: { color: '#747A83', fontSize: 12 }, historyValue: { color: '#30343A', fontSize: 13, fontWeight: '800', textAlign: 'right' }, historyNote: { color: '#777D85', fontSize: 11, marginTop: 3, maxWidth: 190, textAlign: 'right' }, emptyHistory: { color: '#858A91', fontSize: 13, marginTop: 11 }, loading: { alignItems: 'center', flex: 1, justifyContent: 'center' }, loadingText: { color: '#707680', fontSize: 15 }, complete: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 30 }, completeIcon: { backgroundColor: '#78B63A', borderRadius: 99, color: '#FFF', fontSize: 38, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 19, paddingVertical: 11 }, completeTitle: { color: '#1D2027', fontSize: 31, fontWeight: '900', marginTop: 24 }, completeCopy: { color: '#707680', fontSize: 15, lineHeight: 22, marginTop: 10, textAlign: 'center' },
});
