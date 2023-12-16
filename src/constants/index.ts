export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Criar Evento',
    route: '/events/create',
  },
  {
    label: 'Meu perfil',
    route: '/profile',
  },
];

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
};
