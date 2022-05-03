import { Aksjonspunkt } from '@navikt/ft-types';

enum AksjonspunktCode {
  FORESLA_VEDTAK = '5015',
  AVKLAR_VERGE = '5030',
  AUTO_MANUELT_SATT_PÅ_VENT = '7001',
}

export const hasAksjonspunkt = (aksjonspunktKode: string, aksjonspunkter: Aksjonspunkt[]): boolean => aksjonspunkter
  .some((ap) => ap.definisjon === aksjonspunktKode);

export default AksjonspunktCode;
