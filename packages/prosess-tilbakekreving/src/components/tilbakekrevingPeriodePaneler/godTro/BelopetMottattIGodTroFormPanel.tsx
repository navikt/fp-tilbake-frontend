import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';

import {
  minValue, required, removeSpacesFromNumber, formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { VerticalSpacer, ArrowBox } from '@fpsak-frontend/shared-components';
import {
  RadioOption, RadioGroupField, InputField,
} from '@fpsak-frontend/form-hooks';

import styles from './belopetMottattIGodTroFormPanel.less';

const minValue1 = minValue(1);

const parseCurrencyInput = (input: any) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : parsedValue;
};

export interface InitialValuesGodTroForm {
  erBelopetIBehold: boolean;
  tilbakekrevdBelop?: number;
}

interface OwnProps {
  name: string;
  readOnly: boolean;
  erBelopetIBehold?: boolean;
}

interface StaticFunctions {
  buildIntialValues?: (info: { erBelopetIBehold: boolean; tilbakekrevesBelop: number }) => InitialValuesGodTroForm,
  transformValues?: (info: { erBelopetIBehold: boolean; tilbakekrevdBelop: number }, vurderingBegrunnelse: string) => {
    '@type': string;
    begrunnelse: string;
    erBelopetIBehold: boolean;
    tilbakekrevesBelop: number;
  },
}

const BelopetMottattIGodTroFormPanel: FunctionComponent<OwnProps> & StaticFunctions = ({
  name,
  readOnly,
  erBelopetIBehold,
}) => (
  <>
    <Undertekst><FormattedMessage id="BelopetMottattIGodTroFormPanel.BelopetIBehold" /></Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name={`${name}.erBelopetIBehold`}
      readOnly={readOnly}
      parse={(value: string) => value === 'true'}
    >
      <RadioOption label={<FormattedMessage id="BelopetMottattIGodTroFormPanel.Ja" />} value="true" />
      <RadioOption label={<FormattedMessage id="BelopetMottattIGodTroFormPanel.Nei" />} value="false" />
    </RadioGroupField>
    <div className={styles.arrowbox}>
      {erBelopetIBehold === true && (
        <ArrowBox alignOffset={25}>
          <InputField
            name={`${name}.tilbakekrevdBelop`}
            label={<FormattedMessage id="BelopetMottattIGodTroFormPanel.AngiBelop" />}
            validate={[required, minValue1]}
            readOnly={readOnly}
            format={formatCurrencyNoKr}
            parse={parseCurrencyInput}
            bredde="S"
          />
        </ArrowBox>
      )}
      {erBelopetIBehold === false && (
        <ArrowBox alignOffset={90}>
          <Normaltekst>
            <FormattedMessage id="BelopetMottattIGodTroFormPanel.IngenTilbakekreving" />
          </Normaltekst>
        </ArrowBox>
      )}
    </div>
  </>
);

BelopetMottattIGodTroFormPanel.transformValues = (info: { erBelopetIBehold: boolean; tilbakekrevdBelop: number }, vurderingBegrunnelse: string) => ({
  '@type': 'godTro',
  begrunnelse: vurderingBegrunnelse,
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevesBelop: info.erBelopetIBehold ? removeSpacesFromNumber(info.tilbakekrevdBelop) : undefined,
});

BelopetMottattIGodTroFormPanel.buildIntialValues = (info: { erBelopetIBehold: boolean; tilbakekrevesBelop: number }) => ({
  erBelopetIBehold: info.erBelopetIBehold,
  tilbakekrevdBelop: info.tilbakekrevesBelop,
});

export default BelopetMottattIGodTroFormPanel;
