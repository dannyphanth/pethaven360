const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
})
export const decimalToPercentage = (n) => {
    if(n === 0) return '0%'
    return `${formatter.format(Math.abs(n * 100))}%`;
}

export const numberFormatter = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}