import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Goal = 'Hipertrofia' | 'Emagrecimento' | 'Força' | 'Resistência';
type Sex = 'Feminino' | 'Masculino' | 'Prefiro não informar';

const steps = ['Sobre você', 'Medidas', 'Perfil', 'Objetivo'];

const goals: { name: Goal; description: string; icon: string }[] = [
  { name: 'Hipertrofia', description: 'Ganhar massa muscular', icon: '↗' },
  { name: 'Emagrecimento', description: 'Reduzir gordura corporal', icon: '↓' },
  { name: 'Força', description: 'Aumentar a sua potência', icon: '✦' },
  { name: 'Resistência', description: 'Melhorar seu condicionamento', icon: '∞' },
];

export default function HomeScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return Number(weight.replace(',', '.')) > 0 && Number(height) > 0;
    if (step === 2) return Number(age) > 0 && sex !== null;
    return goal !== null;
  }, [age, goal, height, name, sex, step, weight]);

  function continueOnboarding() {
    if (!canContinue) return;
    if (step === steps.length - 1) {
      setIsComplete(true);
      return;
    }
    setStep((current) => current + 1);
  }

  if (isComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.completePage}>
          <View style={styles.completeIcon}><Text style={styles.completeIconText}>✓</Text></View>
          <Text style={styles.completeTitle}>Tudo pronto, {name.trim()}!</Text>
          <Text style={styles.completeCopy}>
            Seu plano de {goal?.toLowerCase()} está sendo preparado para você.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/exercises')}>
            <Text style={styles.primaryButtonText}>Explorar exercícios</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.keyboardView}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>VITAL</Text>
          <Text style={styles.stepLabel}>{step + 1} de {steps.length}</Text>
        </View>

        <View style={styles.progressTrack}>
          {steps.map((item, index) => (
            <View key={item} style={[styles.progressSegment, index <= step && styles.progressSegmentActive]} />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>{steps[step]}</Text>
          {step === 0 && <IntroStep name={name} onChangeName={setName} />}
          {step === 1 && <MeasurementsStep weight={weight} height={height} onWeightChange={setWeight} onHeightChange={setHeight} />}
          {step === 2 && <ProfileStep age={age} sex={sex} onAgeChange={setAge} onSexChange={setSex} />}
          {step === 3 && <GoalStep goal={goal} onGoalChange={setGoal} />}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 ? (
            <Pressable hitSlop={12} onPress={() => setStep((current) => current - 1)}>
              <Text style={styles.backText}>Voltar</Text>
            </Pressable>
          ) : <View />}
          <Pressable
            accessibilityRole="button"
            disabled={!canContinue}
            onPress={continueOnboarding}
            style={[styles.primaryButton, !canContinue && styles.primaryButtonDisabled]}>
            <Text style={styles.primaryButtonText}>{step === 3 ? 'Começar agora' : 'Continuar'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function IntroStep({ name, onChangeName }: { name: string; onChangeName: (value: string) => void }) {
  return <>
    <Text style={styles.title}>Como podemos{`\n`}te chamar?</Text>
    <Text style={styles.description}>Vamos personalizar sua experiência a partir daqui.</Text>
    <View style={styles.fieldGroup}>
      <Text style={styles.inputLabel}>SEU NOME</Text>
      <TextInput autoCapitalize="words" autoFocus onChangeText={onChangeName} placeholder="Digite seu primeiro nome" placeholderTextColor="#9B9FAD" style={styles.input} value={name} />
    </View>
  </>;
}

function MeasurementsStep({ weight, height, onWeightChange, onHeightChange }: { weight: string; height: string; onWeightChange: (value: string) => void; onHeightChange: (value: string) => void }) {
  return <>
    <Text style={styles.title}>Suas medidas</Text>
    <Text style={styles.description}>Esses dados nos ajudam a montar um plano adequado para você.</Text>
    <View style={styles.fieldRow}>
      <View style={[styles.fieldGroup, styles.fieldHalf]}>
        <Text style={styles.inputLabel}>PESO</Text>
        <View style={styles.inputWithUnit}><TextInput keyboardType="decimal-pad" onChangeText={onWeightChange} placeholder="00" placeholderTextColor="#9B9FAD" style={styles.inputUnit} value={weight} /><Text style={styles.unit}>kg</Text></View>
      </View>
      <View style={[styles.fieldGroup, styles.fieldHalf]}>
        <Text style={styles.inputLabel}>ALTURA</Text>
        <View style={styles.inputWithUnit}><TextInput keyboardType="number-pad" maxLength={3} onChangeText={onHeightChange} placeholder="000" placeholderTextColor="#9B9FAD" style={styles.inputUnit} value={height} /><Text style={styles.unit}>cm</Text></View>
      </View>
    </View>
  </>;
}

function ProfileStep({ age, sex, onAgeChange, onSexChange }: { age: string; sex: Sex | null; onAgeChange: (value: string) => void; onSexChange: (value: Sex) => void }) {
  const options: Sex[] = ['Feminino', 'Masculino', 'Prefiro não informar'];
  return <>
    <Text style={styles.title}>Seu perfil</Text>
    <Text style={styles.description}>As informações ficam privadas e ajudam a ajustar suas recomendações.</Text>
    <View style={styles.fieldGroup}>
      <Text style={styles.inputLabel}>IDADE</Text>
      <View style={styles.ageInput}><TextInput keyboardType="number-pad" maxLength={3} onChangeText={onAgeChange} placeholder="00" placeholderTextColor="#9B9FAD" style={styles.inputUnit} value={age} /><Text style={styles.unit}>anos</Text></View>
    </View>
    <Text style={[styles.inputLabel, styles.selectionLabel]}>SEXO</Text>
    <View style={styles.chipRow}>{options.map((option) => <ChoiceChip key={option} label={option} selected={sex === option} onPress={() => onSexChange(option)} />)}</View>
  </>;
}

function GoalStep({ goal, onGoalChange }: { goal: Goal | null; onGoalChange: (value: Goal) => void }) {
  return <>
    <Text style={styles.title}>Qual é o seu{`\n`}objetivo?</Text>
    <Text style={styles.description}>Escolha seu foco principal. Você poderá alterá-lo quando quiser.</Text>
    <View style={styles.goalList}>{goals.map((item) => <Pressable key={item.name} onPress={() => onGoalChange(item.name)} style={[styles.goalCard, goal === item.name && styles.goalCardSelected]}><View style={[styles.goalIcon, goal === item.name && styles.goalIconSelected]}><Text style={[styles.goalIconText, goal === item.name && styles.goalIconTextSelected]}>{item.icon}</Text></View><View style={styles.goalText}><Text style={styles.goalName}>{item.name}</Text><Text style={styles.goalDescription}>{item.description}</Text></View><View style={[styles.radio, goal === item.name && styles.radioSelected]}>{goal === item.name && <View style={styles.radioDot} />}</View></Pressable>)}</View>
  </>;
}

function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF8' },
  keyboardView: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' },
  header: { paddingHorizontal: 24, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { color: '#181B22', fontSize: 18, fontWeight: '900', letterSpacing: 3 },
  stepLabel: { color: '#717581', fontSize: 13, fontWeight: '700' },
  progressTrack: { flexDirection: 'row', gap: 5, paddingHorizontal: 24, marginTop: 22 },
  progressSegment: { height: 4, flex: 1, borderRadius: 99, backgroundColor: '#E4E5E1' },
  progressSegmentActive: { backgroundColor: '#8BC34A' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 52, paddingBottom: 32 },
  eyebrow: { color: '#6E9D32', fontSize: 13, fontWeight: '800', letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase' },
  title: { color: '#181B22', fontSize: 36, fontWeight: '800', letterSpacing: -1.2, lineHeight: 41 },
  description: { color: '#686D78', fontSize: 16, fontWeight: '500', lineHeight: 24, marginTop: 14, maxWidth: 420 },
  fieldGroup: { marginTop: 42 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldHalf: { flex: 1 },
  inputLabel: { color: '#6B707B', fontSize: 11, fontWeight: '800', letterSpacing: 1.1, marginBottom: 9 },
  input: { borderBottomWidth: 1.5, borderBottomColor: '#BFC2BB', color: '#181B22', fontSize: 21, fontWeight: '600', height: 51, padding: 0 },
  inputWithUnit: { alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#BFC2BB', flexDirection: 'row', height: 51 },
  inputUnit: { color: '#181B22', flex: 1, fontSize: 21, fontWeight: '600', height: 51, padding: 0 },
  unit: { color: '#737883', fontSize: 15, fontWeight: '700', paddingBottom: 2 },
  ageInput: { alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#BFC2BB', flexDirection: 'row', height: 51, maxWidth: 180 },
  selectionLabel: { marginTop: 38 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: { borderColor: '#D7D9D4', borderRadius: 99, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 11 },
  chipSelected: { backgroundColor: '#ECF6DF', borderColor: '#7EBB39' },
  chipText: { color: '#545963', fontSize: 14, fontWeight: '700' },
  chipTextSelected: { color: '#46751B' },
  goalList: { gap: 11, marginTop: 31 },
  goalCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E7E8E4', borderRadius: 17, borderWidth: 1, flexDirection: 'row', minHeight: 78, padding: 13 },
  goalCardSelected: { backgroundColor: '#F7FCEF', borderColor: '#8BC34A', borderWidth: 1.5 },
  goalIcon: { alignItems: 'center', backgroundColor: '#F0F1EE', borderRadius: 12, height: 48, justifyContent: 'center', width: 48 },
  goalIconSelected: { backgroundColor: '#8BC34A' },
  goalIconText: { color: '#666C74', fontSize: 25, fontWeight: '700' },
  goalIconTextSelected: { color: '#FFFFFF' },
  goalText: { flex: 1, marginLeft: 14 },
  goalName: { color: '#22252C', fontSize: 16, fontWeight: '800' },
  goalDescription: { color: '#747984', fontSize: 13, fontWeight: '500', marginTop: 3 },
  radio: { alignItems: 'center', borderColor: '#C6CAC3', borderRadius: 99, borderWidth: 1.5, height: 20, justifyContent: 'center', width: 20 },
  radioSelected: { borderColor: '#75AC36' }, radioDot: { backgroundColor: '#75AC36', borderRadius: 99, height: 10, width: 10 },
  footer: { alignItems: 'center', borderTopColor: '#E9EAE6', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 17 },
  backText: { color: '#636975', fontSize: 15, fontWeight: '800' },
  primaryButton: { alignItems: 'center', backgroundColor: '#78B63A', borderRadius: 13, justifyContent: 'center', minHeight: 52, paddingHorizontal: 25 },
  primaryButtonDisabled: { backgroundColor: '#C5D7B1' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  completePage: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 32 },
  completeIcon: { alignItems: 'center', backgroundColor: '#8BC34A', borderRadius: 99, height: 74, justifyContent: 'center', width: 74 },
  completeIconText: { color: 'white', fontSize: 38, fontWeight: '800' },
  completeTitle: { color: '#181B22', fontSize: 31, fontWeight: '800', letterSpacing: -0.8, marginTop: 28, textAlign: 'center' },
  completeCopy: { color: '#686D78', fontSize: 16, lineHeight: 24, marginTop: 12, textAlign: 'center' },
});
