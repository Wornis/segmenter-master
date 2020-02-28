const Joi = require('joi');

const schema = Joi.object().keys({
  extractType: Joi.string().required(),
  extractId: Joi.number().integer().required(),
  queueId: Joi.number().integer().required(),
  appId: Joi.number().integer().required(),
  bucketName: Joi.string().required(),
  getters: Joi.array().required(),
  filterVersion: Joi.alternatives().try([
    Joi.object().keys({
      type: Joi.string().required(),
      extractId: Joi.number().integer().required(),
      upliftWindow: Joi.number().required(),
      upliftRatio: Joi.number().required(),
    }),
    Joi.string()
  ]),
  filters: Joi.array().items(Joi.object().keys({
    type: Joi.string().required(),
    name: Joi.string(),
    opt: Joi.object().keys({
      columnFamily: Joi.string().required(),
      date: Joi.object().keys({
        number: Joi.number().integer(),
        from: Joi.number().integer(),
        to: Joi.number().integer(),
        ts: Joi.date().timestamp('unix'),
        tsFrom: Joi.date().timestamp('unix'),
        tsTo: Joi.date().timestamp('unix'),
        type: Joi.string().required().allow(['days'])
      }).and('tsFrom', 'tsTo')
        .xor('tsFrom', 'from', 'number', 'ts')
        .without('number', [
          'from',
          'to',
          'ts',
          'tsTo',
          'tsFrom'
        ]),
      value: Joi.object().keys({
        min: Joi.number().integer(),
        max: Joi.number().integer(),
        days: Joi.array(),
        country: Joi.string(),
        source: Joi.array(),
        event: Joi.string(),
        gender: Joi.object(),
        version: Joi.string(),
        appversion: Joi.string(),
        sum_min: Joi.number().integer(),
        sum_max: Joi.number().integer(),
        sum_currency: Joi.string(),
        avg_min: Joi.number().integer(),
        avg_max: Joi.number().integer(),
        avg_currency: Joi.string(),
        city: Joi.string()
      })
    }),

    // Used for "or" filter
    filtersToCompare: Joi.array().items(Joi.object().keys({
      type: Joi.string().required(),
      name: Joi.string(),
      opt: Joi.object().keys({
        columnFamily: Joi.string().required(),
        date: Joi.object().keys({
          number: Joi.number().integer(),
          from: Joi.number().integer(),
          to: Joi.number().integer(),
          ts: Joi.date().timestamp('unix'),
          tsFrom: Joi.date().timestamp('unix'),
          tsTo: Joi.date().timestamp('unix'),
          type: Joi.string().required().allow(['days'])
        }).and('tsFrom', 'tsTo')
          .xor('tsFrom', 'from', 'number', 'ts')
          .without('number', [
            'from',
            'to',
            'ts',
            'tsTo',
            'tsFrom'
          ]),
        value: Joi.object().keys({
          min: Joi.number().integer(),
          max: Joi.number().integer(),
          days: Joi.array(),
          country: Joi.string(),
          source: Joi.string(),
          event: Joi.string(),
          gender: Joi.object(),
          version: Joi.string(),
          appversion: Joi.string(),
          sum_min: Joi.number().integer(),
          sum_max: Joi.number().integer(),
          sum_currency: Joi.string(),
          avg_min: Joi.number().integer(),
          avg_max: Joi.number().integer(),
          avg_currency: Joi.string(),
          city: Joi.string(),
        }),
      }),
    })),
  })),
});

module.exports = (data) => {
  const { error, value } = Joi.validate(data, schema);
  if (error) return { error: error.details[0].message };
  return { value };
};
