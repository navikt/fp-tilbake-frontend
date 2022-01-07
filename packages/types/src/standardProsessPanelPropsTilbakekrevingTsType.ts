import Behandling from './behandlingTsType';
import AlleKodeverkTilbakekreving from './kodeverkAlleTilbakekrevingTsType';

interface StandardProsessPanelPropsTilbakekreving {
  behandling: Behandling;
  alleKodeverk: AlleKodeverkTilbakekreving;
  isReadOnly: boolean;
  formData?: any;
  setFormData: (data: any) => void;
}

export default StandardProsessPanelPropsTilbakekreving;
