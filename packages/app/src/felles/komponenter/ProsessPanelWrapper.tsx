import React, {
  FunctionComponent, ReactElement,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { FadingPanel } from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import styles from './prosessPanelWrapper.less';

interface PanelContainerOwnProps {
  children: any;
}

const PanelContainer: FunctionComponent<PanelContainerOwnProps> = ({
  children,
}) => (
  <div className={styles.steg}>
    <FadingPanel>
      {children}
    </FadingPanel>
  </div>
);

interface OwnProps {
  erAksjonspunktOpent: boolean;
  status: string;
  visHenlagt: boolean;
  children: ReactElement | ReactElement[];
}

const ProsessPanelWrapper: FunctionComponent<OwnProps> = ({
  erAksjonspunktOpent,
  status,
  visHenlagt,
  children,
}) => {
  if (visHenlagt) {
    return (
      <PanelContainer>
        <Normaltekst>
          <FormattedMessage id="ProsessPanelWrapper.Henlagt" />
        </Normaltekst>
      </PanelContainer>
    );
  }
  if (status === vilkarUtfallType.IKKE_VURDERT && !erAksjonspunktOpent) {
    return (
      <PanelContainer>
        <Normaltekst>
          <FormattedMessage id="ProsessPanelWrapper.IkkeBehandlet" />
        </Normaltekst>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      {children}
    </PanelContainer>
  );
};

export default ProsessPanelWrapper;
