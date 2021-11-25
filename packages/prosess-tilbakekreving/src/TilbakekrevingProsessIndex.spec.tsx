import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';
import * as stories from './TilbakekrevingProsessIndex.stories';

const { Default } = composeStories(stories);

describe('<TilbakekrevingProsessIndex>', () => {
  it('skal vurdere perioden som God Tro og så bekrefte', async () => {
    const lagre = jest.fn(() => Promise.resolve());

    const utils = render(<Default submitCallback={lagre} />);

    expect(await screen.findByText('Tilbakekreving')).toBeInTheDocument();
    expect(screen.getByText('Fastsett tilbakekreving etter §22-15. Del opp perioden ved behov for ulik vurdering')).toBeInTheDocument();
    expect(screen.getByText('Detaljer for valgt periode')).toBeInTheDocument();
    expect(screen.getByText('01.01.2019 - 01.04.2019')).toBeInTheDocument();
    expect(screen.getByText('13 uker')).toBeInTheDocument();
    expect(screen.getByText('Feilutbetaling:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('§22 Medlemskap')).toBeInTheDocument();

    expect(screen.getByText('Aktivitet')).toBeInTheDocument();
    expect(screen.getByText('Arbeidstaker')).toBeInTheDocument();
    expect(screen.getByText('Feilutbetalt beløp')).toBeInTheDocument();
    expect(screen.getByText('1 050')).toBeInTheDocument();

    userEvent.type(utils.getByLabelText('Vurder hvilken hjemmel i § 22-15 1. ledd som skal benyttes'), 'Dette er en vurdering');

    userEvent.click(screen.getByText('God tro'));

    userEvent.type(utils.getByLabelText('Begrunn hvorfor mottaker er i god tro'), 'Dette er en vurdering a god tro');

    userEvent.click(screen.getByText('Ja'));

    userEvent.type(utils.getByLabelText('Angi beløp som skal tilbakekreves'), '100');

    userEvent.click(screen.getByText('Oppdater'));

    expect(await screen.findByText('Beløp kan ikke være større enn feilutbetalingen')).toBeInTheDocument();

    userEvent.type(utils.getByLabelText('Angi beløp som skal tilbakekreves'), '{backspace}');

    userEvent.click(screen.getByText('Oppdater'));

    await waitFor(() => expect(screen.queryByText('Detaljer for valgt periode')).not.toBeInTheDocument());

    userEvent.click(screen.getByText('Bekreft og fortsett'));

    await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
    expect(lagre).toHaveBeenNthCalledWith(1, {
      kode: '5002',
      vilkarsVurdertePerioder: [{
        begrunnelse: 'Dette er en vurdering',
        fom: '2019-01-01',
        tom: '2019-04-01',
        vilkarResultat: 'GOD_TRO',
        vilkarResultatInfo: {
          '@type': 'godTro',
          begrunnelse: 'Dette er en vurdering a god tro',
          erBelopetIBehold: true,
          tilbakekrevesBelop: 10,
        },
      }],
    });
  });
});
