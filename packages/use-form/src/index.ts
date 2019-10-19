import { useCallback } from 'react'

import { useValidation, Field, Validation } from 'use-validation'

type ValidationsMap = {
  [key: string]: Validation
}

type FieldsMap = {
  [key: string]: Field
}

const runAllValidations = (allFieldValidationsMap: ValidationsMap) =>
  Object.values(allFieldValidationsMap).forEach(({ validate }) => validate())

const checkIsEveryFieldValid = (allFieldValidationsMap: ValidationsMap) =>
  Object.values(allFieldValidationsMap).every(({ isValid }) => isValid)

type Props = {
  fields: FieldsMap
  runValidations?: (validationsMap: ValidationsMap) => void
  checkIsFormValid?: (validationsMap: ValidationsMap) => boolean
}

type FormValidations = {
  fields: ValidationsMap
  isFormValid: boolean
  runValidations: (allFieldValidationsMap: ValidationsMap) => void
}

export function useForm({
  fields,
  runValidations,
  // by default, a form is valid when every single field `isValid`
  checkIsFormValid = checkIsEveryFieldValid,
}: Props): FormValidations {
  const allFieldValidationsMap: ValidationsMap = Object.entries(fields).reduce(
    (acc, [key, { initialState, validations, validateOnSet }]) => {
      // the same amount of hooks is called in the same order
      // eslint-disable-next-line
      acc[key] = useValidation({
        initialState,
        validations,
        validateOnSet,
      })
      return acc
    },
    {}
  )

  // a form can be valid or not according to a custom method you pass in,
  // useful if some fields are not even visible according to the value of others.
  // Updates with the latest state on every render
  const isFormValid = checkIsFormValid(allFieldValidationsMap)

  return {
    fields: allFieldValidationsMap,
    isFormValid,
    runValidations: useCallback(() => {
      if (runValidations) {
        runValidations(allFieldValidationsMap)
      } else {
        runAllValidations(allFieldValidationsMap)
      }
    }, [allFieldValidationsMap, runValidations]),
  }
}
