import React, { FunctionComponent } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@navikt/ft-ui-komponenter';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { VedtaksbrevAvsnitt } from '@fpsak-frontend/types';

import TilbakekrevingVedtakUtdypendeTekstPanel from './TilbakekrevingVedtakUtdypendeTekstPanel';
import underavsnittType from '../../kodeverk/avsnittType';

import styles from './tilbakekrevingEditerVedtaksbrevPanel.less';

export type FormValues = Record<string, Record<string, string> | string>

interface OwnProps {
  intl: IntlShape;
  vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[];
  formName: string;
  readOnly: boolean;
  perioderSomIkkeHarUtfyltObligatoriskVerdi: string[];
  fritekstOppsummeringPakrevdMenIkkeUtfylt?: boolean;
  erRevurderingTilbakekrevingFeilBelÃ¸pBortfalt?: boolean;
}

interface StaticFunctions {
  buildInitialValues?: (vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[]) => FormValues,
}

export const TilbakekrevingEditerVedtaksbrevPanel: FunctionComponent<OwnProps> & StaticFunctions = ({
  intl,
  vedtaksbrevAvsnitt,
  formName,
  readOnly,
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  fritekstOppsummeringPakrevdMenIkkeUtfylt = false,
  erRevurderingTilbakekrevingFeilBelÃ¸pBortfalt,
}) => (
  <div className={styles.container}>
    <VerticalSpacer twentyPx />
    <Undertittel>
      <FormattedMessage id="TilbakekrevingVedtak.Vedtaksbrev" />
    </Undertittel>
    <VerticalSpacer eightPx />
    {vedtaksbrevAvsnitt.map((avsnitt) => {
      const underavsnitter = avsnitt.underavsnittsliste;
      const periode = `${avsnitt.fom}_${avsnitt.tom}`;
      const harPeriodeSomManglerObligatoriskVerdi = perioderSomIkkeHarUtfyltObligatoriskVerdi.some((p) => p === periode);
      const visApen = avsnitt.avsnittstype === underavsnittType.OPPSUMMERING && fritekstOppsummeringPakrevdMenIkkeUtfylt;
      return (
        <React.Fragment key={avsnitt.avsnittstype + avsnitt.fom}>
          <Ekspanderbartpanel
            className={harPeriodeSomManglerObligatoriskVerdi || visApen ? styles.panelMedGulmarkering : styles.panel}
            tittel={avsnitt.overskrift
              ? avsnitt.overskrift : intl.formatMessage({ id: 'TilbakekrevingEditerVedtaksbrevPanel.LovhjemlerOgKlagerettOverskrift' })}
            apen={harPeriodeSomManglerObligatoriskVerdi || visApen}
          >
            {underavsnitter.map((underavsnitt) => (
              <React.Fragment key={underavsnitt.underavsnittstype + underavsnitt.overskrift + underavsnitt.brÃ¸dtekst}>
                {underavsnitt.overskrift && (
                  <Element>
                    {underavsnitt.overskrift}
                  </Element>
                )}
                {underavsnitt.brÃ¸dtekst && (
                  <Normaltekst>
                    {underavsnitt.brÃ¸dtekst}
                  </Normaltekst>
                )}
                {underavsnitt.fritekstTillatt && (
                  <>
                    <VerticalSpacer eightPx />
                    <TilbakekrevingVedtakUtdypendeTekstPanel
                      type={underavsnitt.underavsnittstype ? `${periode}.${underavsnitt.underavsnittstype}` : avsnitt.avsnittstype}
                      formName={formName}
                      readOnly={readOnly}
                      fritekstPakrevet={underavsnitt.fritekstPÃ¥krevet}
                      maximumLength={erRevurderingTilbakekrevingFeilBelÃ¸pBortfalt ? 10000 : null}
                    />
                  </>
                )}
                <VerticalSpacer eightPx />
              </React.Fragment>
            ))}
          </Ekspanderbartpanel>
          <VerticalSpacer eightPx />
        </React.Fragment>
      );
    })}
  </div>
);

TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues = (vedtaksbrevAvsnitt: VedtaksbrevAvsnitt[]): FormValues => vedtaksbrevAvsnitt
  .filter((avsnitt) => avsnitt.underavsnittsliste.some((underavsnitt) => underavsnitt.fritekst))
  .reduce((acc, avsnitt) => {
    const underavsnitter = avsnitt.underavsnittsliste;
    const friteksterForUnderavsnitt = underavsnitter
      .filter((underavsnitt) => underavsnitt.fritekst)
      .reduce((underAcc, underavsnitt) => ({
        ...underAcc,
        [underavsnitt.underavsnittstype ? underavsnitt.underavsnittstype
          : avsnitt.avsnittstype]: decodeHtmlEntity(underavsnitt.fritekst),
      }), {});

    const nyeFritekster = avsnitt.fom
      ? { [`${avsnitt.fom}_${avsnitt.tom}`]: friteksterForUnderavsnitt }
      : friteksterForUnderavsnitt;

    return { ...acc, ...nyeFritekster };
  }, {});

export default TilbakekrevingEditerVedtaksbrevPanel;
