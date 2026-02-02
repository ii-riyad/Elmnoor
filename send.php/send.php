<?php
// send.php - PHPMailer with .env SMTP, sends admin + confirmation
header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Resolve PHPMailer autoload/paths robustly
$vendorAutoload = __DIR__ . '/vendor/autoload.php';
$phpMailerSrc   = __DIR__ . '/PHPMailer/src';
$phpMailerFlat  = __DIR__ . '/mailer'; // current project keeps files here
if (file_exists($vendorAutoload)) {
    require $vendorAutoload;
} elseif (
    file_exists($phpMailerSrc . '/PHPMailer.php') &&
    file_exists($phpMailerSrc . '/SMTP.php') &&
    file_exists($phpMailerSrc . '/Exception.php')
) {
    require $phpMailerSrc . '/PHPMailer.php';
    require $phpMailerSrc . '/SMTP.php';
    require $phpMailerSrc . '/Exception.php';
} elseif (
    file_exists($phpMailerFlat . '/PHPMailer.php') &&
    file_exists($phpMailerFlat . '/SMTP.php') &&
    file_exists($phpMailerFlat . '/Exception.php')
) {
    require $phpMailerFlat . '/PHPMailer.php';
    require $phpMailerFlat . '/SMTP.php';
    require $phpMailerFlat . '/Exception.php';
} else {
    http_response_code(500);
    echo json_encode(['error' => 'PHPMailer library missing (expected vendor/autoload.php, PHPMailer/src, or mailer/)']);
    exit;
}

// Load .env
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    http_response_code(500);
    echo json_encode(['error' => '.env file missing']);
    exit;
}
$env = parse_ini_file($envPath);
$smtpHost   = trim($env['SMTP_HOST'] ?? '');
$smtpUser   = trim($env['SMTP_USER'] ?? '');
$smtpPass   = trim($env['SMTP_PASS'] ?? '');
$smtpPort   = (int)($env['SMTP_PORT'] ?? 465);
$smtpSecure = strtolower(trim($env['SMTP_SECURE'] ?? 'ssl')) === 'tls'
    ? PHPMailer::ENCRYPTION_STARTTLS
    : PHPMailer::ENCRYPTION_SMTPS;
$fromEmail  = trim($env['SMTP_FROM'] ?? $smtpUser);
$fromName   = trim($env['SMTP_FROM_NAME'] ?? 'Elm w Noor Website');
$adminTo    = trim($env['ADMIN_EMAIL'] ?? $smtpUser);
$debugLog   = strtolower(trim($env['SMTP_DEBUG_LOG'] ?? '')) === 'true';

// Database connection for ticket bookings
$dbHost = 'localhost';
$dbName = 'u537910683_elmnoor';
$dbUser = 'u537910683_movie';
$dbPass = 'rfifhG0_0';

