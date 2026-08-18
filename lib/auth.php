<?php
function current_user(): ?array { return $_SESSION['user'] ?? null; }
function is_logged_in(): bool { return current_user() !== null; }
function is_admin(): bool {
    global $config;
    $u = current_user();
    return $u && isset($config['admin_email']) && strcasecmp($u['email'] ?? '', $config['admin_email']) === 0;
}
function require_login(): void {
    if (!is_logged_in()) {
        $next = $_SERVER['REQUEST_URI'] ?? '/';
        header('Location: /auth/login.php?next=' . rawurlencode($next));
        exit;
    }
}
function require_admin(): void {
    require_login();
    if (!is_admin()) { http_response_code(403); exit('Accesso riservato all’amministratore.'); }
}
function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(24));
    return $_SESSION['csrf'];
}
function require_csrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf'] ?? '');
    if (!$token || !hash_equals($_SESSION['csrf'] ?? '', $token)) {
        http_response_code(419); exit('Token CSRF non valido.');
    }
}
function ensure_user_row(array $googleUser): int {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT id FROM users WHERE google_sub = ?');
    $stmt->execute([$googleUser['sub']]);
    $id = $stmt->fetchColumn();
    if ($id) {
        $u = $pdo->prepare('UPDATE users SET email=?, name=?, picture_url=?, last_login=NOW() WHERE id=?');
        $u->execute([$googleUser['email'], $googleUser['name'] ?? '', $googleUser['picture'] ?? '', $id]);
        return (int)$id;
    }
    $i = $pdo->prepare('INSERT INTO users (google_sub,email,name,picture_url,last_login) VALUES (?,?,?,?,NOW())');
    $i->execute([$googleUser['sub'], $googleUser['email'], $googleUser['name'] ?? '', $googleUser['picture'] ?? '']);
    $id = (int)$pdo->lastInsertId();
    $p = $pdo->prepare('INSERT INTO profiles (user_id,name,is_default) VALUES (?,?,1)');
    $p->execute([$id, 'Profilo 1']);
    return $id;
}
