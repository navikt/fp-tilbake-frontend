import React, { FunctionComponent } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import moment from 'moment';
import { Select } from '@navikt/fp-form';

import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import { FeilutbetalingAarsak, FeilutbetalingFakta } from '@fpsak-frontend/types';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import styles from './feilutbetalingPerioderFieldArray.less';

const FIELD_ARRAY_NAME = 'perioder';

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const getHendelseUndertyper = (årsakNavn: string, årsaker: FeilutbetalingAarsak['hendelseTyper']): string[] | null => {
  const årsak = årsaker.find((a) => a.hendelseType === årsakNavn);
  return årsak && årsak.hendelseUndertyper.length > 0 ? årsak.hendelseUndertyper : null;
};

export type FormValues = {
  perioder?: {
    fom: string;
    tom: string;
    årsak?: string;
  }[];
}

type OwnProps = {
  perioder: FeilutbetalingFakta['behandlingFakta']['perioder'];
  årsaker: FeilutbetalingAarsak['hendelseTyper'];
  readOnly: boolean;
  behandlePerioderSamlet: boolean;
  getKodeverknavn: (kode: string, kodeverk: KodeverkType) => string;
};

const FeilutbetalingPerioderFieldArray: FunctionComponent<OwnProps> = ({
  perioder,
  årsaker,
  readOnly,
  behandlePerioderSamlet,
  getKodeverknavn,
}) => {
  const {
    control, watch, setValue, getValues,
  } = useFormContext<FormValues>();
  const { fields } = useFieldArray({
    control,
    name: FIELD_ARRAY_NAME,
  });

  const settAndreFelter = (verdi: string, index: number, årsak?: string) => {
    if (behandlePerioderSamlet) {
      fields.forEach((_f, fieldIndex) => {
        if (index !== fieldIndex) {
          if (årsak) {
            const feltÅrsak = getValues(`${FIELD_ARRAY_NAME}.${fieldIndex}.årsak`);
            if (feltÅrsak === årsak) {
              // @ts-ignore Fiks. Må legge til årsak.underÅrsak i FormValues
              setValue(`${FIELD_ARRAY_NAME}.${fieldIndex}.${årsak}.underÅrsak`, verdi);
            }
          } else {
            setValue(`${FIELD_ARRAY_NAME}.${fieldIndex}.årsak`, verdi);
          }
        }
      });
    }
  };

  return (
    <div className={styles.feilutbetalingTable}>
      <Table
        headerTextCodes={headerTextCodes}
        noHover
      >
        {fields.map((periode, index) => {
          const årsak = watch(`${FIELD_ARRAY_NAME}.${index}.årsak`);
          const hendelseUndertyper = getHendelseUndertyper(årsak, årsaker);
          return (
            <TableRow key={periode.id}>
              <TableColumn>
                {`${moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}`}
              </TableColumn>
              <TableColumn>
                <Select
                  name={`${FIELD_ARRAY_NAME}.${index}.årsak`}
                  selectValues={årsaker.map((a) => (
                    <option key={a.hendelseType} value={a.hendelseType}>{getKodeverknavn(a.hendelseType, KodeverkType.HENDELSE_TYPE)}</option>
                  ))}
                  validate={[required]}
                  disabled={readOnly}
                  onChange={(event) => settAndreFelter(event.target.value, index)}
                  bredde="m"
                  label=""
                />
                {hendelseUndertyper && (
                  <Select
                    name={`${FIELD_ARRAY_NAME}.${index}.${årsak}.underÅrsak`}
                    selectValues={hendelseUndertyper.map((a) => <option key={a} value={a}>{getKodeverknavn(a, KodeverkType.HENDELSE_UNDERTYPE)}</option>)}
                    validate={[required]}
                    disabled={readOnly}
                    onChange={(event) => settAndreFelter(event.target.value, index, årsak)}
                    bredde="m"
                    label=""
                  />
                )}
              </TableColumn>
              <TableColumn className={styles.redText}>
                {perioder[index].belop}
              </TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

export default FeilutbetalingPerioderFieldArray;
