export const removeWhitespace = (str: string) => {
  const trimmedString = str.trim()
  const compactString = trimmedString.replace(/\s+/g, " ")
  return compactString
}
