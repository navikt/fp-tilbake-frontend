import React, { useState } from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';
import { Aksjonspunkt, Behandling } from '@fpsak-frontend/types';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import BehandlingEventHandler from './BehandlingEventHandler';
import BehandlingTilbakekrevingIndex from './BehandlingTilbakekrevingIndex';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from './data/tilbakekrevingBehandlingApi';

const BEHANDLING_AARSAK_KODEVERK = 'BEHANDLING_AARSAK';
const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';
const BEHANDLING_RESULTAT_TYPE_KODEVERK = 'BEHANDLING_RESULTAT_TYPE';
const KONSEKVENS_FOR_YTELSEN_KODEVERK = 'KONSEKVENS_FOR_YTELSEN';

const behandling = {
  uuid: 'test-uuid',
  versjon: 1,
  status: {
    kode: behandlingStatus.OPPRETTET,
    kodeverk: '',
  },
  type: {
    kode: behandlingType.TILBAKEKREVING,
    kodeverk: '',
  },
  behandlingPaaVent: false,
  links: [{
    href: TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD.name,
    rel: 'update',
    type: 'POST',
  }, {
    href: TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER.name,
    rel: 'aksjonspunkter',
    type: 'GET',
  }, {
    href: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA.name,
    rel: 'feilutbetalingFakta',
    type: 'GET',
  }, {
    href: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK.name,
    rel: 'feilutbetalingAarsak',
    type: 'GET',
  }],
} as Behandling;

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
    kodeverk: '',
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
    kodeverk: '',
  },
  kanLoses: true,
}] as Aksjonspunkt[];

const feilutbetalingFakta = {
  behandlingFakta: {
    perioder: [{
      fom: '2018-01-01',
      tom: '2018-01-31',
      belop: 1000,
    }, {
      fom: '2018-02-01',
      tom: '2018-02-28',
      belop: 5000,
    }, {
      fom: '2018-03-01',
      tom: '2018-03-15',
      belop: 100,
    }],
    totalPeriodeFom: '2019-01-01',
    totalPeriodeTom: '2019-01-02',
    aktuellFeilUtbetaltBeløp: 10000,
    tidligereVarseltBeløp: 5000,
    behandlingÅrsaker: [{
      behandlingArsakType: {
        kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
        kodeverk: BEHANDLING_AARSAK_KODEVERK,
      },
    }],
    behandlingsresultat: {
      type: {
        kode: behandlingResultatType.INNVILGET,
        kodeverk: BEHANDLING_RESULTAT_TYPE_KODEVERK,
      },
      konsekvenserForYtelsen: [{
        kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
        kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
      }, {
        kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
        kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
      }],
    },
    tilbakekrevingValg: {
      videreBehandling: {
        kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
        kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
      },
    },
    datoForRevurderingsvedtak: '2019-01-01',
  },
};

const feilutbetalingAarsak = [{
  ytelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
  },
  hendelseTyper: [{
    hendelseType: {
      kode: 'OPPTJENING',
      navn: '§14-6 Opptjening',
    },
    hendelseUndertyper: [],
  }, {
    hendelseType: {
      kode: 'ANNET',
      navn: 'Annet',
    },
    hendelseUndertyper: [{
      kode: 'TEST1',
      navn: 'Årsak 1',
    }, {
      kode: 'TEST2',
      navn: 'Årsak 2',
    }],
  }, {
    hendelseType: {
      kode: 'MEDLEM',
      navn: '§14-2 Medlemskap',
    },
    hendelseUndertyper: [{
      kode: 'IKKE_EØS',
      navn: 'Ikke oppholdsrett EØS',
    }, {
      kode: 'IKKE_BOSATT',
      navn: 'Ikke bosatt',
    }],
  }],
}];

export default {
  title: 'behandling/tilbakekreving',
  component: BehandlingTilbakekrevingIndex,
};

const Template: Story = () => {
  const [valgtProsessSteg, setProsessSteg] = useState('default');
  const [valgtFaktaSteg, setFaktaSteg] = useState('default');

  const oppdaterProsessStegOgFaktaPanelIUrl = (punktnavn?: string, faktanavn?: string) => {
    setProsessSteg(punktnavn);
    setFaktaSteg(faktanavn);
  };

  const data = [
    { key: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE.name, data: behandling },
    { key: TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD.name, data: undefined },
    { key: TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK.name, global: true, data: alleKodeverk },
    { key: TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER.name, data: aksjonspunkter },
    { key: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA.name, data: feilutbetalingFakta },
    { key: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK.name, data: feilutbetalingAarsak },
  ];

  return (
    <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
      <BehandlingTilbakekrevingIndex
        behandlingUuid="12"
        fagsak={{
          dekningsgrad: 100,
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
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
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
    </RestApiMock>
  );
};

export const Default = Template.bind({});
