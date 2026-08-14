const HAS_LETTER_REGEX = /\p{L}/u

export function validateFlightIdFormat(id) {
  return /^\d{1,5}$/.test(String(id).trim())
}

export function validateAirlineName(airline) {
  return HAS_LETTER_REGEX.test(String(airline).trim())
}

export function validatePassengerCount(passengers) {
  const n = Number(passengers)
  return Number.isInteger(n) && n >= 1 && n <= 450
}

export function validateNewFlight({ id, airline, passengers }, flightExists) {
  if (!validateFlightIdFormat(id)) {
    return 'מספר טיסה חייב להיות ערך מספרי עד 5 ספרות.'
  }
  if (flightExists(String(id).trim())) {
    return 'כבר קיימת טיסה עם מספר זהה.'
  }
  if (!validateAirlineName(airline)) {
    return 'שם חברת התעופה חייב להכיל לפחות אות אחת.'
  }
  if (!validatePassengerCount(passengers)) {
    return 'מספר הנוסעים חייב להיות בין 1 ל-450.'
  }
  return null
}
