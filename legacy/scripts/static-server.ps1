param(
  [int]$Port = 5500,
  [string]$Root = (Join-Path $PSScriptRoot "..")
)

$Root = (Resolve-Path $Root).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://localhost:$Port/"

$mimeMap = @{
  ".html" = "text/html"
  ".htm"  = "text/html"
  ".css"  = "text/css"
  ".js"   = "application/javascript"
  ".jsx"  = "text/babel"
  ".json" = "application/json"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response
  try {
    $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
    if ($urlPath -eq "/") { $urlPath = "/index.html" }
    $filePath = Join-Path $Root ($urlPath.TrimStart("/"))
    $filePath = [System.IO.Path]::GetFullPath($filePath)

    if (-not $filePath.StartsWith($Root)) {
      $response.StatusCode = 403
      $response.Close()
      continue
    }

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = $mimeMap[$ext]
      if (-not $mime) { $mime = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentType = $mime
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("Not found: $urlPath")
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    $response.StatusCode = 500
    Write-Host "Error: $_"
  } finally {
    $response.Close()
  }
}
