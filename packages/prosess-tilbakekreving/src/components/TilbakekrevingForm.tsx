import React, {
  FunctionComponent, useState, useCallback, useEffect,
} from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { FaktaGruppe, AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ProsessStegSubmitButton } from '@fpsak-frontend/prosess-felles';
import { omitOne } from '@fpsak-frontend/utils';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import tilbakekrevingKodeverkTyper from '@fpsak-frontend/kodeverk/src/tilbakekrevingKodeverkTyper';
import {
  FeilutbetalingPerioderWrapper, KodeverkMedNavn, VilkarsVurdertePerioderWrapper, VilkarsVurdertPeriode,
  DetaljerteFeilutbetalingsperioder, DetaljertFeilutbetalingPeriode, AlleKodeverkTilbakekreving,
} from '@fpsak-frontend/types';
import { VilkarsVurderingAp } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import TilbakekrevingTimelineData from './splittePerioder/TilbakekrevingTimelineData';
import TilbakekrevingTimelinePanel from './timeline/TilbakekrevingTimelinePanel';
import TilbakekrevingPeriodeForm, {
  CustomPeriode, CustomPerioder, periodeFormTransformValues, periodeFormBuildInitialValues, CustomVilkarsVurdertePeriode,
} from './TilbakekrevingPeriodeForm';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';
import TidslinjePeriode from '../types/tidslinjePeriodeTsType';
import DataForPeriode from '../types/dataForPeriodeTsType';

import styles from './tilbakekrevingForm.less';

const sortPeriods = (periode1: CustomVilkarsVurdertePeriode, periode2: CustomVilkarsVurdertePeriode) => moment(periode1.fom).diff(moment(periode2.fom));

const harApentAksjonspunkt = (periode: CustomVilkarsVurdertePeriode) => !periode.erForeldet && (periode.begrunnelse === undefined || periode.erSplittet);

const emptyFeltverdiOmFinnes = (periode: CustomVilkarsVurdertePeriode) => {
  const valgtVilkarResultatType = periode[periode.valgtVilkarResultatType];
  const handletUaktsomhetGrad = valgtVilkarResultatType[valgtVilkarResultatType.handletUaktsomhetGrad];

  if (valgtVilkarResultatType.tilbakekrevdBelop) {
    return {
      ...periode,
      [periode.valgtVilkarResultatType]: {
        ...omitOne(valgtVilkarResultatType, 'tilbakekrevdBelop'),
      },
    };
  }
  if (handletUaktsomhetGrad && handletUaktsomhetGrad.belopSomSkalTilbakekreves) {
    return {
      ...periode,
      [periode.valgtVilkarResultatType]: {
        ...valgtVilkarResultatType,
        [valgtVilkarResultatType.handletUaktsomhetGrad]: {
          ...omitOne(handletUaktsomhetGrad, 'belopSomSkalTilbakekreves'),
        },
      },
    };
  }
  return periode;
};

const formaterPerioderForTidslinje = (vilkarsVurdertePerioder: CustomVilkarsVurdertePeriode[], perioder: DataForPeriode[] = []) => perioder
  .map((periode: DataForPeriode, index: number): TidslinjePeriode => {
    const per = vilkarsVurdertePerioder.find((p: CustomVilkarsVurdertePeriode) => p.fom === periode.fom && p.tom === periode.tom);
    const erBelopetIBehold = per && per[per.valgtVilkarResultatType] ? per[per.valgtVilkarResultatType].erBelopetIBehold : undefined;
    const erSplittet = per ? !!per.erSplittet : false;
    return {
      fom: periode.fom,
      tom: periode.tom,
      isAksjonspunktOpen: !periode.erForeldet && (per.begrunnelse === undefined || erSplittet),
      isGodkjent: !(periode.erForeldet || erBelopetIBehold === false),
      id: index,
    };
  });

const finnOriginalPeriode = (lagretPeriode: CustomVilkarsVurdertePeriode | VilkarsVurdertPeriode,
  perioder: DetaljertFeilutbetalingPeriode[] | CustomPeriode[]) => perioder
  .find((periode: CustomPeriode) => !moment(lagretPeriode.fom).isBefore(moment(periode.fom))
  && !moment(lagretPeriode.tom).isAfter(moment(periode.tom)));

const erIkkeLagret = (periode: DetaljertFeilutbetalingPeriode, lagredePerioder: { tom: string; fom: string }[]) => lagredePerioder
  .every((lagretPeriode) => {
    const isOverlapping = moment(periode.fom).isSameOrBefore(moment(lagretPeriode.tom)) && moment(lagretPeriode.fom).isSameOrBefore(moment(periode.tom));
    return !isOverlapping;
  });

