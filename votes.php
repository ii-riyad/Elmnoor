<?php
// votes.php - simple vote API for cinema ticket page
// Configure your Hostinger database credentials here
$dbHost = 'localhost';
$dbName = 'u537910683_elmnoor';
$dbUser = 'u537910683_movie';
$dbPass = 'rfifhG0_0';

header('Content-Type: application/json; charset=UTF-8');

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
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'list') {
    try {
        $stmt = $pdo->query('SELECT id, title, votes FROM movies ORDER BY id ASC');
        $movies = $stmt->fetchAll();
        echo json_encode(['success' => true, 'movies' => $movies]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Could not fetch votes']);
    }
    exit;
}

if ($action === 'vote') {
    $movieId = isset($_POST['movie_id']) ? (int) $_POST['movie_id'] : 0;
    if ($movieId <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid movie ID']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Ensure movie exists
        $stmt = $pdo->prepare('SELECT id FROM movies WHERE id = ? LIMIT 1');
        $stmt->execute([$movieId]);
        if (!$stmt->fetch()) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Movie not found']);
            exit;
        }

        // Increment vote
        $stmt = $pdo->prepare('UPDATE movies SET votes = votes + 1 WHERE id = ?');
        $stmt->execute([$movieId]);

        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Could not record vote']);
    }
    exit;
}

if ($action === 'change') {
    $prevId = isset($_POST['prev_id']) ? (int) $_POST['prev_id'] : 0;
    $newId  = isset($_POST['new_id']) ? (int) $_POST['new_id'] : 0;

    if ($prevId <= 0 || $newId <= 0 || $prevId === $newId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid movie IDs']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Verify both movies exist
        $stmt = $pdo->prepare('SELECT id FROM movies WHERE id IN (?, ?)');
        $stmt->execute([$prevId, $newId]);
        if ($stmt->rowCount() < 2) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Movie not found']);
            exit;
        }

        // Decrement previous (guard against negative) and increment new
        $stmt = $pdo->prepare('UPDATE movies SET votes = CASE WHEN votes > 0 THEN votes - 1 ELSE 0 END WHERE id = ?');
        $stmt->execute([$prevId]);

        $stmt = $pdo->prepare('UPDATE movies SET votes = votes + 1 WHERE id = ?');
        $stmt->execute([$newId]);

        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Could not change vote']);
    }
    exit;
}

// Fallback for unknown action
http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unknown action']);
