import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_USER } from '@/constants/mock-data';
import { Fonts, MaxContentWidth, Palette, Spacing, Typography } from '@/constants/theme';

const launchImage = require('@/assets/images/login-runner-bg.png');

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

type SetupFieldProps = {
  accessory?: React.ReactNode;
  keyboardType?: 'default' | 'numeric';
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};

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
          <View style={styles.brandBar}>
            <View style={styles.brandLeft}>
              <Image
                accessibilityLabel={`${MOCK_USER.name}'s profile photo`}
                contentFit="cover"
                source={MOCK_USER.avatarUrl}
                style={styles.avatar}
              />
              <Text style={styles.brandName}>Kinetic Pulse</Text>
            </View>
            <View accessibilityElementsHidden style={styles.cloudIcon}>
              <View style={styles.cloudDomeLarge} />
              <View style={styles.cloudDomeSmall} />
              <View style={styles.cloudBase} />
            </View>
          </View>

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

          <View style={styles.launchCard}>
            <Image
              accessibilityLabel="Runner ready to launch"
              contentFit="cover"
              contentPosition="center"
              source={launchImage}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.launchOverlay} />
            <View style={styles.launchBadge}>
              <View style={styles.launchDot} />
              <Text style={styles.launchText}>READY TO LAUNCH</Text>
            </View>
          </View>

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

function SetupField({
  accessory,
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  value,
}: SetupFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldRow}>
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.14)"
          selectionColor={Palette.primary[500]}
          style={styles.input}
          value={value}
        />
        {accessory ? <View style={styles.fieldAccessory}>{accessory}</View> : null}
      </View>
    </View>
  );
}

function UnitCard<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
}) {
  return (
    <View style={styles.unitCard}>
      <Text style={styles.unitLabel}>{label}</Text>
      <SegmentedControl onChange={onChange} options={options} value={value} variant="wide" />
    </View>
  );
}

function SegmentedControl<T extends string>({
  onChange,
  options,
  value,
  variant = 'compact',
}: {
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  value: T;
  variant?: 'compact' | 'wide';
}) {
  return (
    <View style={[styles.segmented, variant === 'wide' && styles.segmentedWide]}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityLabel={`Select ${option.label}`}
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              variant === 'wide' && styles.segmentWide,
              selected && styles.segmentSelected,
              pressed && styles.segmentPressed,
            ]}>
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function CalendarIcon() {
  return (
    <View accessibilityElementsHidden style={styles.calendarIcon}>
      <View style={styles.calendarTop} />
      <View style={styles.calendarBody} />
    </View>
  );
}

function GearIcon() {
  return (
    <View accessibilityElementsHidden style={styles.gearIcon}>
      <Text style={styles.gearText}>*</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.secondary[950],
    flex: 1,
  },
  screen: {
    backgroundColor: Palette.secondary[950],
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 104,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  content: {
    gap: Spacing.three,
    maxWidth: Math.min(MaxContentWidth, 430),
    width: '100%',
  },
  brandBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(13, 14, 18, 0.96)',
    borderColor: Palette.secondary[800],
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: Spacing.two,
  },
  brandLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  avatar: {
    borderColor: Palette.primary[700],
    borderRadius: 19,
    borderWidth: 1,
    height: 38,
    width: 38,
  },
  brandName: {
    ...Typography.lg,
    color: Palette.white,
    fontFamily: Fonts.heading,
  },
  cloudIcon: {
    height: 20,
    width: 24,
  },
  cloudDomeLarge: {
    borderColor: Palette.primary[500],
    borderRadius: 7,
    borderWidth: 1.8,
    height: 13,
    left: 5,
    position: 'absolute',
    top: 4,
    width: 14,
  },
  cloudDomeSmall: {
    borderColor: Palette.primary[500],
    borderRadius: 5,
    borderWidth: 1.8,
    height: 9,
    left: 2,
    position: 'absolute',
    top: 8,
    width: 10,
  },
  cloudBase: {
    backgroundColor: Palette.secondary[950],
    borderBottomColor: Palette.primary[500],
    borderBottomWidth: 1.8,
    borderLeftColor: Palette.primary[500],
    borderLeftWidth: 1.8,
    borderRightColor: Palette.primary[500],
    borderRightWidth: 1.8,
    borderRadius: 5,
    bottom: 3,
    height: 8,
    left: 2,
    position: 'absolute',
    width: 20,
  },
  heroCopy: {
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  title: {
    ...Typography['3xl'],
    color: Palette.white,
    fontFamily: Fonts.heading,
    lineHeight: 34,
  },
  subtitle: {
    ...Typography.sm,
    color: Palette.neutral[100],
    fontFamily: Fonts.bodyMedium,
  },
  formStack: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  field: {
    backgroundColor: '#1F1D1D',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    gap: 3,
    minHeight: 70,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  fieldLabel: {
    color: Palette.primary[400],
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  fieldRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    ...Typography.base,
    color: Palette.white,
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    minHeight: 30,
    padding: 0,
  },
  fieldAccessory: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    height: 18,
    width: 18,
  },
  calendarTop: {
    borderColor: Palette.white,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 1.5,
    height: 6,
    left: 3,
    position: 'absolute',
    top: 3,
    width: 12,
  },
  calendarBody: {
    borderBottomColor: Palette.white,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomWidth: 1.5,
    borderLeftColor: Palette.white,
    borderLeftWidth: 1.5,
    borderRightColor: Palette.white,
    borderRightWidth: 1.5,
    height: 10,
    left: 3,
    position: 'absolute',
    top: 7,
    width: 12,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  gearIcon: {
    alignItems: 'center',
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  gearText: {
    color: Palette.primary[500],
    fontFamily: Fonts.bodyBold,
    fontSize: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    ...Typography.sm,
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
  },
  unitStack: {
    gap: Spacing.two,
  },
  unitCard: {
    backgroundColor: '#1F1D1D',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  unitLabel: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
  },
  segmented: {
    backgroundColor: '#171616',
    borderColor: '#343131',
    borderCurve: 'continuous',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  segmentedWide: {
    alignSelf: 'stretch',
  },
  segment: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 5,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 45,
    paddingHorizontal: Spacing.two,
  },
  segmentWide: {
    flex: 1,
    minHeight: 42,
  },
  segmentSelected: {
    backgroundColor: Palette.primary[500],
  },
  segmentPressed: {
    opacity: 0.72,
  },
  segmentText: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
  },
  segmentTextSelected: {
    color: Palette.secondary[950],
  },
  launchCard: {
    backgroundColor: Palette.secondary[900],
    borderColor: Palette.secondary[800],
    borderCurve: 'continuous',
    borderRadius: 10,
    borderWidth: 1,
    height: 164,
    justifyContent: 'flex-end',
    marginTop: Spacing.one,
    overflow: 'hidden',
    padding: Spacing.three,
  },
  launchOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  launchBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  launchDot: {
    backgroundColor: Palette.primary[500],
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  launchText: {
    color: Palette.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary[500],
    borderCurve: 'continuous',
    borderRadius: 9,
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: Spacing.three,
  },
  saveButtonPressed: {
    backgroundColor: Palette.primary[600],
    transform: [{ scale: 0.99 }],
  },
  saveButtonText: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
  },
  saveArrow: {
    color: Palette.secondary[950],
    fontFamily: Fonts.bodyBold,
    fontSize: 18,
    lineHeight: 22,
  },
});
