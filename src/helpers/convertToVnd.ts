export const convertToVnd = (amount: number): string => {
  const roundedAmount = Math.floor(amount)
  return roundedAmount.toLocaleString("vi-VN") + " ₫"
}
