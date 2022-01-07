import React, { FunctionComponent } from 'react';

import {
  Aksjonspunkt,
  DetaljerteFeilutbetalingsperioder, FeilutbetalingPerioderWrapper, StandardProsessPanelPropsTilbakekreving, VilkarsVurdertePerioderWrapper,
} from '@fpsak-frontend/types';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { ProsessAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import TilbakekrevingForm from './components/TilbakekrevingForm';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';

const ENDEPUNKTER_PANEL_DATA = [
  TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER,
  TilbakekrevingBehandlingApiKeys.VILKARVURDERING,
];
type EndepunktPanelData = {
  vilkarvurderingsperioder: DetaljerteFeilutbetalingsperioder;
  vilkarvurdering: VilkarsVurdertePerioderWrapper;
}

interface OwnProps {
  navBrukerKjonn: string;
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  submitCallback: (aksjonspunktData: ProsessAksjonspunkt | ProsessAksjonspunkt[]) => Promise<void>;
  aksjonspunkter: Aksjonspunkt[];
  readOnlySubmitButton: boolean;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
}

const TilbakekrevingProsessIndex: FunctionComponent<OwnProps & StandardProsessPanelPropsTilbakekreving> = ({
  behandling,
  submitCallback,
  isReadOnly,
  perioderForeldelse,
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
      perioderForeldelse={perioderForeldelse}
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