export const slaSammenOriginaleOgLagredePeriode = (
  perioder: DetaljertFeilutbetalingPeriode[],
  vilkarsvurdering: VilkarsVurdertePerioderWrapper,
  rettsgebyr: DetaljerteFeilutbetalingsperioder['rettsgebyr'],
): CustomPerioder => {
  const totalbelop = perioder.reduce((acc: number, periode: DetaljertFeilutbetalingPeriode) => acc + periode.feilutbetaling, 0);
  const erTotalBelopUnder4Rettsgebyr = totalbelop < (rettsgebyr * 4);
  const lagredeVilkarsvurdertePerioder = vilkarsvurdering.vilkarsVurdertePerioder;

  const lagredePerioder = lagredeVilkarsvurdertePerioder
    .map((lagretPeriode: VilkarsVurdertPeriode) => {
      const originalPeriode = finnOriginalPeriode(lagretPeriode, perioder);
      return ({
        ...originalPeriode,
        harMerEnnEnYtelse: originalPeriode.ytelser.length > 1,
        ...omitOne(lagretPeriode, 'feilutbetalingBelop'),
        feilutbetaling: lagretPeriode.feilutbetalingBelop,
        erTotalBelopUnder4Rettsgebyr,
      });
    });

  const originaleUrortePerioder = perioder
    .filter((periode: DetaljertFeilutbetalingPeriode) => erIkkeLagret(periode, lagredePerioder))
    .map((periode: DetaljertFeilutbetalingPeriode): CustomPeriode => ({
      ...periode,
      harMerEnnEnYtelse: periode.ytelser.length > 1,
      erTotalBelopUnder4Rettsgebyr,
    }));

  return {
    perioder: originaleUrortePerioder.concat(lagredePerioder),
  };
};

const settOppPeriodeDataForDetailForm = (
  perioder: CustomPerioder,
  perioderFormState: CustomVilkarsVurdertePeriode[],
): DataForPeriode[] => {
  if (!perioder || !perioderFormState) {
    return undefined;
  }

  return perioderFormState.map((periodeFormState: CustomVilkarsVurdertePeriode) => {
    const periode = finnOriginalPeriode(periodeFormState, perioder.perioder) as CustomPeriode; // NOSONAR
    const erForeldet = periode.foreldelseVurderingType
      ? periode.foreldelseVurderingType.kode === foreldelseVurderingType.FORELDET : periode.foreldet;
    return {
      redusertBeloper: periode.redusertBeloper,
      ytelser: periode.ytelser,
      feilutbetaling: periodeFormState.feilutbetaling ? periodeFormState.feilutbetaling : periode.feilutbetaling,
      erTotalBelopUnder4Rettsgebyr: periode.erTotalBelopUnder4Rettsgebyr,
      fom: periodeFormState.fom,
      tom: periodeFormState.tom,
      årsak: periode.årsak,
      begrunnelse: periode.begrunnelse,
      erForeldet,
    };
  });
};

export const buildInitialValues = (
  perioder: CustomPerioder,
  foreldelsePerioder: FeilutbetalingPerioderWrapper,
): CustomVilkarsVurdertePeriode[] => perioder.perioder.map((p: CustomPeriode) => ({
  ...periodeFormBuildInitialValues(p, foreldelsePerioder),
  fom: p.fom,
  tom: p.tom,
})).sort(sortPeriods);

export const transformValues = (
  vilkarsVurdertePerioder: CustomVilkarsVurdertePeriode[],
  sarligGrunnTyper: KodeverkMedNavn[],
): VilkarsVurderingAp => ({
  kode: aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING,
  vilkarsVurdertePerioder: vilkarsVurdertePerioder
    .filter((p: CustomVilkarsVurdertePeriode) => !p.erForeldet)
    .map((p: CustomVilkarsVurdertePeriode) => periodeFormTransformValues(p, sarligGrunnTyper)),
});

