import { CountryData } from "./types";

const calculateTotalLength = (periods: { from: string; to: string }[]) => {
  return periods.reduce((sum, period) => {
    const fromDate = new Date(period.from);
    const toDate = new Date(period.to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);
};

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

const saturateColor = (color: string) => {
  const rgb = hexToRgb(color);
  if (rgb) {
    const saturatedRgb = `rgba(${Math.round(rgb.r * 0.8)}, ${Math.round(rgb.g * 0.8)}, ${Math.round(rgb.b * 0.8)}, 1)`;
    return saturatedRgb;
  }
  return color;
};


const getIsoA2 = (country: CountryData | null) => {
  if (!country) return ''
  return country.properties.iso_a2 === '-99' ? country.properties.postal : country.properties.iso_a2;
};

export { calculateTotalLength, saturateColor, getIsoA2 }