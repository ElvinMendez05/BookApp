export function GetHome(req, res, next) {
  res.render("home/home", { "page-title": "Home" });
}