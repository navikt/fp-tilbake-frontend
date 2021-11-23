import React, { FunctionComponent } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, createIntl } from '@fpsak-frontend/utils';

import messages from '../i18n/nb_NO.json';

const intl = createIntl(messages);

const isDisabled = (isDirty: boolean, isSubmitting: boolean, isSubmittable: boolean): boolean => {
  if (!isSubmittable || isSubmitting) {
    return true;
  }
  return !isDirty;
};

interface OwnProps {
  isReadOnly: boolean;
  isSubmittable: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  text?: string;
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * ProsessStegSubmitButton
 */
const ProsessStegSubmitButton: FunctionComponent<OwnProps> = ({
  isReadOnly,
  isSubmittable,
  isSubmitting,
  isDirty,
  text,
  onClick,
}) => {
  if (!isReadOnly) {
    return (
      <Hovedknapp
        mini
        spinner={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable)}
        onClick={onClick || ariaCheck}
        htmlType="button"
      >
        {text || intl.formatMessage({ id: 'SubmitButton.ConfirmInformation' })}
      </Hovedknapp>
    );
  }
  return null;
};

export default ProsessStegSubmitButton;
