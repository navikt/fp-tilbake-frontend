# fp-tilbake-frontend
Monorepo for Frontend kode for fp-tilbake (Tilbakekrevingmodul bruka av foreldrepenger-løsningen).

[![Build](https://github.com/navikt/fp-tilbake-frontend/workflows/Build,%20push%20and%20deploy%20Fpsak-frontend/badge.svg)](https://github.com/navikt/fp-tilbake-frontend/workflows/Build,%20push%20and%20deploy%20Fpsak-tilbake-frontend/badge.svg)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=navikt_fp-tilbake-frontend&metric=alert_status)](https://sonarcloud.io/dashboard?id=navikt_fp-tilbake-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=navikt_fp-tilbake-frontend&metric=coverage)](https://sonarcloud.io/dashboard?id=navikt_fp-tilbake-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/navikt/fp-tilbake-frontend/badge.svg)](https://snyk.io/test/github/navikt/fp-tilbake-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Storybook
https://navikt.github.io/fp-tilbake-frontend

## For å komme i gang
````
yarn install
yarn dev
````

## Intellj og stubs
Disse må installeres manuelt, følg denne tråde. n:

https://intellij-support.jetbrains.com/hc/en-us/community/posts/207725245-React-import-are-not-resolved-in-WebStrom-and-Intellij-2016-2

### Feature toggles (webpack/mocks/feature-toggles.js)
Tar en kommaseparert liste med featuretoggles og skrur disse på
```
FEATURE_TOGGLES=my.toggle,my.second.toggle
```

### Overstyr enkeltrute (webpack/mocks/fake-error.js)
Nyttig for å teste feilsituasjoner. Overstyres som følger:
```
FAKE_ERROR_PATH=/fpsak/api/behandling/person/personopplysninger
FAKE_ERROR_CODE=401
FAKE_ERROR_BODY={"error":"dette fikk galt"}
```

### Licenses and attribution
*For updated information, always see LICENSE first!*

### For NAV-ansatte
Interne henvendelser kan sendes via Slack i kanalen **#teamforeldrepenger**.