const validerOm6LeddBrukesPåAllePerioder = (
  vilkarsVurdertePerioder: CustomVilkarsVurdertePeriode[],
) => {
  if (!vilkarsVurdertePerioder) {
    return undefined;
  }
  const antallPerioderMedAksjonspunkt = vilkarsVurdertePerioder.reduce((sum: number, periode) => (!periode.erForeldet ? sum + 1 : sum), 0);
  if (antallPerioderMedAksjonspunkt < 2) {
    return undefined;
  }

  const antallValgt = vilkarsVurdertePerioder.reduce((sum: number, periode: CustomVilkarsVurdertePeriode) => {
    const { valgtVilkarResultatType } = periode;
    const vilkarResultatInfo = periode[valgtVilkarResultatType];
    const { handletUaktsomhetGrad } = vilkarResultatInfo;
    const info = vilkarResultatInfo[handletUaktsomhetGrad];
    if (info) {
      return info.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false ? sum + 1 : sum;
    }
    return sum;
  }, 0);
  if (antallValgt > 0 && antallValgt !== vilkarsVurdertePerioder.length) {
    return 'TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr';
  }
  return undefined;
};

interface OwnProps {
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  alleKodeverk: AlleKodeverkTilbakekreving;
  submitCallback: (aksjonspunktData: VilkarsVurderingAp) => Promise<void>;
  readOnly: boolean;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
  perioder: DetaljertFeilutbetalingPeriode[];
  vilkarvurdering: VilkarsVurdertePerioderWrapper;
  rettsgebyr: DetaljerteFeilutbetalingsperioder['rettsgebyr'];
  readOnlySubmitButton: boolean;
  navBrukerKjonn: string;
  beregnBelop: (data: any) => Promise<any>;
  behandlingUuid: string;
  formData?: any;
  setFormData: (data: any) => void;
}

/**
 * TilbakekrevingForm
 *
 * Behandlingspunkt Tilbakekreving. Setter opp en tidslinje som lar en velge periode. Ved valg blir et detaljevindu vist.
 */
