export function generateTimerValues() {
  return Array.from({ length: 24 }, (_, index) => ({
    value: `${String(index).padStart(2, "0")}:00-${String(index + 1 === 24 ? 0 : index + 1).padStart(2, "0")}:00`,
    label: `${String(index).padStart(2, "0")}:00 - ${String(index + 1 === 24 ? 0 : index + 1).padStart(2, "0")}:00`,
  }));
}
