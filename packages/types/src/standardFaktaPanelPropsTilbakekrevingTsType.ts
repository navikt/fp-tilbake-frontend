import { FaktaAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import Aksjonspunkt from './aksjonspunktTsType';
import AlleKodeverkTilbakekreving from './kodeverkAlleTilbakekrevingTsType';

type StandardFaktaPanelPropsTilbakekreving = Readonly<{
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
  submitCallback: (aksjonspunktData: FaktaAksjonspunkt | FaktaAksjonspunkt[]) => Promise<void>;
  alleKodeverk: AlleKodeverkTilbakekreving;
  formData?: any,
  setFormData: (data: any) => void,
}>

export default StandardFaktaPanelPropsTilbakekreving;
