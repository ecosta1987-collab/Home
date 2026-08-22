<?php
require_once __DIR__ . '/../lib/bootstrap.php';

if (!isset($_GET['state'], $_SESSION['oauth_state']) || !hash_equals($_SESSION['oauth_state'], (string)$_GET['state'])) {
    http_response_code(400); exit('Stato OAuth non valido.');
}
if (empty($_GET['code'])) { http_response_code(400); exit('Codice Google mancante.'); }

$ch = curl_init('https://oauth2.googleapis.com/token');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'code' => $_GET['code'],
        'client_id' => $config['google_client_id'],
        'client_secret' => $config['google_client_secret'],
        'redirect_uri' => $config['google_redirect_uri'],
        'grant_type' => 'authorization_code',
    ]),
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
]);
$tokenRaw = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if ($status !== 200 || !$tokenRaw) { http_response_code(401); exit('Login Google non riuscito.'); }
$token = json_decode($tokenRaw, true);
$idToken = $token['id_token'] ?? '';
if (!$idToken) { http_response_code(401); exit('ID token Google mancante.'); }

$verify = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($idToken));
curl_setopt_array($verify, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>10]);
$verifyRaw = curl_exec($verify);
$verifyStatus = curl_getinfo($verify, CURLINFO_HTTP_CODE);
curl_close($verify);
$google = ($verifyStatus === 200 && $verifyRaw) ? json_decode($verifyRaw, true) : null;
if (!$google || ($google['aud'] ?? '') !== $config['google_client_id'] || ($google['email_verified'] ?? 'false') !== 'true') {
    http_response_code(401); exit('Identità Google non verificata.');
}

$userId = ensure_user_row($google);
session_regenerate_id(true);
$_SESSION['user'] = [
    'id' => $userId,
    'sub' => $google['sub'],
    'email' => $google['email'],
    'name' => $google['name'] ?? $google['email'],
    'picture' => $google['picture'] ?? '',
];
unset($_SESSION['oauth_state']);
$next = $_SESSION['oauth_next'] ?? '/';
unset($_SESSION['oauth_next']);
header('Location: ' . (str_starts_with($next, '/') ? $next : '/'));
exit;
