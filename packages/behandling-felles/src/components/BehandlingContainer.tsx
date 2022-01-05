import React, {
  FunctionComponent, ReactElement, useState,
} from 'react';
import { RawIntlProvider } from 'react-intl';

import { Behandling } from '@fpsak-frontend/types';
import { createIntl } from '@fpsak-frontend/utils';

import ProsessContainer from './prosess/ProsessContainer';

import messages from '../../i18n/nb_NO.json';
import ProsessPanelInitProps, { ProsessPanelExtraInitProps } from '../types/prosessPanelInitProps';

const intl = createIntl(messages);

interface OwnProps {
  behandling: Behandling;
  hentProsessPaneler?: ((props: ProsessPanelInitProps, ekstraProps: ProsessPanelExtraInitProps) => ReactElement);
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
}

const BehandlingContainer: FunctionComponent<OwnProps> = ({
  behandling,
  hentProsessPaneler,
  valgtProsessSteg,
  valgtFaktaSteg,
  oppdaterProsessStegOgFaktaPanelIUrl,
}) => (
  <RawIntlProvider value={intl}>
    <ProsessContainer
      hentPaneler={hentProsessPaneler}
      valgtProsessSteg={valgtProsessSteg}
      valgtFaktaSteg={valgtFaktaSteg}
      oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
      behandling={behandling}
    />
  </RawIntlProvider>
);

export default BehandlingContainer;
