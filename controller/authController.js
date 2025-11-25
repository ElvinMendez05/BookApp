export function GetLogin(req, res, next) {
  res.render("auth/login", {
    "page-title": "Login",
    layout: "anonymous-layout",
  });
}
