#!/bin/bash

# Script para baixar imagens de destinos de alta qualidade
# Requer: curl ou wget

DEST_DIR="./public/images/destinations"

# URLs diretas de imagens de alta qualidade do Unsplash
declare -A images=(
  ["paris.jpg"]="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop&q=80"
  ["tokyo.jpg"]="https://images.unsplash.com/photo-1540959375944-7049f642e9c1?w=1920&h=1080&fit=crop&q=80"
  ["bali.jpg"]="https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=1920&h=1080&fit=crop&q=80"
  ["newyork.jpg"]="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&h=1080&fit=crop&q=80"
  ["dubai.jpg"]="https://images.unsplash.com/photo-1518684079-7c8587dc0ee1?w=1920&h=1080&fit=crop&q=80"
  ["barcelona.jpg"]="https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1920&h=1080&fit=crop&q=80"
  ["amsterdam.jpg"]="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&h=1080&fit=crop&q=80"
  ["santorini.jpg"]="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1920&h=1080&fit=crop&q=80"
  ["bangkok.jpg"]="https://images.unsplash.com/photo-1552465881-721a1215a052?w=1920&h=1080&fit=crop&q=80"
  ["sydney.jpg"]="https://images.unsplash.com/photo-1506973404872-a4a41e01b47e?w=1920&h=1080&fit=crop&q=80"
)

# Criar diretório se não existir
mkdir -p "$DEST_DIR"

# Fazer download das imagens
echo "Baixando imagens de destinos..."
for filename in "${!images[@]}"; do
  url="${images[$filename]}"
  filepath="$DEST_DIR/$filename"
  
  if [ ! -f "$filepath" ]; then
    echo "Baixando $filename..."
    curl -L -o "$filepath" "$url" --progress-bar
    echo ""
  else
    echo "$filename já existe, pulando..."
  fi
done

echo "✅ Download concluído!"
