import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { RawIntlProvider } from 'react-intl';

import { createIntl } from '@navikt/ft-utils';
import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import {
  FeilutbetalingPerioderWrapper, DetaljerteFeilutbetalingsperioder,
} from '@fpsak-frontend/types';
import {
  Behandling, AlleKodeverkTilbakekreving, Aksjonspunkt,
} from '@navikt/ft-types';
import { AksjonspunktStatus } from '@navikt/ft-kodeverk';
import { alleTilbakekrevingKodeverk } from '@fpsak-frontend/storybook-utils';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import TilbakekrevingProsessIndex from './TilbakekrevingProsessIndex';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../../data/tilbakekrevingBehandlingApi';

import messages from '../../../i18n/nb_NO.json';

const intl = createIntl(messages);

const perioderForeldelse = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-02-02',
    belop: 1000,
    foreldelseVurderingType: foreldelseVurderingType.IKKE_FORELDET,
  }, {
    fom: '2019-02-03',
    tom: '2019-04-02',
    belop: 3000,
    foreldelseVurderingType: foreldelseVurderingType.FORELDET,
  }],
} as FeilutbetalingPerioderWrapper;

const defaultVilkarvurderingsperioder = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-04-01',
    foreldet: false,
    feilutbetaling: 10,
    årsak: {
      hendelseType: 'MEDLEMSKAP',
    },
    redusertBeloper: [],
    ytelser: [{
      aktivitet: 'Arbeidstaker',
      belop: 1050,
    }],
  }],
  rettsgebyr: 1000,
} as DetaljerteFeilutbetalingsperioder;
const vilkarvurdering = {
  vilkarsVurdertePerioder: [],
};

const alleKodeverk = alleTilbakekrevingKodeverk as AlleKodeverkTilbakekreving;

export default {
  title: 'prosess/prosess-tilbakekreving',
  component: TilbakekrevingProsessIndex,
};

const Template: Story<{
  submitCallback: (aksjonspunktData: any) => Promise<void>;
  aksjonspunkter?: Aksjonspunkt[];
  vilkarvurderingsperioder: DetaljerteFeilutbetalingsperioder
}> = ({
  submitCallback,
  aksjonspunkter = [],
  vilkarvurderingsperioder,
}) => {
  const data = [
    { key: TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER.name, data: vilkarvurderingsperioder },
    { key: TilbakekrevingBehandlingApiKeys.VILKARVURDERING.name, data: vilkarvurdering },
    { key: TilbakekrevingBehandlingApiKeys.BEREGNE_BELØP.name, dataFn: (config) => [200, config.params] },
  ];

  return (
    <RawIntlProvider value={intl}>
      <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
        <TilbakekrevingProsessIndex
          behandling={{
            uuid: '1',
            versjon: 1,
            status: behandlingStatus.BEHANDLING_UTREDES,
          } as Behandling}
          alleKodeverk={alleKodeverk}
          erReadOnlyFn={() => false}
          setFormData={() => undefined}
          formData={{}}
          bekreftAksjonspunkter={submitCallback}
          perioderForeldelse={perioderForeldelse}
          aksjonspunkter={aksjonspunkter}
          navBrukerKjonn={NavBrukerKjonn.KVINNE}
        />
      </RestApiMock>
    </RawIntlProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
  aksjonspunkter: [{
    definisjon: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
    status: AksjonspunktStatus.OPPRETTET,
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  }],
  vilkarvurderingsperioder: defaultVilkarvurderingsperioder,
};

export const MedToPerioder = Template.bind({});
MedToPerioder.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
  aksjonspunkter: [{
    definisjon: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
    status: AksjonspunktStatus.OPPRETTET,
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  }],
  vilkarvurderingsperioder: {
    perioder: [defaultVilkarvurderingsperioder.perioder[0], {
      fom: '2019-04-01',
      tom: '2019-10-01',
      foreldet: false,
      feilutbetaling: 100,
      årsak: {
        hendelseType: {
          kode: 'MEDLEM',
          kodeverk: '',
          navn: '§22 Medlemskap',
        },
      },
      redusertBeloper: [],
      ytelser: [{
        aktivitet: 'Arbeidstaker',
        belop: 2050,
      }],
    }],
    rettsgebyr: 1000,
  } as DetaljerteFeilutbetalingsperioder,
};
