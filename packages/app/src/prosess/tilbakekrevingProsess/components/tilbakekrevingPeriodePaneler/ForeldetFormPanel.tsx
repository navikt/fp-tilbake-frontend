import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import { RadioGroupPanel, TextArea } from '@navikt/fp-form';

const ForeldetFormPanel = () => (
  <Row>
    <Column md="6">
      <TextArea
        name="foreldetBegrunnelse"
        label={<FormattedMessage id="ForeldetPanel.Vurdering" />}
        readOnly
      />
    </Column>
    <Column md="6">
      <RadioGroupPanel
        name="periodenErForeldet"
        label={<Undertekst><FormattedMessage id="ForeldetPanel.VurderOmPeriodenErForeldet" /></Undertekst>}
        radios={[{
          label: <FormattedMessage id="ForeldetPanel.PeriodenErForeldet" />,
          value: 'true',
        }]}
        isReadOnly
      />
    </Column>
  </Row>
);

export default ForeldetFormPanel;
