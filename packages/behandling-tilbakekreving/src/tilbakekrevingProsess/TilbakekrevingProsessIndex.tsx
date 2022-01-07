import React, { FunctionComponent } from 'react';

import {
  DetaljerteFeilutbetalingsperioder, FeilutbetalingPerioderWrapper, StandardProsessPanelPropsTilbakekreving, VilkarsVurdertePerioderWrapper,
} from '@fpsak-frontend/types';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import TilbakekrevingForm from './components/TilbakekrevingForm';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';

const ENDEPUNKTER_PANEL_DATA = [
  TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER,
  TilbakekrevingBehandlingApiKeys.VILKARVURDERING,
  TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE,
];
type EndepunktPanelData = {
  vilkarvurderingsperioder: DetaljerteFeilutbetalingsperioder;
  vilkarvurdering: VilkarsVurdertePerioderWrapper;
  perioderForeldelse: FeilutbetalingPerioderWrapper;
}

interface OwnProps {
  navBrukerKjonn: string;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
}

const TilbakekrevingProsessIndex: FunctionComponent<OwnProps & StandardProsessPanelPropsTilbakekreving> = ({
  behandling,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  formData,
  setFormData,
}) => {
  const { startRequest: beregnBelop } = restApiTilbakekrevingHooks.useRestApiRunner(TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP);

  const formaterteEndepunkter = ENDEPUNKTER_PANEL_DATA.map((e) => ({ key: e }));
  const { data: initData, state } = restApiTilbakekrevingHooks
    .useMultipleRestApi<EndepunktPanelData, any>(formaterteEndepunkter, {
      updateTriggers: [behandling.versjon],
      isCachingOn: true,
    });

  if (state !== RestApiState.SUCCESS) {
    return <LoadingPanel />;
  }

  return (
    <TilbakekrevingForm
      behandlingUuid={behandling.uuid}
      perioderForeldelse={initData.perioderForeldelse}
      perioder={initData.vilkarvurderingsperioder.perioder}
      rettsgebyr={initData.vilkarvurderingsperioder.rettsgebyr}
      vilkarvurdering={initData.vilkarvurdering}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
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

export default TilbakekrevingProsessIndex;
