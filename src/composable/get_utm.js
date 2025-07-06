export const get_utm = (url) => {
  const newUrl = new URL(url);
  const searchParams = newUrl.searchParams;
  let utmObject = {};

  const paramsToCapture = [
    "utm_source",
    "utm_medium",
    "utm_term",
    "utm_content",
    "utm_campaign",
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

    if (value) {
      utmObject[paramsToCapture[index]] = value;
    }
  }

  localStorage.setItem("utm_obj", JSON.stringify(utmObject));
};
