import React, { FunctionComponent, ReactElement, useMemo } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { RadioGruppe, Radio } from 'nav-frontend-skjema';
import { FlexContainer, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';
import { LabelType } from './Label';
import { getError, getValidationRules } from './formUtils';

interface RadioProps {
  value: string;
  label: LabelType;
  element?: ReactElement;
}

interface RadioGroupPanelProps {
  name: string;
  label?: LabelType;
  radios: RadioProps[];
  validate?: ((value: string | number) => any)[];
  onChange?: (value) => void;
  disabled?: boolean;
  isReadOnly?: boolean;
  isHorizontal?: boolean;
  parse?: (value: string) => any;
}

const RadioGroupPanel: FunctionComponent<RadioGroupPanelProps> = ({
  label,
  name,
  validate,
  radios,
  onChange,
  disabled = false,
  isReadOnly = false,
  isHorizontal = false,
  parse = (value) => value,
}) => {
  const { formState: { errors } } = useFormContext();
  const { field } = useController({
    name,
    rules: {
      validate: useMemo(() => getValidationRules(validate), [validate]),
    },
  });

  return (
    <RadioGruppe legend={label} feil={getError(errors, name)}>
      <>
        {!isHorizontal && radios.map((radio) => (
          <React.Fragment key={radio.value}>
            <Radio
              value={radio.value}
              label={radio.label}
              name={name}
              onChange={() => {
                if (onChange) {
                  onChange(radio.value);
                }
                field.onChange(parse(radio.value));
              }}
              checked={parse(radio.value) === field.value}
              disabled={disabled || isReadOnly}
            />
            {parse(radio.value) === field.value && radio.element}
          </React.Fragment>
        ))}
        {isHorizontal && (
          <FlexContainer>
            <FlexRow spaceBetween={false}>
              {radios.map((radio) => (
                <FlexColumn key={radio.value}>
                  <Radio
                    value={radio.value}
                    label={radio.label}
                    name={name}
                    onChange={() => {
                      if (onChange) {
                        onChange(radio.value);
                      }
                      field.onChange(parse(radio.value));
                    }}
                    checked={parse(radio.value) === field.value}
                    disabled={disabled || isReadOnly}
                  />
                  {parse(radio.value) === field.value && radio.element}
                </FlexColumn>
              ))}
            </FlexRow>
          </FlexContainer>
        )}
      </>
    </RadioGruppe>
  );
};

export default RadioGroupPanel;
