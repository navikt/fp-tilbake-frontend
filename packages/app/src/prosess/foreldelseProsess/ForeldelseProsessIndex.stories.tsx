import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { RawIntlProvider } from 'react-intl';

import { createIntl } from '@fpsak-frontend/utils';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import {
  AlleKodeverkTilbakekreving, Behandling, FeilutbetalingPerioderWrapper, Aksjonspunkt,
} from '@fpsak-frontend/types';
import ForeldelseProsessIndex from './ForeldelseProsessIndex';
import messages from '../../../i18n/nb_NO.json';

const intl = createIntl(messages);

const perioderForeldelse = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-01-31',
    belop: 1000,
    begrunnelse: 'Foreldet',
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.FORELDET,
      kodeverk: 'FORELDELSE_VURDERING',
    },
    foreldelsesfrist: '2020-04-01',
  }, {
    fom: '2019-03-01',
    tom: '2019-03-31',
    belop: 3000,
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.UDEFINERT,
      kodeverk: 'FORELDELSE_VURDERING',
    },
  }, {
    fom: '2019-02-01',
    tom: '2019-02-28',
    belop: 3000,
    begrunnelse: 'Over foreldelsesfrist, med tillegsfrist brukes',
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.TILLEGGSFRIST,
      kodeverk: 'FORELDELSE_VURDERING',
    },
    foreldelsesfrist: '2020-04-01',
    oppdagelsesDato: '2019-11-01',
  }, {
    fom: '2019-04-01',
    tom: '2019-04-30',
    belop: 4000,
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.UDEFINERT,
      kodeverk: 'FORELDELSE_VURDERING',
    },
  }],
} as FeilutbetalingPerioderWrapper;

const alleKodeverk = {
  [tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING]: [
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
  title: 'prosess/prosess-foreldelse',
  component: ForeldelseProsessIndex,
};

const Template: Story<{
  submitCallback: (aksjonspunktData: any) => Promise<void>;
  aksjonspunkter?: Aksjonspunkt[];
}> = ({
  submitCallback,
  aksjonspunkter = [],
}) => (
  <RawIntlProvider value={intl}>
    <ForeldelseProsessIndex
      behandling={{
        uuid: '1',
        versjon: 1,
        status: {
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: '',
        },
      } as Behandling}
      alleKodeverk={alleKodeverk}
      bekreftAksjonspunkter={submitCallback}
      erReadOnlyFn={() => false}
      setFormData={() => undefined}
      formData={{}}
      perioderForeldelse={perioderForeldelse}
      aksjonspunkter={aksjonspunkter}
      navBrukerKjonn={NavBrukerKjonn.KVINNE}
    />
  </RawIntlProvider>
);

export const Default = Template.bind({});
Default.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
  aksjonspunkter: [{
    definisjon: {
      kode: aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE,
      kodeverk: '',
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
      kodeverk: '',
    },
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  }],
};

export const UtenAksjonspunkt = Template.bind({});
UtenAksjonspunkt.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
};
