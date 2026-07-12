function shareSymbol(platform) {
  const url = window.location.href;
  const title = document.title;
  const text = document.querySelector('.symbol-detail-info p')?.textContent || '';
  
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  };
  
  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}