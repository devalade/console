export default function getInitials(value: string): string {
  const splittedFullName: string[] = value.split(' ')

  return (
    splittedFullName[0].charAt(0).toUpperCase() +
    (splittedFullName.length > 1 ? splittedFullName[1].charAt(0).toUpperCase() : '')
  )
}
