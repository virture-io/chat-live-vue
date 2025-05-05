export const get_utm = (url) => {
  const source = localStorage.getItem("utm_source");
  const medium = localStorage.getItem("utm_medium");
  const newUrl = new URL(url);
  const searchParams = newUrl.searchParams;

  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");

  if (!source) {
    localStorage.setItem("utm_source", utmSource);
  }

  if (!medium) {
    localStorage.setItem("utm_medium", utmMedium);
  }
};
