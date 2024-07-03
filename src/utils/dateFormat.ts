export const formatDate = (date: Date) => {
  const formattableDate = new Date(date);
  let options;
  options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  };

  const locale = navigator.language;

  const formattedDateTime = new Intl.DateTimeFormat(
    locale,
    options as any
  ).format(formattableDate);
  return formattedDateTime;
};
