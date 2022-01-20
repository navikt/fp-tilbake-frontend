import AksjonspunktKodeTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import AksjonspunktTilBekreftelse from '../AksjonspunktTilBekreftelse';

type AvklartFaktaFeilutbetalingAp = {
  feilutbetalingFakta: {
    fom: string;
    tom: string;
    årsak: {
      hendelseType: string;
      hendelseUndertype: string;
    }
  }[];
} & AksjonspunktTilBekreftelse<AksjonspunktKodeTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING>;

export default AvklartFaktaFeilutbetalingAp;
