export default function isAuthForLogin(req, res, next) {
  if (req.session.isAuthenticated) {
    res.redirect("/home"); // Redirect to the home page
  }

  next(); // If the user is authenticated, proceed to the next middleware or route handler
}
