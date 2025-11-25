// import nodemailer from "nodemailer";

// // Configuración del transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE || "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /**
//  * Envía un correo electrónico.
//  * @param {Object} params
//  * @param {string} params.to - Email del destinatario
//  * @param {string} params.subject - Asunto del correo
//  * @param {string} params.html - Contenido HTML del correo
//  */
// export async function sendEmail({ to, subject, html }) {
//   try {
//     const info = await transporter.sendMail({
//       from: `"NoReply" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("Email sent successfully:", info.response);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error; // Re-lanza el error para que tu controlador lo capture si falla
//   }
// }

// /**
//  * Genera el link de activación para un token
//  * @param {string} token
//  * @returns {string} URL completa de activación
//  */
// export function generateActivationLink(token) {
//   const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
//   return `${baseUrl}/user/activate/${token}`;
// }


import nodemailer from "nodemailer";

 const transporter = nodemailer.createTransport({
   service: process.env.EMAIL_SERVICE || "gmail", // Default to Gmail if not specified
   auth: {
    user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
   },
 });

 export async function sendEmail({ to, subject, html }) {
   try {
     const info = await transporter.sendMail({
       from: `${process.env.EMAIL_USER}`,
       to,
       subject,
       html,
     });

     console.log("Email sent successfully:", info.response);
     return info;
   } catch (error) {
     console.error("Error sending email:", error);
   }
 }
