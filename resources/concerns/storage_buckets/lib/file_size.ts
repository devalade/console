function floorToTwoDecimals(num: number) {
  return Math.floor(num * 100) / 100
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return floorToTwoDecimals(size / 1024) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return floorToTwoDecimals(size / (1024 * 1024)) + 'MB'
  } else {
    return floorToTwoDecimals(size / (1024 * 1024 * 1024)) + 'GB'
  }
}
