const { sendEmail } = require('../services/email');

const sendEmailHandler = async (req, res) => {
  const { to_name, from_name, message, to_email } = req.body;

  try {
    const response = await sendEmail({ to_name, from_name, message, to_email });
    res.status(200).json({ message: 'Correo enviado con éxito.', response });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error enviando el correo.' });
  }
};

module.exports = { sendEmailHandler };
