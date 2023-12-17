export const formatPrice = (price: string) => {
  const amount = parseFloat(price);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return formattedPrice;
};
