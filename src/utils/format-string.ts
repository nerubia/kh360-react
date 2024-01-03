export function formatString(inputString: string | undefined, maxLength: number): string {
  if (inputString == null) {
    return ""
  }
  return inputString.length > maxLength
    ? inputString.substring(0, maxLength - 3) + "..."
    : inputString
}
