<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Solo procesar si el formulario se envió por POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. CAPTURAMOS LOS DATOS REALES DEL FORMULARIO
    $nombreUsuario = $_POST['nombre_usuario'];
    $correoDestino = $_POST['correo_usuario'];
    $fecha = $_POST['fecha'];
    $detallesCompra = $_POST['detalles_compra'];

    $mail = new PHPMailer(true);

    try {
        // --- CONFIGURACIÓN DE DEBUG ---
        // Ponemos 0 para que el usuario no vea el código técnico al enviar
        $mail->SMTPDebug = 0; 

        // --- CONFIGURACIÓN DE MAILTRAP ---
        $mail->isSMTP();
        $mail->Host       = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth   = true;
        $mail->Port       = 2525; 
        $mail->Username   = '9419fba30adf8b'; 
        $mail->Password   = '4b172e39aaca98'; 

        // --- DATOS DINÁMICOS DEL MENSAJE ---
        $mail->setFrom('sistema@upbc.edu.mx', 'Notificaciones ITID');
        $mail->addAddress($correoDestino, $nombreUsuario); // Usamos los datos del formulario

        // --- PERSONALIZACIÓN DEL CONTENIDO ---
        $mail->isHTML(true);
        $mail->Subject = "Confirmación de Pago - Lotta Gourmet";
        
        $mail->Body = "
            <div style='font-family: sans-serif; border: 1px solid #ddd; padding: 25px; border-radius: 10px; max-width: 600px;'>
                <h1 style='color: #0d6efd;'>¡Hola, $nombreUsuario!</h1>
                <p>Tu pago ha sido confirmado exitosamente.</p>
                <p style='background: #f8f9fa; padding: 10px; border-left: 4px solid #0d6efd;'>
                    <b>Fecha de la transacción:</b> $fecha <br>
                    <b>Detalles de la compra:</b><br>
                    $detallesCompra
                </p>
                <p>Gracias por tu compra en Lotta Gourmet.</p>
                <hr style='border: none; border-top: 1px solid #eee;'>
                <p style='font-size: 11px; color: #999;'>Proyecto de Ingeniería en Tecnologías de la Información - UPBC</p>
            </div>";

        // --- ENVIAR CORREO ---
        $mail->send();
        
        // 2. REDIRECCIÓN AUTOMÁTICA
        // Esto limpia el formulario y regresa al index con un aviso de éxito
        header("Location: index.html?status=success");
        exit;

    } catch (Exception $e) {
        // Si hay error, lo mostramos
        echo "Error al enviar la notificación: {$mail->ErrorInfo}";
    }
} else {
    // Si alguien intenta entrar a enviar.php directamente sin el formulario
    header("Location: index.html");
    exit;
}