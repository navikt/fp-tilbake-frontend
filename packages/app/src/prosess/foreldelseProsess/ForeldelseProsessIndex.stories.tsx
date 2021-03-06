import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { RawIntlProvider } from 'react-intl';

import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import { createIntl } from '@navikt/ft-utils';
import { AksjonspunktStatus, TilbakekrevingKodeverkType } from '@navikt/ft-kodeverk';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import {
  AlleKodeverkTilbakekreving, Behandling, Aksjonspunkt,
} from '@navikt/ft-types';
import {
  FeilutbetalingPerioderWrapper,
} from '@fpsak-frontend/types';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../../data/tilbakekrevingBehandlingApi';
import ForeldelseProsessIndex from './ForeldelseProsessIndex';
import messages from '../../../i18n/nb_NO.json';

const intl = createIntl(messages);

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

const alleKodeverk = {
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
  title: 'prosess/prosess-foreldelse',
  component: ForeldelseProsessIndex,
};

const Template: Story<{
  submitCallback: (aksjonspunktData: any) => Promise<void>;
  aksjonspunkter?: Aksjonspunkt[];
}> = ({
  submitCallback,
  aksjonspunkter = [],
}) => {
  const data = [
    { key: TilbakekrevingBehandlingApiKeys.BEREGNE_BEL??P.name, dataFn: (config) => [200, config.params] },
  ];

  return (
    <RawIntlProvider value={intl}>
      <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
        <ForeldelseProsessIndex
          behandling={{
            uuid: '1',
            versjon: 1,
            status: behandlingStatus.BEHANDLING_UTREDES,
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
      </RestApiMock>
    </RawIntlProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
  aksjonspunkter: [{
    definisjon: aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE,
    status: AksjonspunktStatus.OPPRETTET,
    begrunnelse: undefined,
    kanLoses: true,
    erAktivt: true,
  }],
};

export const UtenAksjonspunkt = Template.bind({});
UtenAksjonspunkt.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
};
