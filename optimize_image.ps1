
Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\arian\arian\Escritorio\Programacion\Portafolio\pc-builder-lite\public\preview-image.png"
$destPath = "c:\Users\arian\arian\Escritorio\Programacion\Portafolio\pc-builder-lite\public\preview-image.jpg"

if (-Not (Test-Path $sourcePath)) {
    Write-Error "Source file not found: $sourcePath"
    exit 1
}

try {
    $image = [System.Drawing.Image]::FromFile($sourcePath)
    $image.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $image.Dispose()
    Write-Host "Successfully converted to $destPath"
} catch {
    Write-Error "Failed to convert image: $_"
    exit 1
}
