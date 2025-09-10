export function getTrashBin(category: string) {
  switch(category) {
    case 'Plastique': return 'Poubelle Jaune';
    case 'Papier': return 'Poubelle Bleue';
    case 'Métal': return 'Poubelle Jaune';
    case 'Verre': return 'Poubelle Verte';
    default: return 'Poubelle Générale';
  }
}
