import React, { FunctionComponent, useMemo, useCallback } from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  FeilutbetalingFakta, AlleKodeverk, Behandling, Aksjonspunkt, AlleKodeverkTilbakekreving,
} from '@fpsak-frontend/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { FaktaPanelCode } from '@fpsak-frontend/konstanter';
import { FaktaAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';
import FeilutbetalingInfoPanel from './components/FeilutbetalingInfoPanel';
import getAlleMerknaderFraBeslutter from '../../felles/util/getAlleMerknaderFraBeslutter';

interface OwnProps {
  behandling: Behandling;
  feilutbetalingFakta: FeilutbetalingFakta;
  fagsakYtelseTypeKode: string;
  aksjonspunkter: Aksjonspunkt[];
  erReadOnlyFn: (aksjonspunkter: Aksjonspunkt[]) => boolean;
  alleKodeverk: AlleKodeverkTilbakekreving;
  fpsakKodeverk: AlleKodeverk;
  submitCallback: (aksjonspunktData: FaktaAksjonspunkt | FaktaAksjonspunkt[]) => Promise<void>;
  formData: any,
  setFormData: (data: any) => void
}

const FeilutbetalingFaktaIndex: FunctionComponent<OwnProps> = ({
  behandling,
  feilutbetalingFakta,
  fagsakYtelseTypeKode,
  aksjonspunkter,
  erReadOnlyFn,
  alleKodeverk,
  fpsakKodeverk,
  submitCallback,
  formData,
  setFormData,
}) => {
  const aksjonspunkterForFeilutbetalingFakta = useMemo(() => (
    aksjonspunkter.filter((ap) => aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING === ap.definisjon)),
  [aksjonspunkter]);

  const alleMerknaderFraBeslutter = useMemo(() => getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForFeilutbetalingFakta),
    [behandling, aksjonspunkterForFeilutbetalingFakta]);
  const readOnly = useMemo(() => erReadOnlyFn(aksjonspunkterForFeilutbetalingFakta), [aksjonspunkterForFeilutbetalingFakta]);

  const setFormDataFeilutbetaling = useCallback((data: any) => setFormData((oldData) => ({
    ...oldData,
    [FaktaPanelCode.FEILUTBETALING]: data,
  })), [setFormData]);

  const { data: feilutbetalingAarsak, state } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK);

  if (state !== RestApiState.SUCCESS) {
    return <LoadingPanel />;
  }

  return (
    <FeilutbetalingInfoPanel
      feilutbetalingFakta={feilutbetalingFakta}
      feilutbetalingAarsak={feilutbetalingAarsak.find((a) => a.ytelseType === fagsakYtelseTypeKode)}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      fpsakKodeverk={fpsakKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={aksjonspunkterForFeilutbetalingFakta.some((ap) => isAksjonspunktOpen(ap.status) && ap.kanLoses)}
      formData={formData[FaktaPanelCode.FEILUTBETALING]}
      setFormData={setFormDataFeilutbetaling}
    />
  );
};

export default FeilutbetalingFaktaIndex;
