let jwtDecode = require("jwt-decode");

export const updateAppSettings = (token) => {
  localStorage.clear();
  if (token) {
    localStorage.setItem("displayName", jwtDecode(token)["sub"]);
    localStorage.setItem("token", token);
  }
};

export const isMember = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return jwtDecode(token)["aud"];
  }
};

export const constructHeader = (contentType) => {
  const auth = "Bearer " + localStorage.getItem("token") || "";
  return contentType
    ? { "Content-type": contentType, Authorization: auth }
    : { Authorization: auth };
};
