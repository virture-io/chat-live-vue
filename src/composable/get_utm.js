export const get_utm = (url) => {
  const newUrl = new URL(url);
  const searchParams = newUrl.searchParams;

  const paramsToCapture = [
    "utm_source",
    "utm_medium",
    "campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "wbraid",
    "gbraid",
    "crm_link",
    "adSet",
    "ad",
    "form",
    "gad_campaignid",
    "gad_source",
  ];

  for (let index = 0; index < paramsToCapture.length; index++) {
    const value = searchParams.get(paramsToCapture[index]) ?? null;
    localStorage.setItem(paramsToCapture[index], value);
  }
};
