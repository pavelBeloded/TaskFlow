export function getColorFromName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    '#534ab7', // purple
    '#1d9e75', // teal
    '#d85a30', // coral
    '#378add', // blue
    '#ef9f27', // amber
    '#888780', // gray
  ]
  return colors[Math.abs(hash) % colors.length]
}
