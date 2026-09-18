import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getWorkoutHistory, type WorkoutSessionHistory } from '@/db/workouts';

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function dateKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
function duration(startedAt: string, finishedAt: string) {
  return Math.max(
    0,
    Math.round(
      (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 60000,
    ),
  );
}
function volume(value: number) {
  return `${Math.round(value).toLocaleString('pt-BR')}kg`;
}

export default function HistoryScreen() {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<WorkoutSessionHistory[]>([]);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selected, setSelected] = useState<WorkoutSessionHistory | null>(null);
  const refresh = useCallback(
    async () => setSessions(await getWorkoutHistory(db)),
    [db],
  );
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sessionsByDay = useMemo(
    () =>
      new Map(
        sessions
          .filter(item => {
            const date = new Date(item.finishedAt);
            return (
              date.getFullYear() === month.getFullYear() &&
              date.getMonth() === month.getMonth()
            );
          })
          .map(item => [dateKey(item.finishedAt), item]),
      ),
    [month, sessions],
  );
  const calendarDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = first.getDay();
    const count = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0,
    ).getDate();
    return Array.from(
      { length: Math.ceil((offset + count) / 7) * 7 },
      (_, index) => index - offset + 1,
    );
  }, [month]);
  function changeMonth(amount: number) {
    setSelected(null);
    setMonth(
      current =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.page}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={s.back}>‹ Voltar</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/progress')}>
            <Text style={s.logo}>PROGRESSÃO</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title}>Histórico</Text>
          <Text style={s.subtitle}>Acompanhe os treinos concluídos.</Text>
          <View style={s.monthRow}>
            <Pressable hitSlop={10} onPress={() => changeMonth(-1)}>
              <Text style={s.chevron}>‹</Text>
            </Pressable>
            <Text style={s.month}>{monthNames[month.getMonth()]}</Text>
            <Pressable hitSlop={10} onPress={() => changeMonth(1)}>
              <Text style={s.chevron}>›</Text>
            </Pressable>
          </View>
          <View style={s.week}>
            {weekDays.map((day, index) => (
              <Text key={`${day}-${index}`} style={s.weekDay}>
                {day}
              </Text>
            ))}
          </View>
          <View style={s.grid}>
            {calendarDays.map((day, index) => {
              if (
                day < 1 ||
                day >
                  new Date(
                    month.getFullYear(),
                    month.getMonth() + 1,
                    0,
                  ).getDate()
              )
                return <View key={`empty-${index}`} style={s.day} />;
              const key = `${month.getFullYear()}-${month.getMonth()}-${day}`;
              const session = sessionsByDay.get(key);
              const active = session?.id === selected?.id;
              return (
                <Pressable
                  key={key}
                  disabled={!session}
                  onPress={() => setSelected(session ?? null)}
                  style={[s.day, session && s.done, active && s.active]}
                >
                  <Text
                    style={[
                      s.dayText,
                      session && s.doneText,
                      active && s.activeText,
                    ]}
                  >
                    {session ? '✓' : day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {selected ? (
            <View style={s.detail}>
              <Text style={s.detailEyebrow}>TREINO CONCLUÍDO</Text>
              <Text style={s.workoutName}>{selected.name}</Text>
              <View style={s.metrics}>
                <Metric
                  label="Duração"
                  value={`${duration(selected.startedAt, selected.finishedAt)} minutos`}
                />
                <Metric label="Séries" value={`${selected.sets} séries`} />
                <Metric label="Volume" value={volume(selected.volume)} />
              </View>
            </View>
          ) : (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>Selecione um treino</Text>
              <Text style={s.emptyText}>
                {sessions.length
                  ? 'Os dias marcados com ✓ têm um treino registrado.'
                  : 'Quando você concluir um treino, ele aparecerá aqui.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.metric}>
      <Text style={s.metricLabel}>{label.toUpperCase()}</Text>
      <Text style={s.metricValue}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { backgroundColor: '#FAFAF8', flex: 1 },
  page: { alignSelf: 'center', flex: 1, maxWidth: 680, width: '100%' },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 12,
  },
  back: { color: '#5C626B', fontSize: 14, fontWeight: '800' },
  logo: { color: '#181B22', fontWeight: '900', letterSpacing: 3 },
  content: { padding: 20, paddingTop: 12, paddingBottom: 44 },
  title: {
    color: '#1D2027',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: { color: '#717781', fontSize: 15, marginTop: 6 },
  monthRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 34,
    paddingHorizontal: 8,
  },
  month: { color: '#252930', fontSize: 22, fontWeight: '900' },
  chevron: { color: '#5D902A', fontSize: 31, fontWeight: '600' },
  week: { flexDirection: 'row', marginTop: 22 },
  weekDay: {
    color: '#858B92',
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 9 },
  day: {
    alignItems: 'center',
    height: 47,
    justifyContent: 'center',
    width: '14.2857%',
  },
  dayText: { color: '#535962', fontSize: 14, fontWeight: '700' },
  done: {
    backgroundColor: '#E8F4DB',
    borderRadius: 99,
    height: 37,
    marginHorizontal: '2.5%',
    width: '9.2857%',
  },
  doneText: { color: '#5C9628', fontSize: 18, fontWeight: '900' },
  active: { backgroundColor: '#78B63A' },
  activeText: { color: '#FFF' },
  detail: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE5D5',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 30,
    padding: 21,
  },
  detailEyebrow: {
    color: '#6B9D33',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  workoutName: {
    color: '#22262C',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 8,
  },
  metrics: {
    borderTopColor: '#EDF0E9',
    borderTopWidth: 1,
    gap: 18,
    marginTop: 20,
    paddingTop: 19,
  },
  metric: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: '#7B8189',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  metricValue: { color: '#29302A', fontSize: 16, fontWeight: '900' },
  empty: {
    alignItems: 'center',
    backgroundColor: '#F0F3ED',
    borderRadius: 19,
    marginTop: 30,
    padding: 28,
  },
  emptyTitle: { color: '#3E454B', fontSize: 16, fontWeight: '900' },
  emptyText: {
    color: '#777D85',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    textAlign: 'center',
  },
});
