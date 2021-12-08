const getPopularity = (num) => {
  if (num >= 0 && num <= 10) {
    return '😍'.repeat(1)
  }
  if (num > 10 && num <= 40) {
    return '😍'.repeat(2)
  }
  if (num > 40 && num <= 90) {
    return '😍'.repeat(3)
  }
  return '😍'.repeat(4)
}
export default getPopularity
