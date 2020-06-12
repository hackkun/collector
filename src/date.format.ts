/**
 * 时间格式化字符串
 * @param date
 * @param formatType
 */
export const dateFormat = (
  date: Date,
  formatType: string = 'yyyy-MM-dd hh:mm:ss'
): string => {
  if (/(y+)/.test(formatType)) {
    formatType = formatType.replace(
      RegExp.$1,
      (date.getFullYear() + '').substring(4 - RegExp.$1.length)
    )
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(formatType)) {
      formatType = formatType.replace(RegExp.$1, lessThanTen(o[k]))
    }
  }

  return formatType
}

/**
 * 补0
 * @param num
 */
function lessThanTen(num: number): string {
  return num < 10 ? '0' + num : num + ''
}
