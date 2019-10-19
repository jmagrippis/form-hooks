import { useCallback, useState, useEffect } from 'react'

type ValidationFunction = (value: string) => boolean

export type Validator = ValidationFunction | RegExp

const _validate = (value: string, validations: Validator[]): boolean =>
  validations.every((validation) =>
    typeof validation === 'function'
      ? validation(value)
      : validation.test(value)
  )

export type Field = {
  validations: Validator[]
  initialState?: string
  validateOnSet?: boolean
}

export type Validation = {
  value: string
  set: (v: string) => void
  validate: () => void
  isValid: boolean
  hasBeenSet: boolean
  success: boolean
  error: boolean
}

export function useValidation({
  initialState,
  validations,
  validateOnSet = false,
}: Field): Validation {
  const hasInitialState = initialState !== undefined && initialState !== null
  const [value, setValue] = useState<string>(
    // default to empty string for a starting value,
    // so inputs will not switch from uncontrolled to controlled
    hasInitialState ? initialState : ''
  )
  const isValid = _validate(value, validations)
  const [hasValidationSucceeded, setValidationSucceeded] = useState(
    hasInitialState ? isValid : undefined
  )
  const [hasBeenSet, setHasBeenSet] = useState(false)

  // returns a method that also switches `hasBeenSet` to true on first run
  // but then only directly proxies to `setValue`
  const set = useCallback(
    (v: string) => {
      if (!hasBeenSet) {
        setHasBeenSet(true)
      }
      return setValue(v)
    },
    [hasBeenSet]
  )

  // we expose this method as we may want to programmatically change
  // success and error states, usually for styling
  const validate = useCallback(() => setValidationSucceeded(isValid), [isValid])

  // knowing if a value has been set and validating when it is,
  // is especially useful for checkboxes
  useEffect(() => {
    if (validateOnSet && hasBeenSet) {
      validate()
    }
  }, [value, validate, hasBeenSet, validateOnSet])

  return {
    value,
    set,
    isValid,
    validate,
    hasBeenSet,
    success: hasValidationSucceeded,
    error:
      hasValidationSucceeded === undefined
        ? hasValidationSucceeded
        : !hasValidationSucceeded,
  }
}
