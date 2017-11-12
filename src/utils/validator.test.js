import Joi from 'joi-browser'
import {validate, createSchema} from './validator'

describe('validator', () => {

  describe('validate', () => {
    let isValid

    beforeAll(() => {
      isValid = validate(
        Joi.object().keys({
          username: Joi.string().alphanum().min(3).max(30).required(),
          password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
        })
      )
    })

    it('should return an empty object upon success', () => {
      expect(isValid({
        username: 'test',
        password: '1234A'
      })).toEqual({})
    })

    it('should generate validation props from a Joi schema', () => {
      expect(isValid({
        username: ''
      })).toEqual({
        username: 'username is not allowed to be empty'
      })

      expect(isValid({
        username: 'ab'
      })).toEqual({
        username: 'username length must be at least 3 characters long'
      })

      expect(isValid({
        username: 'abcd'
      })).toEqual({
        password: 'password is required'
      })
    })

  })

  describe('createSchema', () => {
    it('should create a Joi schema using fields definitions', () => {
      const fields = {
        code: 'Code',
        name: 'Name'
      }

      const schema = {
        name: Joi.string(),
        code: Joi.string()
      }

      expect(
        createSchema(fields, schema)
      ).toEqual(
        Joi.object().keys({
          code: Joi.string().label(fields.code),
          name: Joi.string().label(fields.name)
        })
      )

    })
  })

})
