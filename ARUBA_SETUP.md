# Setup su Aruba — elisacosta.it

Questa versione usa PHP + MySQL Aruba e Google come unico metodo di login.

## 1. Database MySQL

Quando MySQL Aruba è attivo:

1. apri phpMyAdmin dal pannello Aruba;
2. seleziona il database;
3. importa `database/schema.sql`;
4. conserva host, nome database, utente e password.

## 2. Configurazione privata

Sul server Aruba copia `config.example.php` in `config.php` e compila:

- `google_client_id`
- `google_client_secret`
- `admin_email` — l'account Google che può aprire `/admin/`
- host/nome/utente/password MySQL

`config.php` è escluso da Git e non deve essere caricato su GitHub.

## 3. Google OAuth

In Google Cloud Console crea/configura un client OAuth 2.0 di tipo **Web application**.

Redirect URI autorizzato:

`https://www.elisacosta.it/auth/callback.php`

L'app richiede soltanto gli scope OpenID standard: `openid email profile`.

Inserisci Client ID e Client Secret nel `config.php` sul server Aruba.

## 4. Pubblicazione

Carica nella root web di `www.elisacosta.it` il contenuto del repository, incluso `.htaccess`.

La pagina `/` mostra soltanto il pulsante **Continua con Google** se non sei autenticato.

Dopo il login:

- `/profiles.php` gestisce profili con progressi separati;
- `/admin/` è visibile solo all'email configurata come amministratore;
- tutte le app sono protette dal login;
- Compiti, CompitiVacanze, Lettura, LetturaAvventura, Operazioni e Thrivers sincronizzano i progressi col profilo attivo;
- Scala è protetta dal login ma non salva progressi sul database.

## 5. Sicurezza

- Non committare mai `config.php`.
- Non inserire password MySQL o Client Secret Google nei file HTML/JavaScript.
- Usa sempre HTTPS in produzione.
- La vecchia apertura diretta degli `index.html` viene rediretta ai wrapper PHP autenticati tramite `.htaccess`.