const TilbakekrevingForm: FunctionComponent<OwnProps> = ({
  perioderForeldelse,
  alleKodeverk,
  submitCallback,
  readOnly,
  alleMerknaderFraBeslutter,
  perioder,
  vilkarvurdering,
  rettsgebyr,
  readOnlySubmitButton,
  navBrukerKjonn,
  beregnBelop,
  behandlingUuid,
  formData,
  setFormData,
}) => {
  const sammenslåttePerioder = slaSammenOriginaleOgLagredePeriode(perioder, vilkarvurdering, rettsgebyr);
  const [vilkårsvurdertePerioder, setVilkårsvurdertePerioder] = useState<CustomVilkarsVurdertePeriode[]>(
    formData || buildInitialValues(sammenslåttePerioder, perioderForeldelse),
  );

  const [isDirty, setDirty] = useState(!!formData);
  const [valgtPeriode, setValgtPeriode] = useState<CustomVilkarsVurdertePeriode | undefined>(vilkårsvurdertePerioder?.find(harApentAksjonspunkt));
  const [isSubmitting, setSubmitting] = useState(false);
  const [valideringsmeldingId, setValideringsmeldingId] = useState<string | undefined>();

  useEffect(() => {
    setValideringsmeldingId(validerOm6LeddBrukesPåAllePerioder(vilkårsvurdertePerioder));
  }, [vilkårsvurdertePerioder]);

  const dataForDetailForm = settOppPeriodeDataForDetailForm(sammenslåttePerioder, vilkårsvurdertePerioder);
  const isReadOnly = readOnly || valgtPeriode?.erForeldet === true;
  const antallPerioderMedAksjonspunkt = vilkårsvurdertePerioder.reduce((sum: number, periode) => (!periode.erForeldet ? sum + 1 : sum), 0);
  const merknaderFraBeslutter = alleMerknaderFraBeslutter[aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING];

  const lagrePerioder = useCallback(() => {
    setSubmitting(true);
    submitCallback(transformValues(vilkårsvurdertePerioder, alleKodeverk[tilbakekrevingKodeverkTyper.SARLIG_GRUNN]))
      .then(() => setSubmitting(false));
  }, [vilkårsvurdertePerioder]);

  const perioderFormatertForTidslinje = formaterPerioderForTidslinje(vilkårsvurdertePerioder, dataForDetailForm);
  const isApOpen = perioderFormatertForTidslinje.some((p) => p.isAksjonspunktOpen);
  const valgtPeriodeFormatertForTidslinje = valgtPeriode
    ? perioderFormatertForTidslinje.find((p: TidslinjePeriode) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)
    : undefined;

  const setPeriode = (periode: CustomVilkarsVurdertePeriode | TidslinjePeriode) => {
    const valgt = periode ? vilkårsvurdertePerioder.find((p) => p.fom === periode.fom && p.tom === periode.tom) : undefined;
    setValgtPeriode(valgt);
  };

  const setNestePeriode = () => {
    const index = vilkårsvurdertePerioder.findIndex((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    setPeriode(vilkårsvurdertePerioder[index + 1]);
  };

  const setForrigePeriode = () => {
    const index = vilkårsvurdertePerioder.findIndex((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    setPeriode(vilkårsvurdertePerioder[index - 1]);
  };

  const togglePeriode = () => {
    const periode = valgtPeriode ? undefined : vilkårsvurdertePerioder[0];
    setPeriode(periode);
  };

  const oppdaterPeriode = (values: CustomVilkarsVurdertePeriode) => {
    const verdier = omitOne(values, 'erSplittet');

    const otherThanUpdated = vilkårsvurdertePerioder.filter((o) => o.fom !== verdier.fom && o.tom !== verdier.tom);
    const sortedActivities = otherThanUpdated.concat(verdier).sort(sortPeriods);
    setVilkårsvurdertePerioder(sortedActivities);
    setFormData(sortedActivities);
    setDirty(true);
    togglePeriode();

    const periodeMedApenAksjonspunkt = sortedActivities.find(harApentAksjonspunkt);
    if (periodeMedApenAksjonspunkt) {
      setPeriode(periodeMedApenAksjonspunkt);
    }
  };

  const oppdaterSplittedePerioder = (oppdatertePerioder: CustomVilkarsVurdertePeriode[]) => {
    const periode = vilkårsvurdertePerioder.find((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    const nyePerioder = oppdatertePerioder.map((p) => ({
      ...emptyFeltverdiOmFinnes(periode),
      ...p,
      erSplittet: true,
    }));

    const otherThanUpdated = vilkårsvurdertePerioder.filter((o) => o.fom !== valgtPeriode.fom && o.tom !== valgtPeriode.tom);
    const sortedActivities = otherThanUpdated.concat(nyePerioder).sort(sortPeriods);

    togglePeriode();
    setDirty(true);
    setVilkårsvurdertePerioder(sortedActivities);
    setFormData(sortedActivities);
    setPeriode(nyePerioder[0]);
  };

  return (
    <FaktaGruppe
      merknaderFraBeslutter={merknaderFraBeslutter}
      withoutBorder
    >
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Tilbakekreving" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
        {[<FormattedMessage key="AksjonspunktHjelpetekst" id="TilbakekrevingForm.AksjonspunktHjelpetekst" />] }
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer twentyPx />
      {vilkårsvurdertePerioder && (
        <>
          <TilbakekrevingTimelinePanel
            perioder={perioderFormatertForTidslinje}
            valgtPeriode={valgtPeriodeFormatertForTidslinje}
            setPeriode={setPeriode}
            toggleDetaljevindu={togglePeriode}
            hjelpetekstKomponent={<TilbakekrevingTidslinjeHjelpetekster />}
            kjonn={navBrukerKjonn}
          />
          {valgtPeriode && (
            <div className={styles.container}>
              <TilbakekrevingTimelineData
                periode={dataForDetailForm.find((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)}
                callbackForward={setNestePeriode}
                callbackBackward={setForrigePeriode}
                oppdaterSplittedePerioder={oppdaterSplittedePerioder}
                readOnly={isReadOnly}
                behandlingUuid={behandlingUuid}
                beregnBelop={beregnBelop}
              />
              <VerticalSpacer twentyPx />
              <TilbakekrevingPeriodeForm
                key={valgtPeriodeFormatertForTidslinje.id}
                periode={valgtPeriode}
                data={dataForDetailForm.find((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)}
                antallPerioderMedAksjonspunkt={antallPerioderMedAksjonspunkt}
                readOnly={isReadOnly}
                skjulPeriode={togglePeriode}
                oppdaterPeriode={oppdaterPeriode}
                alleKodeverk={alleKodeverk}
                vilkarsVurdertePerioder={vilkårsvurdertePerioder}
              />
            </div>
          )}
        </>
      )}
      <VerticalSpacer twentyPx />
      {valideringsmeldingId && (
        <>
          <AlertStripe type="feil">
            <FormattedMessage id={valideringsmeldingId} />
          </AlertStripe>
          <VerticalSpacer twentyPx />
        </>
      )}
      <ProsessStegSubmitButton
        isReadOnly={isReadOnly}
        isDirty={isDirty}
        isSubmittable={!isApOpen && !valgtPeriode && !readOnlySubmitButton && !valideringsmeldingId}
        onClick={lagrePerioder}
        isSubmitting={isSubmitting}
      />
    </FaktaGruppe>
  );
};

export default TilbakekrevingForm;