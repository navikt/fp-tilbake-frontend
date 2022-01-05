import React, { FunctionComponent } from 'react';
import { SideMenu } from '@navikt/fp-react-components';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';

interface OwnProps {
  menyData: {
    label: string;
    erAktiv: boolean;
    harApneAksjonspunkter: boolean;
  }[];
  oppdaterFaktaPanelIUrl: (index: number) => void;
}

const FaktaMeny: FunctionComponent<OwnProps> = ({
  menyData,
  oppdaterFaktaPanelIUrl,
}) => (
  <SideMenu
    heading="FaktaPanel.FaktaOm"
    links={menyData.map((data) => ({
      label: data.label,
      active: data.erAktiv,
      iconSrc: data.harApneAksjonspunkter ? advarselIkonUrl : undefined,
      iconAltText: data.harApneAksjonspunkter ? 'HelpText.Aksjonspunkt' : undefined,
    }))}
    onClick={oppdaterFaktaPanelIUrl}
  />
);

export default FaktaMeny;
