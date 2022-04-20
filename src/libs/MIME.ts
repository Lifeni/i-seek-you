export const formatMIME = (mime: string, name: string) => {
  const ext = name.split('.').pop()
  const unknown = ext ? ext.toUpperCase() : 'File'
  if (!mime) return unknown

  const prefix = mime.split('/')[0]
  const type = mime.split('/')[1]

  const firstLetter = ([first, ...rest]: string) =>
    first.toUpperCase() + rest.join('').toLowerCase()

  switch (prefix) {
    case 'image':
    case 'video':
    case 'audio':
    case 'font': {
      switch (type) {
        case 'svg+xml': {
          return 'SVG'
        }
        case 'vnd.microsoft.icon': {
          return 'ICO'
        }
        default: {
          return `${firstLetter(prefix)}`
        }
      }
    }
    case 'text': {
      switch (type) {
        case 'plain': {
          return 'Text'
        }

        case 'x-javascript':
        case 'javascript': {
          return 'JavaScript'
        }

        default: {
          return `${type.toUpperCase()}`
        }
      }
    }
    case 'application': {
      switch (type) {
        case 'msword':
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document': {
          return 'Microsoft Word'
        }

        case 'vnd.ms-excel':
        case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          return 'Microsoft Excel'
        }

        case 'vnd.ms-powerpoint':
        case 'vnd.openxmlformats-officedocument.presentationml.presentation': {
          return 'Microsoft Powerpoint'
        }

        case 'vnd.rar': {
          return 'RAR'
        }

        case 'x-javascript': {
          return 'JavaScript'
        }

        case 'x-7z-compressed': {
          return '7Zip'
        }

        case 'gzip':
        case 'pdf':
        case 'zip':
        case 'json': {
          return `${type.toUpperCase()}`
        }
        default: {
          return unknown
        }
      }
    }
    default: {
      return unknown
    }
  }
}
