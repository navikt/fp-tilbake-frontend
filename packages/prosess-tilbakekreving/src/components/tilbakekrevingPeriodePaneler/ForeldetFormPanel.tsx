import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form-hooks';

const ForeldetFormPanel = () => (
  <Row>
    <Column md="6">
      <TextAreaField
        name="foreldetBegrunnelse"
        label={<FormattedMessage id="ForeldetPanel.Vurdering" />}
        readOnly
      />
    </Column>
    <Column md="6">
      <RadioGroupField
        name="periodenErForeldet"
        readOnly
        label={<FormattedMessage id="ForeldetPanel.VurderOmPeriodenErForeldet" />}
      >
        {[<RadioOption key={1} label={<FormattedMessage id="ForeldetPanel.PeriodenErForeldet" />} value="true" />]}
      </RadioGroupField>
    </Column>
  </Row>
);

export default ForeldetFormPanel;
