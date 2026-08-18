export type ExerciseType = 'Composto' | 'Isolado';
export type Difficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  type: ExerciseType;
  difficulty: Difficulty;
  instructions: string[];
  image: string;
  video: string;
};

export const exercises: Exercise[] = [
  { id: 'supino-reto', name: 'Supino reto com barra', muscleGroup: 'Peitoral', secondaryMuscles: ['Tríceps', 'Ombros'], equipment: 'Barra', type: 'Composto', difficulty: 'Intermediário', image: '🏋️', video: 'local://supino-reto', instructions: ['Deite-se no banco com os pés firmes no chão.', 'Segure a barra pouco além da largura dos ombros.', 'Desça a barra de forma controlada até o meio do peito.', 'Empurre a barra até estender os braços sem travar os cotovelos.'] },
  { id: 'agachamento-livre', name: 'Agachamento livre', muscleGroup: 'Pernas', secondaryMuscles: ['Glúteos', 'Core'], equipment: 'Barra', type: 'Composto', difficulty: 'Intermediário', image: '🧍', video: 'local://agachamento-livre', instructions: ['Posicione a barra sobre o trapézio e afaste os pés na largura dos ombros.', 'Inicie o movimento levando o quadril para trás.', 'Desça mantendo o peito aberto e os joelhos alinhados aos pés.', 'Empurre o chão para voltar à posição inicial.'] },
  { id: 'remada-curvada', name: 'Remada curvada', muscleGroup: 'Costas', secondaryMuscles: ['Bíceps', 'Ombros'], equipment: 'Barra', type: 'Composto', difficulty: 'Intermediário', image: '💪', video: 'local://remada-curvada', instructions: ['Segure a barra com as mãos na largura dos ombros.', 'Incline o tronco mantendo a coluna neutra.', 'Puxe a barra em direção ao abdômen.', 'Desça de forma controlada até estender os braços.'] },
  { id: 'desenvolvimento', name: 'Desenvolvimento com halteres', muscleGroup: 'Ombros', secondaryMuscles: ['Tríceps'], equipment: 'Halteres', type: 'Composto', difficulty: 'Iniciante', image: '🏋️', video: 'local://desenvolvimento', instructions: ['Sente-se com as costas apoiadas e halteres na altura dos ombros.', 'Mantenha os punhos alinhados aos cotovelos.', 'Empurre os halteres para cima em um arco leve.', 'Retorne lentamente à posição inicial.'] },
  { id: 'rosca-direta', name: 'Rosca direta', muscleGroup: 'Bíceps', secondaryMuscles: ['Antebraços'], equipment: 'Barra', type: 'Isolado', difficulty: 'Iniciante', image: '💪', video: 'local://rosca-direta', instructions: ['Fique em pé com a barra à frente das coxas.', 'Mantenha os cotovelos próximos ao tronco.', 'Flexione os cotovelos levando a barra até os ombros.', 'Desça lentamente sem balançar o corpo.'] },
  { id: 'triceps-corda', name: 'Tríceps na corda', muscleGroup: 'Tríceps', secondaryMuscles: ['Antebraços'], equipment: 'Cabo', type: 'Isolado', difficulty: 'Iniciante', image: '⚡', video: 'local://triceps-corda', instructions: ['Ajuste a polia na posição alta e segure a corda.', 'Mantenha os cotovelos fixos junto ao corpo.', 'Estenda os braços até separar levemente as pontas da corda.', 'Retorne de forma controlada até 90 graus.'] },
  { id: 'levantamento-terra', name: 'Levantamento terra', muscleGroup: 'Costas', secondaryMuscles: ['Pernas', 'Glúteos', 'Core'], equipment: 'Barra', type: 'Composto', difficulty: 'Avançado', image: '🏋️', video: 'local://levantamento-terra', instructions: ['Aproxime a barra das canelas e afaste os pés na largura do quadril.', 'Segure a barra mantendo a coluna neutra.', 'Estenda joelhos e quadril ao mesmo tempo.', 'Desça a barra junto ao corpo com controle.'] },
  { id: 'elevacao-lateral', name: 'Elevação lateral', muscleGroup: 'Ombros', secondaryMuscles: ['Trapézio'], equipment: 'Halteres', type: 'Isolado', difficulty: 'Iniciante', image: '↔️', video: 'local://elevacao-lateral', instructions: ['Fique em pé segurando os halteres ao lado do corpo.', 'Mantenha uma leve flexão nos cotovelos.', 'Eleve os braços até a linha dos ombros.', 'Desça devagar, mantendo o controle do movimento.'] },
];

export const muscleGroups = ['Todos', ...Array.from(new Set(exercises.map((exercise) => exercise.muscleGroup)))];
export const equipmentOptions = ['Todos', ...Array.from(new Set(exercises.map((exercise) => exercise.equipment)))];
export const typeOptions = ['Todos', 'Composto', 'Isolado'];
