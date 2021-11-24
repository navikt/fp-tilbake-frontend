import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { CheckboxField, TextAreaField } from '@fpsak-frontend/form-hooks';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import AktsomhetReduksjonAvBelopFormPanel from './AktsomhetReduksjonAvBelopFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface OwnProps {
  harGrunnerTilReduksjon?: boolean;
  readOnly: boolean;
  handletUaktsomhetGrad: string;
  erSerligGrunnAnnetValgt: boolean;
  harMerEnnEnYtelse: boolean;
  feilutbetalingBelop: number;
  andelSomTilbakekreves?: string;
  sarligGrunnTyper?: KodeverkMedNavn[];
  name: string;
}

const AktsomhetSarligeGrunnerFormPanel: FunctionComponent<OwnProps> = ({
  name,
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  andelSomTilbakekreves,
}) => (
  <div>
    <Undertekst>
      <FormattedMessage id="AktsomhetSarligeGrunnerFormPanel.GrunnerTilReduksjon" />
    </Undertekst>
    <VerticalSpacer eightPx />
    {sarligGrunnTyper.map((sgt: KodeverkMedNavn) => (
      <React.Fragment key={sgt.kode}>
        <CheckboxField
          key={sgt.kode}
          name={`${name}.${sgt.kode}`}
          label={sgt.navn}
          readOnly={readOnly}
        />
        <VerticalSpacer eightPx />
      </React.Fragment>
    ))}
    {erSerligGrunnAnnetValgt && (
      <Row>
        <Column md="1" />
        <Column md="10">
          <TextAreaField
            name={`${name}.annetBegrunnelse`}
            label=""
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </Column>
      </Row>
    )}
    <AktsomhetReduksjonAvBelopFormPanel
      name={name}
      harGrunnerTilReduksjon={harGrunnerTilReduksjon}
      readOnly={readOnly}
      handletUaktsomhetGrad={handletUaktsomhetGrad}
      harMerEnnEnYtelse={harMerEnnEnYtelse}
      feilutbetalingBelop={feilutbetalingBelop}
      andelSomTilbakekreves={andelSomTilbakekreves}
    />
  </div>
);

export default AktsomhetSarligeGrunnerFormPanel;
