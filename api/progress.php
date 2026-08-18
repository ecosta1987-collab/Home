<?php
require_once __DIR__ . '/../lib/bootstrap.php';
require_login();
$profileId = require_profile();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $appKey = $_GET['app_key'] ?? '';
    if (!$appKey) { http_response_code(400); exit('app_key mancante'); }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['state' => app_progress_state($profileId, $appKey)], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
require_csrf();
$payload = json_decode(file_get_contents('php://input'), true);
$appKey = $payload['app_key'] ?? '';
$state = $payload['state'] ?? null;
$allowed = ['Compiti','CompitiVacanze','Lettura','LetturaAvventura','Operazioni','Thrivers'];
if (!in_array($appKey, $allowed, true) || !is_array($state)) { http_response_code(400); exit('Dati non validi'); }
if (!app_allowed($appKey)) { http_response_code(403); exit; }
$json = json_encode($state, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
$stmt = db()->prepare('INSERT INTO app_progress (profile_id,app_key,state_json,updated_at) VALUES (?,?,?,NOW()) ON DUPLICATE KEY UPDATE state_json=VALUES(state_json), updated_at=NOW()');
$stmt->execute([$profileId, $appKey, $json]);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['ok'=>true]);
