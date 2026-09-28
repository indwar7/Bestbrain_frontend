<?php
/**
 * FALLBACK FIX, only needed if the .htaccess mod_proxy rule (see
 * htaccess-snippet.txt) gives a 500 error, meaning Apache's mod_proxy
 * isn't enabled on this Hostinger plan. Most shared hosting supports PHP
 * even when mod_proxy is locked down, so this reverse-proxies over cURL
 * instead.
 *
 * LIMITATION: this does NOT support WebSockets. Anything using
 * /socket.io/* (live classes' real-time connection) will still be broken
 * under this fallback - PHP's request/response model can't hold a
 * long-lived socket open. If live classes matter, the mod_proxy route
 * (or moving off Hostinger for API traffic) is the only real fix for that
 * part.
 *
 * SETUP:
 * 1. Upload this file next to bestbrainplus.com's live index.html.
 * 2. Add this to .htaccess in that same directory:
 *      RewriteEngine On
 *      RewriteCond %{REQUEST_URI} ^/backend-api/
 *      RewriteRule ^backend-api/(.*)$ backend-api-proxy.php?path=$1 [QSA,L]
 * 3. Test: https://bestbrainplus.com/backend-api/api/health should return
 *    {"status":"ok","service":"edulearn-backend"}.
 */

// Shared hosts vary in whether display_errors is on; a stray notice/warning
// would otherwise print into the response body ahead of the real JSON and
// corrupt it (caught locally: curl_close() is a deprecated no-op as of
// PHP 8.5 and did exactly this during testing). Force it off so this script's
// own output is always clean, regardless of the host's php.ini.
ini_set('display_errors', '0');

$origin = 'https://api.bestbrainplus.com';

$path = isset($_GET['path']) ? $_GET['path'] : '';
$query = $_SERVER['QUERY_STRING'] ?? '';
$query = preg_replace('/^path=[^&]*&?/', '', $query);
$url = $origin . '/' . ltrim($path, '/') . ($query !== '' ? ('?' . $query) : '');

$method = $_SERVER['REQUEST_METHOD'];
$forwardHeaders = [];
foreach (getallheaders() as $name => $value) {
    if (strtolower($name) === 'host') {
        continue;
    }
    $forwardHeaders[] = "$name: $value";
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 25);
if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Upstream backend unreachable', 'detail' => curl_error($ch)]);
    exit;
}

$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

http_response_code($statusCode);
foreach (explode("\r\n", $responseHeaders) as $line) {
    $skip = stripos($line, 'Transfer-Encoding:') === 0
        || stripos($line, 'Connection:') === 0
        || stripos($line, 'HTTP/') === 0;
    if (!$skip && trim($line) !== '' && strpos($line, ':') !== false) {
        header($line);
    }
}
echo $responseBody;
