const Favorites = {
  getAll() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  },
  
  add(id) {
    const favs = this.getAll();
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem('favorites', JSON.stringify(favs));
    }
  },
  
  remove(id) {
    const favs = this.getAll().filter(f => f !== id);
    localStorage.setItem('favorites', JSON.stringify(favs));
  },
  
  isFavorite(id) {
    return this.getAll().includes(id);
  },
  
  toggle(id) {
    if (this.isFavorite(id)) {
      this.remove(id);
      return false;
    } else {
      this.add(id);
      return true;
    }
  }
};