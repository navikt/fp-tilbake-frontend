import React, {
  FunctionComponent,
} from 'react';
import { useIntl } from 'react-intl';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import { ProsessStegCode } from '@fpsak-frontend/konstanter';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import {
  Aksjonspunkt, AlleKodeverkTilbakekreving, FeilutbetalingPerioderWrapper, Kodeverk,
} from '@fpsak-frontend/types';
import { ProsessDefaultInitPanel, ProsessPanelInitProps } from '@fpsak-frontend/behandling-felles';

import { restApiTilbakekrevingHooks, requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';

const AKSJONSPUNKT_KODER = [aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE];

const ENDEPUNKTER_INIT_DATA = [TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER, TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE];
type EndepunktInitData = {
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse: FeilutbetalingPerioderWrapper;
}

interface OwnProps {
  fagsakKjønn: Kodeverk;
  fptilbakeKodeverk: AlleKodeverkTilbakekreving;
}

const ForeldelseProsessStegInitPanel: FunctionComponent<OwnProps & ProsessPanelInitProps> = ({
  fagsakKjønn,
  fptilbakeKodeverk,
  ...props
}) => {
  const intl = useIntl();
  const { startRequest: beregnBelop } = restApiTilbakekrevingHooks.useRestApiRunner(TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP);

  return (
    <ProsessDefaultInitPanel<EndepunktInitData>
      {...props}
      requestApi={requestTilbakekrevingApi}
      initEndepunkter={ENDEPUNKTER_INIT_DATA}
      aksjonspunktKoder={AKSJONSPUNKT_KODER}
      prosessPanelKode={ProsessStegCode.FORELDELSE}
      prosessPanelMenyTekst={intl.formatMessage({ id: 'Behandlingspunkt.Foreldelse' })}
      skalPanelVisesIMeny={() => true}
      hentOverstyrtStatus={(initData) => (initData.perioderForeldelse ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT)}
      renderPanel={(data) => (
        <ForeldelseProsessIndex
          navBrukerKjonn={fagsakKjønn.kode}
          beregnBelop={beregnBelop}
          {...data}
          alleKodeverk={fptilbakeKodeverk}
        />
      )}
    />
  );
};

export default ForeldelseProsessStegInitPanel;
