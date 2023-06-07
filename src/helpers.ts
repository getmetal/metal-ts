// export function sanitizeFilename(filename: string): string {
//   const splitFilename = filename.split('.')
//   const extension = splitFilename.pop()
//   const nameWithoutExtension = splitFilename.join('.')

//   const sanitized = nameWithoutExtension.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'file'

//   return `${sanitized || 'file'}.${extension}`
// }
