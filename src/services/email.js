const emailjs = require('@emailjs/nodejs');

const sendEmail = async ({ to_name, from_name, message, to_email }) => {
  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  try {
    const response = await emailjs.send(serviceID, templateID, {
      to_name,
      from_name,
      message,
      to_email,
    }, {
      publicKey,
    });

    return response;
  } catch (error) {
    throw new Error('Error al enviar el correo electrónico.');
  }
};

module.exports = { sendEmail };
