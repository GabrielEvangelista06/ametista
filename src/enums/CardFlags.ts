export enum CardFlags {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  ELO = 'ELO',
  AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  DINERS_CLUB = 'DINERS_CLUB',
  HIPERCARD = 'HIPERCARD',
  OTHER = 'OTHER',
}

export const CardFlagsDescriptions = {
  [CardFlags.VISA]: 'Visa',
  [CardFlags.MASTERCARD]: 'Mastercard',
  [CardFlags.ELO]: 'Elo',
  [CardFlags.AMERICAN_EXPRESS]: 'American Express',
  [CardFlags.DINERS_CLUB]: 'Diners Club',
  [CardFlags.HIPERCARD]: 'Hipercard',
  [CardFlags.OTHER]: 'Outro',
}
