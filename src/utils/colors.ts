// utils/colors.ts
export const COUNTRY_VISITED = '#8BC34A';
export const COUNTRY_LIVED = '#FFC107';
export const COUNTRY_WANT = '#9C27B0';
export const COUNTRY_DEFAULT = '#F5F5F5';
export const GLOBE_COLOR = '#0B3954';
export const POLYGON_SIDE_COLOR = '#091732';



const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const saturateColor = (color: string) => {
  const rgb = hexToRgb(color);
  if (rgb) {
    const saturatedRgb = `rgba(${Math.round(rgb.r * 0.8)}, ${Math.round(rgb.g * 0.8)}, ${Math.round(rgb.b * 0.8)}, 1)`;
    return saturatedRgb;
  }
  return color;
};
