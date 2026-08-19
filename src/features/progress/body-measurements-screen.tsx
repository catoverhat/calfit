import { styles } from './body-measurements-screen.styles';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Header } from '@/components/layout/header';
import { TabScreen } from '@/components/layout/tab-screen';
import { MOCK_USER } from '@/fixtures/mock-data';
import { SemanticColors } from '@/theme/tokens';
import {
  BodyMeasurementForm,
  BodyMeasurementHistory,
  type HistoryMeasurement,
} from './components/body-measurement-sections';
import { LinePlot, type LineSegment } from './components/line-plot';

const trendSegments = [
  { left: '7%', top: '59%', width: 54, rotate: '-10deg' },
  { left: '24%', top: '50%', width: 58, rotate: '-13deg' },
  { left: '42%', top: '43%', width: 58, rotate: '-5deg' },
  { left: '60%', top: '45%', width: 54, rotate: '10deg' },
  { left: '75%', top: '53%', width: 42, rotate: '-2deg' },
  { left: '86%', top: '47%', width: 48, rotate: '-27deg' },
] satisfies LineSegment[];

const initialMeasurements = [
  { bmi: '23.8', bodyFat: '14.2%', date: 'Oct 24, 2023', weight: '82.8 kg' },
  { bmi: '23.5', bodyFat: '14.5%', date: 'Oct 17, 2023', weight: '83.5 kg' },
  { bmi: '23.2', bodyFat: '14.4%', date: 'Oct 10, 2023', weight: '83.2 kg' },
] satisfies HistoryMeasurement[];

export function BodyMeasurementsScreen() {
  const [date, setDate] = useState('10/27/2023');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [history, setHistory] = useState<HistoryMeasurement[]>(initialMeasurements);

  const addMeasurement = () => {
    setHistory((current) => [
      {
        bmi: bmi || '0.0',
        bodyFat: bodyFat ? `${bodyFat}%` : '0.0%',
        date: date || 'Today',
        weight: weight ? `${weight} kg` : '0.0 kg',
      },
      ...current,
    ]);
    setWeight('');
    setBmi('');
    setBodyFat('');
  };

  return (
    <TabScreen
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Header
          actionAccessibilityLabel="Sync body measurements"
          actionIcon="cloud"
          actionIconColor={SemanticColors.actionSoft}
          avatarUrl={MOCK_USER.avatarUrl}
          onNotificationsPress={() => router.push('/progress/sync' as Href)}
          profileName={MOCK_USER.name}
        />

        <View style={styles.trendBlock}>
          <View style={styles.trendHeader}>
            <View>
              <Text style={styles.label}>Weight Trend</Text>
              <View style={styles.weightRow}>
                <Text style={styles.weightValue}>82.4</Text>
                <Text style={styles.weightUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.deltaPill}>
              <Text style={styles.deltaText}>-1.2 kg this month</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <LinePlot segments={trendSegments} style={styles.trendPlot} />
            <View style={styles.highlightPoint} />
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>Week 1</Text>
              <Text style={styles.chartLabel}>Week 2</Text>
              <Text style={styles.chartLabel}>Week 3</Text>
              <Text style={styles.chartLabel}>Today</Text>
            </View>
          </View>
        </View>

        <BodyMeasurementForm
          bmi={bmi}
          bodyFat={bodyFat}
          date={date}
          onAdd={addMeasurement}
          onBmiChange={setBmi}
          onBodyFatChange={setBodyFat}
          onDateChange={setDate}
          onWeightChange={setWeight}
          weight={weight}
        />
        <BodyMeasurementHistory history={history} />
      </View>
    </TabScreen>
  );
}
