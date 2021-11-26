import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import {
  RadioGroupField, RadioOption, TextAreaField, SelectField, Form,
} from '@fpsak-frontend/form-hooks';
import {
  formatCurrencyNoKr, hasValidText, maxLength, minLength, required, DDMMYYYY_DATE_FORMAT, decodeHtmlEntity,
} from '@fpsak-frontend/utils';
import {
  AdvarselModal, FlexColumn, FlexRow, VerticalSpacer, usePrevious,
} from '@fpsak-frontend/shared-components';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import {
  FeilutbetalingPerioderWrapper, Kodeverk, KodeverkMedNavn, DetaljertFeilutbetalingPeriode, AlleKodeverkTilbakekreving,
} from '@fpsak-frontend/types';

import sarligGrunn from '../kodeverk/sarligGrunn';
import Aktsomhet, { AKTSOMHET_REKKEFØLGE } from '../kodeverk/aktsomhet';
import VilkarResultat from '../kodeverk/vilkarResultat';
import TilbakekrevingAktivitetTabell from './tilbakekrevingPeriodePaneler/TilbakekrevingAktivitetTabell';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import BelopetMottattIGodTroFormPanel, { InitialValuesGodTroForm } from './tilbakekrevingPeriodePaneler/godTro/BelopetMottattIGodTroFormPanel';
import AktsomhetFormPanel, { InitialValuesAktsomhetForm } from './tilbakekrevingPeriodePaneler/aktsomhet/AktsomhetFormPanel';
import DataForPeriode from '../types/dataForPeriodeTsType';

import styles from './tilbakekrevingPeriodeForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

export const TILBAKEKREVING_PERIODE_FORM_NAME = 'TilbakekrevingPeriodeForm';

export type CustomPeriode = {
  fom: string;
  tom: string;
  erTotalBelopUnder4Rettsgebyr: boolean;
  foreldelseVurderingType?: Kodeverk;
  begrunnelse?: string;
  harMerEnnEnYtelse: boolean;
} & DetaljertFeilutbetalingPeriode

export type CustomPerioder = {
  perioder: CustomPeriode[];
}

export interface InitialValuesDetailForm {
  valgtVilkarResultatType: string;
  begrunnelse: string;
  erForeldet?: boolean;
  periodenErForeldet?: boolean;
  foreldetBegrunnelse?: string;
  vurderingBegrunnelse?: string;
  harMerEnnEnYtelse: boolean;
  [VilkarResultat.FEIL_OPPLYSNINGER]?: InitialValuesAktsomhetForm;
  [VilkarResultat.FORSTO_BURDE_FORSTAATT]?: InitialValuesAktsomhetForm;
  [VilkarResultat.MANGELFULL_OPPLYSNING]?: InitialValuesAktsomhetForm;
  [VilkarResultat.GOD_TRO]?: InitialValuesGodTroForm;
}

export type CustomVilkarsVurdertePeriode = {
  fom: string;
  tom: string;
  erSplittet?: boolean;
  feilutbetaling?: number;
} & InitialValuesDetailForm

interface OwnProps {
  data: DataForPeriode;
  periode?: CustomVilkarsVurdertePeriode;
  skjulPeriode: (...args: any[]) => any;
  readOnly: boolean;
  oppdaterPeriode: (...args: any[]) => any;
  vilkarsVurdertePerioder: CustomVilkarsVurdertePeriode[];
  alleKodeverk: AlleKodeverkTilbakekreving;
  antallPerioderMedAksjonspunkt: number;
}

