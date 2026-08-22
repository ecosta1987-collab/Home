<?php
require_once __DIR__ . '/lib/bootstrap.php';
require_login();
if ($_SERVER['REQUEST_METHOD']==='POST') {
  require_csrf();
  $action=$_POST['action']??'';
  if($action==='create'){
    $name=trim($_POST['name']??'');
    if($name!==''){
      $s=db()->prepare('INSERT INTO profiles (user_id,name,is_default) VALUES (?,?,0)');$s->execute([current_user()['id'],mb_substr($name,0,80)]);
      $_SESSION['profile_id']=(int)db()->lastInsertId();
    }
  } elseif($action==='select'){
    $id=(int)($_POST['profile_id']??0);
    $s=db()->prepare('SELECT id FROM profiles WHERE id=? AND user_id=?');$s->execute([$id,current_user()['id']]);
    if($s->fetchColumn())$_SESSION['profile_id']=$id;
  } elseif($action==='delete'){
    $id=(int)($_POST['profile_id']??0);
    $s=db()->prepare('SELECT COUNT(*) FROM profiles WHERE user_id=?');$s->execute([current_user()['id']]);
    if((int)$s->fetchColumn()>1){$d=db()->prepare('DELETE FROM profiles WHERE id=? AND user_id=?');$d->execute([$id,current_user()['id']]);if(active_profile_id()===$id)unset($_SESSION['profile_id']);}
  }
  header('Location: /profiles.php');exit;
}
$s=db()->prepare('SELECT id,name,is_default FROM profiles WHERE user_id=? ORDER BY is_default DESC,id');$s->execute([current_user()['id']]);$profiles=$s->fetchAll();
?><!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Profili</title><style>body{font-family:system-ui;background:#f6f8fc;color:#172033;margin:0}.wrap{max-width:760px;margin:auto;padding:22px}.card{background:#fff;border-radius:22px;padding:18px;margin:12px 0;box-shadow:0 8px 24px #17203312;display:flex;justify-content:space-between;align-items:center;gap:12px}.actions{display:flex;gap:8px;flex-wrap:wrap}button,input{font:inherit;border-radius:12px;padding:10px 12px}button{border:0;background:#293b70;color:#fff;font-weight:800}button.danger{background:#b83b4b}input{border:1px solid #ccd3df}.new{display:flex;gap:8px;flex-wrap:wrap}</style></head><body><main class="wrap"><p><a href="/Applicazioni/">← Applicazioni</a></p><h1>Profili</h1><p>Ogni profilo mantiene progressi separati nelle app.</p><?php foreach($profiles as $p): ?><div class="card"><div><strong><?=htmlspecialchars($p['name'])?></strong><?php if((int)$p['id']===active_profile_id()): ?> · attivo<?php endif; ?></div><div class="actions"><?php if((int)$p['id']!==active_profile_id()): ?><form method="post"><input type="hidden" name="csrf" value="<?=csrf_token()?>"><input type="hidden" name="action" value="select"><input type="hidden" name="profile_id" value="<?=$p['id']?>"><button>Usa</button></form><?php endif; ?><form method="post" onsubmit="return confirm('Eliminare questo profilo e tutti i suoi progressi?')"><input type="hidden" name="csrf" value="<?=csrf_token()?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="profile_id" value="<?=$p['id']?>"><button class="danger">Elimina</button></form></div></div><?php endforeach; ?><h2>Nuovo profilo</h2><form class="new" method="post"><input type="hidden" name="csrf" value="<?=csrf_token()?>"><input type="hidden" name="action" value="create"><input name="name" maxlength="80" placeholder="Nome profilo" required><button>Crea</button></form></main></body></html>
