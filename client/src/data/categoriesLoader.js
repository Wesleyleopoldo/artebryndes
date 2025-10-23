export function readCategories() {
  try {
    const raw = localStorage.getItem('categories');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveCategories(list) {
  try { localStorage.setItem('categories', JSON.stringify(list)); } catch (e) { }
}
