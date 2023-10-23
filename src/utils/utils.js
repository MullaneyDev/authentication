const isPopulated = (body, fieldName) => {
  if (body[fieldName] === "" || body[fieldName] === null) {
    return false;
  }
  return true;
};

const findMissingRequiredFields = (requiredFields, body) => {
  return requiredFields.filter((fieldName) => !isPopulated(body, fieldName));
};

module.exports = {
  isPopulated,
  findMissingRequiredFields,
};
