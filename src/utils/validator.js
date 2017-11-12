import get from 'lodash/get'
import Joi from 'joi-browser'

const options = {
  language: {
    key: '{{key}} '
  }
}

const getError = detail => ({[detail.path]: detail.message})

export const validate = schema => values => {
  const result = Joi.validate(values, schema, options)
  const detail = get(result, 'error.details[0]')
  if (detail) return getError(detail)
  return {}
}

export const createSchema = (labels, schema) => Joi.object().keys(
  Object.keys(labels).reduce((result, key) => Object.assign(result, {
    [key]: schema[key].label(labels[key])
  }), {})
)
