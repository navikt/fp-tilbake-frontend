import React, {
  FunctionComponent, useEffect, useState, useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegCode } from '@fpsak-frontend/konstanter';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import {
  LoadingPanel,
} from '@fpsak-frontend/shared-components';
import {
  Aksjonspunkt, FeilutbetalingPerioderWrapper, AlleKodeverkTilbakekreving, Behandling, AksessRettigheter, Kodeverk,
} from '@fpsak-frontend/types';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FaktaAksjonspunkt } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import getAlleMerknaderFraBeslutter from './getAlleMerknaderFraBeslutter';
import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import ProsessMeny from './ProsessMeny';
import ForeldelseProsessIndex from './foreldelseProsess/ForeldelseProsessIndex';
import TilbakekrevingProsessIndex from './tilbakekrevingProsess/TilbakekrevingProsessIndex';
import ProsessPanelWrapper from './felles/ProsessPanelWrapper';
import { erReadOnly } from './readOnlyPanelUtils';

import styles from './prosessContainer.less';

const DEFAULT_PANEL_VALGT = 'default';

const ENDEPUNKTER_INIT_DATA = [TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER, TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE];
type EndepunktInitData = {
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse: FeilutbetalingPerioderWrapper;
}

const finnStatus = (aksjonspunkter: Aksjonspunkt[]) => {
  if (aksjonspunkter.length > 0) {
    return aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode)) ? vilkarUtfallType.IKKE_VURDERT : vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

interface OwnProps {
  behandling: Behandling;
  fagsakKjønn: Kodeverk;
  tilbakekrevingKodeverk: AlleKodeverkTilbakekreving;
  valgtProsessSteg?: string;
  oppdaterProsessPanelIUrl: (faktanavn: string) => void;
  submitCallback: (aksjonspunkter: FaktaAksjonspunkt | FaktaAksjonspunkt[]) => Promise<any>;
  rettigheter: AksessRettigheter;
  hasFetchError: boolean;
}

const ProsessIndex: FunctionComponent<OwnProps> = ({
  behandling,
  fagsakKjønn,
  tilbakekrevingKodeverk,
  valgtProsessSteg,
  oppdaterProsessPanelIUrl,
  submitCallback,
  rettigheter,
  hasFetchError,
}) => {
  const intl = useIntl();
  const formaterteEndepunkter = ENDEPUNKTER_INIT_DATA.map((e) => ({ key: e }));
  const { data: initData, state } = restApiTilbakekrevingHooks
    .useMultipleRestApi<EndepunktInitData, any>(formaterteEndepunkter, {
      updateTriggers: [behandling.versjon],
      isCachingOn: true,
    });

  const aksjonspunkterForForeldelse = useMemo(() => (initData?.aksjonspunkter
    ? initData.aksjonspunkter.filter((ap) => aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE === ap.definisjon.kode) : []),
  [initData?.aksjonspunkter]);
  const aksjonspunkterForTilbakekreving = useMemo(() => (initData?.aksjonspunkter
    ? initData.aksjonspunkter.filter((ap) => aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING === ap.definisjon.kode) : []),
  [initData?.aksjonspunkter]);

  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (formData) {
      setFormData({});
    }
  }, [behandling.versjon]);

  const menyData = [];

  const harApentAksjonspunkt = aksjonspunkterForForeldelse.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
  const erAktiv = valgtProsessSteg === ProsessStegCode.FORELDELSE || (harApentAksjonspunkt && valgtProsessSteg === DEFAULT_PANEL_VALGT);
  menyData.push({
    id: ProsessStegCode.FORELDELSE,
    tekst: intl.formatMessage({ id: 'Behandlingspunkt.Foreldelse' }),
    erAktiv,
    harApentAksjonspunkt,
    status: initData?.perioderForeldelse ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT,
  });

  const harApentAksjonspunktForTilbakekreving = aksjonspunkterForTilbakekreving.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
  const erAktivForTilbakekreving = valgtProsessSteg === ProsessStegCode.TILBAKEKREVING
    || (harApentAksjonspunktForTilbakekreving && valgtProsessSteg === DEFAULT_PANEL_VALGT);
  menyData.push({
    id: ProsessStegCode.TILBAKEKREVING,
    tekst: intl.formatMessage({ id: 'Behandlingspunkt.Tilbakekreving' }),
    erAktiv: erAktivForTilbakekreving,
    harApentAksjonspunkt: harApentAksjonspunktForTilbakekreving,
    status: finnStatus(aksjonspunkterForTilbakekreving),
  });

  const oppdaterProsessPanel = (index: number) => {
    oppdaterProsessPanelIUrl(menyData[index].id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.meny}>
        <ProsessMeny menyData={menyData} oppdaterProsessPanelIUrl={oppdaterProsessPanel} />
      </div>
      {state !== RestApiState.SUCCESS && (
        <LoadingPanel />
      )}
      {menyData.some((d) => d.id === ProsessStegCode.FORELDELSE && d.erAktiv) && (
        <ProsessPanelWrapper
          erAksjonspunktOpent={menyData.find((d) => d.id === ProsessStegCode.FORELDELSE).harApentAksjonspunkt}
          status={menyData.find((d) => d.id === ProsessStegCode.FORELDELSE).status}
        >
          <ForeldelseProsessIndex
            navBrukerKjonn={fagsakKjønn.kode}
            alleKodeverk={tilbakekrevingKodeverk}
            behandling={behandling}
            perioderForeldelse={initData?.perioderForeldelse}
            alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForForeldelse)}
            submitCallback={submitCallback}
            readOnly={erReadOnly(behandling, aksjonspunkterForForeldelse, rettigheter, hasFetchError)}
            readOnlySubmitButton={!(aksjonspunkterForForeldelse.some((ap) => ap.kanLoses))}
            aksjonspunkter={aksjonspunkterForForeldelse}
            formData={formData[ProsessStegCode.FORELDELSE]}
            setFormData={(data: any) => setFormData((oldData) => ({
              ...oldData,
              [ProsessStegCode.FORELDELSE]: data,
            }))}
          />
        </ProsessPanelWrapper>
      )}
      {menyData.some((d) => d.id === ProsessStegCode.TILBAKEKREVING && d.erAktiv) && (
        <ProsessPanelWrapper
          erAksjonspunktOpent={menyData.find((d) => d.id === ProsessStegCode.TILBAKEKREVING).harApentAksjonspunkt}
          status={menyData.find((d) => d.id === ProsessStegCode.TILBAKEKREVING).status}
        >
          <TilbakekrevingProsessIndex
            navBrukerKjonn={fagsakKjønn.kode}
            alleKodeverk={tilbakekrevingKodeverk}
            behandling={behandling}
            perioderForeldelse={initData?.perioderForeldelse}
            alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForTilbakekreving)}
            submitCallback={submitCallback}
            readOnly={erReadOnly(behandling, aksjonspunkterForTilbakekreving, rettigheter, hasFetchError)}
            readOnlySubmitButton={!(aksjonspunkterForTilbakekreving.some((ap) => ap.kanLoses))}
            aksjonspunkter={aksjonspunkterForTilbakekreving}
            formData={formData[ProsessStegCode.TILBAKEKREVING]}
            setFormData={(data: any) => setFormData((oldData) => ({
              ...oldData,
              [ProsessStegCode.TILBAKEKREVING]: data,
            }))}
          />
        </ProsessPanelWrapper>
      )}
    </div>
  );
};

export default ProsessIndex;
