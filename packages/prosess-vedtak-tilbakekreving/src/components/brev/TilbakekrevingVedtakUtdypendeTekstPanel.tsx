import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { Undertekst } from 'nav-frontend-typografi';

import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import {
  required, hasValidText, maxLength, minLength,
} from '@fpsak-frontend/utils';
import { TextArea } from '@fpsak-frontend/form-hooks';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './tilbakekrevingVedtakUtdypendeTekstPanel.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

const valideringsregler = [minLength3, hasValidText];
const valideringsreglerPakrevet = [required, minLength3, hasValidText];

interface OwnProps {
  type: string;
  readOnly: boolean;
  fritekstPakrevet: boolean;
  maximumLength?: number;
  formName: string;
}

export const TilbakekrevingVedtakUtdypendeTekstPanel: FunctionComponent<OwnProps> = ({
  type,
  readOnly,
  fritekstPakrevet,
  maximumLength,
}) => {
  const intl = useIntl();
  const { watch } = useFormContext();
  const isEmpty = watch(type) === undefined;

  const [isTextfieldHidden, hideTextField] = useState(isEmpty && !fritekstPakrevet);
  const valideringsRegler = fritekstPakrevet ? valideringsreglerPakrevet : valideringsregler;
  valideringsRegler.push(maximumLength ? maxLength(maximumLength) : maxLength4000);
  return (
    <>
      {(isTextfieldHidden && !readOnly) && (
        <>
          <VerticalSpacer eightPx />
          <div
            onClick={(event) => { event.preventDefault(); hideTextField(false); }}
            onKeyDown={(event) => { event.preventDefault(); hideTextField(false); }}
            className={styles.addPeriode}
            role="button"
            tabIndex={0}
          >
            <Image
              className={styles.addCircleIcon}
              src={addCircleIcon}
              alt={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst' })}
            />
            <Undertekst className={styles.imageText}>
              <FormattedMessage id="TilbakekrevingVedtakUtdypendeTekstPanel.LeggTilUtdypendeTekst" />
            </Undertekst>
          </div>
        </>
      )}
      {!isTextfieldHidden && (
        <>
          <VerticalSpacer eightPx />
          <TextArea
            name={type}
            label={intl.formatMessage({ id: 'TilbakekrevingVedtakUtdypendeTekstPanel.UtdypendeTekst' })}
            validate={valideringsRegler}
            maxLength={maximumLength || 4000}
            readOnly={readOnly}
          />
        </>
      )}
    </>
  );
};

export default TilbakekrevingVedtakUtdypendeTekstPanel;
