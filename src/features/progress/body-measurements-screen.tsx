import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BodyMeasurementForm, BodyMeasurementHistory } from './components/body-measurement-sections';
import { LinePlot } from './components/line-plot';
import { todayDateInput } from './progress.viewmodel';
import { useStyles } from './body-measurements-screen.styles';
import { useBodyMeasurements } from './use-body-measurements';

export function BodyMeasurementsScreen() {
  const styles = useStyles();
  const { addMeasurement, error, heightCm, history, isLoading, isSaving, latestWeight, trendSegments, weightUnit } = useBodyMeasurements();
  const [date, setDate] = useState(todayDateInput);
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const handleAdd = async () => {
    const saved = await addMeasurement({ bmi, bodyFat, date, weight });
    if (saved) {
      setWeight('');
      setBmi('');
      setBodyFat('');
    }
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.trendBlock}>
          <View style={styles.trendHeader}>
            <View><Text style={styles.label}>Weight trend</Text><View style={styles.weightRow}><Text style={styles.weightValue}>{latestWeight}</Text>{latestWeight !== '—' ? <Text style={styles.weightUnit}>{weightUnit}</Text> : null}</View></View>
          </View>
          <View style={styles.chartCard}>
            {trendSegments.length > 0 ? <LinePlot segments={trendSegments} style={styles.trendPlot} /> : <Text style={styles.emptyText}>Add at least two weight measurements to see a trend.</Text>}
          </View>
        </View>
        {isLoading ? <View style={styles.statusCard}><Text style={styles.statusTitle}>Loading measurements</Text><Text style={styles.emptyText}>Reading local measurement history.</Text></View> : null}
        <BodyMeasurementForm bmi={bmi} bodyFat={bodyFat} date={date} disabled={isLoading || isSaving} error={error} heightCm={heightCm} isSaving={isSaving} onAdd={handleAdd} onBmiChange={setBmi} onBodyFatChange={setBodyFat} onDateChange={setDate} onWeightChange={setWeight} weight={weight} weightUnit={weightUnit} />
        <BodyMeasurementHistory history={history} />
      </View>
    </ScrollView>
  );
}