const TilbakekrevingPeriodeForm: FunctionComponent<OwnProps> = ({
  data,
  periode,
  skjulPeriode,
  readOnly,
  oppdaterPeriode,
  vilkarsVurdertePerioder,
  alleKodeverk,
  antallPerioderMedAksjonspunkt,
}) => {
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);

  const formMethods = useForm<any>({
    defaultValues: periode,
  });

  const valgtVilkarResultatType = formMethods.watch('valgtVilkarResultatType');
  const handletUaktsomhetsgrad = formMethods.watch(`${valgtVilkarResultatType}.handletUaktsomhetGrad`);
  const harGrunnerTilReduksjon = formMethods.watch(`${valgtVilkarResultatType}.${handletUaktsomhetsgrad}.harGrunnerTilReduksjon`);
  const andelSomTilbakekreves = formMethods.watch(`${valgtVilkarResultatType}.${handletUaktsomhetsgrad}.andelSomTilbakekreves`);
  const tilbakekrevSelvOmBeloepErUnder4Rettsgebyr = formMethods
    .watch(`${valgtVilkarResultatType}.${handletUaktsomhetsgrad}.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr`);
  const erSerligGrunnAnnetValgt = formMethods.watch(`${valgtVilkarResultatType}.${handletUaktsomhetsgrad}.${sarligGrunn.ANNET}`);
  const erBelopetIBehold = formMethods.watch(`${valgtVilkarResultatType}.erBelopetIBehold`);

  const forrigeVilkarResultatType = usePrevious(valgtVilkarResultatType);
  const forrigeHandletUaktsomhetsgrad = usePrevious(handletUaktsomhetsgrad);

  const reduserteBelop = data.redusertBeloper;
  const sarligGrunnTyper = alleKodeverk[tilbakekrevingKodeverkTyper.SARLIG_GRUNN];
  const vilkarResultatTyper = alleKodeverk[tilbakekrevingKodeverkTyper.VILKAR_RESULTAT];
  const aktsomhetTyper = AKTSOMHET_REKKEFØLGE
    .map((a) => alleKodeverk[tilbakekrevingKodeverkTyper.AKTSOMHET].find((el: KodeverkMedNavn) => el.kode === a));

  const onEndrePeriodeForKopi = (event: any, vurdertePerioder: CustomVilkarsVurdertePeriode[]) => {
    const fomTom = event.target.value.split('_');
    const kopierDenne = vurdertePerioder.find((per) => per.fom === fomTom[0] && per.tom === fomTom[1]);
    const vilkårResultatType = kopierDenne.valgtVilkarResultatType;
    const resultatType = kopierDenne[vilkårResultatType];

    const resultatTypeKopi = JSON.parse(JSON.stringify(resultatType));
    if (vilkårResultatType !== VilkarResultat.GOD_TRO) {
      const { handletUaktsomhetGrad } = resultatTypeKopi;
      if (handletUaktsomhetGrad !== Aktsomhet.FORSETT && periode.harMerEnnEnYtelse !== kopierDenne.harMerEnnEnYtelse) {
        resultatTypeKopi[handletUaktsomhetGrad].andelSomTilbakekreves = null;
        resultatTypeKopi[handletUaktsomhetGrad].andelSomTilbakekrevesManuell = null;
        resultatTypeKopi[handletUaktsomhetGrad].belopSomSkalTilbakekreves = null;
      }
    }

    formMethods.setValue('valgtVilkarResultatType', vilkårResultatType, { shouldDirty: true });
    formMethods.setValue('begrunnelse', kopierDenne.begrunnelse, { shouldDirty: true });
    formMethods.setValue('vurderingBegrunnelse', kopierDenne.vurderingBegrunnelse, { shouldDirty: true });
    formMethods.setValue(vilkårResultatType, resultatTypeKopi, { shouldDirty: true });

    event.preventDefault();
  };

  const saveForm = () => {
    setShowModal(!showModal);
    oppdaterPeriode(formMethods.getValues());
  };

  const saveOrToggleModal = (values: any) => {
    if (antallPerioderMedAksjonspunkt > 1 && data.erTotalBelopUnder4Rettsgebyr && tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false) {
      setShowModal(!showModal);
    } else {
      oppdaterPeriode(values);
    }
  };

  const resetVilkarresultatType = () => {
    if (forrigeVilkarResultatType) {
      formMethods.resetField(forrigeVilkarResultatType);
    }
  };

  const resetUtaktsomhetsgrad = () => {
    if (forrigeHandletUaktsomhetsgrad) {
      formMethods.resetField(`${valgtVilkarResultatType}.${forrigeHandletUaktsomhetsgrad}`);
    }
  };

  const vurdertePerioder = vilkarsVurdertePerioder.filter((per) => !per.erForeldet && per.valgtVilkarResultatType != null);
  return (
    <Form formMethods={formMethods} onSubmit={saveOrToggleModal}>
      {reduserteBelop.map((belop) => (
        <React.Fragment key={belop.belop}>
          <Normaltekst>
            <FormattedMessage
              id={belop.erTrekk ? 'TilbakekrevingPeriodeForm.FeilutbetaltBelopTrekk' : 'TilbakekrevingPeriodeForm.FeilutbetaltBelopEtterbetaling'}
              values={{ belop: formatCurrencyNoKr(belop.belop), b: (chunks: any) => <b>{chunks}</b> }}
            />
          </Normaltekst>
          <VerticalSpacer eightPx />
        </React.Fragment>
      ))}
      <TilbakekrevingAktivitetTabell ytelser={data.ytelser} />
      <VerticalSpacer twentyPx />
      {!readOnly && !data.erForeldet && vurdertePerioder.length > 0 && (
        <>
          <Row>
            <Column md="10">
              <Element>
                <FormattedMessage id="TilbakekrevingPeriodeForm.KopierVilkårsvurdering" />
              </Element>
              <SelectField
                name="perioderForKopi"
                selectValues={vurdertePerioder.map((per) => {
                  const perId = `${per.fom}_${per.tom}`;
                  const perValue = `${moment(per.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(per.tom).format(DDMMYYYY_DATE_FORMAT)}`;
                  return <option key={perId} value={perId}>{perValue}</option>;
                })}
                onChange={(event) => onEndrePeriodeForKopi(event, vurdertePerioder)}
                bredde="m"
                label=""
              />
            </Column>
          </Row>
          <VerticalSpacer twentyPx />
        </>
      )}
      <Row>
        <Column md={data.erForeldet ? '12' : '6'}>
          <Row>
            {data.erForeldet && (
              <Column md="12">
                <ForeldetFormPanel />
              </Column>
            )}
            {!data.erForeldet && (
              <Column md="10">
                <Element>
                  <FormattedMessage id="TilbakekrevingPeriodeForm.VilkarForTilbakekreving" />
                </Element>
                <VerticalSpacer eightPx />
                <TextAreaField
                  name="begrunnelse"
                  label={intl.formatMessage({ id: 'TilbakekrevingPeriodeForm.Vurdering' })}
                  validate={[required, minLength3, maxLength1500, hasValidText]}
                  maxLength={1500}
                  readOnly={readOnly}
                  textareaClass={styles.explanationTextarea}
                  placeholder={intl.formatMessage({ id: 'TilbakekrevingPeriodeForm.Vurdering.Hjelpetekst' })}
                />
                <VerticalSpacer twentyPx />
                <Undertekst><FormattedMessage id="TilbakekrevingPeriodeForm.oppfylt" /></Undertekst>
                <VerticalSpacer eightPx />
                <RadioGroupField
                  validate={[required]}
                  name="valgtVilkarResultatType"
                  direction="vertical"
                  readOnly={readOnly}
                  onChange={resetVilkarresultatType}
                >
                  {vilkarResultatTyper.map((vrt) => (
                    <RadioOption
                      key={vrt.kode}
                      label={vrt.navn}
                      value={vrt.kode}
                    />
                  ))}
                </RadioGroupField>
              </Column>
            )}
          </Row>
        </Column>
        <Column md="6">
          <Row>
            <Column md="10">
              {valgtVilkarResultatType && (
                <>
                  <Element>
                    <FormattedMessage id={valgtVilkarResultatType === VilkarResultat.GOD_TRO
                      ? 'TilbakekrevingPeriodeForm.BelopetMottattIGodTro' : 'TilbakekrevingPeriodeForm.Aktsomhet'}
                    />
                  </Element>
                  <VerticalSpacer eightPx />
                  <TextAreaField
                    name="vurderingBegrunnelse"
                    label={intl.formatMessage({
                      id: valgtVilkarResultatType === VilkarResultat.GOD_TRO
                        ? 'TilbakekrevingPeriodeForm.VurderingMottattIGodTro'
                        : 'TilbakekrevingPeriodeForm.VurderingAktsomhet',
                    })}
                    validate={[required, minLength3, maxLength1500, hasValidText]}
                    maxLength={1500}
                    readOnly={readOnly}
                  />
                  <VerticalSpacer eightPx />
                  {valgtVilkarResultatType === VilkarResultat.GOD_TRO && (
                    <BelopetMottattIGodTroFormPanel
                      name={valgtVilkarResultatType}
                      readOnly={readOnly}
                      erBelopetIBehold={erBelopetIBehold}
                      feilutbetalingBelop={data.feilutbetaling}
                    />
                  )}
                  {valgtVilkarResultatType !== VilkarResultat.GOD_TRO && (
                    <AktsomhetFormPanel
                      name={valgtVilkarResultatType}
                      harGrunnerTilReduksjon={harGrunnerTilReduksjon}
                      readOnly={readOnly}
                      handletUaktsomhetGrad={handletUaktsomhetsgrad}
                      resetFields={resetUtaktsomhetsgrad}
                      erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
                      erValgtResultatTypeForstoBurdeForstaatt={valgtVilkarResultatType === VilkarResultat.FORSTO_BURDE_FORSTAATT}
                      aktsomhetTyper={aktsomhetTyper}
                      sarligGrunnTyper={sarligGrunnTyper}
                      antallYtelser={data.ytelser.length}
                      feilutbetalingBelop={data.feilutbetaling}
                      erTotalBelopUnder4Rettsgebyr={data.erTotalBelopUnder4Rettsgebyr}
                      andelSomTilbakekreves={andelSomTilbakekreves}
                    />
                  )}
                </>
              )}
            </Column>
          </Row>
        </Column>
      </Row>
      <VerticalSpacer twentyPx />
      <FlexRow>
        <FlexColumn>
          <Hovedknapp
            mini
            htmlType="submit"
            disabled={!formMethods.formState.isDirty || readOnly}
          >
            <FormattedMessage id="TilbakekrevingPeriodeForm.Oppdater" />
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp mini htmlType="button" onClick={skjulPeriode}>
            <FormattedMessage id="TilbakekrevingPeriodeForm.Avbryt" />
          </Knapp>
        </FlexColumn>
      </FlexRow>
      { showModal
        && <AdvarselModal bodyText={intl.formatMessage({ id: 'TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr' })} showModal submit={saveForm} />}
    </Form>
  );
};

