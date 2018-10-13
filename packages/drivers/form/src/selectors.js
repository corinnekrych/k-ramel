// FIXME: validator is a function that take (values) and (next)
// values can be a single value when the user get in single value
// it can be an object when user ask for all
// next is the driver validator, it can be not called

const get = key => state => name => type => (field) => {
  const values = state[type].get(name)

  if (!field && values) {
    // remove `key` from the result so as not to pollute
    const rest = { ...values }
    delete rest[key]
    return rest
  }

  return (values && values[field]) || ''
}

const validator = key => state => name => type => field => (values, next) => {
  let nextValidator = []

  if (next) nextValidator = next(values)

  console.log('inner validator')

  return nextValidator
}

const getAndValidate = key => state => name => type => (field, validator) => {
  const values = get(key)(state)(name)(type)(field)

  const userValidator = validator(values, validator(key)(state)(name)(type)(field))
}

export default key => state => name => ({
  exists: () => !!state.values.get(name),
  get: getAndValidate(key)(state)(name)('values'),
  getErrors: get(key)(state)(name)('errors'),
  getRules: get(key)(state)(name)('rules'),
})
