import React, { FunctionComponent } from 'react';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import {
  BehandlingContainer, StandardBehandlingProps, StandardPropsProvider, BehandlingPaVent,
  useInitRequestApi, useLagreAksjonspunkt, useBehandling, useInitBehandlingHandlinger,
} from '@fpsak-frontend/behandling-felles';
import {
  LoadingPanel,
} from '@fpsak-frontend/shared-components';
import {
  Kodeverk,
} from '@fpsak-frontend/types';

import { restApiTilbakekrevingHooks, requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import ForeldelseProsessStegInitPanel from './prosessPaneler/ForeldelseProsessStegInitPanel';
import TilbakekrevingProsessStegInitPanel from './prosessPaneler/TilbakekrevingProsessStegInitPanel';
import VedtakTilbakekrevingProsessStegInitPanel from './prosessPaneler/VedtakTilbakekrevingProsessStegInitPanel';
import FaktaIndex from './FaktaIndex';

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

  return (
    <>
      <BehandlingPaVent
        behandling={behandling}
        hentBehandling={hentBehandling}
        kodeverk={tilbakekrevingKodeverk}
        requestApi={requestTilbakekrevingApi}
        oppdaterPaVentKey={TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD}
        aksjonspunktKey={TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER}
      />
      <StandardPropsProvider
        behandling={behandling}
        fagsak={fagsak}
        rettigheter={rettigheter}
        hasFetchError={behandlingState === RestApiState.ERROR}
        alleKodeverk={fpsakKodeverk}
        lagreAksjonspunkter={lagreAksjonspunkter}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      >
        <BehandlingContainer
          behandling={behandling}
          valgtProsessSteg={valgtProsessSteg}
          valgtFaktaSteg={valgtFaktaSteg}
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          hentProsessPaneler={(props) => (
            <>
              <ForeldelseProsessStegInitPanel {...props} fagsakKjønn={fagsakKjønn} fptilbakeKodeverk={tilbakekrevingKodeverk} />
              <TilbakekrevingProsessStegInitPanel {...props} fagsakKjønn={fagsakKjønn} fptilbakeKodeverk={tilbakekrevingKodeverk} />
              <VedtakTilbakekrevingProsessStegInitPanel
                {...props}
                fptilbakeKodeverk={tilbakekrevingKodeverk}
                harApenRevurdering={harApenRevurdering}
                opneSokeside={opneSokeside}
                toggleOppdatereFagsakContext={toggleOppdateringAvFagsakOgBehandling}
              />
            </>
          )}
        />
      </StandardPropsProvider>
      <FaktaIndex
        fagsak={fagsak}
        behandling={behandling}
        tilbakekrevingKodeverk={tilbakekrevingKodeverk}
        fpsakKodeverk={fpsakKodeverk}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        rettigheter={rettigheter}
        hasFetchError={behandlingState === RestApiState.ERROR}
      />
    </>
  );
};

export default BehandlingTilbakekrevingIndex;
