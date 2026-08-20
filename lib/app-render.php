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
function app_progress_state(int $profileId, string $appKey): array {
    $stmt = db()->prepare('SELECT state_json FROM app_progress WHERE profile_id=? AND app_key=?');
    $stmt->execute([$profileId, $appKey]);
    $raw = $stmt->fetchColumn();
    if (!$raw) return [];
    $decoded = json_decode((string)$raw, true);
    return is_array($decoded) ? $decoded : [];
}
function render_legacy_app(string $appKey, bool $syncProgress=true): void {
    require_login();
    if (!app_allowed($appKey)) { http_response_code(403); exit('Questa app non è attiva per il tuo account.'); }
    $profileId = $syncProgress ? require_profile() : null;
    $file = dirname(__DIR__) . '/' . $appKey . '/index.html';
    if (!is_file($file)) { http_response_code(404); exit('App non trovata.'); }
    $html = file_get_contents($file);

    $homeButton = '<style>#home-back-button{position:fixed;top:max(12px,env(safe-area-inset-top));left:12px;z-index:2147483647;display:inline-flex;align-items:center;gap:7px;padding:10px 14px;border-radius:999px;background:#fff;color:#1f2937;text-decoration:none;font:700 15px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.18);border:1px solid rgba(0,0,0,.08)}#home-back-button:active{transform:translateY(1px)}@media(max-width:520px){#home-back-button{top:max(8px,env(safe-area-inset-top));left:8px;padding:9px 12px;font-size:14px}}</style><a id="home-back-button" href="/Applicazioni/" aria-label="Torna alle Applicazioni">&#8592; Torna alle Applicazioni</a>';

    // Cerca il vero tag <body> solo dopo la chiusura di <head>, evitando
    // eventuali stringhe "<body>" presenti in CSS, commenti o script.
    $headEnd = stripos($html, '</head>');
    if ($headEnd !== false) {
        $bodyStart = stripos($html, '<body', $headEnd + 7);
        if ($bodyStart !== false) {
            $bodyTagEnd = strpos($html, '>', $bodyStart);
            if ($bodyTagEnd !== false) {
                $insertAt = $bodyTagEnd + 1;
                $html = substr($html, 0, $insertAt) . $homeButton . substr($html, $insertAt);
            }
        }
    }

    if ($syncProgress) {
        $state = app_progress_state($profileId, $appKey);
        $bootstrap = '<script>window.HOME_APP_KEY=' . json_encode($appKey) . ';window.HOME_CSRF=' . json_encode(csrf_token()) . ';window.HOME_PROGRESS=' . json_encode($state, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) . ';</script><script src="/assets/profile-sync.js"></script>';
        if ($appKey === 'Thrivers') {
            $bootstrap .= '<script src="/assets/thrivers-enhancements.js?v=20260820-2"></script><script src="/assets/thrivers-results-home.js?v=20260820-4"></script>';
        }
        $html = preg_replace('/<head(.*?)>/i', '<head$1>' . $bootstrap, $html, 1);
    }
    echo $html;
}
