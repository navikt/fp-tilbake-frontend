import AksjonspunktCodeTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import AksjonspunktTilBekreftelse from '../AksjonspunktTilBekreftelse';

type VilkårResultatAktsomhet = {
  sarligGrunner: string[];
  harGrunnerTilReduksjon?: number;
  andelTilbakekreves?: number;
  ileggRenter?: boolean;
  tilbakekrevesBelop?: number;
  tilbakekrevSelvOmBeloepErUnder4Rettsgebyr?: boolean;
  annetBegrunnelse?: string;
  sarligGrunnerBegrunnelse?: string;
}

type VilkårResultatAnnet = {
  aktsomhet: string;
  aktsomhetInfo: VilkårResultatAktsomhet;
}

type VilkårResultatGodTro = {
  erBelopetIBehold?: boolean;
  tilbakekrevesBelop?: number;
}

type VilkarsVurderingAp = {
  vilkarsVurdertePerioder: {
    fom: string;
    tom: string;
    vilkarResultat: string;
    begrunnelse?: string;
    vilkarResultatInfo: {
      begrunnelse?: string;
    } & (VilkårResultatAnnet | VilkårResultatGodTro);
    feilutbetalingBelop?: number;
  }[];
} & AksjonspunktTilBekreftelse<AksjonspunktCodeTilbakekreving.VURDER_TILBAKEKREVING>;

export default VilkarsVurderingAp;
