export const formatPrice = (price: string | null) => {
  if (!price) return 'Não informado'

  const amount = parseFloat(price);

  const formattedPrice = new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

  return formattedPrice;
};
