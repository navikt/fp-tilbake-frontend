import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { RawIntlProvider } from 'react-intl';

import { createIntl } from '@fpsak-frontend/utils';
import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import {
  Behandling, FeilutbetalingPerioderWrapper, DetaljerteFeilutbetalingsperioder, AlleKodeverkTilbakekreving, Aksjonspunkt,
} from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import TilbakekrevingProsessIndex from './TilbakekrevingProsessIndex';
import vilkarResultat from './kodeverk/vilkarResultat';
import sarligGrunn from './kodeverk/sarligGrunn';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../../data/tilbakekrevingBehandlingApi';
import aktsomhet from './kodeverk/aktsomhet';

import messages from '../../../i18n/nb_NO.json';

const intl = createIntl(messages);

const perioderForeldelse = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-02-02',
    belop: 1000,
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.IKKE_FORELDET,
      kodeverk: 'FORELDELSE_VURDERING',
    },
  }, {
    fom: '2019-02-03',
    tom: '2019-04-02',
    belop: 3000,
    foreldelseVurderingType: {
      kode: foreldelseVurderingType.FORELDET,
      kodeverk: 'FORELDELSE_VURDERING',
    },
  }],
} as FeilutbetalingPerioderWrapper;

const defaultVilkarvurderingsperioder = {
  perioder: [{
    fom: '2019-01-01',
    tom: '2019-04-01',
    foreldet: false,
    feilutbetaling: 10,
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
      belop: 1050,
    }],
  }],
  rettsgebyr: 1000,
} as DetaljerteFeilutbetalingsperioder;
const vilkarvurdering = {
  vilkarsVurdertePerioder: [],
};

const alleKodeverk = {
  [tilbakekrevingKodeverkTyper.FORELDELSE_VURDERING]: [{
    kode: foreldelseVurderingType.FORELDET,
    navn: 'Foreldet',
    kodeverk: 'FORELDELSE_VURDERING',
  }, {
    kode: foreldelseVurderingType.IKKE_FORELDET,
    navn: 'Ikke foreldet',
    kodeverk: 'FORELDELSE_VURDERING',
  }, {
    kode: foreldelseVurderingType.TILLEGGSFRIST,
    navn: 'Tilleggsfrist',
    kodeverk: 'FORELDELSE_VURDERING',
  }],
  [tilbakekrevingKodeverkTyper.SARLIG_GRUNN]: [{
    kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
    navn: 'Grad av uaktsomhet',
    kodeverk: '',
  }, {
    kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
    navn: 'Helt eller delvis NAVs feil',
    kodeverk: '',
  }, {
    kode: sarligGrunn.STOERRELSE_BELOEP,
    navn: 'Størrelse beløp',
    kodeverk: '',
  }, {
    kode: sarligGrunn.TID_FRA_UTBETALING,
    navn: 'Tid fra utbetaling',
    kodeverk: '',
  }, {
    kode: sarligGrunn.ANNET,
    navn: 'Annet',
    kodeverk: '',
  }],
  [tilbakekrevingKodeverkTyper.VILKAR_RESULTAT]: [{
    kode: vilkarResultat.FORSTO_BURDE_FORSTAATT,
    navn: 'Forsto eller burde forstått',
    kodeverk: '',
  }, {
    kode: vilkarResultat.FEIL_OPPLYSNINGER,
    navn: 'Feil opplysninger',
    kodeverk: '',
  }, {
    kode: vilkarResultat.MANGELFULL_OPPLYSNING,
    navn: 'Mangelfull opplysning',
    kodeverk: '',
  }, {
    kode: vilkarResultat.GOD_TRO,
    navn: 'God tro',
    kodeverk: '',
  }],
  [tilbakekrevingKodeverkTyper.AKTSOMHET]: [{
    kode: aktsomhet.FORSETT,
    navn: 'Forsett',
    kodeverk: '',
  }, {
    kode: aktsomhet.GROVT_UAKTSOM,
    navn: 'Grovt uaktsom',
    kodeverk: '',
  }, {
    kode: aktsomhet.SIMPEL_UAKTSOM,
    navn: 'Simpel uaktsom',
    kodeverk: '',
  }],
} as AlleKodeverkTilbakekreving;

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
  ];

  return (
    <RawIntlProvider value={intl}>
      <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
        <TilbakekrevingProsessIndex
          behandling={{
            uuid: '1',
            versjon: 1,
            status: {
              kode: behandlingStatus.BEHANDLING_UTREDES,
              kodeverk: '',
            },
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
    definisjon: {
      kode: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
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
  vilkarvurderingsperioder: defaultVilkarvurderingsperioder,
};

export const MedToPerioder = Template.bind({});
MedToPerioder.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
  aksjonspunkter: [{
    definisjon: {
      kode: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
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
