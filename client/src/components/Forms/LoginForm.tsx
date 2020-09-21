import React from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import * as yup from 'yup'
import FormikInput from '../UI/FormikInput/FormikInput'

// import c from './LoginForm.module.scss'

type LoginFormPorps = {
  onSubmit: (values: any, helpers?: any) => void
  isLoading: boolean
}

const LoginForm: React.FC<LoginFormPorps> = (props) => {
  return (
    <div>
      <Formik validationSchema={yup.object().shape({
        email: yup.string().required('Поле обязательно')
          .email('email адресс не по формату'),

        password: yup.string().required('Поле обязательно')
          .max(48, 'пароль не длиннее 48')
          .min(6, 'пароль не короче 6 символов')
          .matches(/^[a-z0-9]+$/ig, 'в пароле только цифры и латинские буквы')
      })}
        initialValues={
          { email: '', password: '' }
        }
        onSubmit={(values, hepls) => {
          if (!props.isLoading) props.onSubmit(values, hepls)
          hepls.setSubmitting(false)
        }}>

        {formik => (
          <Form>
            <div className="input-group">
              <ErrorMessage name="email">
                {msg => (<p className="input-group__error">{msg}</p>)}
              </ErrorMessage>
              <FormikInput
                name="email"
                placeholder="email"
                formik={formik} />
            </div>
            <div className="input-group">
              <ErrorMessage name="password">
                {msg => (<p className="input-group__error">{msg}</p>)}
              </ErrorMessage>
              <FormikInput
                name="password"
                type="password"
                placeholder="пароль"
                formik={formik} />
            </div>
            <button className="btn" type="submit" disabled={!formik.isValid || props.isLoading}>
              Войти
            </button>  
            <button type="reset" className="btn green fright">
              <Fa icon={faRedo} />
            </button>
          </Form>
        )}

      </Formik>
    </div>
  );
}

export default LoginForm