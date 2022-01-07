import React from 'react';
import { Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import RestApiMock from '@fpsak-frontend/utils-test/src/rest/RestApiMock';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { alleKodeverk } from '@fpsak-frontend/storybook-utils';
import VergeFaktaIndex from './VergeFaktaIndex';
import { TilbakekrevingBehandlingApiKeys, requestTilbakekrevingApi } from '../../data/tilbakekrevingBehandlingApi';

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.AVKLAR_VERGE,
    kodeverk: '',
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
    kodeverk: '',
  },
  begrunnelse: undefined,
  kanLoses: true,
  erAktivt: true,
}];

const verge = {};

const merknaderFraBeslutter = {
  notAccepted: false,
};

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
    <RestApiMock data={data} requestApi={requestTilbakekrevingApi}>
      <VergeFaktaIndex
        submitCallback={submitCallback}
        readOnly={false}
        setFormData={() => undefined}
        aksjonspunkter={aksjonspunkter}
        alleKodeverk={alleKodeverk as any}
        alleMerknaderFraBeslutter={{
          [aksjonspunktCodes.AVKLAR_VERGE]: merknaderFraBeslutter,
        }}
      />
    </RestApiMock>
  );
};

export const Default = Template.bind({});
Default.args = {
  submitCallback: action('button-click') as (data: any) => Promise<any>,
};
