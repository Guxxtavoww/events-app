export const formatPrice = (price: string) => {
  const amount = parseFloat(price);

  const formattedPrice = new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

  return formattedPrice;
};
