// Function to get charm color based on its name
export function getCharmColor(charmName: string) {
  // Get the first character code to determine category
  const charCode = charmName.charCodeAt(0)

  // Default values
  let colorClass = "from-pink-200 to-pink-400"
  let lightColor = "#f8bbd0" // pink-200
  let darkColor = "#ec407a" // pink-400
  let category = "Relationships"

  // Assign colors based on character code modulo 5
  if (charCode % 5 === 0) {
    colorClass = "from-green-200 to-green-400"
    lightColor = "#c8e6c9" // green-200
    darkColor = "#66bb6a" // green-400
    category = "Growth"
  } else if (charCode % 5 === 1) {
    colorClass = "from-red-200 to-red-400"
    lightColor = "#ffcdd2" // red-200
    darkColor = "#ef5350" // red-400
    category = "Challenges"
  } else if (charCode % 5 === 2) {
    colorClass = "from-blue-200 to-blue-400"
    lightColor = "#bbdefb" // blue-200
    darkColor = "#42a5f5" // blue-400
    category = "Opportunities"
  } else if (charCode % 5 === 3) {
    colorClass = "from-purple-200 to-purple-400"
    lightColor = "#e1bee7" // purple-200
    darkColor = "#ab47bc" // purple-400
    category = "Transitions"
  } else if (charCode % 5 === 4) {
    colorClass = "from-yellow-200 to-yellow-400"
    lightColor = "#fff9c4" // yellow-200
    darkColor = "#ffee58" // yellow-400
    category = "Insights"
  }

  return { colorClass, lightColor, darkColor, category }
}

