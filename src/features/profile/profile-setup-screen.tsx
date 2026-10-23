import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLock } from '@/features/auth/app-lock-context';
import { AppIcon } from '@/components/ui/app-icon';
import { DesignColors, SemanticColors } from '@/theme/tokens';
import {
  CalendarIcon,
  GearIcon,
  SegmentedControl,
  SetupField,
  UnitCard,
} from './components/profile-form-controls';
import {
  ProfileHeader,
  ProfileSecuritySection,
} from './components/profile-sections';
import { styles } from './profile-setup-screen.styles';
import { useProfile } from './use-profile';

export function ProfileSetupScreen() {
  const { capability, lock } = useAppLock();
  const {
    changeHeightUnit,
    changeWeightUnit,
    draft,
    error,
    isLoading,
    isSaving,
    save,
    setField,
    success,
  } = useProfile();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.screen}>
        <View style={styles.content}>
          <ProfileHeader name={draft.username} />

          <View style={styles.heroCopy}>
            <Text style={styles.title}>Profile & Preferences</Text>
            <Text style={styles.subtitle}>
              Keep your measurements and training units accurate across the app.
            </Text>
          </View>

          <View style={styles.formStack}>
            <SetupField
              label="Username"
              onChangeText={(value) => setField('username', value)}
              placeholder="e.g. IronPulse_88"
              value={draft.username}
            />
            <SetupField
              accessory={<CalendarIcon />}
              label="Date of Birth"
              onChangeText={(value) => setField('birthDate', value)}
              placeholder="YYYY-MM-DD"
              value={draft.birthDate}
            />
            <SetupField
              accessory={
                <SegmentedControl
                  onChange={changeHeightUnit}
                  options={[
                    { label: 'cm', value: 'cm' },
                    { label: 'ft', value: 'ft' },
                  ]}
                  value={draft.heightUnit}
                />
              }
              keyboardType="decimal-pad"
              label="Height"
              onChangeText={(value) => setField('height', value)}
              placeholder={draft.heightUnit === 'cm' ? '180' : '5.11'}
              value={draft.height}
            />
            <SetupField
              accessory={
                <SegmentedControl
                  onChange={changeWeightUnit}
                  options={[
                    { label: 'kg', value: 'kg' },
                    { label: 'lb', value: 'lb' },
                  ]}
                  value={draft.weightUnit}
                />
              }
              keyboardType="numeric"
              label="Current Weight"
              onChangeText={(value) => setField('weight', value)}
              placeholder={draft.weightUnit === 'kg' ? '85.5' : '188.5'}
              value={draft.weight}
            />
          </View>

          <View style={styles.sectionHeader}>
            <GearIcon />
            <Text style={styles.sectionTitle}>Performance Units</Text>
          </View>

          <View style={styles.unitStack}>
            <UnitCard
              label="Preferred Speed Unit"
              onChange={(value) => setField('speedUnit', value)}
              options={[
                { label: 'km/h', value: 'kmh' },
                { label: 'mph', value: 'mph' },
              ]}
              value={draft.speedUnit}
            />
            <UnitCard
              label="Preferred Distance Unit"
              onChange={(value) => setField('distanceUnit', value)}
              options={[
                { label: 'km', value: 'km' },
                { label: 'mi', value: 'mi' },
              ]}
              value={draft.distanceUnit}
            />
          </View>

          {isLoading ? <ActivityIndicator color={SemanticColors.action} /> : null}
          {error ? <Text selectable style={styles.feedbackError}>{error}</Text> : null}
          {success ? <Text accessibilityRole="alert" style={styles.feedbackSuccess}>{success}</Text> : null}

          <Pressable
            accessibilityLabel="Save Profile"
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading || isSaving }}
            disabled={isLoading || isSaving}
            onPress={save}
            style={({ pressed }) => [
              styles.saveButton,
              (isLoading || isSaving) && styles.saveButtonDisabled,
              pressed && !isLoading && !isSaving && styles.saveButtonPressed,
            ]}>
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving…' : 'Save Profile'}</Text>
            <AppIcon color={DesignColors.onPrimaryContainer} name="save" size={18} />
          </Pressable>

          <ProfileSecuritySection isWebSession={capability.kind === 'web'} onLock={lock} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
