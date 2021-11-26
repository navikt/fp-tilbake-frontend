import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import {
  AlleKodeverkTilbakekreving, Behandling, FeilutbetalingPerioderWrapper, Aksjonspunkt,
} from '@fpsak-frontend/types';

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

const merknaderFraBeslutter = {
  notAccepted: false,
};

const beregnBelop = (params: {perioder: any[]}) => {
  const { perioder } = params;
  return Promise.resolve({
    perioder,
  });
};

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
  <ForeldelseProsessIndex
    behandling={{
      uuid: '1',
      versjon: 1,
    } as Behandling}
    alleKodeverk={alleKodeverk}
    submitCallback={submitCallback}
    isReadOnly={false}
    isAksjonspunktOpen
    readOnlySubmitButton={false}
    status=""
    vilkar={[]}
    setFormData={() => undefined}
    perioderForeldelse={perioderForeldelse}
    aksjonspunkter={aksjonspunkter}
    navBrukerKjonn={NavBrukerKjonn.KVINNE}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE]: merknaderFraBeslutter,
    }}
    beregnBelop={(params) => beregnBelop(params)}
  />
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
