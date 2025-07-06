import { ref } from "vue";

const sessionInfo = ref({
  browser: "Unknown",
  browserVersion: "Unknown",
  os: "Unknown",
  deviceType: "Unknown",
  screenWidth: 0,
  screenHeight: 0,
  userAgent: "",
  clientLocation: {
    country: "Unknown",
    city: "Unknown",
    region: "Unknown",
    latitude: null,
    longitude: null,
    timezone: "Unknown",
  },
  referrer: null,
});

export const useSessionMetrics = () => {
  const getBrowserAndOSInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    let browserName = "Unknown";
    let browserVersion = "Unknown";
    let os = "Unknown";
    let deviceType = "Unknown";

    // Detect OS
    if (userAgent.includes("Windows NT")) {
      os = "Windows";
    } else if (userAgent.includes("Mac OS X")) {
      os = "macOS";
    } else if (userAgent.includes("Linux")) {
      os = "Linux";
    } else if (userAgent.includes("Android")) {
      os = "Android";
    } else if (
      userAgent.includes("iPhone") ||
      userAgent.includes("iPad") ||
      userAgent.includes("iPod")
    ) {
      os = "iOS";
    }

    // Detect Device Type
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      deviceType = "Tablet";
    } else if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk|Opera Mini/i.test(
        userAgent
      )
    ) {
      deviceType = "Mobile";
    } else {
      deviceType = "Desktop";
    }

    // Detect Browser and Version
    if (userAgent.includes("Firefox")) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Opera") || userAgent.includes("Opr")) {
      browserName = "Opera";
      browserVersion =
        userAgent.match(/(Opera|Opr)\/([0-9.]+)/)?.[2] || "Unknown";
    } else if (userAgent.includes("Chrome")) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Safari")) {
      browserName = "Safari";
      browserVersion =
        userAgent.match(/Version\/([0-9.]+).*Safari/)?.[1] || "Unknown";
    } else if (userAgent.includes("Edge")) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      browserName = "IE";
      browserVersion =
        userAgent.match(/(MSIE |rv:)([0-9.]+)/)?.[2] || "Unknown";
    }

    return {
      browser: browserName,
      browserVersion,
      os,
      deviceType,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      userAgent,
    };
  };

  const getLocationInfo = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });

        sessionInfo.value.clientLocation.latitude = position.coords.latitude;
        sessionInfo.value.clientLocation.longitude = position.coords.longitude;

        try {
          const ipResponse = await fetch("https://ipapi.co/json/");
          const ipData = await ipResponse.json();
          sessionInfo.value.clientLocation.country =
            ipData.country_name || "Unknown";
          sessionInfo.value.clientLocation.city = ipData.city || "Unknown";
          sessionInfo.value.clientLocation.region = ipData.region || "Unknown";
          sessionInfo.value.clientLocation.timezone =
            ipData.timezone || "Unknown";
        } catch (ipError) {
          console.error(
            "Error fetching IP-based location data as fallback:",
            ipError
          );
        }
      } catch (error) {
        await fetchIPLocation();
      }
    } else {
      await fetchIPLocation();
    }
  };

  const fetchIPLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      sessionInfo.value.clientLocation = {
        country: data.country_name || "Unknown",
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        timezone: data.timezone || "Unknown",
      };
    } catch (error) {
      console.error("Error fetching IP-based location data:", error);
    }
  };

  const referrerUrl = document.referrer;
  const updateSessionInfo = async () => {
    sessionInfo.value = {
      ...getBrowserAndOSInfo(),
      clientLocation: sessionInfo.value.clientLocation,
      referrer: referrerUrl ? referrerUrl : null,
    };
  };

  // Función para solicitar ubicación manualmente
  const requestLocationPermission = async () => {
    await getLocationInfo();
  };

  updateSessionInfo();

  window.addEventListener("resize", () => {
    sessionInfo.value = {
      ...sessionInfo.value,
      ...getBrowserAndOSInfo(),
    };
  });

  return {
    sessionInfo,
    updateSessionInfo,
    requestLocationPermission,
  };
};
