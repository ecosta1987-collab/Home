<?php
function active_profile_id(): ?int { return isset($_SESSION['profile_id']) ? (int)$_SESSION['profile_id'] : null; }
function require_profile(): int {
    require_login();
    $pid = active_profile_id();
    if ($pid) return $pid;
    $stmt = db()->prepare('SELECT id FROM profiles WHERE user_id=? ORDER BY is_default DESC,id ASC LIMIT 1');
    $stmt->execute([current_user()['id']]);
    $pid = (int)$stmt->fetchColumn();
    if (!$pid) { header('Location: /profiles.php'); exit; }
    $_SESSION['profile_id'] = $pid;
    return $pid;
}
function app_allowed(string $appKey): bool {
    if (is_admin()) return true;
    $stmt = db()->prepare('SELECT enabled FROM user_app_permissions WHERE user_id=? AND app_key=?');
    $stmt->execute([current_user()['id'], $appKey]);
    $v = $stmt->fetchColumn();
    return $v === false ? true : (bool)$v;
}
function render_legacy_app(string $appKey, bool $syncProgress=true): void {
    require_login();
    if (!app_allowed($appKey)) { http_response_code(403); exit('Questa app non è attiva per il tuo account.'); }
    if ($syncProgress) require_profile();
    $file = dirname(__DIR__) . '/' . $appKey . '/index.html';
    if (!is_file($file)) { http_response_code(404); exit('App non trovata.'); }
    $html = file_get_contents($file);
    if ($syncProgress) {
        $tag = '<script>window.HOME_APP_KEY=' . json_encode($appKey) . ';window.HOME_CSRF=' . json_encode(csrf_token()) . ';</script><script src="/assets/profile-sync.js"></script>';
        $html = str_replace('</body>', $tag . '</body>', $html);
    }
    echo $html;
}
