export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.response?.data) {
    const { data } = error.response;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0].msg || data.errors[0].message || fallback;
    }
  }

  if (error?.code === "ERR_NETWORK") {
    return "Network error: please check your internet connection";
  }

  if (error?.message) {
    if (error.message.includes("CORS")) {
      return "Request blocked by CORS configuration. Please contact support.";
    }
    if (error.message.includes("Network")) {
      return "Network error: please try again later";
    }
    return error.message;
  }

  return fallback;
}

export default getErrorMessage;
