import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Undertekst, Normaltekst } from 'nav-frontend-typografi';

import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import {
  BeregningResultatPeriode, VedtaksbrevAvsnitt, AlleKodeverkTilbakekreving,
} from '@fpsak-frontend/types';
import { ForeslaVedtakTilbakekrevingAp } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm, { ForhandsvisData } from './TilbakekrevingVedtakForm';

interface OwnProps {
  submitCallback: (aksjonspunktData: ForeslaVedtakTilbakekrevingAp) => Promise<void>;
  readOnly: boolean;
  resultat: string;
  perioder: BeregningResultatPeriode[];
  alleKodeverk: AlleKodeverkTilbakekreving;
  behandlingUuid: string;
  avsnittsliste: VedtaksbrevAvsnitt[];
  fetchPreviewVedtaksbrev: (data: ForhandsvisData) => Promise<any>;
  erRevurderingTilbakekrevingKlage?: boolean;
  erRevurderingTilbakekrevingFeilBeløpBortfalt?: boolean;
  formData?: any;
  setFormData: (data: any) => void;
}

const TilbakekrevingVedtak: FunctionComponent<OwnProps> = ({
  submitCallback,
  readOnly,
  resultat,
  perioder,
  alleKodeverk,
  behandlingUuid,
  avsnittsliste,
  fetchPreviewVedtaksbrev,
  erRevurderingTilbakekrevingKlage,
  erRevurderingTilbakekrevingFeilBeløpBortfalt,
  formData,
  setFormData,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk);
  return (
    <>
      <Undertittel>
        <FormattedMessage id="TilbakekrevingVedtak.Vedtak" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      <Undertekst>
        <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
      </Undertekst>
      <Normaltekst>
        {getKodeverknavn(resultat, KodeverkType.VEDTAK_RESULTAT_TYPE)}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        behandlingUuid={behandlingUuid}
        avsnittsliste={avsnittsliste}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        erRevurderingTilbakekrevingKlage={erRevurderingTilbakekrevingKlage}
        erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default TilbakekrevingVedtak;
