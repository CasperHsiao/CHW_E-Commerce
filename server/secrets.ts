export const keycloak = {
  client_id: "game",
  client_secret: "Ydvh8xiTiG5saX6rcVCqk2YQWruXYR4W", // TODO
  redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
}