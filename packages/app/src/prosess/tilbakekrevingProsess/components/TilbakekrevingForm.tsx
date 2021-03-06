import React, {
  FunctionComponent, useState, useCallback, useEffect,
} from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { FaktaGruppe, AksjonspunktHelpTextTemp, VerticalSpacer } from '@navikt/ft-ui-komponenter';
import { omitOne } from '@navikt/ft-utils';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { TilbakekrevingKodeverkType } from '@navikt/ft-kodeverk';
import {
  KodeverkMedNavn, AlleKodeverkTilbakekreving,
} from '@navikt/ft-types';
import {
  FeilutbetalingPerioderWrapper, VilkarsVurdertePerioderWrapper, VilkarsVurdertPeriode,
  DetaljerteFeilutbetalingsperioder, DetaljertFeilutbetalingPeriode,
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
import ProsessStegSubmitButton from '../../../felles/komponenter/ProsessStegSubmitButton';

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
      ? periode.foreldelseVurderingType === foreldelseVurderingType.FORELDET : periode.foreldet;
    return {
      redusertBeloper: periode.redusertBeloper,
      ytelser: periode.ytelser,
      feilutbetaling: periodeFormState.feilutbetaling ? periodeFormState.feilutbetaling : periode.feilutbetaling,
      erTotalBelopUnder4Rettsgebyr: periode.erTotalBelopUnder4Rettsgebyr,
      fom: periodeFormState.fom,
      tom: periodeFormState.tom,
      ??rsak: periode.??rsak,
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

const validerOm6LeddBrukesP??AllePerioder = (
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
  alleTilbakekrevingKodeverk: AlleKodeverkTilbakekreving;
  submitCallback: (aksjonspunktData: VilkarsVurderingAp) => Promise<void>;
  readOnly: boolean;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
  perioder: DetaljertFeilutbetalingPeriode[];
  vilkarvurdering: VilkarsVurdertePerioderWrapper;
  rettsgebyr: DetaljerteFeilutbetalingsperioder['rettsgebyr'];
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
  alleTilbakekrevingKodeverk,
  submitCallback,
  readOnly,
  alleMerknaderFraBeslutter,
  perioder,
  vilkarvurdering,
  rettsgebyr,
  navBrukerKjonn,
  beregnBelop,
  behandlingUuid,
  formData,
  setFormData,
}) => {
  const sammensl??ttePerioder = slaSammenOriginaleOgLagredePeriode(perioder, vilkarvurdering, rettsgebyr);
  const [vilk??rsvurdertePerioder, setVilk??rsvurdertePerioder] = useState<CustomVilkarsVurdertePeriode[]>(
    formData || buildInitialValues(sammensl??ttePerioder, perioderForeldelse),
  );

  const [isDirty, setDirty] = useState(!!formData);
  const [valgtPeriode, setValgtPeriode] = useState<CustomVilkarsVurdertePeriode | undefined>(vilk??rsvurdertePerioder?.find(harApentAksjonspunkt));
  const [isSubmitting, setSubmitting] = useState(false);
  const [valideringsmeldingId, setValideringsmeldingId] = useState<string | undefined>();

  useEffect(() => {
    setValideringsmeldingId(validerOm6LeddBrukesP??AllePerioder(vilk??rsvurdertePerioder));
  }, [vilk??rsvurdertePerioder]);

  const dataForDetailForm = settOppPeriodeDataForDetailForm(sammensl??ttePerioder, vilk??rsvurdertePerioder);
  const isReadOnly = readOnly || valgtPeriode?.erForeldet === true;
  const antallPerioderMedAksjonspunkt = vilk??rsvurdertePerioder.reduce((sum: number, periode) => (!periode.erForeldet ? sum + 1 : sum), 0);
  const merknaderFraBeslutter = alleMerknaderFraBeslutter[aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING];

  const lagrePerioder = useCallback(() => {
    setSubmitting(true);
    submitCallback(transformValues(vilk??rsvurdertePerioder, alleTilbakekrevingKodeverk[TilbakekrevingKodeverkType.SARLIG_GRUNN]));
  }, [vilk??rsvurdertePerioder]);

  const perioderFormatertForTidslinje = formaterPerioderForTidslinje(vilk??rsvurdertePerioder, dataForDetailForm);
  const isApOpen = perioderFormatertForTidslinje.some((p) => p.isAksjonspunktOpen);
  const valgtPeriodeFormatertForTidslinje = valgtPeriode
    ? perioderFormatertForTidslinje.find((p: TidslinjePeriode) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)
    : undefined;

  const setPeriode = (periode: CustomVilkarsVurdertePeriode | TidslinjePeriode) => {
    const valgt = periode ? vilk??rsvurdertePerioder.find((p) => p.fom === periode.fom && p.tom === periode.tom) : undefined;
    setValgtPeriode(valgt);
  };

  const setNestePeriode = () => {
    const index = vilk??rsvurdertePerioder.findIndex((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    setPeriode(vilk??rsvurdertePerioder[index + 1]);
  };

  const setForrigePeriode = () => {
    const index = vilk??rsvurdertePerioder.findIndex((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    setPeriode(vilk??rsvurdertePerioder[index - 1]);
  };

  const togglePeriode = () => {
    const periode = valgtPeriode ? undefined : vilk??rsvurdertePerioder[0];
    setPeriode(periode);
  };

  const oppdaterPeriode = (values: CustomVilkarsVurdertePeriode) => {
    const verdier = omitOne(values, 'erSplittet');

    const otherThanUpdated = vilk??rsvurdertePerioder.filter((o) => o.fom !== verdier.fom && o.tom !== verdier.tom);
    const sortedActivities = otherThanUpdated.concat(verdier).sort(sortPeriods);
    setVilk??rsvurdertePerioder(sortedActivities);
    setFormData(sortedActivities);
    setDirty(true);
    togglePeriode();

    const periodeMedApenAksjonspunkt = sortedActivities.find(harApentAksjonspunkt);
    if (periodeMedApenAksjonspunkt) {
      setPeriode(periodeMedApenAksjonspunkt);
    }
  };

  const oppdaterSplittedePerioder = (oppdatertePerioder: CustomVilkarsVurdertePeriode[]) => {
    const periode = vilk??rsvurdertePerioder.find((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    const nyePerioder = oppdatertePerioder.map((p) => ({
      ...emptyFeltverdiOmFinnes(periode),
      ...p,
      erSplittet: true,
    }));

    const otherThanUpdated = vilk??rsvurdertePerioder.filter((o) => o.fom !== valgtPeriode.fom && o.tom !== valgtPeriode.tom);
    const sortedActivities = otherThanUpdated.concat(nyePerioder).sort(sortPeriods);

    togglePeriode();
    setDirty(true);
    setVilk??rsvurdertePerioder(sortedActivities);
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
      {vilk??rsvurdertePerioder && (
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
                alleTilbakekrevingKodeverk={alleTilbakekrevingKodeverk}
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
                alleKodeverk={alleTilbakekrevingKodeverk}
                vilkarsVurdertePerioder={vilk??rsvurdertePerioder}
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
        isSubmittable={!isApOpen && !valgtPeriode && !valideringsmeldingId}
        onClick={lagrePerioder}
        isSubmitting={isSubmitting}
      />
    </FaktaGruppe>
  );
};

export default TilbakekrevingForm;
