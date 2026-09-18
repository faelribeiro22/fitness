import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';

import { exercises } from '@/data/exercises';
import {
  type WorkoutDay,
  type WorkoutExercise,
  type WorkoutPlan,
} from '@/data/workouts';
import {
  createEmptyWorkout,
  deleteWorkout,
  duplicateWorkout,
  getWorkouts,
  saveWorkout,
} from '@/db/workouts';

export default function WorkoutsScreen() {
  const db = useSQLiteContext();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [current, setCurrent] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setWorkouts(await getWorkouts(db));
    setLoading(false);
  }, [db]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function create() {
    const workout = createEmptyWorkout();
    await saveWorkout(db, workout);
    await refresh();
    setCurrent(workout);
  }
  async function duplicate(workout: WorkoutPlan) {
    const copy = duplicateWorkout(workout);
    await saveWorkout(db, copy);
    await refresh();
    setCurrent(copy);
  }
  function remove(workout: WorkoutPlan) {
    Alert.alert(
      'Remover treino?',
      `“${workout.name}” será removido deste dispositivo.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            void deleteWorkout(db, workout.id).then(refresh);
          },
        },
      ],
    );
  }
  if (current)
    return (
      <Editor
        initialWorkout={current}
        onClose={() => {
          setCurrent(null);
          void refresh();
        }}
      />
    );
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.page}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={s.back}>‹ Exercícios</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/history')}>
            <Text style={s.logo}>HISTÓRICO</Text>
          </Pressable>
        </View>
        <View style={s.titleRow}>
          <View>
            <Text style={s.title}>Meus treinos</Text>
            <Text style={s.subtitle}>Monte e ajuste sua rotina semanal.</Text>
          </View>
          <Pressable onPress={() => void create()} style={s.primary}>
            <Text style={s.primaryText}>+ Criar</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={s.list}>
          {loading ? (
            <Text style={s.muted}>Carregando...</Text>
          ) : (
            workouts.map(workout => (
              <View key={workout.id} style={s.planCard}>
                <Pressable
                  onPress={() => setCurrent(workout)}
                  style={s.planBody}
                >
                  <Text style={s.planName}>{workout.name}</Text>
                  <Text style={s.planMeta}>
                    {workout.days.filter(day => !day.isRest).length} dias de
                    treino ·{' '}
                    {workout.days.reduce(
                      (count, day) => count + day.exercises.length,
                      0,
                    )}{' '}
                    exercícios
                  </Text>
                  <Text numberOfLines={1} style={s.planFocus}>
                    {workout.days
                      .map(
                        day =>
                          `${day.weekday}: ${day.isRest ? 'descanso' : day.focus.join(', ') || 'sem foco'}`,
                      )
                      .join('  ·  ')}
                  </Text>
                </Pressable>
                <View style={s.actions}>
                  <Pressable onPress={() => void duplicate(workout)}>
                    <Text style={s.link}>Duplicar</Text>
                  </Pressable>
                  <Pressable onPress={() => remove(workout)}>
                    <Text style={s.danger}>Remover</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Editor({
  initialWorkout,
  onClose,
}: {
  initialWorkout: WorkoutPlan;
  onClose: () => void;
}) {
  const db = useSQLiteContext();
  const [workout, setWorkout] = useState(initialWorkout);
  const [dayId, setDayId] = useState(initialWorkout.days[0]?.id);
  const [picker, setPicker] = useState(false);
  const day = workout.days.find(item => item.id === dayId) ?? workout.days[0];
  const exerciseMap = useMemo(
    () => new Map(exercises.map(exercise => [exercise.id, exercise])),
    [],
  );
  async function persist(next: WorkoutPlan) {
    setWorkout(next);
    await saveWorkout(db, next);
  }
  function changeDay(next: WorkoutDay) {
    void persist({
      ...workout,
      days: workout.days.map(item => (item.id === next.id ? next : item)),
    });
  }
  function reorder(index: number, amount: -1 | 1) {
    const target = index + amount;
    if (target < 0 || target >= day.exercises.length) return;
    const items = [...day.exercises];
    [items[index], items[target]] = [items[target], items[index]];
    changeDay({ ...day, exercises: items });
  }
  function add(exerciseId: string) {
    if (day.exercises.some(item => item.exerciseId === exerciseId)) return;
    const item: WorkoutExercise = {
      id: `${exerciseId}-${Date.now()}`,
      exerciseId,
      sets: 3,
      reps: '8-12',
    };
    changeDay({ ...day, isRest: false, exercises: [...day.exercises, item] });
    setPicker(false);
  }
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.page}>
        <View style={s.header}>
          <Pressable onPress={onClose}>
            <Text style={s.back}>‹ Meus treinos</Text>
          </Pressable>
          <Text style={s.logo}>VITAL</Text>
        </View>
        <TextInput
          style={s.nameInput}
          value={workout.name}
          onChangeText={name => setWorkout({ ...workout, name })}
          onEndEditing={() => void saveWorkout(db, workout)}
          placeholder="Nome da rotina"
        />
        <Text style={s.subtitle}>
          As alterações são salvas neste dispositivo.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabs}
        >
          {workout.days.map(item => (
            <Pressable
              key={item.id}
              onPress={() => setDayId(item.id)}
              style={[s.tab, item.id === day.id && s.tabActive]}
            >
              <Text style={[s.tabText, item.id === day.id && s.tabTextActive]}>
                {item.weekday}
              </Text>
              <Text style={[s.tabSub, item.id === day.id && s.tabTextActive]}>
                {item.isRest ? 'Descanso' : item.focus.join(' · ') || 'Treino'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView
          contentContainerStyle={s.editor}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.dayHeader}>
            <View>
              <Text style={s.dayTitle}>{day.weekday}</Text>
              <Text style={s.daySub}>
                {day.isRest
                  ? 'Dia de recuperação'
                  : 'Configure o treino do dia'}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                changeDay({
                  ...day,
                  isRest: !day.isRest,
                  exercises: !day.isRest ? [] : day.exercises,
                })
              }
              style={s.rest}
            >
              <Text style={s.restText}>
                {day.isRest ? 'Descanso' : 'Treino'}
              </Text>
            </Pressable>
          </View>
          {!day.isRest && day.exercises.length > 0 && (
            <Pressable
              style={s.startWorkout}
              onPress={() =>
                router.push({
                  pathname: '/workouts/run',
                  params: { workoutId: workout.id, dayId: day.id },
                })
              }
            >
              <Text style={s.startWorkoutText}>▶ Iniciar treino</Text>
            </Pressable>
          )}
          <Text style={s.label}>FOCOS DO DIA</Text>
          <TextInput
            style={s.focusInput}
            value={day.focus.join(', ')}
            onChangeText={value =>
              changeDay({
                ...day,
                focus: value
                  .split(',')
                  .map(item => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Ex.: Peito, Tríceps"
          />
          {day.isRest ? (
            <View style={s.restCard}>
              <Text style={s.restTitle}>☾ Descanso programado</Text>
              <Text style={s.daySub}>
                Recuperação também faz parte do progresso.
              </Text>
            </View>
          ) : (
            <>
              <Text style={s.label}>
                EXERCÍCIOS · USE AS SETAS PARA REORDENAR
              </Text>
              {day.exercises.map((item, index) => (
                <ExerciseRow
                  key={item.id}
                  item={item}
                  name={exerciseMap.get(item.exerciseId)?.name ?? 'Exercício'}
                  first={index === 0}
                  last={index === day.exercises.length - 1}
                  onChange={next =>
                    changeDay({
                      ...day,
                      exercises: day.exercises.map(current =>
                        current.id === item.id ? next : current,
                      ),
                    })
                  }
                  onUp={() => reorder(index, -1)}
                  onDown={() => reorder(index, 1)}
                  onRemove={() =>
                    changeDay({
                      ...day,
                      exercises: day.exercises.filter(
                        current => current.id !== item.id,
                      ),
                    })
                  }
                />
              ))}
              <Pressable style={s.add} onPress={() => setPicker(true)}>
                <Text style={s.addText}>+ Adicionar exercício</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
        <Modal
          visible={picker}
          transparent
          animationType="slide"
          onRequestClose={() => setPicker(false)}
        >
          <Pressable style={s.overlay} onPress={() => setPicker(false)}>
            <Pressable
              style={s.sheet}
              onPress={event => event.stopPropagation()}
            >
              <Text style={s.sheetTitle}>Adicionar exercício</Text>
              <ScrollView>
                {exercises.map(exercise => {
                  const exists = day.exercises.some(
                    item => item.exerciseId === exercise.id,
                  );
                  return (
                    <Pressable
                      key={exercise.id}
                      disabled={exists}
                      onPress={() => add(exercise.id)}
                      style={s.exerciseChoice}
                    >
                      <Text style={s.emoji}>{exercise.image}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={s.choiceName}>{exercise.name}</Text>
                        <Text style={s.choiceMeta}>
                          {exercise.muscleGroup} · {exercise.equipment}
                        </Text>
                      </View>
                      {exists && <Text style={s.added}>Adicionado</Text>}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function ExerciseRow({
  item,
  name,
  first,
  last,
  onChange,
  onUp,
  onDown,
  onRemove,
}: {
  item: WorkoutExercise;
  name: string;
  first: boolean;
  last: boolean;
  onChange: (item: WorkoutExercise) => void;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={s.exercise}>
      <View style={{ flex: 1 }}>
        <Text style={s.exerciseName}>{name}</Text>
        <View style={s.setsRow}>
          <TextInput
            keyboardType="number-pad"
            value={String(item.sets)}
            onChangeText={value =>
              onChange({ ...item, sets: Number(value) || 0 })
            }
            style={s.setsInput}
          />
          <Text style={s.small}> séries · </Text>
          <TextInput
            value={item.reps}
            onChangeText={reps => onChange({ ...item, reps })}
            style={s.repsInput}
          />
          <Text style={s.small}> reps</Text>
        </View>
      </View>
      <Pressable disabled={first} onPress={onUp}>
        <Text style={[s.order, first && s.disabled]}>↑</Text>
      </Pressable>
      <Pressable disabled={last} onPress={onDown}>
        <Text style={[s.order, last && s.disabled]}>↓</Text>
      </Pressable>
      <Pressable onPress={onRemove}>
        <Text style={s.x}>×</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAF8' },
  page: { flex: 1, width: '100%', maxWidth: 680, alignSelf: 'center' },
  header: {
    padding: 20,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: { color: '#5C626B', fontWeight: '800' },
  logo: { color: '#181B22', fontWeight: '900', letterSpacing: 3 },
  titleRow: {
    margin: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { color: '#1D2027', fontSize: 31, fontWeight: '800' },
  subtitle: {
    color: '#717781',
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 6,
  },
  primary: {
    backgroundColor: '#78B63A',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryText: { color: '#FFF', fontWeight: '900' },
  list: { padding: 20, gap: 12 },
  planCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E7E1',
    borderRadius: 16,
    overflow: 'hidden',
  },
  planBody: { padding: 16 },
  planName: { color: '#24272D', fontSize: 17, fontWeight: '900' },
  planMeta: { color: '#747A83', fontSize: 13, marginTop: 5 },
  planFocus: { color: '#5F8E2E', fontSize: 12, marginTop: 12 },
  actions: {
    padding: 13,
    gap: 20,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEF0EC',
  },
  link: { color: '#5D902A', fontWeight: '900' },
  danger: { color: '#B6544D', fontWeight: '900' },
  muted: { color: '#737980', textAlign: 'center' },
  nameInput: {
    marginHorizontal: 20,
    marginTop: 5,
    padding: 0,
    fontSize: 31,
    fontWeight: '800',
    color: '#1D2027',
  },
  tabs: { gap: 9, padding: 20 },
  tab: {
    minWidth: 96,
    padding: 11,
    borderRadius: 14,
    backgroundColor: '#F0F1EE',
  },
  tabActive: { backgroundColor: '#78B63A' },
  tabText: { color: '#444A52', fontWeight: '900' },
  tabSub: { color: '#717780', fontSize: 11, marginTop: 4 },
  tabTextActive: { color: '#FFF' },
  editor: { padding: 20, paddingTop: 0, paddingBottom: 42 },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: { color: '#20232A', fontSize: 25, fontWeight: '800' },
  daySub: { color: '#717781', marginTop: 4 },
  rest: { backgroundColor: '#EAF3DE', borderRadius: 99, padding: 9 },
  restText: { color: '#628F2D', fontWeight: '800', fontSize: 12 },
  startWorkout: {
    backgroundColor: '#78B63A',
    borderRadius: 13,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 22,
  },
  startWorkoutText: { color: '#FFF', fontWeight: '900' },
  label: {
    color: '#747A83',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 25,
    marginBottom: 7,
  },
  focusInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#D7DBD4',
    paddingVertical: 10,
    color: '#2B2F35',
  },
  restCard: {
    marginTop: 24,
    padding: 27,
    borderRadius: 18,
    backgroundColor: '#F0F4EC',
    alignItems: 'center',
  },
  restTitle: { color: '#2C3036', fontSize: 17, fontWeight: '800' },
  exercise: {
    minHeight: 70,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E9E4',
    backgroundColor: '#FFF',
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseName: { color: '#262930', fontWeight: '800' },
  setsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  setsInput: {
    width: 25,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#C7CCC4',
    fontSize: 12,
    textAlign: 'center',
  },
  repsInput: {
    width: 42,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#C7CCC4',
    fontSize: 12,
    textAlign: 'center',
  },
  small: { color: '#777D85', fontSize: 12 },
  order: { color: '#60942B', fontSize: 19, fontWeight: '800' },
  disabled: { color: '#D4D8D1' },
  x: { color: '#B6544D', fontSize: 23 },
  add: {
    borderWidth: 1.3,
    borderStyle: 'dashed',
    borderColor: '#8BBC4D',
    borderRadius: 13,
    marginTop: 11,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addText: { color: '#5B9126', fontWeight: '800' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '78%',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FAFAF8',
  },
  sheetTitle: {
    color: '#20232A',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 14,
  },
  exerciseChoice: {
    minHeight: 68,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E9E4',
  },
  emoji: { fontSize: 24, marginRight: 12 },
  choiceName: { color: '#282C31', fontWeight: '800' },
  choiceMeta: { color: '#777D85', fontSize: 12, marginTop: 3 },
  added: { color: '#789260', fontSize: 11, fontWeight: '800' },
});
