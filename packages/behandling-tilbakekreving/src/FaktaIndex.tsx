import React, {
  FunctionComponent, useEffect, useState, useMemo,
} from 'react';

import { FaktaPanelCode } from '@fpsak-frontend/konstanter';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import {
  StandardBehandlingProps,
} from '@fpsak-frontend/behandling-felles';
import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  Aksjonspunkt, FeilutbetalingFakta, AlleKodeverkTilbakekreving, Fagsak, Behandling, AlleKodeverk, AksessRettigheter,
} from '@fpsak-frontend/types';
import { createIntl } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import FeilutbetalingFaktaIndex from './feilutbetalingFakta/FeilutbetalingFaktaIndex';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import VergeFaktaInitPanel from './faktaPaneler/VergeFaktaInitPanel';
import FaktaMeny from './FaktaMeny';
import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';
import messages from '../i18n/nb_NO.json';

import styles from './faktaContainer.less';
import { erReadOnly } from './readOnlyPanelUtils';

const intl = createIntl(messages);

const DEFAULT_PANEL_VALGT = 'default';

const ENDEPUNKTER_INIT_DATA = [TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER, TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA];
type EndepunktInitData = {
  aksjonspunkter: Aksjonspunkt[];
  feilutbetalingFakta: FeilutbetalingFakta;
}

interface OwnProps {
  behandling: Behandling;
  fagsak: Fagsak;
  tilbakekrevingKodeverk: AlleKodeverkTilbakekreving;
  fpsakKodeverk: AlleKodeverk;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  submitCallback: () => undefined;
  rettigheter: AksessRettigheter;
  hasFetchError: boolean;
}

const FaktaIndex: FunctionComponent<OwnProps & StandardBehandlingProps> = ({
  behandling,
  fagsak,
  tilbakekrevingKodeverk,
  fpsakKodeverk,
  valgtFaktaSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
  submitCallback,
  rettigheter,
  hasFetchError,
}) => {
  const formaterteEndepunkter = ENDEPUNKTER_INIT_DATA.map((e) => ({ key: e }));
  const { data: initData } = restApiTilbakekrevingHooks
    .useMultipleRestApi<EndepunktInitData, any>(formaterteEndepunkter, {
      updateTriggers: [behandling.versjon],
      isCachingOn: true,
    });

  const skalFeilutbetalingspanelVises = !!initData?.feilutbetalingFakta;

  const aksjonspunkterForFeilutbetalingFakta = useMemo(() => (initData?.aksjonspunkter
    ? initData.aksjonspunkter.filter((ap) => aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING === ap.definisjon.kode) : []),
  [initData?.aksjonspunkter]);

  const [formData, setFormData] = useState();
  useEffect(() => {
    if (formData) {
      setFormData(undefined);
    }
  }, [behandling.versjon]);

  const menyData = [];
  if (skalFeilutbetalingspanelVises) {
    const harApneAksjonspunkter = aksjonspunkterForFeilutbetalingFakta.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
    const erAktiv = valgtFaktaSteg === FaktaPanelCode.FEILUTBETALING || (harApneAksjonspunkter && valgtFaktaSteg === DEFAULT_PANEL_VALGT);
    menyData.push({
      label: intl.formatMessage({ id: 'TilbakekrevingFakta.FaktaFeilutbetaling' }),
      erAktiv,
      harApneAksjonspunkter,
    });
  }

  return (
    <div className={styles.container}>
      <FlexContainer fullHeight>
        <FlexRow>
          <FlexColumn className={styles.sideMenu}>
            <FaktaMeny
              menyData={menyData}
              oppdaterFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            />
          </FlexColumn>
          <FlexColumn className={styles.content}>
            {skalFeilutbetalingspanelVises && (
              <FeilutbetalingFaktaIndex
                fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
                fpsakKodeverk={fpsakKodeverk}
                alleKodeverk={tilbakekrevingKodeverk}
                feilutbetalingFakta={initData.feilutbetalingFakta}
                aksjonspunkter={aksjonspunkterForFeilutbetalingFakta}
                alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForFeilutbetalingFakta)}
                submitCallback={submitCallback}
                readOnly={erReadOnly(behandling, aksjonspunkterForFeilutbetalingFakta, [], rettigheter, hasFetchError)}
                formData={formData}
                setFormData={setFormData}
              />
            )}
            <VergeFaktaInitPanel valgtFaktaSteg={valgtFaktaSteg} />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default FaktaIndex;
