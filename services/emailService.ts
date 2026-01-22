import nodemailer from 'nodemailer';

// Configurar el transportador de correo con opciones específicas para hosting
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Puerto SSL (más confiable en hosting)
  secure: true, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  // Opciones adicionales para mejorar conectividad en hosting
  tls: {
    rejectUnauthorized: false // Aceptar certificados autofirmados (solo para producción si es necesario)
  },
  connectionTimeout: 10000, // 10 segundos
  greetingTimeout: 10000,
  socketTimeout: 10000
});

export const enviarNotificacionAsistencia = async (datosInvitado: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: '🎉 Nueva confirmación de asistencia - Boda Diter y Vivian',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
                
                <!-- Encabezado -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                      💍 Nueva Confirmación
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #f0f0f0; font-size: 16px;">
                      Boda de Diter & Vivian
                    </p>
                  </td>
                </tr>
                
                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    
                    <!-- Asistencia destacada -->
                    <div style="background-color: ${datosInvitado.asistira ? '#d4edda' : '#f8d7da'}; border-left: 4px solid ${datosInvitado.asistira ? '#28a745' : '#dc3545'}; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                      <p style="margin: 0; font-size: 18px; color: ${datosInvitado.asistira ? '#155724' : '#721c24'}; font-weight: 600;">
                        ${datosInvitado.asistira ? '✅ CONFIRMA ASISTENCIA' : '❌ NO ASISTIRÁ'}
                      </p>
                    </div>
                    
                    <!-- Datos del invitado -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase;">Nombre completo</span>
                          <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px; font-weight: 500;">
                            ${datosInvitado.nombre_completo}
                          </p>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase;">Correo electrónico</span>
                          <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px;">
                            ${datosInvitado.correo_electronico}
                          </p>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase;">Número de invitados</span>
                          <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px; font-weight: 600;">
                            ${datosInvitado.numero_invitados || 'No especificado'} ${datosInvitado.numero_invitados > 1 ? 'personas' : 'persona'}
                          </p>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase;">Teléfono</span>
                          <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px;">
                            ${datosInvitado.telefono || 'No proporcionado'}
                          </p>
                        </td>
                      </tr>
                      
                      ${datosInvitado.mensaje ? `
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase;">Mensaje</span>
                          <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px; font-style: italic; background-color: #f8f9fa; padding: 15px; border-radius: 8px; line-height: 1.6;">
                            "${datosInvitado.mensaje}"
                          </p>
                        </td>
                      </tr>
                      ` : ''}
                      
                      <tr>
                        <td style="padding: 15px 0;">
                          <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase;">Fecha de confirmación</span>
                          <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px;">
                            ${new Date().toLocaleString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                <!-- Pie de página -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 14px;">
                      💌 Este correo fue generado automáticamente desde el formulario de confirmación
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Notificación enviada correctamente');
  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  }
};