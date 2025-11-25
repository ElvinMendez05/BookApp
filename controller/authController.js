import context from "../context/appContext.js";
import { sendEmail } from "../services/EmailServices.js";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { randomBytes } from "crypto";
import { Op } from "sequelize";

export function GetLogin(req, res, next) {
  res.render("auth/login", {
    "page-title": "Login",
    layout: "anonymous-layout",
  });
}

export async function PostLogin(req, res, next) {
  const { Email, Password } = req.body;

  try {
    const user = await context.UserModel.findOne({ where: { email: Email } });

    // Check if user exists
    if (!user) {
      req.flash("errors", "No user found with this email.");
      return res.redirect("/");
    }

    // Check if user is active
    if (!user.isActive) {
      req.flash(
        "errors",
        "Your account is not active. Please check your email for activation instructions."
      );
      return res.redirect("/");
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(Password, user.password);

    if (!isPasswordValid) {
      req.flash("errors", "Invalid password.");
      return res.redirect("/");
    }

    // Set user session
    req.session.isAuthenticated = true; // Set the session as authenticated
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Save session and redirect
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        req.flash("errors", "An error occurred while logging in.");
        return res.redirect("/");
      }

      return res.redirect("/home"); // Redirect to the dashboard or any other page after successful login
    });
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred while logging in.");
    return res.redirect("/");
  }
}

export function Logout(req, res, next) {
  req.session.destroy((err) => {
    // Destroy the session
    if (err) {
      console.error("Session destroy error:", err);
      req.flash("errors", "An error occurred while logging out.");
      return res.redirect("/home");
    }
  });
  res.redirect("/"); // Redirect to the home page or login page after logout
}

export function GetRegister(req, res, next) {
  res.render("auth/register-user", {
    "page-title": "Register user",
    layout: "anonymous-layout",
  });
}

export async function PostRegister(req, res, next) {
  const { Name, Email, Password, ConfirmPassword } = req.body;

  try {
    if (Password !== ConfirmPassword) {
      req.flash("errors", "Passwords do not match.");
      return res.redirect("/user/register");
    }

    const user = await context.UserModel.findOne({ where: { email: Email } });
    if (user) {
      req.flash("errors", "User already exists with this email.");
      return res.redirect("/user/register");
    }

    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    const hashedPassword = await bcrypt.hash(Password, 10);

    await context.UserModel.create({
      name: Name,
      email: Email,
      password: hashedPassword,
      isActive: false,
      ActivateToken: token, // Initially set to null, can be used for email activation later
    });

    req.flash("success", "User registered successfully. You can now log in.");

    await sendEmail({
      to: Email,
      subject: "Welcome to Assets App",
      html: `<p>Dear ${Name},</p>
             <p>Thank you for registering. Please click the link below to activate your account:</p>
             <p><a href="${process.env.APP_URL}/user/activate/${token}">Activate Account</a></p>
             <p>If you did not register, please ignore this email.</p>`,
    });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred while registering the user.");
    return res.redirect("/user/register");
  }
}

export async function GetActivate(req, res, next) {
  const { token } = req.params;

  if (!token) {
    req.flash("errors", "Invalid activation token.");
    return res.redirect("/");
  }

  try {
    const user = await context.UserModel.findOne({
      where: { ActivateToken: token },
    });

    if (!user) {
      req.flash("errors", "Invalid activation token.");
      return res.redirect("/");
    }

    user.isActive = true;
    user.ActivateToken = null; // Clear the activation token after successful activation
    await user.save();
    req.flash("success", "Account activated successfully. You can now log in.");
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred while activating your account.");
    return res.redirect("/");
  }
}

export function GetForgot(req, res, next) {
  res.render("auth/forgot", {
    "page-title": "Forgot password",
    layout: "anonymous-layout",
  });
}

export async function PostForgot(req, res, next) {
  const { Email } = req.body;

  try {
    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    const user = await context.UserModel.findOne({ where: { email: Email } });

    // Check if user exists
    if (!user) {
      req.flash("errors", "No user found with this email.");
      return res.redirect("/user/forgot");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
    const result = await user.save();

    if (!result) {
      req.flash("errors", "An error occurred while saving the reset token.");
      return res.redirect("/user/forgot");
    }

    await sendEmail({
      to: Email,
      subject: "Password Reset Request",
      html: `<p>Dear ${user.name},</p>
             <p>You requested a password reset. Please click the link below to reset your password:</p>
             <p><a href="${process.env.APP_URL}/user/reset/${token}">Reset Password</a></p>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    req.flash("success", "Password reset link sent to your email.");
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred while processing your request.");
    return res.redirect("/user/forgot");
  }
}

export async function GetReset(req, res, next) {
  const { token } = req.params;
  if (!token) {
    req.flash("errors", "Invalid or expired token.");
    return res.redirect("/user/forgot");
  }

  try {
    const user = await context.UserModel.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gte]: Date.now() },
      },
    });

    if (!user) {
      req.flash("errors", "Invalid or expired token.");
      return res.redirect("/user/forgot");
    }

    res.render("auth/reset", {
      "page-title": "Reset password",
      layout: "anonymous-layout",
      passwordToken: token,
      userId: user.id,
    });
  } catch (err) {
    console.error(err);
    req.flash("errors", "An error occurred while processing your request.");
    return res.redirect("/user/forgot");
  }
}

export async function PostReset(req, res, next) {
  const { passwordToken, userId, Password, ConfirmPassword } = req.body;

  if (Password !== ConfirmPassword) {
    req.flash("errors", "Passwords do not match.");
    return res.redirect(`/user/reset/${passwordToken}`);
  }

  const user = await context.UserModel.findOne({
    where: {
      id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { [Op.gte]: Date.now() },
    },
  });

  if (!user) {
    req.flash("errors", "Invalid or expired token.");
    return res.redirect("/user/forgot");
  }

  const hashedPassword = await bcrypt.hash(Password, 10);
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiration = null;
  await user.save();
  req.flash("success", "Password reset successfully. You can now log in.");
  return res.redirect("/");
}
