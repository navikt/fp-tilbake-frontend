import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

import { formatCurrencyNoKr } from '@navikt/ft-utils';
import { Table, TableColumn, TableRow } from '@navikt/ft-ui-komponenter';

import styles from './tilbakekrevingAktivitetTabell.less';

const headerTextCodes = [
  'TilbakekrevingAktivitetTabell.Aktivitet',
  'TilbakekrevingAktivitetTabell.FeilutbetaltBelop',
];

interface OwnProps {
  ytelser: {
    aktivitet: string;
    belop: number;
  }[];
}

const TilbakekrevingAktivitetTabell: FunctionComponent<OwnProps> = ({
  ytelser,
}) => {
  if (ytelser.length === 0) {
    return null;
  }
  let counter = 0;
  return (
    <Table headerTextCodes={headerTextCodes} noHover classNameTable={styles.feilutbetalingTable}>
      {ytelser.map((y) => {
        counter += 1;
        return (
          <TableRow key={y.aktivitet + y.belop + counter}>
            <TableColumn>
              <Normaltekst>{y.aktivitet}</Normaltekst>
            </TableColumn>
            <TableColumn>
              <Normaltekst>{formatCurrencyNoKr(y.belop)}</Normaltekst>
            </TableColumn>
          </TableRow>
        );
      })}
    </Table>
  );
};

export default TilbakekrevingAktivitetTabell;
