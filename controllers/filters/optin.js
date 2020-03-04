module.exports = {
  /**
   * Check if user is optin
   *
   * @param {object} data - RowKey's device object.
   */
  isOptin: ({ data }) => {
    if (!data || !data.optin)
      return false;
    const optin = data.optin[0].value;
    // Optin value is inserted in an encoding I cannot find. (legacy code...)
    // Until all values are replaced by boolean with the new way to
    // insert (direct pull from pubsub and insert w/ appengine).
    // The 'old' way used dataflow.
    // -17 === true (old encoding) or true === true
    return optin === 'yes' || Buffer.from(optin).readInt8(0, true) === -17;
  },

  /**
   * Check if user is optout
   *
   * @param {object} data - RowKey's device object.
   */
  isOptout: ({ data }) => {
    if (!data || !data.optin)
      return true;
    const optin = data.optin[0].value;
    return optin === 'no' || Buffer.from(optin).readInt8(0, true) === 0;
  }
};
