import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export async function notifyAdminLowStock(product) {
  try {
    await apiInstance.sendTransacEmail({
      to: [{ email: process.env.ADMIN_EMAIL }],
      sender: { email: process.env.BREVO_FROM_EMAIL, name: "Luxe Imports" },
      subject: `Stock bajo: ${product.title}`,
      textContent: `El producto "${product.title}" tiene solo ${product.stock} unidades disponibles.`,
    });
    return true;
  } catch (err) {
    console.error('Error enviando email al admin:', err);
    return false;
  }
}