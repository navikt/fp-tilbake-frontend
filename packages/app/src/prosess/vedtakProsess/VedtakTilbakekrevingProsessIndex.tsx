import React, { FunctionComponent, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { LoadingPanel, AdvarselModal } from '@fpsak-frontend/shared-components';
import {
  BeregningsresultatTilbakekreving, Kodeverk, StandardProsessPanelPropsTilbakekreving,
} from '@fpsak-frontend/types';
import { forhandsvisDokument } from '@fpsak-frontend/utils';
import { ProsessAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import { ForhandsvisData } from './components/TilbakekrevingVedtakForm';
import TilbakekrevingVedtak from './components/TilbakekrevingVedtak';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';
import FatterVedtakStatusModal from '../../felles/komponenter/FatterVedtakStatusModal';

const tilbakekrevingÅrsakTyperKlage = [
  behandlingArsakType.RE_KLAGE_KA,
  behandlingArsakType.RE_KLAGE_NFP,
];

const erTilbakekrevingÅrsakKlage = (årsak: Kodeverk): boolean => årsak && tilbakekrevingÅrsakTyperKlage.includes(årsak.kode);

const getLagringSideeffekter = (
  toggleFatterVedtakModal: (skalViseModal: boolean) => void,
  toggleOppdatereFagsakContext: (skalOppdatereFagsak: boolean) => void,
) => () => {
  toggleOppdatereFagsakContext(false);

  // Returner funksjon som blir kjørt etter lagring av aksjonspunkt(er)
  return () => {
    toggleFatterVedtakModal(true);
  };
};

interface OwnProps {
  beregningsresultat: BeregningsresultatTilbakekreving;
  harApenRevurdering: boolean;
  submitCallback: (
    lagringSideEffectsCallback?: (aksjonspunktModeller: any) => () => void,
  ) => (aksjonspunkter: ProsessAksjonspunkt | ProsessAksjonspunkt[]) => Promise<any>;
  opneSokeside: () => void;
  toggleOppdatereFagsakContext: (skalOppdatereFagsak: boolean) => void;
}

const VedtakTilbakekrevingProsessIndex: FunctionComponent<OwnProps & StandardProsessPanelPropsTilbakekreving> = ({
  behandling,
  beregningsresultat,
  submitCallback,
  isReadOnly,
  alleKodeverk,
  formData,
  setFormData,
  harApenRevurdering,
  opneSokeside,
  toggleOppdatereFagsakContext,
}) => {
  const intl = useIntl();
  const [visApenRevurderingModal, toggleApenRevurderingModal] = useState(harApenRevurdering);
  const lukkApenRevurderingModal = useCallback(() => toggleApenRevurderingModal(false), []);

  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);

  const lagringSideeffekterCallback = getLagringSideeffekter(toggleFatterVedtakModal, toggleOppdatereFagsakContext);

  const { startRequest: forhandsvisVedtaksbrev } = restApiTilbakekrevingHooks.useRestApiRunner(TilbakekrevingBehandlingApiKeys.PREVIEW_VEDTAKSBREV);
  const fetchPreviewVedtaksbrev = useCallback((param: ForhandsvisData) => forhandsvisVedtaksbrev(param).then((response) => forhandsvisDokument(response)), []);

  const { data: vedtaksbrev, state } = restApiTilbakekrevingHooks.useRestApi(TilbakekrevingBehandlingApiKeys.VEDTAKSBREV);

  if (state !== RestApiState.SUCCESS) {
    return <LoadingPanel />;
  }

  const erRevurderingTilbakekrevingKlage = behandling.førsteÅrsak && erTilbakekrevingÅrsakKlage(behandling.førsteÅrsak.behandlingArsakType);
  const erRevurderingTilbakekrevingFeilBeløpBortfalt = behandling.førsteÅrsak
    && behandlingArsakType.RE_FEILUTBETALT_BELØP_REDUSERT === behandling.førsteÅrsak.behandlingArsakType.kode;
  return (
    <>
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={() => { toggleFatterVedtakModal(false); opneSokeside(); }}
        tekst={intl.formatMessage({ id: 'FatterTilbakekrevingVedtakStatusModal.Sendt' })}
      />
      {visApenRevurderingModal && (
        <AdvarselModal
          headerText={intl.formatMessage({ id: 'BehandlingTilbakekrevingIndex.ApenRevurderingHeader' })}
          bodyText={intl.formatMessage({ id: 'BehandlingTilbakekrevingIndex.ApenRevurdering' })}
          showModal
          submit={lukkApenRevurderingModal}
        />
      )}
      <TilbakekrevingVedtak
        behandlingUuid={behandling.uuid}
        perioder={beregningsresultat.beregningResultatPerioder}
        resultat={beregningsresultat.vedtakResultatType}
        avsnittsliste={vedtaksbrev.avsnittsliste}
        submitCallback={submitCallback(lagringSideeffekterCallback)}
        readOnly={isReadOnly}
        alleKodeverk={alleKodeverk}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        erRevurderingTilbakekrevingKlage={erRevurderingTilbakekrevingKlage}
        erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default VedtakTilbakekrevingProsessIndex;