try {
    $pdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (Exception $e) {
    // Database connection failed but don't block email sending
    $pdo = null;
}

// Lightweight server-side log to help diagnose SMTP failures
function log_smtp_issue($message)
{
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    $line = '[' . date('c') . '] ' . $message . "\n";
    @file_put_contents($logDir . '/smtp.log', $line, FILE_APPEND);
}

if (!$smtpHost || !$smtpUser || !$smtpPass) {
    http_response_code(500);
    echo json_encode(['error' => 'SMTP credentials missing in .env']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$name    = trim($_POST['name'] ?? 'Guest');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$major   = trim($_POST['major'] ?? '');
$type    = trim($_POST['type'] ?? 'contact');

// Extract ticket ID from message if it's a ticket booking
$ticketId = null;
if ($type === 'ticket') {
    // First try to get from phone field (HTML now sends it here)
    if (!empty($phone) && preg_match('/^\d{6}$/', $phone)) {
        $ticketId = $phone;
    }
    // Fallback: try to extract from message
    elseif (preg_match('/رقم التذكرة:\s*#?(\d+)/', $message, $matches)) {
        $ticketId = $matches[1];
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

// Save ticket booking to database (before sending emails)
if ($type === 'ticket' && $pdo) {
    try {
        // Generate ticket ID if not found
        if (!$ticketId) {
            $ticketId = substr(str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT), 0, 6);
        }
        
        $stmt = $pdo->prepare(
            'INSERT INTO ticket_bookings (ticket_id, name, email, phone, notes, booking_date, status) 
             VALUES (?, ?, ?, ?, ?, NOW(), ?)'
        );
        $stmt->execute([
            $ticketId,
            $name,
            $email,
            $major ?: null,  // Store movie name in phone field
            $message,
            'confirmed'
        ]);
    } catch (Exception $e) {
        // Log but don't block email sending
        if ($debugLog) {
            log_smtp_issue('DB_INSERT_FAIL: ' . $e->getMessage());
        }
    }
}

// 1) Admin email
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort ?: 465;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($fromEmail ?: $smtpUser, $fromName ?: 'Elm w Noor Website');
    $mail->addAddress($adminTo ?: $smtpUser);
    if ($email) {
        $mail->addReplyTo($email, $name ?: 'User');
    }

    $adminSubject = ($type === 'ticket') ? '🎟 New Ticket Booking' : '📩 New Contact Message';
    $lines = [];
    if ($type === 'ticket') {
        $lines[] = 'New ticket booking:';
    } else {
        $lines[] = 'New contact message:';
    }
    $lines[] = '';
    $lines[] = 'Name: ' . ($name ?: '-');
    $lines[] = 'Email: ' . ($email ?: '-');
    if ($phone) { $lines[] = 'Phone: ' . $phone; }
    if ($major) { $lines[] = 'Major: ' . $major; }
    $lines[] = '';
    $lines[] = 'Message:';
    $lines[] = $message ?: '-';

    $mail->Subject = $adminSubject;
    $mail->Body    = implode("\n", $lines);

    $mail->send();
} catch (Exception $e) {
    $detail = $mail->ErrorInfo ?: $e->getMessage();
    if ($debugLog) {
        log_smtp_issue('ADMIN_FAIL host=' . $smtpHost . ' port=' . $smtpPort . ' secure=' . ($smtpSecure === PHPMailer::ENCRYPTION_STARTTLS ? 'tls' : 'ssl') . ' detail=' . $detail);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Admin email failed', 'detail' => $detail]);
    exit;
}

// 2) User confirmation (non-blocking)
try {
    $confirm = new PHPMailer(true);
    $confirm->isSMTP();
    $confirm->Host       = $smtpHost;
    $confirm->SMTPAuth   = true;
    $confirm->Username   = $smtpUser;
    $confirm->Password   = $smtpPass;
    $confirm->SMTPSecure = $smtpSecure;
    $confirm->Port       = $smtpPort ?: 465;
    $confirm->CharSet    = 'UTF-8';

    $confirm->setFrom($fromEmail ?: $smtpUser, 'Elm w Noor');
    $confirm->addAddress($email, $name);

    $arabicName = $name ?: 'صديقنا';
    if ($type === 'ticket') {
        $confirm->Subject = '✅ تم تأكيد الحجز - علم ونور';
        $confirm->Body = "مرحباً {$arabicName},\n\nتم تأكيد حجزك في سينما علم ونور 🎬\nرقم التذكرة: " . ($ticketId ?: 'غير متوفر') . "\nالوقت: 7:00 مساءً\nالمكان: قاعة الجامعة الرئيسية\n\nيرجى الاحتفاظ بهذا البريد كتأكيد للحجز.\n\nفريق علم ونور";
    } else {
        $confirm->Subject = '✅ تم استلام رسالتك - علم ونور';
        $confirm->Body = "مرحباً {$arabicName},\n\nلقد استلمنا رسالتك وسيتواصل معك فريق علم ونور قريباً.\n\nفريق علم ونور";
    }

    $confirm->send();
} catch (Exception $e) {
    if ($debugLog) {
        $detail = $confirm->ErrorInfo ?: $e->getMessage();
        log_smtp_issue('USER_FAIL host=' . $smtpHost . ' port=' . $smtpPort . ' secure=' . ($smtpSecure === PHPMailer::ENCRYPTION_STARTTLS ? 'tls' : 'ssl') . ' detail=' . $detail);
    }
    // don't block user if confirmation fails
}

$successMsg = ($type === 'ticket')
    ? 'Booking sent & confirmation delivered'
    : 'Message sent & confirmation delivered';
echo json_encode(['success' => true, 'message' => $successMsg]);
