import React from 'react';
import { render, screen } from '@testing-library/react';

import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { BehandlingType, FagsakYtelseType } from '@navikt/ft-kodeverk';
import { AksessRettigheter } from '@fpsak-frontend/types';
import { AlleKodeverk, Fagsak } from '@navikt/ft-types';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';

import BehandlingTilbakekrevingIndex from './BehandlingTilbakekrevingIndex';
import { requestTilbakekrevingApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';

describe('<BehandlingTilbakekrevingIndex>', () => {
  it('skal rendre korrekt', async () => {
    const data = [
      {
        key: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE.name,
        noRelLink: true,
        data: {
          uuid: 'test-uuid',
          versjon: 1,
          status: behandlingStatus.OPPRETTET,
          type: BehandlingType.TILBAKEKREVING,
          links: [{
            href: TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD.name,
            rel: 'update',
            type: 'POST',
          }, {
            href: TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER.name,
            rel: 'aksjonspunkter',
            type: 'GET',
          }],
        },
      },
      { key: TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD.name, data: undefined },
      { key: TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER.name, data: [] },
      { key: TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK.name, global: true, data: alleKodeverk },
    ];

    render(
      <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
        <BehandlingTilbakekrevingIndex
          behandlingEventHandler={{
            setHandler: () => {},
            clear: () => {},
          }}
          behandlingUuid="test-uuid"
          oppdaterBehandlingVersjon={() => {}}
          // @ts-ignore
          kodeverk={alleKodeverk as AlleKodeverk}
          fagsak={{
            fagsakYtelseType: FagsakYtelseType.FORELDREPENGER,
          } as Fagsak}
          rettigheter={{
            writeAccess: {
              isEnabled: true,
            },
            kanOverstyreAccess: {
              isEnabled: true,
            },
          } as AksessRettigheter}
          oppdaterProsessStegOgFaktaPanelIUrl={() => {}}
          valgtProsessSteg="default"
          valgtFaktaSteg="default"
          opneSokeside={() => {}}
          setRequestPendingMessage={() => {}}
          fagsakKj??nn={navBrukerKjonn.KVINNE}
          harApenRevurdering={false}
        />
      </RestApiMock>,
    );
    expect(await screen.findByText('Foreldelse')).toBeInTheDocument();
    expect(screen.getByText('Tilbakekreving')).toBeInTheDocument();
    expect(screen.getByText('Vedtak')).toBeInTheDocument();
  });
});
