<?php
// test-smtp.php - Quick SMTP connection test
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$phpMailerFlat = __DIR__ . '/mailer';
require $phpMailerFlat . '/PHPMailer.php';
require $phpMailerFlat . '/SMTP.php';
require $phpMailerFlat . '/Exception.php';

// Load .env
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    die('.env file missing');
}
$env = parse_ini_file($envPath);

echo "<h2>SMTP Configuration Test</h2>";
echo "<pre>";
echo "SMTP Host: " . ($env['SMTP_HOST'] ?? 'NOT SET') . "\n";
echo "SMTP Port: " . ($env['SMTP_PORT'] ?? 'NOT SET') . "\n";
echo "SMTP User: " . ($env['SMTP_USER'] ?? 'NOT SET') . "\n";
echo "SMTP Pass: " . (isset($env['SMTP_PASS']) ? '***SET***' : 'NOT SET') . "\n";
echo "SMTP Secure: " . ($env['SMTP_SECURE'] ?? 'NOT SET') . "\n";
echo "</pre>";

echo "<h3>Testing Connection...</h3>";

try {
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 2; // Enable verbose debug output
    $mail->isSMTP();
    $mail->Host = $env['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $env['SMTP_USER'];
    $mail->Password = $env['SMTP_PASS'];
    $mail->SMTPSecure = strtolower($env['SMTP_SECURE'] ?? 'ssl') === 'tls'
        ? PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = (int)$env['SMTP_PORT'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($env['SMTP_FROM'], $env['SMTP_FROM_NAME']);
    $mail->addAddress($env['ADMIN_EMAIL']); // Send test to admin

    $mail->Subject = 'Test Email from Elm w Noor';
    $mail->Body = 'This is a test email to verify SMTP configuration is working correctly.';

    $mail->send();
    echo "<p style='color: green; font-weight: bold;'>✅ Email sent successfully!</p>";
} catch (Exception $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ Email failed: " . $mail->ErrorInfo . "</p>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
