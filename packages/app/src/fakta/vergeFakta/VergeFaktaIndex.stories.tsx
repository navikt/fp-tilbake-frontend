import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { RawIntlProvider } from 'react-intl';

import { createIntl } from '@navikt/ft-utils';
import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktStatus } from '@navikt/ft-kodeverk';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';
import { Behandling } from '@navikt/ft-types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import VergeFaktaIndex from './VergeFaktaIndex';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../../data/tilbakekrevingBehandlingApi';

import messages from '../../../i18n/nb_NO.json';

const intl = createIntl(messages);

const aksjonspunkter = [{
  definisjon: aksjonspunktCodes.AVKLAR_VERGE,
  status: AksjonspunktStatus.OPPRETTET,
  begrunnelse: undefined,
  kanLoses: true,
  erAktivt: true,
}];

const verge = {};

export default {
  title: 'fakta/fakta-verge',
  component: VergeFaktaIndex,
};

const Template: Story<{
  submitCallback: (aksjonspunktData: any) => Promise<void>;
}> = ({
  submitCallback,
}) => {
  const data = [
    { key: TilbakekrevingBehandlingApiKeys.VERGE.name, data: verge },
  ];

  return (
    <RawIntlProvider value={intl}>
      <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
        <VergeFaktaIndex
          behandling={{
            status: behandlingStatus.BEHANDLING_UTREDES,
          } as Behandling}
          submitCallback={submitCallback}
          erReadOnlyFn={() => false}
          setFormData={() => undefined}
          formData={{}}
          aksjonspunkter={aksjonspunkter}
          alleKodeverk={alleKodeverk as any}
        />
      </RestApiMock>
    </RawIntlProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
};
