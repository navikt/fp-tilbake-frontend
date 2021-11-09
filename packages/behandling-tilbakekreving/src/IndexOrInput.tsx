import React, { FunctionComponent } from 'react';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';
import BehandlingTilbakekrevingIndex from './BehandlingTilbakekrevingIndex';
import BehandlingEventHandler from './BehandlingEventHandler';

const IndexOrInput: FunctionComponent = () => (
  <BehandlingTilbakekrevingIndex
    behandlingUuid="d4674d96-d99c-40e1-b32a-ff132cc4d432"
    fagsak={{
      dekningsgrad: 80,
      fagsakYtelseType: {
        kode: 'FP',
        kodeverk: 'FAGSAK_YTELSE',
      },
      relasjonsRolleType: {
        kode: 'MORA',
        kodeverk: 'RELASJONSROLLE_TYPE',
      },
      saksnummer: '152001002',
      status: {
        kode: 'LOP',
        kodeverk: 'FAGSAK_STATUS',
      },
    }}
    rettigheter={{
      kanOverstyreAccess: {
        employeeHasAccess: true,
        isEnabled: true,
      },
      writeAccess: {
        employeeHasAccess: true,
        isEnabled: true,
      },
    }}
    oppdaterProsessStegOgFaktaPanelIUrl={() => undefined}
    valgtProsessSteg="default"
    valgtFaktaSteg="default"
    oppdaterBehandlingVersjon={() => undefined}
    behandlingEventHandler={BehandlingEventHandler}
    opneSokeside={() => undefined}
    setRequestPendingMessage={() => undefined}
    // @ts-ignore
    kodeverk={alleKodeverk}
    fagsakKjønn={{
      kode: 'K',
      kodeverk: 'KJONN',
    }}
    harApenRevurdering={false}
  />
);

export default IndexOrInput;
