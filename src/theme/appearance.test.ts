import { resolveColorScheme } from './appearance';
import { AppThemes } from './palettes';

describe('appearance selection', () => {
  it('follows the current device scheme in system mode', () => {
    expect(resolveColorScheme('system', 'light')).toBe('light');
    expect(resolveColorScheme('system', 'dark')).toBe('dark');
    expect(resolveColorScheme('system', null)).toBe('light');
  });

  it('keeps an explicit selection when the system changes', () => {
    expect(resolveColorScheme('light', 'dark')).toBe('light');
    expect(resolveColorScheme('dark', 'light')).toBe('dark');
  });

  it.each(['light', 'dark'] as const)('%s palette keeps body, secondary, placeholder, and action text readable', (scheme) => {
    const colors = AppThemes[scheme].SemanticColors;
    const pairs = [
      [colors.textPrimary, colors.card],
      [colors.textSecondary, colors.card],
      [colors.textMuted, colors.recessed],
      [colors.textMuted, colors.cardHighest],
      [colors.actionText, colors.action],
      [colors.actionSoft, colors.card],
      [colors.danger, AppThemes[scheme].DesignColors.errorContainer],
    ];
    for (const [foreground, background] of pairs) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

function contrast(a: string, b: string) {
  const values = [a, b].map((hex) => {
    const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
    return channels.reduce((total, channel, index) => total + (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][index], 0);
  }).sort((left, right) => left - right);
  return (values[1] + 0.05) / (values[0] + 0.05);
}
