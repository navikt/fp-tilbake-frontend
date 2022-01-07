import React, { FunctionComponent } from 'react';

import { FeilutbetalingPerioderWrapper, StandardProsessPanelPropsTilbakekreving } from '@fpsak-frontend/types';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import ForeldelseForm from './components/ForeldelseForm';

interface OwnProps {
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  navBrukerKjonn: string;
}

const ForeldelseProsessIndex: FunctionComponent<OwnProps & StandardProsessPanelPropsTilbakekreving> = ({
  behandling,
  perioderForeldelse,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  formData,
  setFormData,
}) => {
  const { startRequest: beregnBelop } = restApiTilbakekrevingHooks.useRestApiRunner(TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP);

  return (
    <ForeldelseForm
      behandlingUuid={behandling.uuid}
      perioderForeldelse={perioderForeldelse}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      aksjonspunkt={aksjonspunkter[0]}
      readOnlySubmitButton={readOnlySubmitButton}
      navBrukerKjonn={navBrukerKjonn}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      beregnBelop={beregnBelop}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default ForeldelseProsessIndex;
