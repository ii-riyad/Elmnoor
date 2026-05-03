<?php
// view-bookings.php - View all ticket bookings
// Simple admin page to view ticket bookings

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
    die('Database connection failed: ' . $e->getMessage());
}

// Get filter and sorting
$statusFilter = $_GET['status'] ?? 'all';
$orderBy = $_GET['order'] ?? 'DESC';

// Build query
$sql = 'SELECT * FROM ticket_bookings';
if ($statusFilter !== 'all') {
    $sql .= ' WHERE status = :status';
}
$sql .= ' ORDER BY booking_date ' . ($orderBy === 'ASC' ? 'ASC' : 'DESC');

$stmt = $pdo->prepare($sql);
if ($statusFilter !== 'all') {
    $stmt->execute(['status' => $statusFilter]);
} else {
    $stmt->execute();
}
$bookings = $stmt->fetchAll();

// Get statistics
$statsStmt = $pdo->query('SELECT status, COUNT(*) as count FROM ticket_bookings GROUP BY status');
$stats = [];
foreach ($statsStmt as $row) {
    $stats[$row['status']] = $row['count'];
}
$totalBookings = array_sum($stats);
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حجوزات التذاكر - علم ونور</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Changa', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
        }
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
            margin-top: 5px;
        }
        .filters {
            display: flex;
            gap: 15px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        select, button {
            padding: 10px 20px;
            border: 2px solid #667eea;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            background: white;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
        }
        button:hover {
            background: #5568d3;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 15px;
            text-align: right;
            border-bottom: 1px solid #e2e8f0;
        }
        th {
            background: #f7fafc;
            font-weight: bold;
            color: #2d3748;
            position: sticky;
            top: 0;
        }
        tr:hover {
            background: #f7fafc;
        }
        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: bold;
        }
        .status-confirmed {
            background: #c6f6d5;
            color: #22543d;
        }
        .status-pending {
            background: #fef5e7;
            color: #975a16;
        }
        .status-cancelled {
            background: #fed7d7;
            color: #742a2a;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #718096;
            font-size: 1.2rem;
        }
        .email-link {
            color: #667eea;
            text-decoration: none;
        }
        .email-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📋 حجوزات التذاكر</h1>
        <p style="color: #718096; margin-bottom: 20px;">إدارة حجوزات تذاكر سينما علم ونور</p>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value"><?= $totalBookings ?></div>
                <div class="stat-label">إجمالي الحجوزات</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?= $stats['confirmed'] ?? 0 ?></div>
                <div class="stat-label">مؤكدة</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?= $stats['pending'] ?? 0 ?></div>
                <div class="stat-label">قيد الانتظار</div>
            </div>
            <div class="stat-card">
                <div class="stat-value"><?= $stats['cancelled'] ?? 0 ?></div>
                <div class="stat-label">ملغاة</div>
            </div>
        </div>

        <div class="filters">
            <form method="GET" style="display: flex; gap: 15px; flex-wrap: wrap;">
                <select name="status" onchange="this.form.submit()">
                    <option value="all" <?= $statusFilter === 'all' ? 'selected' : '' ?>>جميع الحجوزات</option>
                    <option value="confirmed" <?= $statusFilter === 'confirmed' ? 'selected' : '' ?>>مؤكدة فقط</option>
                    <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>قيد الانتظار</option>
                    <option value="cancelled" <?= $statusFilter === 'cancelled' ? 'selected' : '' ?>>ملغاة</option>
                </select>

                <select name="order" onchange="this.form.submit()">
                    <option value="DESC" <?= $orderBy === 'DESC' ? 'selected' : '' ?>>الأحدث أولاً</option>
                    <option value="ASC" <?= $orderBy === 'ASC' ? 'selected' : '' ?>>الأقدم أولاً</option>
                </select>
            </form>

            <button onclick="window.print()">🖨️ طباعة</button>
            <button onclick="window.location.href='index.html'">🏠 العودة للرئيسية</button>
        </div>

        <?php if (empty($bookings)): ?>
            <div class="no-data">📭 لا توجد حجوزات حالياً</div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>رقم التذكرة</th>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الهاتف</th>
                        <th>تاريخ الحجز</th>
                        <th>الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($bookings as $index => $booking): ?>
                        <tr>
                            <td><?= $index + 1 ?></td>
                            <td><strong>#<?= htmlspecialchars($booking['ticket_id']) ?></strong></td>
                            <td><?= htmlspecialchars($booking['name']) ?></td>
                            <td>
                                <a href="mailto:<?= htmlspecialchars($booking['email']) ?>" class="email-link">
                                    <?= htmlspecialchars($booking['email']) ?>
                                </a>
                            </td>
                            <td><?= htmlspecialchars($booking['phone'] ?: '-') ?></td>
                            <td><?= date('Y-m-d H:i', strtotime($booking['booking_date'])) ?></td>
                            <td>
                                <span class="status status-<?= $booking['status'] ?>">
                                    <?php
                                    $statusLabels = [
                                        'confirmed' => 'مؤكدة',
                                        'pending' => 'قيد الانتظار',
                                        'cancelled' => 'ملغاة'
                                    ];
                                    echo $statusLabels[$booking['status']] ?? $booking['status'];
                                    ?>
                                </span>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</body>
</html>
