import React, { FunctionComponent } from 'react';
import { RawIntlProvider } from 'react-intl';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  AlleKodeverk, AlleKodeverkTilbakekreving, StandardFaktaPanelProps,
} from '@fpsak-frontend/types';
import { createIntl } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import RegistrereVergeInfoPanel from './components/RegistrereVergeInfoPanel';
import messages from '../../i18n/nb_NO.json';

const intl = createIntl(messages);

type OwnProps = {
  alleKodeverk: AlleKodeverk | AlleKodeverkTilbakekreving;
};

const VergeFaktaIndex: FunctionComponent<OwnProps & StandardFaktaPanelProps> = ({
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  readOnly,
  formData,
  setFormData,
}) => {
  const { data: verge, state } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.VERGE);

  if (state !== RestApiState.SUCCESS) {
    return <LoadingPanel />;
  }

  return (
    <RawIntlProvider value={intl}>
      <RegistrereVergeInfoPanel
        verge={verge}
        aksjonspunkter={aksjonspunkter}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        hasOpenAksjonspunkter={aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses)}
        alleKodeverk={alleKodeverk}
        submitCallback={submitCallback}
        readOnly={readOnly}
        submittable={!aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) || aksjonspunkter.some((ap) => ap.kanLoses)}
        formData={formData}
        setFormData={setFormData}
      />
    </RawIntlProvider>
  );
};

export default VergeFaktaIndex;
