import React from 'react'

import c from './ErrorReplacer.module.scss'

const ErrorReplacer: React.FC = function (props) {
  return (
    <div className={c['error-replacer']}>
      <h2>Простите! Произошла ошибка. Пожалуйста перезагрузите страницу.</h2>
      <a href="/book">Перезагрузка</a>
    </div>
  );
}

export default ErrorReplacer