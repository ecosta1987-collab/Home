<?php
require_once __DIR__ . '/../lib/bootstrap.php';
require_admin();
$apps=['Compiti'=>'Compiti','Lettura'=>'Lettura','LetturaAvventura'=>'Lettura Avventura','Operazioni'=>'Operazioni','Scala'=>'Scala','Thrivers'=>'Thrivers'];
if($_SERVER['REQUEST_METHOD']==='POST'){
  require_csrf();
  $userId=(int)($_POST['user_id']??0);$appKey=$_POST['app_key']??'';$enabled=isset($_POST['enabled'])?1:0;
  if($userId && isset($apps[$appKey])){
    $check=db()->prepare('SELECT id FROM users WHERE id=?');$check->execute([$userId]);
    if($check->fetchColumn()){
      $s=db()->prepare('INSERT INTO user_app_permissions (user_id,app_key,enabled,updated_at) VALUES (?,?,?,NOW()) ON DUPLICATE KEY UPDATE enabled=VALUES(enabled),updated_at=NOW()');
      $s->execute([$userId,$appKey,$enabled]);
    }
  }
  header('Location: /admin/');exit;
}
$users=db()->query('SELECT id,email,name,last_login FROM users ORDER BY last_login DESC,id DESC')->fetchAll();
$permRows=db()->query('SELECT user_id,app_key,enabled FROM user_app_permissions')->fetchAll();$perms=[];foreach($permRows as $r)$perms[$r['user_id']][$r['app_key']]=(bool)$r['enabled'];
?><!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin</title><style>body{margin:0;font-family:system-ui;background:#f5f7fb;color:#172033}.wrap{max-width:1100px;margin:auto;padding:22px}.user{background:#fff;border-radius:22px;padding:20px;margin:14px 0;box-shadow:0 8px 26px #17203312}.apps{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px;margin-top:14px}.toggle{display:flex;gap:8px;align-items:center;padding:10px;background:#f6f8fc;border-radius:14px}.toggle form{display:flex;align-items:center;gap:8px;width:100%}.toggle button{margin-left:auto;border:0;border-radius:10px;padding:7px 9px;background:#293b70;color:#fff}.muted{color:#657087}</style></head><body><main class="wrap"><p><a href="/Applicazioni/">← Applicazioni</a></p><h1>Admin</h1><p>Per ogni account puoi scegliere quali applicazioni mostrare. Se non esiste ancora una regola, l'app è visibile per default.</p><?php foreach($users as $u): ?><section class="user"><strong><?=htmlspecialchars($u['name']?:$u['email'])?></strong><div class="muted"><?=htmlspecialchars($u['email'])?></div><div class="apps"><?php foreach($apps as $key=>$label): $on=$perms[$u['id']][$key]??true; ?><div class="toggle"><form method="post"><input type="hidden" name="csrf" value="<?=csrf_token()?>"><input type="hidden" name="user_id" value="<?=$u['id']?>"><input type="hidden" name="app_key" value="<?=htmlspecialchars($key)?>"><input type="checkbox" name="enabled" value="1" <?=$on?'checked':''?> onchange="this.form.submit()"><span><?=htmlspecialchars($label)?></span></form></div><?php endforeach; ?></div></section><?php endforeach; ?></main></body></html>
