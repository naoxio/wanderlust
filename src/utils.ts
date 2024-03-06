export const calculateTotalLength = (periods: { from: string; to: string }[]) => {
  return periods.reduce((sum, period) => {
    const fromDate = new Date(period.from);
    const toDate = new Date(period.to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);
};