import React from 'react'
import { Field, FormikProps } from 'formik';

type FormikInputPorps = {
  [p: string]: any,
  formik: FormikProps<any>,
  name: string
}

const FormikInput: React.FC<FormikInputPorps> = (props) => {
  const fieldMeta = props.formik.getFieldMeta(props.name)

  let statusClassName = ''
  if (fieldMeta.touched) {
    if (fieldMeta.error) statusClassName = ' invalid'
    else statusClassName = ' valid'
  }

  return (
    <Field {...props}
      className={"input-group__input" + statusClassName}
      name={props.name} />
  );
}

export default FormikInput