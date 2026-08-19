import { styles } from './profile-setup-screen.styles';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CalendarIcon,
  GearIcon,
  SegmentedControl,
  SetupField,
  UnitCard,
} from './components/profile-form-controls';
import { ProfileHeader, ProfileLaunchCard } from './components/profile-sections';

export function ProfileSetupScreen() {
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [speedUnit, setSpeedUnit] = useState<'km/h' | 'mph'>('km/h');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');

  const saveProfile = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.screen}>
        <View style={styles.content}>
          <ProfileHeader />

          <View style={styles.heroCopy}>
            <Text style={styles.title}>Set up your profile</Text>
            <Text style={styles.subtitle}>
              Complete your details to personalize your performance metrics and training plans.
            </Text>
          </View>

          <View style={styles.formStack}>
            <SetupField
              label="Username"
              onChangeText={setUsername}
              placeholder="e.g. IronPulse_88"
              value={username}
            />
            <SetupField
              accessory={<CalendarIcon />}
              label="Date of Birth"
              onChangeText={setBirthDate}
              placeholder="mm/dd/yyyy"
              value={birthDate}
            />
            <SetupField
              accessory={
                <SegmentedControl
                  onChange={setHeightUnit}
                  options={[
                    { label: 'cm', value: 'cm' },
                    { label: 'ft', value: 'ft' },
                  ]}
                  value={heightUnit}
                />
              }
              keyboardType="numeric"
              label="Height"
              onChangeText={setHeight}
              placeholder="180"
              value={height}
            />
            <SetupField
              accessory={
                <SegmentedControl
                  onChange={setWeightUnit}
                  options={[
                    { label: 'kg', value: 'kg' },
                    { label: 'lb', value: 'lb' },
                  ]}
                  value={weightUnit}
                />
              }
              keyboardType="numeric"
              label="Current Weight"
              onChangeText={setWeight}
              placeholder="85.5"
              value={weight}
            />
          </View>

          <View style={styles.sectionHeader}>
            <GearIcon />
            <Text style={styles.sectionTitle}>Performance Units</Text>
          </View>

          <View style={styles.unitStack}>
            <UnitCard
              label="Preferred Speed Unit"
              onChange={setSpeedUnit}
              options={[
                { label: 'km/h', value: 'km/h' },
                { label: 'mph', value: 'mph' },
              ]}
              value={speedUnit}
            />
            <UnitCard
              label="Preferred Distance Unit"
              onChange={setDistanceUnit}
              options={[
                { label: 'km', value: 'km' },
                { label: 'mi', value: 'mi' },
              ]}
              value={distanceUnit}
            />
          </View>

          <ProfileLaunchCard />

          <Pressable
            accessibilityLabel="Save Profile"
            accessibilityRole="button"
            onPress={saveProfile}
            style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
            <Text style={styles.saveArrow}>-&gt;</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
