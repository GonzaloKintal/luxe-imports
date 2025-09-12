// Utilidad para enviar email al admin cuando el stock es bajo
import nodemailer from 'nodemailer';

export async function notifyAdminLowStock(product) {
  // Configura tu transporte SMTP aquí
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL_USER,
      pass: process.env.ADMIN_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL_USER,
    to: process.env.ADMIN_EMAIL_TO || process.env.ADMIN_EMAIL_USER,
    subject: `Stock bajo: ${product.title}`,
    text: `El producto "${product.title}" tiene solo ${product.stock} unidades disponibles.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Error enviando email al admin:', err);
    return false;
  }
}
