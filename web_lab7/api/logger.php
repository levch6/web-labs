<?php
// api/logger.php

header('Content-Type: application/json');

// Ensure data directory exists (redundant if folder structure is static, but good practice)
if (!is_dir('../data')) {
    mkdir('../data', 0777, true);
}

$file = '../data/logs.json';

// Get POST body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data) {
    // Add server timestamp
    $data['server_timestamp'] = date('Y-m-d H:i:s') . "." . sprintf("%03d", (microtime(true) - floor(microtime(true))) * 1000); // High precision time

    // Read existing logs
    $current_logs = [];
    if (file_exists($file)) {
        $json_content = file_get_contents($file);
        $current_logs = json_decode($json_content, true);
        if (!is_array($current_logs)) {
            $current_logs = [];
        }
    }

    // Append new log
    $current_logs[] = $data;

    // Save back to file
    if (file_put_contents($file, json_encode($current_logs, JSON_PRETTY_PRINT))) {
        echo json_encode(['status' => 'success', 'server_time' => $data['server_timestamp']]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to file']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
}
?>
