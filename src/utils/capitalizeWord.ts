export const capitalizeWord = (word: string | undefined) => {
  if (word === undefined || word.length === 0) {
    return word
  }
  return word.charAt(0).toUpperCase() + word.slice(1)
}
