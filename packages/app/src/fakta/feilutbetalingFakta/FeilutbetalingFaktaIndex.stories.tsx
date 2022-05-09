import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { RawIntlProvider } from 'react-intl';

import { createIntl } from '@navikt/ft-utils';
import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import { FagsakYtelseType, AksjonspunktStatus } from '@navikt/ft-kodeverk';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { FaktaAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';
import { alleTilbakekrevingKodeverk, alleKodeverk } from '@fpsak-frontend/storybook-utils';
import {
  AlleKodeverkTilbakekreving, Behandling,
} from '@navikt/ft-types';
import {
  FeilutbetalingFakta, FeilutbetalingAarsak,
} from '@fpsak-frontend/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../../data/tilbakekrevingBehandlingApi';
import FeilutbetalingFaktaIndex from './FeilutbetalingFaktaIndex';

import messages from '../../../i18n/nb_NO.json';

const intl = createIntl(messages);

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
      behandlingArsakType: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
    }],
    behandlingsresultat: {
      type: behandlingResultatType.INNVILGET,
      konsekvenserForYtelsen: [konsekvensForYtelsen.FORELDREPENGER_OPPHØRER, konsekvensForYtelsen.ENDRING_I_BEREGNING],
    },
    tilbakekrevingValg: {
      videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
    },
    datoForRevurderingsvedtak: '2019-01-01',
  },
};

const feilutbetalingAarsak = [{
  ytelseType: FagsakYtelseType.FORELDREPENGER,
  hendelseTyper: [{
    hendelseType: 'MEDLEMSKAP',
    hendelseUndertyper: [],
  }, {
    hendelseType: 'OKONOMI_FEIL',
    hendelseUndertyper: ['OKONOMI_FEIL_TREKK'],
  }, {
    hendelseType: 'BEREGNING_TYPE',
    hendelseUndertyper: ['IKKE_BOSATT'],
  }],
}] as FeilutbetalingAarsak[];

const fpTilbakekrevingAlleKodeverk = alleTilbakekrevingKodeverk as AlleKodeverkTilbakekreving;
const fpSakAlleKodeverk = alleKodeverk as any;

export default {
  title: 'fakta/fakta-feilutbetaling',
  component: FeilutbetalingFaktaIndex,
};

const Template: Story<{
  submitCallback: (aksjonspunktData: FaktaAksjonspunkt | FaktaAksjonspunkt[]) => Promise<void>;
}> = ({
  submitCallback,
}) => {
  const data = [
    { key: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK.name, data: feilutbetalingAarsak },
  ];

  return (
    <RawIntlProvider value={intl}>
      <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
        <FeilutbetalingFaktaIndex
          behandling={{
            status: behandlingStatus.BEHANDLING_UTREDES,
          } as Behandling}
          submitCallback={submitCallback}
          erReadOnlyFn={() => false}
          setFormData={() => undefined}
          formData={{}}
          feilutbetalingFakta={feilutbetalingFakta as FeilutbetalingFakta}
          aksjonspunkter={[{
            definisjon: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
            status: AksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          }]}
          alleKodeverk={fpTilbakekrevingAlleKodeverk}
          fpsakKodeverk={fpSakAlleKodeverk}
          fagsakYtelseTypeKode={FagsakYtelseType.FORELDREPENGER}
        />
      </RestApiMock>
    </RawIntlProvider>
  );
};

export const AksjonspunktForFeilutbetaling = Template.bind({});
AksjonspunktForFeilutbetaling.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
};
