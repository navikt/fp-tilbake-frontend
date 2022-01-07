import { ProsessAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import Aksjonspunkt from './aksjonspunktTsType';
import Behandling from './behandlingTsType';
import AlleKodeverkTilbakekreving from './kodeverkAlleTilbakekrevingTsType';

interface StandardProsessPanelPropsTilbakekreving {
  behandling: Behandling;
  alleKodeverk: AlleKodeverkTilbakekreving;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
  submitCallback: (aksjonspunktData: ProsessAksjonspunkt | ProsessAksjonspunkt[]) => Promise<void>;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: Aksjonspunkt[];
  formData?: any;
  setFormData: (data: any) => void;
}

export default StandardProsessPanelPropsTilbakekreving;
