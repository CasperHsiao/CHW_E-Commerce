export const keycloak = {
  client_id: "game",
  client_secret: "2LAK8xIajJ81RFfiFmv8SglbqZ4YBY8S", // TODO
  redirect_uris: ["http://127.0.0.1:8080/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
}