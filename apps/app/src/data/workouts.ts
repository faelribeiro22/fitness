export type WorkoutExercise = { id: string; exerciseId: string; sets: number; reps: string };
export type WorkoutDay = { id: string; weekday: string; focus: string[]; isRest: boolean; exercises: WorkoutExercise[] };
export type WorkoutPlan = { id: string; name: string; days: WorkoutDay[] };

export const initialWorkout: WorkoutPlan = {
  id: 'rotina-inicial', name: 'Rotina semanal', days: [
    { id: 'monday', weekday: 'Segunda', focus: ['Peito', 'Tríceps'], isRest: false, exercises: [{ id: 'm1', exerciseId: 'supino-reto', sets: 4, reps: '8-10' }, { id: 'm2', exerciseId: 'triceps-corda', sets: 3, reps: '10-12' }] },
    { id: 'tuesday', weekday: 'Terça', focus: ['Costas', 'Bíceps'], isRest: false, exercises: [{ id: 't1', exerciseId: 'remada-curvada', sets: 4, reps: '8-10' }, { id: 't2', exerciseId: 'rosca-direta', sets: 3, reps: '10-12' }] },
    { id: 'wednesday', weekday: 'Quarta', focus: [], isRest: true, exercises: [] },
    { id: 'thursday', weekday: 'Quinta', focus: ['Pernas'], isRest: false, exercises: [{ id: 'th1', exerciseId: 'agachamento-livre', sets: 4, reps: '8-10' }, { id: 'th2', exerciseId: 'levantamento-terra', sets: 3, reps: '6-8' }] },
    { id: 'friday', weekday: 'Sexta', focus: ['Ombros'], isRest: false, exercises: [{ id: 'f1', exerciseId: 'desenvolvimento', sets: 3, reps: '8-10' }, { id: 'f2', exerciseId: 'elevacao-lateral', sets: 3, reps: '12-15' }] },
  ],
};
