import React, { FunctionComponent, useMemo, useCallback } from 'react';

import { FaktaPanelCode } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Aksjonspunkt, AlleKodeverk, AlleKodeverkTilbakekreving, Behandling,
} from '@fpsak-frontend/types';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { FaktaAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';
import RegistrereVergeInfoPanel from './components/RegistrereVergeInfoPanel';
import getAlleMerknaderFraBeslutter from '../../felles/util/getAlleMerknaderFraBeslutter';

type OwnProps = {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk | AlleKodeverkTilbakekreving;
  submitCallback: (aksjonspunktData: FaktaAksjonspunkt | FaktaAksjonspunkt[]) => Promise<void>;
  erReadOnlyFn: (aksjonspunkter: Aksjonspunkt[]) => boolean;
  formData?: any,
  setFormData: (data: any) => void
};

const VergeFaktaIndex: FunctionComponent<OwnProps> = ({
  behandling,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  erReadOnlyFn,
  formData,
  setFormData,
}) => {
  const { data: verge, state } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.VERGE);

  const aksjonspunkterForVergeFakta = useMemo(() => (
    aksjonspunkter.filter((ap) => aksjonspunktCodes.AVKLAR_VERGE === ap.definisjon.kode)),
  [aksjonspunkter]);

  const alleMerknaderFraBeslutter = useMemo(() => getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForVergeFakta),
    [behandling, aksjonspunkterForVergeFakta]);
  const readOnly = useMemo(() => erReadOnlyFn(aksjonspunkterForVergeFakta), [aksjonspunkterForVergeFakta]);

  const setFormDataVerge = useCallback((data: any) => setFormData((oldData) => ({
    ...oldData,
    [FaktaPanelCode.VERGE]: data,
  })), [setFormData]);

  if (state !== RestApiState.SUCCESS) {
    return <LoadingPanel />;
  }

  return (
    <RegistrereVergeInfoPanel
      verge={verge}
      aksjonspunkter={aksjonspunkterForVergeFakta}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      hasOpenAksjonspunkter={aksjonspunkterForVergeFakta.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses)}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      submittable={!aksjonspunkterForVergeFakta.some((ap) => isAksjonspunktOpen(ap.status.kode)) || aksjonspunkter.some((ap) => ap.kanLoses)}
      formData={formData[FaktaPanelCode.VERGE]}
      setFormData={setFormDataVerge}
    />
  );
};

export default VergeFaktaIndex;
