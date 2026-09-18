import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';

import { exercises } from '@/data/exercises';
import {
  getPersonalRecords,
  getWorkoutHistory,
  type PersonalRecord,
  type WorkoutSessionHistory,
} from '@/db/workouts';

function minutes(session: WorkoutSessionHistory) {
  return Math.max(
    0,
    Math.round(
      (new Date(session.finishedAt).getTime() -
        new Date(session.startedAt).getTime()) /
        60000,
    ),
  );
}
function label(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}
function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export default function ProgressScreen() {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<WorkoutSessionHistory[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const refresh = useCallback(async () => {
    const [allSessions, allRecords] = await Promise.all([
      getWorkoutHistory(db),
      getPersonalRecords(db),
    ]);
    setSessions(allSessions);
    setRecords(allRecords);
  }, [db]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const latest = useMemo(() => [...sessions].reverse().slice(-6), [sessions]);
  const exerciseNames = useMemo(
    () => new Map(exercises.map(item => [item.id, item.name])),
    [],
  );
  const totalMinutes = sum(sessions.map(minutes));

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.page}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={s.back}>‹ Histórico</Text>
          </Pressable>
          <Text style={s.logo}>VITAL</Text>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title}>Progressão</Text>
          <Text style={s.subtitle}>
            Sua evolução com base nos treinos salvos.
          </Text>
          {!sessions.length ? (
            <Empty />
          ) : (
            <>
              <View style={s.summary}>
                <Summary value={String(sessions.length)} label="treinos" />
                <Summary value={`${totalMinutes} min`} label="tempo total" />
                <Summary
                  value={`${Math.round(sum(sessions.map(item => item.volume))).toLocaleString('pt-BR')} kg`}
                  label="volume total"
                />
              </View>
              <Chart
                title="Carga"
                value={item => (item.sets ? item.volume / item.sets : 0)}
                format={value => `${Math.round(value)} kg/série`}
                sessions={latest}
              />
              <Chart
                title="Volume"
                value={item => item.volume}
                format={value =>
                  `${Math.round(value).toLocaleString('pt-BR')} kg`
                }
                sessions={latest}
              />
              <FrequencyChart sessions={sessions} />
              <Chart
                title="Tempo"
                value={item => minutes(item)}
                format={value => `${Math.round(value)} minutos`}
                sessions={latest}
              />
              <Text style={s.section}>RECORDES PESSOAIS</Text>
              {records.map(record => (
                <View key={record.exerciseId} style={s.record}>
                  <View style={s.recordMedal}>
                    <Text style={s.medalText}>★</Text>
                  </View>
                  <View style={s.recordBody}>
                    <Text style={s.recordName}>
                      {exerciseNames.get(record.exerciseId) ?? 'Exercício'}
                    </Text>
                    <Text style={s.recordDate}>
                      {label(record.completedAt)}
                    </Text>
                  </View>
                  <Text style={s.recordValue}>
                    {record.weight.toLocaleString('pt-BR')} kg ×{' '}
                    {record.repetitions}
                  </Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Summary({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.summaryItem}>
      <Text style={s.summaryValue}>{value}</Text>
      <Text style={s.summaryLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}
function Empty() {
  return (
    <View style={s.empty}>
      <Text style={s.emptyTitle}>Ainda não há evolução para mostrar</Text>
      <Text style={s.emptyText}>
        Conclua seu primeiro treino para acompanhar carga, volume, frequência,
        tempo e recordes.
      </Text>
    </View>
  );
}
function Chart({
  title,
  sessions,
  value,
  format,
}: {
  title: string;
  sessions: WorkoutSessionHistory[];
  value: (session: WorkoutSessionHistory, index: number) => number;
  format: (value: number) => string;
}) {
  const values = sessions.map(value);
  const maximum = Math.max(...values, 1);
  const current = values.at(-1) ?? 0;
  return (
    <View style={s.chart}>
      <View style={s.chartHeader}>
        <Text style={s.chartTitle}>{title}</Text>
        <Text style={s.chartValue}>{format(current)}</Text>
      </View>
      <View style={s.bars}>
        {sessions.map((item, index) => (
          <View key={item.id} style={s.barColumn}>
            <View style={s.barTrack}>
              <View
                style={[
                  s.bar,
                  {
                    height: `${Math.max(8, (values[index] / maximum) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={s.barLabel}>{label(item.finishedAt)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
function FrequencyChart({ sessions }: { sessions: WorkoutSessionHistory[] }) {
  const now = new Date();
  const weeks = Array.from({ length: 6 }, (_, index) => {
    const end = new Date(now);
    end.setDate(now.getDate() - (5 - index) * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    return {
      label: `${start.getDate()}/${start.getMonth() + 1}`,
      count: sessions.filter(session => {
        const date = new Date(session.finishedAt);
        return date >= start && date <= end;
      }).length,
    };
  });
  const maximum = Math.max(...weeks.map(week => week.count), 1);
  return (
    <View style={s.chart}>
      <View style={s.chartHeader}>
        <Text style={s.chartTitle}>Frequência</Text>
        <Text style={s.chartValue}>
          {weeks.at(-1)?.count ?? 0} treino(s) nesta semana
        </Text>
      </View>
      <View style={s.bars}>
        {weeks.map(week => (
          <View key={week.label} style={s.barColumn}>
            <View style={s.barTrack}>
              <View
                style={[
                  s.bar,
                  {
                    height: `${Math.max(week.count ? 8 : 0, (week.count / maximum) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={s.barLabel}>{week.label}</Text>
          </View>
        ))}
      </View>
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
  subtitle: { color: '#717781', fontSize: 15, lineHeight: 21, marginTop: 6 },
  summary: {
    backgroundColor: '#EFF5E8',
    borderRadius: 17,
    flexDirection: 'row',
    marginTop: 25,
    paddingVertical: 17,
  },
  summaryItem: { alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  summaryValue: {
    color: '#314220',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  summaryLabel: {
    color: '#75905E',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginTop: 5,
    textAlign: 'center',
  },
  chart: {
    backgroundColor: '#FFF',
    borderColor: '#E4E8E1',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    padding: 17,
  },
  chartHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartTitle: { color: '#29302B', fontSize: 17, fontWeight: '900' },
  chartValue: { color: '#64952F', fontSize: 13, fontWeight: '900' },
  bars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 9,
    height: 132,
    marginTop: 15,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    backgroundColor: '#EFF2EC',
    borderRadius: 9,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%',
  },
  bar: { backgroundColor: '#82BB42', borderRadius: 9, width: '100%' },
  barLabel: { color: '#858A91', fontSize: 9, fontWeight: '700', marginTop: 7 },
  section: {
    color: '#747A83',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.9,
    marginTop: 28,
    marginBottom: 8,
  },
  record: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: '#E7EAE4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 14,
  },
  recordMedal: {
    alignItems: 'center',
    backgroundColor: '#F7E9B8',
    borderRadius: 99,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  medalText: { color: '#A77513', fontSize: 15 },
  recordBody: { flex: 1, marginLeft: 11 },
  recordName: { color: '#30343A', fontSize: 14, fontWeight: '900' },
  recordDate: { color: '#858A91', fontSize: 11, marginTop: 3 },
  recordValue: { color: '#587E2C', fontSize: 13, fontWeight: '900' },
  empty: {
    alignItems: 'center',
    backgroundColor: '#F0F3ED',
    borderRadius: 19,
    marginTop: 31,
    padding: 29,
  },
  emptyTitle: {
    color: '#3E454B',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyText: {
    color: '#777D85',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    textAlign: 'center',
  },
});
