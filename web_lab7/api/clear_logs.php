<?php
// api/clear_logs.php

header('Content-Type: application/json');

$file = '../data/logs.json';

// clear logs by overwriting with empty array
if (file_put_contents($file, json_encode([], JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'success', 'message' => 'Logs cleared']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to clear logs']);
}
?>