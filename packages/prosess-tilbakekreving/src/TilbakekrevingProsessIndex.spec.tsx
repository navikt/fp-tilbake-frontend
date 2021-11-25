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

  it('skal vurdere perioden som Forsto eller burde forstått og så bekrefte', async () => {
    const lagre = jest.fn(() => Promise.resolve());

    const utils = render(<Default submitCallback={lagre} />);

    expect(await screen.findByText('Tilbakekreving')).toBeInTheDocument();
    expect(screen.getByText('Bekreft og fortsett')).toBeDisabled();

    userEvent.type(utils.getByLabelText('Vurder hvilken hjemmel i § 22-15 1. ledd som skal benyttes'), 'Dette er en vurdering');

    // Velg først 'Feil opplysninger' for å sjekke at denne informasjonen blir resatt når en bytter
    userEvent.click(screen.getByText('Feil opplysninger'));
    userEvent.click(screen.getByText('Forsett'));
    expect(await screen.findByText('Andel som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('100 %')).toBeInTheDocument();
    expect(screen.getByText('Det legges til 10 % renter')).toBeInTheDocument();

    // Velg så 'Forsto eller burde forstått'
    userEvent.click(screen.getByText('Forsto eller burde forstått'));

    // Velg først 'Forsto' får å sjekk at dette blir resatt korrekt ved bytte
    userEvent.click(screen.getByText('Forsto'));
    expect(await screen.findByText('Skal det tillegges renter?')).toBeInTheDocument();
    userEvent.click(screen.getByText('Ja'));

    userEvent.click(screen.getByText('Må ha forstått'));
    expect(await screen.findByText('Særlige grunner 4. ledd')).toBeInTheDocument();
    expect(screen.queryByText('Totalbeløpet er under 4 rettsgebyr (6. ledd). Skal det tilbakekreves?')).not.toBeInTheDocument();

    userEvent.type(utils.getByLabelText('Vurder i hvilken grad mottaker har handlet uaktsomt'), 'Dette er en vurdering a god tro');

    userEvent.click(screen.getByText('Burde ha forstått'));
    expect(await screen.findByText('Totalbeløpet er under 4 rettsgebyr (6. ledd). Skal det tilbakekreves?')).toBeInTheDocument();
    userEvent.click(screen.getByText('Ja'));

    userEvent.type(utils.getByLabelText('Vurder særlige grunner du har vektlagt for resultatet'), 'Begrunnelse for særlige grunner');

    userEvent.click(screen.getAllByText('Ja')[1]);
    userEvent.selectOptions(screen.getByRole('combobox', { hidden: true }), '30');

    userEvent.click(screen.getByText('Oppdater'));

    expect(await screen.findByText('Du må velge minst en Særlig grunn')).toBeInTheDocument();
    userEvent.click(screen.getByText('Grad av uaktsomhet'));

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
        vilkarResultat: 'FORSTO_BURDE_FORSTAATT',
        vilkarResultatInfo: {
          '@type': 'annet',
          aktsomhet: 'SIMPEL_UAKTSOM',
          aktsomhetInfo: {
            andelTilbakekreves: 30,
            annetBegrunnelse: undefined,
            harGrunnerTilReduksjon: true,
            ileggRenter: undefined,
            sarligGrunner: [
              'GRAD_AV_UAKTSOMHET',
            ],
            sarligGrunnerBegrunnelse: 'Begrunnelse for særlige grunner',
            tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
            tilbakekrevesBelop: undefined,
          },
          begrunnelse: 'Dette er en vurdering a god tro',
        },
      }],
    });
  });

  // test for 6ledd
  // test for deling av perioder
});
