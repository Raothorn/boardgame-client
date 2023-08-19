
const abilityCards = [
  {label: "Triage"},
  {label: "Focused Mind"},
  {label: "Counsel"},
]

export function getAbilityCard(index: number) {
  let card = abilityCards[index]
  let imgSrc = `/assets/ability_card_deck/${index}.png`;

  return {label: card.label, imgSrc: imgSrc};
}

export default getAbilityCard
