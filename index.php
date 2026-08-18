<?php
require_once __DIR__ . '/lib/bootstrap.php';
$apps = [
  'Compiti' => ['label'=>'Compiti','emoji'=>'✏️'],
  'CompitiVacanze' => ['label'=>'Compiti vacanze','emoji'=>'🏖️'],
  'Lettura' => ['label'=>'Lettura','emoji'=>'📖'],
  'LetturaAvventura' => ['label'=>'Lettura Avventura','emoji'=>'⚽'],
  'Operazioni' => ['label'=>'Operazioni','emoji'=>'➗'],
  'Scala' => ['label'=>'Scala','emoji'=>'🎵'],
  'Thrivers' => ['label'=>'Thrivers','emoji'=>'🌱'],
];
if (!is_logged_in()):
?><!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Home</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui;background:#f5f7fb;color:#172033}.card{width:min(92vw,520px);background:#fff;border-radius:28px;padding:36px;box-shadow:0 20px 60px #17203322;text-align:center}h1{font-size:clamp(2.2rem,8vw,4rem);margin:.2em 0}.google{display:inline-flex;align-items:center;gap:10px;text-decoration:none;background:#fff;color:#172033;border:1px solid #d7dce5;border-radius:16px;padding:14px 18px;font-weight:800;box-shadow:0 4px 14px #17203318}</style></head><body><main class="card"><div style="font-size:4rem">🏡</div><h1>Home</h1><p>Accedi per continuare.</p><a class="google" href="/auth/login.php">G&nbsp;&nbsp;Continua con Google</a></main></body></html><?php exit; endif;
require_profile();
$stmt=db()->prepare('SELECT id,name FROM profiles WHERE user_id=? ORDER BY is_default DESC,id');$stmt->execute([current_user()['id']]);$profiles=$stmt->fetchAll();
$currentName='Profilo';foreach($profiles as $p){if((int)$p['id']===active_profile_id())$currentName=$p['name'];}
?><!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Home</title><style>body{margin:0;font-family:system-ui;background:#f6f8fc;color:#172033}.wrap{max-width:1000px;margin:auto;padding:22px}.top{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}.links a{margin-left:10px;color:#46516a}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-top:24px}.app{display:block;text-decoration:none;color:inherit;background:#fff;border-radius:24px;padding:24px;box-shadow:0 10px 30px #17203312;font-weight:900;font-size:1.15rem}.app span{font-size:2.5rem;display:block;margin-bottom:10px}.muted{color:#657087}.profile{background:#e9eefc;padding:8px 12px;border-radius:999px;font-weight:800}</style></head><body><main class="wrap"><div class="top"><div><h1>Home</h1><div class="muted">Ciao <?=htmlspecialchars(current_user()['name'])?> · <span class="profile"><?=htmlspecialchars($currentName)?></span></div></div><div class="links"><a href="/profiles.php">Profili</a><?php if(is_admin()): ?><a href="/admin/">Admin</a><?php endif; ?><a href="/auth/logout.php">Esci</a></div></div><div class="grid"><?php foreach($apps as $key=>$a): if(!app_allowed($key))continue; ?><a class="app" href="/<?=rawurlencode($key)?>/"><span><?=$a['emoji']?></span><?=htmlspecialchars($a['label'])?></a><?php endforeach; ?></div></main></body></html>
