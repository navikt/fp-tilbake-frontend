import React, { FunctionComponent } from 'react';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  FeilutbetalingFakta, AlleKodeverk, StandardFaktaPanelPropsTilbakekreving,
} from '@fpsak-frontend/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import FeilutbetalingInfoPanel from './components/FeilutbetalingInfoPanel';

interface OwnProps {
  feilutbetalingFakta: FeilutbetalingFakta;
  fpsakKodeverk: AlleKodeverk;
  fagsakYtelseTypeKode: string;
}

const FeilutbetalingFaktaIndex: FunctionComponent<OwnProps & StandardFaktaPanelPropsTilbakekreving> = ({
  feilutbetalingFakta,
  fagsakYtelseTypeKode,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  fpsakKodeverk,
  submitCallback,
  readOnly,
  formData,
  setFormData,
}) => {
  const { data: feilutbetalingAarsak, state } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK);

  if (state !== RestApiState.SUCCESS) {
    return <LoadingPanel />;
  }

  return (
    <FeilutbetalingInfoPanel
      feilutbetalingFakta={feilutbetalingFakta}
      feilutbetalingAarsak={feilutbetalingAarsak.find((a) => a.ytelseType.kode === fagsakYtelseTypeKode)}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      fpsakKodeverk={fpsakKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses)}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default FeilutbetalingFaktaIndex;
