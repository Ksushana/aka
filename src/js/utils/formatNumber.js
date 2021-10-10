export function formatThousands(num, separator = ' ') {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
}

export default formatThousands;
