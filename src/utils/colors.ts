export const getScoreRatingBackgroundColor = (score_rating: string) => {
  if (score_rating === "Needs Improvement") {
    return "bg-customRed-500"
  }
  if (score_rating === "Fair") {
    return "bg-customOrange-500"
  }
  if (score_rating === "Satisfactory") {
    return "bg-customYellow-500"
  }
  if (score_rating === "Good") {
    return "bg-customLightGreen-500"
  }
  if (score_rating === "Excellent") {
    return "bg-customGreen-500"
  }
}

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}
