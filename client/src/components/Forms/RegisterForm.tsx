import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import * as yup from 'yup'

// import c from './RegisterForm.module.scss'

type RegisterFormPorps = {
  onSubmit: (values: any, helpers?: any) => void
  isLoading: boolean
}

const RegisterForm: React.FC<RegisterFormPorps> = (props) => {
  return (
    <div>
      <Formik validationSchema={yup.object().shape({
        email: yup.string().required('Поле обязательно')
          .email('email адресс не по формату'),

        password: yup.string().required('Поле обязательно')
          .max(48, 'пароль не длиннее 48')
          .min(6, 'пароль не короче 6 символов')
          .matches(/^[a-z0-9]+$/i, { message: 'в пароле только цифры и латинские буквы' })
          .matches(/[0-9]/i, { message: 'в пароле должна быть хотябы одна цифра' })
          .matches(/[a-z]/i, { message: 'в пароле должна быть хотябы одна буква' }),

        passwordr: yup.string().required('Поле обязательно'),

        nickname: yup.string().required('Поле обязательно')
          .max(48, 'ник не длиннее 48 символов')
          .min(3, 'ник не короче 3 символов')
          .matches(/^[a-z0-9]+$/i, { message: 'в нике только цифры и латинские буквы' })
      })}
        initialValues={
          { email: '', password: '', passwordr: '', nickname: '' }
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
              <Field name="email" className="input-group__input" placeholder="email" />
            </div>
            <div className="input-group">
              <ErrorMessage name="password">
                {msg => (<p className="input-group__error">{msg}</p>)}
              </ErrorMessage>
              <Field name="password" type="password" className="input-group__input" placeholder="пароль" />
            </div>
            <div className="input-group">
              <ErrorMessage name="passwordr">
                {msg => (<p className="input-group__error">{msg}</p>)}
              </ErrorMessage>
              <Field name="passwordr" type="password" className="input-group__input" placeholder="повторите пароль"
                validate={() => {
                  let error = ''
                  if (formik.values.password !== formik.values.passwordr) {
                    error = 'пароли должны совпадать'
                  }
                  return error
                }} />
            </div>

            <div className="input-group">
              <ErrorMessage name="nickname">
                {msg => (<p className="input-group__error">{msg}</p>)}
              </ErrorMessage>
              <Field name="nickname" className="input-group__input" placeholder="ваш ник" />
            </div>

            <button className="btn" type="submit" disabled={!formik.isValid || props.isLoading}>
              Зарегистрироваться
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

export default RegisterForm