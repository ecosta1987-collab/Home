<?php
require_once __DIR__ . '/../lib/bootstrap.php';
require_login();
require_profile();

$categories = [
  'Scuola' => [
    'Compiti' => ['label'=>'Compiti','emoji'=>'✏️'],
    'Operazioni' => ['label'=>'Operazioni','emoji'=>'➗'],
    'Lettura' => ['label'=>'Lettura','emoji'=>'📖'],
  ],
  'Apprendimento' => [
    'LetturaAvventura' => ['label'=>'Lettura Avventura','emoji'=>'⚽'],
  ],
  'Giochi' => [
    'Scala 40' => ['label'=>'Scala','emoji'=>'🃏'],
  ],
  'Crescita' => [
    'Thrivers' => ['label'=>'Thrivers','emoji'=>'🌱'],
  ],
];

$stmt=db()->prepare('SELECT id,name FROM profiles WHERE user_id=? ORDER BY is_default DESC,id');
$stmt->execute([current_user()['id']]);
$profiles=$stmt->fetchAll();
$currentName='Profilo';
foreach($profiles as $p){
  if((int)$p['id']===active_profile_id()) $currentName=$p['name'];
}
?>
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Applicazioni</title>
  <style>
    body{margin:0;font-family:system-ui;background:#f6f8fc;color:#172033}
    .wrap{max-width:1000px;margin:auto;padding:22px}
    .top{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}
    .links{display:flex;gap:12px;flex-wrap:wrap}.links a{color:#46516a}
    .category{margin-top:34px}
    .category h2{margin:0 0 14px;font-size:1.35rem}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}
    .app{display:block;text-decoration:none;color:inherit;background:#fff;border-radius:24px;padding:24px;box-shadow:0 10px 30px #17203312;font-weight:900;font-size:1.15rem}
    .app span{font-size:2.5rem;display:block;margin-bottom:10px}
    .muted{color:#657087}.profile{background:#e9eefc;padding:8px 12px;border-radius:999px;font-weight:800}
  </style>
</head>
<body>
<main class="wrap">
  <div class="top">
    <div>
      <h1>Applicazioni</h1>
      <div class="muted">Ciao <?=htmlspecialchars(current_user()['name'])?> · <span class="profile"><?=htmlspecialchars($currentName)?></span></div>
    </div>
    <div class="links">
      <a href="/">Sito pubblico</a>
      <a href="/profiles.php">Profili</a>
      <?php if(is_admin()): ?><a href="/admin/">Admin</a><?php endif; ?>
      <a href="/auth/logout.php">Esci</a>
    </div>
  </div>

  <?php foreach($categories as $categoryName=>$apps): ?>
    <?php
      $visibleApps=[];
      foreach($apps as $key=>$a){
        if(app_allowed($key)) $visibleApps[$key]=$a;
      }
      if(!$visibleApps) continue;
    ?>
    <section class="category">
      <h2><?=htmlspecialchars($categoryName)?></h2>
      <div class="grid">
        <?php foreach($visibleApps as $key=>$a): ?>
          <a class="app" href="/Applicazioni/<?=rawurlencode($key)?>/"><span><?=$a['emoji']?></span><?=htmlspecialchars($a['label'])?></a>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endforeach; ?>
</main>
</body>
</html>