export const periodeFormBuildInitialValues = (periode: any, foreldelsePerioder: FeilutbetalingPerioderWrapper): InitialValuesDetailForm => {
  const { vilkarResultat, begrunnelse, vilkarResultatInfo } = periode;

  const vilkarResultatKode = vilkarResultat && vilkarResultat.kode ? vilkarResultat.kode : vilkarResultat;
  let foreldetData = { erForeldet: false, periodenErForeldet: undefined, foreldetBegrunnelse: undefined };
  const erForeldet = periode.erForeldet ? periode.erForeldet : periode.foreldet;
  if (erForeldet) {
    const foreldelsePeriode = foreldelsePerioder.perioder.find((p) => p.fom === periode.fom && p.tom === periode.tom);
    foreldetData = {
      erForeldet,
      periodenErForeldet: true,
      foreldetBegrunnelse: decodeHtmlEntity(foreldelsePeriode.begrunnelse),
    };
  }

  const initialValues = {
    valgtVilkarResultatType: vilkarResultatKode,
    begrunnelse: decodeHtmlEntity(begrunnelse),
    harMerEnnEnYtelse: periode.ytelser.length > 1,
    ...foreldetData,
  };

  const godTroData = vilkarResultatKode === VilkarResultat.GOD_TRO ? BelopetMottattIGodTroFormPanel.buildIntialValues(vilkarResultatInfo) : {};
  const annetData = vilkarResultatKode !== undefined && vilkarResultatKode !== VilkarResultat.GOD_TRO
    ? AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo) : {};
  return {
    ...initialValues,
    vurderingBegrunnelse: vilkarResultatInfo ? decodeHtmlEntity(vilkarResultatInfo.begrunnelse) : undefined,
    [initialValues.valgtVilkarResultatType]: {
      ...godTroData,
      ...annetData,
    },
  };
};

export const periodeFormTransformValues = (values: CustomVilkarsVurdertePeriode, sarligGrunnTyper: KodeverkMedNavn[]) => {
  const { valgtVilkarResultatType, begrunnelse, vurderingBegrunnelse } = values;
  const info = values[valgtVilkarResultatType];

  const godTroData = valgtVilkarResultatType === VilkarResultat.GOD_TRO ? BelopetMottattIGodTroFormPanel.transformValues(info, vurderingBegrunnelse) : {};
  const annetData = valgtVilkarResultatType !== VilkarResultat.GOD_TRO ? AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse) : {};

  return {
    begrunnelse,
    fom: values.fom,
    tom: values.tom,
    vilkarResultat: valgtVilkarResultatType,
    vilkarResultatInfo: {
      ...godTroData,
      ...annetData,
    },
  };
};

export default TilbakekrevingPeriodeForm;
