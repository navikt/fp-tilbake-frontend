import React, { FunctionComponent } from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { WrappedComponentProps } from 'react-intl';
import {
  VerticalSpacer, FaktaGruppe, FlexContainer, FlexColumn, FlexRow,
} from '@navikt/ft-ui-komponenter';

import {
  hasValidDate, hasValidFodselsnummer, hasValidName, required,
} from '@navikt/ft-form-validators';
import {
  Datepicker, InputField, SelectField,
} from '@navikt/ft-form-hooks';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { KodeverkMedNavn } from '@navikt/ft-types';
import { Verge } from '@fpsak-frontend/types';

import VergeType from '../kodeverk/vergeType';

export type FormValues = {
  navn?: string;
  gyldigFom?: string;
  gyldigTom?: string;
  fnr?: string;
  organisasjonsnummer?: string;
  vergeType?: string;
}

export type TransformedValues = {
  vergeType: string,
  navn: string,
  fnr: string,
  organisasjonsnummer: string,
  gyldigFom: string,
  gyldigTom: string,
  kode: aksjonspunktCodes.AVKLAR_VERGE,
}

interface OwnProps {
  readOnly: boolean;
  vergetyper?: KodeverkMedNavn[];
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
  valgtVergeType?: string;
}

interface StaticFunctions {
  buildInitialValues: (verge: Verge) => FormValues;
  transformValues: (values: FormValues) => TransformedValues;
}

/**
 * RegistrereVergeFaktaForm
 *
 * Formkomponent. Registrering og oppdatering av verge.
 */
export const RegistrereVergeFaktaForm: FunctionComponent<OwnProps & WrappedComponentProps> & StaticFunctions = ({
  intl,
  readOnly,
  vergetyper,
  alleMerknaderFraBeslutter,
  valgtVergeType,
}) => (
  <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_VERGE]}>
    <Row>
      <Column xs="5">
        <SelectField
          name="vergeType"
          label={intl.formatMessage({ id: 'Verge.TypeVerge' })}
          placeholder={intl.formatMessage({ id: 'Verge.TypeVerge' })}
          validate={[required]}
          selectValues={vergetyper.map((vt) => <option key={vt.kode} value={vt.kode}>{vt.navn}</option>)}
          readOnly={readOnly}
        />
      </Column>
    </Row>
    {valgtVergeType && (
      <>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="3">
            <InputField
              bredde="XXL"
              name="navn"
              label={intl.formatMessage({ id: 'Verge.Navn' })}
              validate={[required, hasValidName]}
              readOnly={readOnly}
            />
          </Column>
          <Column xs="3">
            {valgtVergeType !== VergeType.ADVOKAT && (
              <InputField
                bredde="S"
                name="fnr"
                label={intl.formatMessage({ id: 'Verge.FodselsNummer' })}
                validate={[required, hasValidFodselsnummer]}
                readOnly={readOnly}
              />
            )}
            {valgtVergeType === VergeType.ADVOKAT && (
              <InputField
                bredde="S"
                name="organisasjonsnummer"
                label={intl.formatMessage({ id: 'Verge.Organisasjonsnummer' })}
                validate={[required]}
                readOnly={readOnly}
              />
            )}
          </Column>
        </Row>
        <VerticalSpacer eightPx />
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Datepicker
                name="gyldigFom"
                label={intl.formatMessage({ id: 'Verge.PeriodeFOM' })}
                validate={[required, hasValidDate]}
                isReadOnly={readOnly}
              />
            </FlexColumn>
            <FlexColumn>
              <Datepicker
                name="gyldigTom"
                label={intl.formatMessage({ id: 'Verge.PeriodeTOM' })}
                validate={[hasValidDate]}
                isReadOnly={readOnly}
              />
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </>
    )}
  </FaktaGruppe>
);

RegistrereVergeFaktaForm.defaultProps = {
  vergetyper: [],
};

RegistrereVergeFaktaForm.buildInitialValues = (verge: Verge): FormValues => ({
  navn: verge.navn,
  gyldigFom: verge.gyldigFom,
  gyldigTom: verge.gyldigTom,
  fnr: verge.fnr,
  organisasjonsnummer: verge.organisasjonsnummer,
  vergeType: verge.vergeType || undefined,
});

RegistrereVergeFaktaForm.transformValues = (values: FormValues): TransformedValues => ({
  vergeType: values.vergeType,
  navn: values.navn,
  fnr: values.fnr,
  organisasjonsnummer: values.organisasjonsnummer,
  gyldigFom: values.gyldigFom,
  gyldigTom: values.gyldigTom,
  kode: aksjonspunktCodes.AVKLAR_VERGE,
});

export default RegistrereVergeFaktaForm;
