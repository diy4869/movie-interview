export function showTotal(total: number, range: number[]) {
  const [start, end] = range

  return `总共 ${total} 件, 当前 ${start} ～ ${end} 件`
}
