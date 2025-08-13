// Function to get a cosmic color based on charm name
export const getCosmicColor = (charmName: string): string => {
  // Use the first character code to determine color
  const charCode = charmName.charCodeAt(0)

  // Assign colors based on character code modulo 4
  if (charCode % 4 === 0) {
    return "var(--color-deep-purple)"
  } else if (charCode % 4 === 1) {
    return "var(--color-neon-pink)"
  } else if (charCode % 4 === 2) {
    return "var(--color-acid-green)"
  } else {
    return "var(--color-cosmic-blue)"
  }
}
