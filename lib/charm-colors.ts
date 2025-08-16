// Function to get a consistent color for each charm based on its name
export function getCharmColor(charmName: string): string {
  // Use the first character code to determine color consistently
  const charCode = charmName.charCodeAt(0)

  // Assign colors based on character code modulo for consistency
  if (charCode % 6 === 0) {
    return "#7c3aed" // Purple
  } else if (charCode % 6 === 1) {
    return "#ec4899" // Pink
  } else if (charCode % 6 === 2) {
    return "#10b981" // Green
  } else if (charCode % 6 === 3) {
    return "#3b82f6" // Blue
  } else if (charCode % 6 === 4) {
    return "#f59e0b" // Yellow
  } else {
    return "#ef4444" // Red
  }
}
