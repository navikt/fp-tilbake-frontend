import ForeslaVedtakTilbakekrevingAp from './prosess/ForeslaVedtakTilbakekrevingAp';
import VilkarsVurderingAp from './prosess/VilkarsVurderingAp';
import VurderForeldelseAp from './prosess/VurderForeldelseAp';

export type ProsessAksjonspunkt = ForeslaVedtakTilbakekrevingAp
  | VilkarsVurderingAp
  | VurderForeldelseAp;

export default ProsessAksjonspunkt;
