import React, { FunctionComponent, useEffect, useCallback } from 'react';
import { RawIntlProvider } from 'react-intl';

import {
  LoadingPanel,
} from '@fpsak-frontend/shared-components';
import {
  Kodeverk,
} from '@fpsak-frontend/types';
import { createIntl } from '@fpsak-frontend/utils';

import { restApiTilbakekrevingHooks, requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import FaktaIndex from './fakta/FaktaIndex';
import ProsessIndex from './prosess/ProsessIndex';
import BehandlingPaVent from './felles/komponenter/BehandlingPaVent';
import { getBekreftAksjonspunktFaktaCallback, getBekreftAksjonspunktProsessCallback } from './submit';
import StandardBehandlingProps from './felles/types/standardBehandlingProps';
import {
  useLagreAksjonspunkt, useBehandling, useInitBehandlingHandlinger,
} from './felles/util/indexHooks';
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
  useEffect(() => {
    requestTilbakekrevingApi.setRequestPendingHandler(setRequestPendingMessage);
    requestTilbakekrevingApi.setAddErrorMessageHandler(setRequestPendingMessage);
  }, []);

  const {
    behandling, hentingHarFeilet, hentBehandling, setBehandling, toggleOppdateringAvFagsakOgBehandling,
  } = useBehandling(behandlingUuid, oppdaterBehandlingVersjon);

  const lagreAksjonspunkter = useLagreAksjonspunkt(setBehandling);

  useInitBehandlingHandlinger(behandlingEventHandler, hentBehandling, setBehandling, behandling);

  const oppdaterFaktaPanelIUrl = useCallback((nyttFaktaSteg: string): void => {
    oppdaterProsessStegOgFaktaPanelIUrl(valgtProsessSteg, nyttFaktaSteg);
  }, [valgtProsessSteg]);
  const oppdaterProsessPanelIUrl = useCallback((nyttProsessSteg: string): void => {
    oppdaterProsessStegOgFaktaPanelIUrl(nyttProsessSteg, valgtFaktaSteg);
  }, [valgtFaktaSteg]);

  const { data: tilbakekrevingKodeverk } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK);

  if (!behandling || !tilbakekrevingKodeverk) {
    return <LoadingPanel />;
  }

  const submitCallback = getBekreftAksjonspunktFaktaCallback(fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, lagreAksjonspunkter);
  const submitCallbackProsess = getBekreftAksjonspunktProsessCallback(fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, lagreAksjonspunkter);

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
        hasFetchError={hentingHarFeilet}
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
        hasFetchError={hentingHarFeilet}
        submitCallback={submitCallback}
      />
    </RawIntlProvider>
  );
};

export default BehandlingTilbakekrevingIndex;
