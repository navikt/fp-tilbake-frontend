import React, { FunctionComponent } from 'react';
import {
  FormattedMessage, injectIntl, IntlShape, WrappedComponentProps,
} from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';

import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form-hooks';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

import styles from './aktsomhetGradUaktsomhetFormPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const sarligGrunnerBegrunnelseDiv = (
  name: string,
  readOnly: boolean,
  intl: IntlShape,
) => (
  <div>
    <Element>
      <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.SærligGrunner" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name={`${name}.sarligGrunnerBegrunnelse`}
      label={intl.formatMessage({ id: 'AktsomhetGradUaktsomhetFormPanel.VurderSærligGrunner' })}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
      textareaClass={styles.explanationTextarea}
      placeholder={intl.formatMessage({ id: 'AktsomhetGradUaktsomhetFormPanel.VurderSærligGrunner.Hjelpetekst' })}
    />
    <VerticalSpacer twentyPx />
  </div>
);

interface OwnProps {
  harGrunnerTilReduksjon?: boolean;
  readOnly: boolean;
  handletUaktsomhetGrad: string;
  erSerligGrunnAnnetValgt: boolean;
  harMerEnnEnYtelse: boolean;
  feilutbetalingBelop: number;
  erTotalBelopUnder4Rettsgebyr: boolean;
  sarligGrunnTyper?: KodeverkMedNavn[];
  andelSomTilbakekreves?: string;
  erValgtResultatTypeForstoBurdeForstaatt?: boolean;
  name: string;
}

const AktsomhetGradUaktsomhetFormPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
  erValgtResultatTypeForstoBurdeForstaatt,
  name,
}) => {
  const grovUaktsomOffset = erValgtResultatTypeForstoBurdeForstaatt ? 180 : 200;
  return (
    <ArrowBox alignOffset={handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM ? grovUaktsomOffset : 20}>
      {(handletUaktsomhetGrad === aktsomhet.SIMPEL_UAKTSOM && erTotalBelopUnder4Rettsgebyr) && (
      <>
        <Undertekst><FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Tilbakekrev" /></Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          validate={[required]}
          name={`${name}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`}
          readOnly={readOnly}
          parse={(value: string) => value === 'true'}
        >
          <RadioOption label={<FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Ja" />} value="true">
            {sarligGrunnerBegrunnelseDiv(name, readOnly, intl)}
            <AktsomhetSarligeGrunnerFormPanel
              name={name}
              harGrunnerTilReduksjon={harGrunnerTilReduksjon}
              erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
              sarligGrunnTyper={sarligGrunnTyper}
              harMerEnnEnYtelse={harMerEnnEnYtelse}
              feilutbetalingBelop={feilutbetalingBelop}
              readOnly={readOnly}
              handletUaktsomhetGrad={handletUaktsomhetGrad}
              andelSomTilbakekreves={andelSomTilbakekreves}
            />
          </RadioOption>
          <RadioOption label={<FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Nei" />} value="false">
            <ArrowBox alignOffset={20}>
              <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.AllePerioderBehandlesLikt" />
            </ArrowBox>
          </RadioOption>
        </RadioGroupField>
        <VerticalSpacer eightPx />
      </>
      )}
      {(handletUaktsomhetGrad !== aktsomhet.SIMPEL_UAKTSOM || !erTotalBelopUnder4Rettsgebyr) && (
      <>
        {sarligGrunnerBegrunnelseDiv(name, readOnly, intl)}
        <AktsomhetSarligeGrunnerFormPanel
          name={name}
          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
          erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
          sarligGrunnTyper={sarligGrunnTyper}
          harMerEnnEnYtelse={harMerEnnEnYtelse}
          feilutbetalingBelop={feilutbetalingBelop}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          andelSomTilbakekreves={andelSomTilbakekreves}
        />
      </>
      )}
    </ArrowBox>
  );
};

export default injectIntl(AktsomhetGradUaktsomhetFormPanel);
