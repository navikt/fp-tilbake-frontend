import React, {
  FunctionComponent, useEffect, useState, useMemo,
} from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelCode } from '@fpsak-frontend/konstanter';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import {
  FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  Aksjonspunkt, FeilutbetalingFakta, AlleKodeverkTilbakekreving, Fagsak, Behandling, AlleKodeverk, AksessRettigheter,
} from '@fpsak-frontend/types';
import { createIntl } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FaktaAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import FeilutbetalingFaktaIndex from './feilutbetalingFakta/FeilutbetalingFaktaIndex';
import VergeFaktaIndex from './vergeFakta/VergeFaktaIndex';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
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
  oppdaterFaktaPanelIUrl: (faktanavn: string) => void;
  submitCallback: (aksjonspunkter: FaktaAksjonspunkt | FaktaAksjonspunkt[]) => Promise<any>;
  rettigheter: AksessRettigheter;
  hasFetchError: boolean;
}

const FaktaIndex: FunctionComponent<OwnProps> = ({
  behandling,
  fagsak,
  tilbakekrevingKodeverk,
  fpsakKodeverk,
  valgtFaktaSteg,
  oppdaterFaktaPanelIUrl,
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
  const skalVergepanelVises = !!initData?.aksjonspunkter?.some((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE);

  const aksjonspunkterForFeilutbetalingFakta = useMemo(() => (initData?.aksjonspunkter
    ? initData.aksjonspunkter.filter((ap) => aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING === ap.definisjon.kode) : []),
  [initData?.aksjonspunkter]);

  const aksjonspunkterForVergeFakta = useMemo(() => (initData?.aksjonspunkter
    ? initData.aksjonspunkter.filter((ap) => aksjonspunktCodes.AVKLAR_VERGE === ap.definisjon.kode) : []),
  [initData?.aksjonspunkter]);

  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (formData) {
      setFormData({});
    }
  }, [behandling.versjon]);

  const menyData = [];
  if (skalFeilutbetalingspanelVises) {
    const harApneAksjonspunkter = aksjonspunkterForFeilutbetalingFakta.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
    const erAktiv = valgtFaktaSteg === FaktaPanelCode.FEILUTBETALING || (harApneAksjonspunkter && valgtFaktaSteg === DEFAULT_PANEL_VALGT);
    menyData.push({
      id: FaktaPanelCode.FEILUTBETALING,
      label: intl.formatMessage({ id: 'TilbakekrevingFakta.FaktaFeilutbetaling' }),
      erAktiv,
      harApneAksjonspunkter,
    });
  }
  if (skalVergepanelVises) {
    const harApneAksjonspunkter = aksjonspunkterForVergeFakta.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
    const erAktiv = valgtFaktaSteg === FaktaPanelCode.VERGE || (harApneAksjonspunkter && valgtFaktaSteg === DEFAULT_PANEL_VALGT);
    menyData.push({
      id: FaktaPanelCode.VERGE,
      label: intl.formatMessage({ id: 'RegistrereVergeInfoPanel.Info' }),
      erAktiv,
      harApneAksjonspunkter,
    });
  }

  const oppdaterFaktaPanel = (index: number) => {
    oppdaterFaktaPanelIUrl(menyData[index].id);
  };

  return (
    <div className={styles.container}>
      <FlexContainer fullHeight>
        <FlexRow>
          <FlexColumn className={styles.sideMenu}>
            <FaktaMeny
              menyData={menyData}
              oppdaterFaktaPanelIUrl={oppdaterFaktaPanel}
            />
          </FlexColumn>
          <FlexColumn className={styles.content}>
            {menyData.some((d) => d.id === FaktaPanelCode.FEILUTBETALING && d.erAktiv) && (
              <FeilutbetalingFaktaIndex
                fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
                fpsakKodeverk={fpsakKodeverk}
                alleKodeverk={tilbakekrevingKodeverk}
                feilutbetalingFakta={initData.feilutbetalingFakta}
                aksjonspunkter={aksjonspunkterForFeilutbetalingFakta}
                alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForFeilutbetalingFakta)}
                submitCallback={submitCallback}
                readOnly={erReadOnly(behandling, aksjonspunkterForFeilutbetalingFakta, [], rettigheter, hasFetchError)}
                formData={formData[FaktaPanelCode.FEILUTBETALING]}
                setFormData={(data: any) => setFormData((oldData) => ({
                  ...oldData,
                  [FaktaPanelCode.FEILUTBETALING]: data,
                }))}
              />
            )}
            {menyData.some((d) => d.id === FaktaPanelCode.VERGE && d.erAktiv) && (
              <VergeFaktaIndex
                aksjonspunkter={aksjonspunkterForVergeFakta}
                alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForVergeFakta)}
                alleKodeverk={fpsakKodeverk}
                submitCallback={submitCallback}
                readOnly={erReadOnly(behandling, aksjonspunkterForVergeFakta, [], rettigheter, hasFetchError)}
                formData={formData[FaktaPanelCode.VERGE]}
                setFormData={(data: any) => setFormData((oldData) => ({
                  ...oldData,
                  [FaktaPanelCode.VERGE]: data,
                }))}
              />
            )}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default FaktaIndex;
