import AksjonspunktCodeTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import AksjonspunktTilBekreftelse from '../AksjonspunktTilBekreftelse';

type VurderForeldelseAp = {
  foreldelsePerioder: {
    fraDato: string;
    tilDato: string;
    foreldelseVurderingType: string;
    begrunnelse: string;
  }[];
} & AksjonspunktTilBekreftelse<AksjonspunktCodeTilbakekreving.VURDER_FORELDELSE>;

export default VurderForeldelseAp;
