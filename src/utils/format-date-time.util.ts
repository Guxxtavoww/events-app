export const formatDateTime = (dateString: Date | null) => {
  if (!dateString)
    return {
      dateTime: 'Não Informado',
      dateOnly: 'Não Informado',
      timeOnly: 'Não Informado',
    };

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'pt-br',
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    'pt-br',
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    'pt-br',
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
