<?php
require_once __DIR__ . '/lib/bootstrap.php';

$homeApps = [
  'Compiti' => 'Compiti',
  'Operazioni' => 'Operazioni',
  'Lettura' => 'Lettura',
  'LetturaAvventura' => 'Lettura Avventura',
  'MissioneNumeri' => 'Missione Numeri',
  'Scala' => 'Scala 40',
  'Thrivers' => 'Thrivers',
];

$visibleHomeApps = [];
if (is_logged_in()) {
  foreach ($homeApps as $key => $label) {
    if (app_allowed($key)) {
      $visibleHomeApps[$key] = $label;
    }
  }
}
?>
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Elisa Costa</title>
  <style>
    :root{
      --bg:#fbf8f3;
      --paper:#fffdf9;
      --ink:#181513;
      --muted:#746b63;
      --line:#e8dfd6;
      --orange:#ef6c24;
      --orange-soft:#f8c8aa;
      --apricot:#ffe2c8;
      --rose:#f4d6d0;
      --sage:#dfe6d7;
      --sand:#f1e6cf;
      --max:980px;
    }

    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      background:var(--bg);
      color:var(--ink);
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      line-height:1.72;
      text-rendering:optimizeLegibility;
    }

    .wrap{
      width:min(calc(100% - 36px),var(--max));
      margin:0 auto;
    }

    header{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:24px 0;
    }

    .brand{
      font-weight:800;
      letter-spacing:-.03em;
    }

    .private{
      text-decoration:none;
      color:var(--ink);
      font-size:.92rem;
      font-weight:700;
      padding:9px 14px;
      border:1px solid var(--line);
      border-radius:999px;
      background:rgba(255,255,255,.65);
    }

    .account{position:relative}
    .account summary{
      list-style:none;
      cursor:pointer;
      color:var(--ink);
      font-size:.92rem;
      font-weight:700;
      padding:9px 14px;
      border:1px solid var(--line);
      border-radius:999px;
      background:rgba(255,255,255,.72);
      user-select:none;
    }
    .account summary::-webkit-details-marker{display:none}
    .account-menu{
      position:absolute;
      right:0;
      top:calc(100% + 10px);
      width:min(290px,calc(100vw - 36px));
      padding:12px;
      border:1px solid var(--line);
      border-radius:18px;
      background:var(--paper);
      box-shadow:0 18px 45px rgba(44,31,20,.12);
      z-index:30;
    }
    .account-name{
      padding:7px 9px 11px;
      color:var(--muted);
      font-size:.86rem;
      border-bottom:1px solid var(--line);
      margin-bottom:6px;
    }
    .account-menu a{
      display:block;
      padding:9px;
      border-radius:10px;
      text-decoration:none;
      color:var(--ink);
      font-size:.92rem;
      font-weight:650;
    }
    .account-menu a:hover{background:#f7eee6}
    .account-menu .logout{
      margin-top:6px;
      padding-top:10px;
      border-top:1px solid var(--line);
      color:var(--orange);
    }
    .menu-title{
      padding:8px 9px 3px;
      color:var(--muted);
      text-transform:uppercase;
      letter-spacing:.08em;
      font-size:.68rem;
      font-weight:800;
    }

    .hero{
      padding:110px 0 120px;
      position:relative;
    }

    .hero::before{
      content:"";
      position:absolute;
      width:240px;
      height:240px;
      border-radius:50%;
      background:var(--apricot);
      filter:blur(2px);
      right:1%;
      top:48px;
      z-index:-1;
      opacity:.82;
    }

    .kicker{
      text-transform:uppercase;
      letter-spacing:.12em;
      font-size:.76rem;
      font-weight:800;
      color:var(--orange);
      margin-bottom:18px;
    }

    h1,h2,.statement,.questions{
      font-family:Georgia,"Times New Roman",serif;
      font-weight:400;
    }

    h1{
      margin:0;
      max-width:860px;
      font-size:clamp(3.5rem,8.8vw,7.2rem);
      line-height:.95;
      letter-spacing:-.05em;
    }

    .lead{
      max-width:720px;
      margin-top:32px;
      font-size:clamp(1.18rem,2.2vw,1.42rem);
      color:#37312d;
    }

    .intro{
      max-width:680px;
      margin-top:22px;
      color:var(--muted);
      font-size:1.04rem;
    }

    section{
      padding:88px 0;
      border-top:1px solid var(--line);
    }

    .section-grid{
      display:grid;
      grid-template-columns:220px minmax(0,1fr);
      gap:72px;
      align-items:start;
    }

    .label{
      text-transform:uppercase;
      letter-spacing:.11em;
      font-size:.72rem;
      font-weight:800;
      color:var(--orange);
      margin-bottom:12px;
    }

    h2{
      margin:0;
      font-size:clamp(2rem,4vw,3.5rem);
      line-height:1.04;
      letter-spacing:-.03em;
    }

    .copy{
      max-width:720px;
      font-size:1.06rem;
    }

    .copy p{margin:0 0 18px}
    .copy p:last-child{margin-bottom:0}

    .statement{
      margin:34px 0 0;
      padding:24px 28px;
      border-radius:18px;
      background:var(--paper);
      border:1px solid var(--line);
      font-size:clamp(1.35rem,2.8vw,2rem);
      line-height:1.35;
      box-shadow:0 12px 28px rgba(44,31,20,.04);
    }

    .soft-band{
      margin:0 calc((100vw - min(calc(100vw - 36px),var(--max)))/-2);
      padding-left:max(18px,calc((100vw - var(--max))/2));
      padding-right:max(18px,calc((100vw - var(--max))/2));
      background:linear-gradient(90deg,#fff6ef 0%,#fef2e8 45%,#f6eadf 100%);
    }

    .soft-band section{
      border-top:none;
    }

    .work-accent{
      position:relative;
    }

    .work-accent::after{
      content:"";
      position:absolute;
      left:0;
      bottom:0;
      width:76px;
      height:5px;
      background:var(--orange);
      border-radius:999px;
    }

    .questions{
      margin:30px 0 26px;
      font-size:clamp(1.45rem,3vw,2.15rem);
      line-height:1.35;
      letter-spacing:-.02em;
    }

    .questions div{margin:8px 0}

    .ending{
      padding-bottom:120px;
    }

    .rainbow{
      margin-top:36px;
      padding:28px 30px;
      border-radius:22px;
      background:
        linear-gradient(135deg,
          rgba(239,108,36,.20),
          rgba(244,214,208,.55) 32%,
          rgba(223,230,215,.72) 68%,
          rgba(241,230,207,.75));
      border:1px solid rgba(239,108,36,.12);
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(1.6rem,3.2vw,2.5rem);
      line-height:1.25;
    }

    footer{
      border-top:1px solid var(--line);
      padding:28px 0 42px;
      display:flex;
      justify-content:space-between;
      gap:20px;
      color:var(--muted);
      font-size:.9rem;
    }

    footer a{
      color:var(--orange);
      text-decoration:none;
      font-weight:800;
    }

    @media(max-width:760px){
      .hero{padding:80px 0 88px}
      .hero::before{width:170px;height:170px;top:28px;right:-28px}
      section{padding:68px 0}
      .section-grid{grid-template-columns:1fr;gap:28px}
      .soft-band{
        margin-left:-18px;
        margin-right:-18px;
        padding-left:18px;
        padding-right:18px;
      }
      footer{flex-direction:column}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brand">Elisa Costa</div>
      <?php if (!is_logged_in()): ?>
        <a class="private" href="/auth/login.php?next=%2F">Accedi</a>
      <?php else: ?>
        <details class="account">
          <summary><?= htmlspecialchars(current_user()['name'] ?: 'Account') ?></summary>
          <div class="account-menu">
            <div class="account-name">Area personale</div>
            <a href="/Applicazioni/">Tutte le applicazioni</a>
            <?php if ($visibleHomeApps): ?>
              <div class="menu-title">Applicazioni abilitate</div>
              <?php foreach ($visibleHomeApps as $key => $label): ?>
                <a href="/Applicazioni/<?= rawurlencode($key) ?>/"><?= htmlspecialchars($label) ?></a>
              <?php endforeach; ?>
            <?php endif; ?>
            <a href="/profiles.php">Profili</a>
            <?php if (is_admin()): ?><a href="/admin/">Admin</a><?php endif; ?>
            <a class="logout" href="/auth/logout.php">Esci</a>
          </div>
        </details>
      <?php endif; ?>
    </header>

    <main>
      <section class="hero" style="border-top:none">
        <div class="kicker">Ciao, sono Elisa</div>
        <h1>Curiosa, ambiziosa, sempre in movimento.</h1>
        <p class="lead">
          Mi piace capire come funzionano le cose, imparare qualcosa di nuovo
          e avere sempre una sfida davanti.
        </p>
        <p class="intro">
          Sono pragmatica, competitiva e molto razionale. Mi appassiono facilmente,
          provo cose nuove e spesso mi ritrovo con più interessi aperti contemporaneamente.
          Alcuni restano per anni, altri abbastanza da insegnarmi qualcosa.
        </p>
      </section>

      <section>
        <div class="section-grid">
          <div>
            <div class="label">Valori</div>
            <h2>Le cose che contano</h2>
          </div>
          <div class="copy">
            <p>
              Giustizia, rispetto, onestà, integrità, solidarietà e sostenibilità.
              Per me non sono parole da mettere in fila, ma criteri con cui provare
              a scegliere e a comportarsi.
            </p>
            <p>
              Faccio fatica con la mancanza di trasparenza e con chi cerca di ottenere
              un vantaggio a discapito degli altri.
            </p>
            <div class="statement">È coerente con quello in cui credo?</div>
            <p style="margin-top:18px">
              Quando devo prendere una decisione importante posso ragionarci molto,
              ma alla fine questa è la domanda che pesa più delle altre.
            </p>
          </div>
        </div>
      </section>

      <div class="soft-band">
        <section>
          <div class="section-grid">
            <div>
              <div class="label">Famiglia</div>
              <h2>La mia base</h2>
            </div>
            <div class="copy">
              <p>
                Sono mamma di tre bambini e la famiglia è una parte centrale della mia vita.
              </p>
              <p>
                Io e mio marito abbiamo costruito nel tempo un equilibrio che ci permette
                di sostenerci a vicenda, anche quando il lavoro richiede più tempo,
                più energie o qualche periodo lontano da casa.
              </p>
              <p>
                Non significa che tutto sia sempre perfettamente organizzato.
                Significa sapere che possiamo contarci, adattarci e fare spazio ai progetti
                dell’altro senza perdere il senso di quello che stiamo costruendo insieme.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div class="section-grid">
          <div>
            <div class="label">Fuori dal lavoro</div>
            <h2>Le cose che mi fanno stare bene</h2>
          </div>
          <div class="copy">
            <p>
              Leggo. Molto. Pratico thai boxe da quasi dieci anni, mi piacciono
              le passeggiate in montagna, un bel film e le giornate in cui posso
              perdermi dentro un libro.
            </p>
            <p>
              Ho anche una certa necessità di avere sempre qualcosa da risolvere:
              Sudoku, cubo di Rubik, Settimana Enigmistica e qualunque altra cosa
              possa farmi pensare “vediamo se ci riesco”.
            </p>
            <p>
              Tra i prossimi obiettivi c’è imparare a usare bene una macchina da cucire.
              Preferisco una tisana al caffè, l’estate all’inverno e, tra cane e gatto,
              scelgo il gatto.
            </p>
            
          </div>
        </div>
      </section>

      <section>
        <div class="section-grid">
          <div>
            <div class="label">Progetti</div>
            <h2>Curiosità applicata</h2>
          </div>
          <div class="copy">
            <p>
              Mi piace sperimentare strumenti nuovi, provare, costruire qualcosa
              e vedere se funziona.
            </p>
            <p>
              I progetti e le applicazioni raccolti su questo sito sono nati in modi diversi:
              alcuni da idee mie, alcuni insieme ad altre persone, altri direttamente
              da chi ha contribuito al progetto.
            </p>
            <p>
              Alcuni nascono da esigenze concrete, anche familiari; altri dalla curiosità
              di provare qualcosa di nuovo. Quello che li accomuna è la voglia di trasformare
              un’idea in qualcosa di concreto.
            </p>
          </div>
        </div>
      </section>

      <div class="soft-band">
        <section>
          <div class="section-grid">
            <div class="work-accent">
              <div class="label">Percorso</div>
              <h2>Una parte del mio percorso</h2>
            </div>
            <div class="copy">
              <p>
                Il lavoro è una parte importante della mia vita. Ho iniziato da una formazione
                tecnica e sono cresciuta lavorando su problemi sempre più diversi:
                tecnologia, progettazione di soluzioni, organizzazione, decisioni,
                clienti, partner e business.
              </p>
              <p>
                La cosa che mi piace di più è poter passare da un punto di vista all’altro:
                capire la parte tecnica e, allo stesso tempo, vedere cosa significa
                per le persone, per il business e per le decisioni.
              </p>
              <p>
                Negli anni ho continuato a investire nella mia crescita, anche attraverso
                formazione, un Executive MBA e certificazioni professionali.
              </p>
              <p>
                Mi interessa molto anche la sostenibilità, soprattutto quando diventa
                qualcosa di concreto e non solo una dichiarazione di principio.
              </p>
              <div class="statement">
                Ogni passo ha aggiunto qualcosa al precedente, senza cancellarlo.
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="ending">
        <div class="section-grid">
          <div>
            <div class="label">Nel tempo</div>
            <h2>Una cosa che ho capito</h2>
          </div>
          <div class="copy">
            <p>
              Per molto tempo ho pensato che gli altri fossero molto più concentrati
              su di noi di quanto in realtà siano.
            </p>

            <div class="questions">
              <div>“Sarò abbastanza brava?”</div>
              <div>“Sono vestita bene?”</div>
              <div>“Sto dicendo la cosa giusta?”</div>
            </div>

            <p>
              Poi ho capito che, molto spesso, anche la persona davanti a noi
              sta probabilmente facendo esattamente lo stesso.
            </p>
            <p>
              Ricordarmelo mi aiuta a prendere le cose con un po’ più di leggerezza.
            </p>
            <p>
              E, più in generale, negli anni ho imparato a fidarmi anche di un’altra cosa:
              i momenti difficili passano, cambiano prospettiva e spesso lasciano qualcosa dietro di sé.
            </p>

            <div class="rainbow">
              Dopo i temporali, prima o poi, arriva sempre un arcobaleno.
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <span>Elisa Costa</span>
      <?php if (is_logged_in()): ?>
        <a href="/Applicazioni/">Applicazioni →</a>
      <?php else: ?>
        <a href="/auth/login.php?next=%2FApplicazioni%2F">Accedi alle applicazioni →</a>
      <?php endif; ?>
    </footer>
  </div>
</body>
</html>
