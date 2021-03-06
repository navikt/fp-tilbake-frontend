import React, { FunctionComponent } from 'react';
import {
  FormattedMessage, injectIntl, IntlShape, WrappedComponentProps,
} from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';

import { ArrowBox, VerticalSpacer } from '@navikt/ft-ui-komponenter';
import { RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import {
  hasValidText, maxLength, minLength, required,
} from '@navikt/ft-form-validators';
import { KodeverkMedNavn } from '@navikt/ft-types';

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
        <RadioGroupPanel
          name={`${name}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`}
          label={<Undertekst><FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Tilbakekrev" /></Undertekst>}
          validate={[required]}
          parse={(value: string) => value === 'true'}
          isHorizontal
          isReadOnly={readOnly}
          radios={[{
            label: <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />,
            value: 'true',
            element: (
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
            ),
          }, {
            label: <FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />,
            value: 'false',
            element: (
              <ArrowBox alignOffset={20}>
                <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.AllePerioderBehandlesLikt" />
              </ArrowBox>
            ),
          }]}
        />
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
