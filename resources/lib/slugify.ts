export default function slugify(str: string): string {
  return str.toLowerCase().split(' ').join('-')
}
