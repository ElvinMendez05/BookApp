import express from "express";
import isAuthForLogin from "../middlewares/isAuthForLogin.js";
import {
  GetLogin,
  GetRegister,
  PostRegister,
  PostLogin,
  Logout,
  GetForgot,
  PostForgot,
  GetReset,
  PostReset,
  GetActivate
} from "../controller/authController.js";

const router = express.Router();

// User route
router.get("/", isAuthForLogin, GetLogin);
router.post("/", isAuthForLogin, PostLogin);
router.get("/user/logout", Logout);

router.get("/user/register", isAuthForLogin, GetRegister);
router.post("/user/register", isAuthForLogin, PostRegister);

router.get("/user/forgot", isAuthForLogin, GetForgot);
router.post("/user/forgot", isAuthForLogin, PostForgot);

router.get("/user/reset/:token", isAuthForLogin, GetReset);
router.post("/user/reset", isAuthForLogin, PostReset);

router.get("/user/activate/:token", isAuthForLogin, GetActivate);

export default router;