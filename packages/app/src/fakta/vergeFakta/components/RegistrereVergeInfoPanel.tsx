import React, { FunctionComponent, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { Form } from '@navikt/ft-form-hooks';
import {
  Verge,
} from '@fpsak-frontend/types';
import {
  Aksjonspunkt, AlleKodeverk, AlleKodeverkTilbakekreving,
} from '@navikt/ft-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { KodeverkType } from '@navikt/ft-kodeverk';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@navikt/ft-ui-komponenter';
import { AvklarVergeAp } from '@fpsak-frontend/types-avklar-aksjonspunkter';

import FaktaBegrunnelseTextField from './FaktaBegrunnelseTextField';
import FaktaSubmitButton from './FaktaSubmitButton';
import RegistrereVergeFaktaForm, { FormValues as RegistrereFormValues } from './RegistrereVergeFaktaForm';

type FormValues = RegistrereFormValues & {
  begrunnelse?: string,
}

const buildInitialValues = (verge: Verge, aksjonspunkter: Aksjonspunkt[]): FormValues => ({
  begrunnelse: FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter
    .filter((ap) => ap.definisjon === aksjonspunktCodes.AVKLAR_VERGE)[0]).begrunnelse,
  ...RegistrereVergeFaktaForm.buildInitialValues(verge || {}),
});

const transformValues = (values: FormValues): AvklarVergeAp => ({
  ...RegistrereVergeFaktaForm.transformValues(values),
  ...{ begrunnelse: values.begrunnelse },
});

interface PureOwnProps {
  submitCallback: (aksjonspunktData: AvklarVergeAp) => Promise<void>;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: AlleKodeverk | AlleKodeverkTilbakekreving;
  verge: Verge;
  hasOpenAksjonspunkter: boolean;
  submittable?: boolean;
  readOnly: boolean;
  alleMerknaderFraBeslutter: { [key: string] : { notAccepted?: boolean }};
  formData?: any,
  setFormData: (data: any) => void,
}

/**
 * RegistrereVergeInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp formen for att registrere verge.
 */
const RegistrereVergeInfoPanel: FunctionComponent<PureOwnProps> = ({
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  alleMerknaderFraBeslutter,
  aksjonspunkter,
  verge,
  alleKodeverk,
  submitCallback,
  formData,
  setFormData,
}) => {
  const intl = useIntl();

  const formMethods = useForm<FormValues>({
    defaultValues: formData || buildInitialValues(verge, aksjonspunkter),
    shouldUnregister: true,
  });

  if (aksjonspunkter.length === 0) {
    return null;
  }

  const valgtVergeType = formMethods.watch('vergeType');
  const begrunnelse = formMethods.watch('begrunnelse');
  const vergetyper = useMemo(() => alleKodeverk[KodeverkType.VERGE_TYPE].sort((k1, k2) => k1.navn.localeCompare(k2.navn)),
    [alleKodeverk[KodeverkType.VERGE_TYPE]]);

  return (
    <>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {[intl.formatMessage({ id: 'RegistrereVergeInfoPanel.CheckInformation' })]}
      </AksjonspunktHelpTextTemp>
      <Form formMethods={formMethods} onSubmit={(values: FormValues) => submitCallback(transformValues(values))} setDataOnUnmount={setFormData}>
        <RegistrereVergeFaktaForm
          readOnly={readOnly}
          intl={intl}
          vergetyper={vergetyper}
          valgtVergeType={valgtVergeType}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        />
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!begrunnelse} />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          isSubmittable={submittable && !!valgtVergeType}
          isReadOnly={readOnly}
          isSubmitting={formMethods.formState.isSubmitting}
          isDirty={formMethods.formState.isDirty}
        />
      </Form>
    </>
  );
};

export default RegistrereVergeInfoPanel;
