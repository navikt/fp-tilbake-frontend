import React, { useState } from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies

import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';
import {
  fagsakYtelseType, TilbakekrevingKodeverkType, behandlingType, aksjonspunktStatus,
} from '@navikt/ft-kodeverk';
import {
  FeilutbetalingPerioderWrapper, Verge,
} from '@fpsak-frontend/types';
import {
  Aksjonspunkt, AlleKodeverkTilbakekreving, Behandling,
} from '@navikt/ft-types';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import BehandlingEventHandler from './felles/util/BehandlingEventHandler';
import BehandlingTilbakekrevingIndex from './BehandlingTilbakekrevingIndex';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from './data/tilbakekrevingBehandlingApi';
import VergeType from './fakta/vergeFakta/kodeverk/vergeType';

const BEHANDLING_AARSAK_KODEVERK = 'BEHANDLING_AARSAK';
const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';
const BEHANDLING_RESULTAT_TYPE_KODEVERK = 'BEHANDLING_RESULTAT_TYPE';
const KONSEKVENS_FOR_YTELSEN_KODEVERK = 'KONSEKVENS_FOR_YTELSEN';

const defaultBehandling = {
  uuid: 'test-uuid',
  versjon: 1,
  status: behandlingStatus.OPPRETTET,
  type: behandlingType.TILBAKEKREVING,
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
    href: TilbakekrevingBehandlingApiKeys.VERGE.name,
    rel: 'soeker-verge',
    type: 'GET',
  }, {
  }, {
    href: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA.name,
    rel: 'feilutbetalingFakta',
    type: 'GET',
  }, {
    href: TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE.name,
    rel: 'perioderForeldelse',
    type: 'GET',
  }, {
    href: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK.name,
    rel: 'feilutbetalingAarsak',
    type: 'GET',
  }],
} as Behandling;

const faktaAksjonspunkter = [{
  definisjon: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
  status: aksjonspunktStatus.OPPRETTET,
  kanLoses: true,
}, {
  definisjon: aksjonspunktCodes.AVKLAR_VERGE,
  status: aksjonspunktStatus.UTFORT,
  begrunnelse: 'Dette er en begrunnelse',
  kanLoses: true,
  erAktivt: false,
}] as Aksjonspunkt[];

const prosessAksjonspunkter = [{
  definisjon: aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE,
  status: aksjonspunktStatus.OPPRETTET,
  kanLoses: true,
  erAktivt: true,
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
  ytelseType: fagsakYtelseType.FORELDREPENGER,
  hendelseTyper: [{
    hendelseType: 'OPPTJENING',
    hendelseUndertyper: [],
  }, {
    hendelseType: 'ANNET',
    hendelseUndertyper: ['TEST1', 'TEST2'],
  }, {
    hendelseType: 'MEDLEM',
    hendelseUndertyper: ['IKKE_EØS', 'IKKE_BOSATT'],
  }],
}];

const perioderForeldelse = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-01-31',
    belop: 1000,
    begrunnelse: 'Foreldet',
    foreldelseVurderingType: foreldelseVurderingType.FORELDET,
    foreldelsesfrist: '2020-04-01',
  }, {
    fom: '2019-03-01',
    tom: '2019-03-31',
    belop: 3000,
    foreldelseVurderingType: foreldelseVurderingType.UDEFINERT,
  }, {
    fom: '2019-02-01',
    tom: '2019-02-28',
    belop: 3000,
    begrunnelse: 'Over foreldelsesfrist, med tillegsfrist brukes',
    foreldelseVurderingType: foreldelseVurderingType.TILLEGGSFRIST,
    foreldelsesfrist: '2020-04-01',
    oppdagelsesDato: '2019-11-01',
  }, {
    fom: '2019-04-01',
    tom: '2019-04-30',
    belop: 4000,
    foreldelseVurderingType: foreldelseVurderingType.UDEFINERT,
  }],
} as FeilutbetalingPerioderWrapper;

const verge = {
  navn: 'Espen Utvikler',
  gyldigFom: '2021-01-01',
  fnr: '23232323',
  vergeType: VergeType.BARN,
} as Verge;

const tilbakeKodeverk = {
  [TilbakekrevingKodeverkType.VENTEARSAK]: alleKodeverk.Venteårsak,
  [TilbakekrevingKodeverkType.FORELDELSE_VURDERING]: [
    {
      kode: foreldelseVurderingType.FORELDET,
      navn: 'Foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
    {
      kode: foreldelseVurderingType.TILLEGGSFRIST,
      navn: 'Ikke foreldet, med tilleggsfrist',
      kodeverk: 'FORELDELSE_VURDERING',
    },
    {
      kode: foreldelseVurderingType.IKKE_FORELDET,
      navn: 'Ikke foreldet',
      kodeverk: 'FORELDELSE_VURDERING',
    },
  ],
} as AlleKodeverkTilbakekreving;

export default {
  title: 'behandling/tilbakekreving',
  component: BehandlingTilbakekrevingIndex,
};

const Template: Story<{
  aksjonspunkter: Aksjonspunkt[];
  behandling: Behandling;
}> = ({
  aksjonspunkter,
  behandling,
}) => {
  const [valgtProsessSteg, setProsessSteg] = useState('default');
  const [valgtFaktaSteg, setFaktaSteg] = useState('default');

  const oppdaterProsessStegOgFaktaPanelIUrl = (punktnavn?: string, faktanavn?: string) => {
    setProsessSteg(punktnavn);
    setFaktaSteg(faktanavn);
  };

  const data = [
    { key: TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE.name, data: behandling },
    { key: TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD.name, data: undefined },
    { key: TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK.name, global: true, data: tilbakeKodeverk },
    { key: TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER.name, data: aksjonspunkter },
    { key: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA.name, data: feilutbetalingFakta },
    { key: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK.name, data: feilutbetalingAarsak },
    { key: TilbakekrevingBehandlingApiKeys.VERGE.name, data: verge },
    { key: TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE.name, data: perioderForeldelse },
  ];

  return (
    <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
      <BehandlingTilbakekrevingIndex
        behandlingUuid="12"
        fagsak={{
          dekningsgrad: 100,
          fagsakYtelseType: 'FP',
          relasjonsRolleType: 'MORA',
          saksnummer: '152001002',
          status: 'LOP',
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
        fagsakKjønn="K"
        harApenRevurdering={false}
      />
    </RestApiMock>
  );
};

export const FaktaPaneler = Template.bind({});
FaktaPaneler.args = {
  behandling: defaultBehandling,
  aksjonspunkter: faktaAksjonspunkter,
};

export const ProsessPaneler = Template.bind({});
ProsessPaneler.args = {
  behandling: defaultBehandling,
  aksjonspunkter: prosessAksjonspunkter,
};

export const HenlagtBehandling = Template.bind({});
HenlagtBehandling.args = {
  behandling: {
    ...defaultBehandling,
    behandlingHenlagt: true,
    status: behandlingStatus.AVSLUTTET,
  },
  aksjonspunkter: [{
    ...prosessAksjonspunkter[0],
    status: aksjonspunktStatus.UTFORT,
  }],
};
