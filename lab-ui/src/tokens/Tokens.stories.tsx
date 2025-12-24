import type { Meta, StoryObj } from '@storybook/react';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { borders } from './borders';

const meta: Meta = {
  title: 'Design Tokens',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Color Palette</h1>
          <p className="text-neutral-400">Design system color tokens</p>
        </div>
        
        {Object.entries(colors).map(([colorName, colorPalette]) => {
          // text, background, border, dark는 다른 구조
          if (colorName === 'text' || colorName === 'background' || colorName === 'border' || colorName === 'dark') {
            return (
              <div key={colorName} className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
                <h2 className="text-2xl font-bold text-neutral-50 capitalize mb-6">{colorName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(colorPalette).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                      // dark.text, dark.background, dark.border 같은 중첩 구조
                      return (
                        <div key={key} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                          <h3 className="text-sm font-semibold text-neutral-300 capitalize mb-3">{key}</h3>
                          <div className="space-y-2">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="flex items-center justify-between">
                                <span className="text-xs text-neutral-400 capitalize">{subKey}</span>
                                <div className="flex items-center gap-2">
                                  {typeof subValue === 'string' && subValue.startsWith('#') && (
                                    <div
                                      className="w-6 h-6 rounded border border-neutral-700"
                                      style={{ backgroundColor: subValue }}
                                    />
                                  )}
                                  <span className="text-xs text-neutral-300 font-mono">{String(subValue)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={key} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-300 capitalize">{key}</span>
                          <div className="flex items-center gap-2">
                            {typeof value === 'string' && value.startsWith('#') && (
                              <div
                                className="w-6 h-6 rounded border border-neutral-700"
                                style={{ backgroundColor: value }}
                              />
                            )}
                            <span className="text-xs text-neutral-300 font-mono">{String(value)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          
          // 일반 색상 팔레트 (primary, secondary 등)
          return (
            <div key={colorName} className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
              <h2 className="text-2xl font-bold text-neutral-50 capitalize mb-6">{colorName}</h2>
              <div className="grid grid-cols-11 gap-3">
                {Object.entries(colorPalette).map(([shade, value]) => {
                  const isLight = parseInt(shade) <= 300;
                  return (
                    <div key={shade} className="space-y-2">
                      <div
                        className="w-full aspect-square rounded-lg border-2 shadow-lg transition-transform hover:scale-105"
                        style={{ 
                          backgroundColor: String(value),
                          borderColor: isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                        }}
                      />
                      <div className="text-xs font-semibold text-neutral-200 text-center">{shade}</div>
                      <div className="text-[10px] text-neutral-400 text-center font-mono bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                        {String(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Typography</h1>
          <p className="text-neutral-400">Font families, sizes, weights, and spacing</p>
        </div>

        {/* Font Family */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Font Family</h3>
          <div className="space-y-6">
            {Object.entries(typography.fontFamily).map(([name, fonts]) => (
              <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                <div className="text-sm font-semibold text-neutral-300 capitalize mb-3">{name}</div>
                <div
                  className="text-2xl text-neutral-50 mb-3"
                  style={{ fontFamily: fonts.join(', ') }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
                <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-2 rounded border border-neutral-800">
                  {fonts.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Font Size</h3>
          <div className="space-y-6">
            {Object.entries(typography.fontSize).map(([name, value]) => {
              const [size, config] = Array.isArray(value) ? value : [value, null];
              return (
                <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-neutral-300">{name}</div>
                    <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
                      {size} {config?.lineHeight && `/ ${config.lineHeight}`}
                    </div>
                  </div>
                  <div
                    className="text-neutral-50"
                    style={{
                      fontSize: size,
                      lineHeight: config?.lineHeight || 'normal',
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Font Weight */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Font Weight</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(typography.fontWeight).map(([name, value]) => (
              <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                <div className="text-sm font-semibold text-neutral-300 capitalize mb-3">{name}</div>
                <div className="text-2xl text-neutral-50 mb-3" style={{ fontWeight: value }}>
                  The quick brown fox
                </div>
                <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Letter Spacing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(typography.letterSpacing).map(([name, value]) => (
              <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                <div className="text-sm font-semibold text-neutral-300 capitalize mb-3">{name}</div>
                <div className="text-xl text-neutral-50 mb-3" style={{ letterSpacing: value }}>
                  The quick brown fox jumps over the lazy dog
                </div>
                <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Line Height</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(typography.lineHeight).map(([name, value]) => (
              <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                <div className="text-sm font-semibold text-neutral-300 capitalize mb-3">{name}</div>
                <div
                  className="text-base text-neutral-50 mb-3 max-w-md"
                  style={{ lineHeight: value }}
                >
                  The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
                </div>
                <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Spacing Scale</h1>
          <p className="text-neutral-400">Consistent spacing values for layout and components</p>
        </div>
        
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <div className="space-y-4">
            {Object.entries(spacing).map(([name, value]) => (
              <div key={name} className="flex items-center gap-6 bg-neutral-950 p-5 rounded-lg border border-neutral-800">
                <div className="text-sm font-semibold text-neutral-200 w-24">{name}</div>
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="bg-primary-500 rounded shadow-lg transition-transform hover:scale-110"
                    style={{ width: value, height: value, minWidth: '12px', minHeight: '12px' }}
                  />
                  <div className="text-sm text-neutral-300 font-mono bg-neutral-900 px-4 py-2 rounded border border-neutral-800">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Box Shadows</h1>
          <p className="text-neutral-400">Elevation and depth through shadow effects</p>
        </div>
        
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(shadows).map(([name, value]) => {
              // 그림자 값에서 색상을 primary 색상으로 변경
              const shadowWithPrimaryColor = value
                .replace(/rgba?\([^)]+\)/g, (match) => {
                  // rgba 또는 rgb 값을 primary 색상의 rgba로 변환
                  const primaryRgba = 'rgba(255, 140, 26, '; // primary-500: #ff8c1a
                  // 기존 opacity 값 추출
                  const opacityMatch = match.match(/[\d.]+\)$/);
                  const opacity = opacityMatch ? opacityMatch[0].replace(')', '') : '0.2';
                  return primaryRgba + opacity + ')';
                })
                .replace(/rgb\([^)]+\)/g, (match) => {
                  // rgb 값을 primary 색상의 rgba로 변환 (기본 opacity 0.2)
                  return 'rgba(255, 140, 26, 0.2)';
                });
              
              return (
                <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <div className="text-sm font-semibold text-neutral-200 capitalize mb-4">{name}</div>
                  <div className="relative w-full h-32 mb-4">
                    <div
                      className="absolute inset-0 bg-neutral-950 rounded-lg transition-transform hover:scale-105"
                      style={{ boxShadow: shadowWithPrimaryColor }}
                    />
                  </div>
                  <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-2 rounded border border-neutral-800 break-all">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Borders: Story = {
  render: () => (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">Borders</h1>
          <p className="text-neutral-400">Border radius and width tokens</p>
        </div>

        {/* Border Radius */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Border Radius</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Object.entries(borders.radius).map(([name, value]) => (
              <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                <div className="text-sm font-semibold text-neutral-200 capitalize mb-4">{name}</div>
                <div
                  className="w-full h-24 bg-primary-500 rounded-lg shadow-lg mb-4 transition-transform hover:scale-105"
                  style={{ borderRadius: value }}
                />
                <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-2 rounded border border-neutral-800">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Border Width */}
        <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-50 mb-6">Border Width</h3>
          <div className="space-y-4">
            {Object.entries(borders.width).map(([name, value]) => (
              <div key={name} className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-neutral-200 capitalize">{name}</div>
                  <div className="text-xs text-neutral-400 font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
                    {value}
                  </div>
                </div>
                <div
                  className="w-full h-20 bg-neutral-900 border border-neutral-100 rounded-lg"
                  style={{ borderWidth: value }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
