/** Formatage stable serveur/client (pas d'Intl pour éviter les écarts d'hydratation). */
export function formatKz(amount) {
  const digits = String(Math.round(amount));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return `${grouped} Kz`;
}
