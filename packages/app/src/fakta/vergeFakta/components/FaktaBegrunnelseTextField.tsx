import React, { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { decodeHtmlEntity } from '@navikt/ft-utils';
import {
  hasValidText, maxLength, minLength, required,
} from '@navikt/ft-form-validators';
import { TextAreaField } from '@navikt/ft-form-hooks';
import { Aksjonspunkt } from '@navikt/ft-types';

import styles from './faktaBegrunnelseTextField.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

type OwnProps = {
  isReadOnly: boolean;
  isSubmittable: boolean;
  hasBegrunnelse: boolean;
  label?: string;
  hasVurderingText?: boolean;
  name?: string;
};

export type FormValues = {
  [key: string]: any;
};

type TransformedValues = {
  begrunnelse: string;
};

interface StaticFunctions {
  buildInitialValues: (aksjonspunkt: Aksjonspunkt[] | Aksjonspunkt, begrunnelseFieldName?: string) => FormValues;
  transformValues: (values: FormValues, name?: string) => TransformedValues;
}

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextField: FunctionComponent<OwnProps> & StaticFunctions = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  label,
  hasVurderingText,
  name,
}) => {
  const intl = useIntl();
  const code = hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : 'FaktaBegrunnelseTextField.BegrunnEndringene';
  const textAreaLabel = label || intl.formatMessage({ id: code });

  if (isSubmittable || hasBegrunnelse) {
    return (
      <div className={styles.begrunnelseTextField}>
        <TextAreaField
          name={name}
          label={isReadOnly ? '' : textAreaLabel}
          validate={[required, minLength3, maxLength1500, hasValidText]}
          textareaClass={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
          maxLength={1500}
          readOnly={isReadOnly}
        />
      </div>
    );
  }
  return null;
};

FaktaBegrunnelseTextField.defaultProps = {
  name: 'begrunnelse',
  hasVurderingText: false,
};

const getBegrunnelse = (aksjonspunkt: Aksjonspunkt[] | Aksjonspunkt): string => {
  if (aksjonspunkt && Array.isArray(aksjonspunkt)) {
    return aksjonspunkt.length > 0 ? aksjonspunkt[0].begrunnelse : '';
  }
  return aksjonspunkt && !Array.isArray(aksjonspunkt) ? aksjonspunkt.begrunnelse : '';
};

FaktaBegrunnelseTextField.buildInitialValues = (aksjonspunkt: Aksjonspunkt[] | Aksjonspunkt, begrunnelseFieldName = 'begrunnelse'): FormValues => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextField.transformValues = (values: FormValues, name = 'begrunnelse'): TransformedValues => ({
  begrunnelse: values[name] as string,
});

export default FaktaBegrunnelseTextField;
