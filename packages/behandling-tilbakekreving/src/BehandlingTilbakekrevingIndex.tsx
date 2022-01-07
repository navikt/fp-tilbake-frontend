import React, { FunctionComponent } from 'react';
import { RawIntlProvider } from 'react-intl';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import {
  StandardBehandlingProps, useInitRequestApi, useLagreAksjonspunkt, useBehandling, useInitBehandlingHandlinger,
} from '@fpsak-frontend/behandling-felles';
import {
  LoadingPanel,
} from '@fpsak-frontend/shared-components';
import {
  Kodeverk,
} from '@fpsak-frontend/types';
import { createIntl } from '@fpsak-frontend/utils';

import { restApiTilbakekrevingHooks, requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import FaktaIndex from './FaktaIndex';
import ProsessIndex from './ProsessIndex';
import BehandlingPaVent from './felles/BehandlingPaVent';
import { getBekreftAksjonspunktFaktaCallback, getBekreftAksjonspunktProsessCallback } from './submit';
import messages from '../i18n/nb_NO.json';

const intl = createIntl(messages);

interface OwnProps {
  fagsakKjønn: Kodeverk;
  harApenRevurdering: boolean;
}

const BehandlingTilbakekrevingIndex: FunctionComponent<OwnProps & StandardBehandlingProps> = ({
  behandlingEventHandler,
  behandlingUuid,
  oppdaterBehandlingVersjon,
  kodeverk: fpsakKodeverk,
  fagsak,
  fagsakKjønn,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  valgtFaktaSteg,
  opneSokeside,
  harApenRevurdering,
  setRequestPendingMessage,
}) => {
  useInitRequestApi(requestTilbakekrevingApi, setRequestPendingMessage);

  const {
    behandling, behandlingState, hentBehandling, setBehandling, toggleOppdateringAvFagsakOgBehandling,
  } = useBehandling(
    requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE, behandlingUuid, oppdaterBehandlingVersjon,
  );

  const { lagreAksjonspunkter } = useLagreAksjonspunkt(
    requestTilbakekrevingApi, setBehandling, TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );

  useInitBehandlingHandlinger(requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys, behandlingEventHandler, hentBehandling, setBehandling, behandling);

  const { data: tilbakekrevingKodeverk } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK);

  if (!behandling || !tilbakekrevingKodeverk) {
    return <LoadingPanel />;
  }

  const oppdaterFaktaPanelIUrl = (nyttFaktaSteg: string): void => {
    oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, nyttFaktaSteg);
  };
  const oppdaterProsessPanelIUrl = (nyttProsessSteg: string): void => {
    oppdaterProsessStegOgFaktaPanelIUrl(nyttProsessSteg, valgtFaktaSteg);
  };

  const submitCallback = getBekreftAksjonspunktFaktaCallback(fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, lagreAksjonspunkter);
  const submitCallbackProsess = getBekreftAksjonspunktProsessCallback(fagsak, behandling, lagreAksjonspunkter);

  return (
    <RawIntlProvider value={intl}>
      <BehandlingPaVent
        behandling={behandling}
        hentBehandling={hentBehandling}
        kodeverk={tilbakekrevingKodeverk}
        requestApi={requestTilbakekrevingApi}
        oppdaterPaVentKey={TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD}
        aksjonspunktKey={TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER}
      />
      <ProsessIndex
        behandling={behandling}
        fagsakKjønn={fagsakKjønn}
        tilbakekrevingKodeverk={tilbakekrevingKodeverk}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessPanelIUrl={oppdaterProsessPanelIUrl}
        rettigheter={rettigheter}
        hasFetchError={behandlingState === RestApiState.ERROR}
        submitCallback={submitCallbackProsess}
        harApenRevurdering={harApenRevurdering}
        opneSokeside={opneSokeside}
        toggleOppdatereFagsakContext={toggleOppdateringAvFagsakOgBehandling}
      />
      <FaktaIndex
        fagsak={fagsak}
        behandling={behandling}
        tilbakekrevingKodeverk={tilbakekrevingKodeverk}
        fpsakKodeverk={fpsakKodeverk}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
        rettigheter={rettigheter}
        hasFetchError={behandlingState === RestApiState.ERROR}
        submitCallback={submitCallback}
      />
    </RawIntlProvider>
  );
};

export default BehandlingTilbakekrevingIndex;
