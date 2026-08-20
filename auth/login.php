<?php
require_once __DIR__ . '/../lib/bootstrap.php';

$defaultNext = '/Applicazioni/';

if (is_logged_in()) {
    header('Location: ' . $defaultNext);
    exit;
}

$next = $_GET['next'] ?? $defaultNext;
if (!is_string($next) || !str_starts_with($next, '/')) {
    $next = $defaultNext;
}

// Evita loop del tipo /auth/login.php?next=/auth/login.php?next=...
if (str_starts_with($next, '/auth/login.php')) {
    $next = $defaultNext;
}

$state = bin2hex(random_bytes(24));
$_SESSION['oauth_state'] = $state;
$_SESSION['oauth_next'] = $next;

$params = http_build_query([
    'client_id' => $config['google_client_id'],
    'redirect_uri' => $config['google_redirect_uri'],
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'state' => $state,
    'access_type' => 'online',
    'prompt' => 'select_account',
]);

header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $params);
exit;
