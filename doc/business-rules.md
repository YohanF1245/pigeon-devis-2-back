# Business rules
## Table of Contents

- [Account management](#account-management)
- [Dashboard management](#dashboard-management)
- [Profile management](#profile-management)
- [Role management](#role-management)
- [Postal address management](#postal-address-management)
- [Business management](#business-management)
- [Performance management](#performance-management)
- [Estimate management](#estimate-management)
- [Customer management](#customer-management)
- [Invoice management](#invoice-management)
- [Expense management](#expense-management)
## Account management
- B.R. 1: A user must be logged in to use the software
- B.R. 2: A user must input a valid email to create an account
- B.R. 3: User email must not be already used
- B.R. 4: A user must input a valid password to create an account
- B.R. 5: Account must be verified by mail confirmation
- B.R. 6: User can't request a password reset link

## Role management
- B.R. 7: A user must have exactly one role
- B.R. 8: A user is automatically assigned the USER role upon registration
- B.R. 9: Only administrators can change a user's role to ADMIN
- B.R. 10: A user cannot have multiple roles simultaneously
- B.R. 11: A user's role cannot be empty
- B.R. 12: Only administrators can modify user roles

## Dashboard management
- B.R. 13: The dashboard shows global statistics about the business activities
- B.R. 14: The dashboard has a graph showing income and outcome
- B.R. 15: Income is split between money from emitted invoice, emitted estimate, or paid invoice
- B.R. 16: The dashboard shows notification about the number of estimates not paid on time
- B.R. 17: The dashboard shows notification about the number of invoices not paid on time
- B.R. 18: The dashboard shows the five last invoices, estimates, and expenses in a table
- B.R. 19: The dashboard shows a balance with income and outcome

## Profile management
- B.R. 20: A user has a first name (required)
- B.R. 21: A user has a last name (required)
- B.R. 22: A user has an email address (required)
- B.R. 23: A user has a phone number (not required)
- B.R. 24: A user has a postal address (not required)
- B.R. 25: A user with an associated business is a business owner
- B.R. 26: A user can upload his signature

## Postal address management
- B.R. 27: Postal address has a street number
- B.R. 28: Postal address has a street name
- B.R. 29: Postal address has a ZIP code
- B.R. 30: Postal address has a city
- B.R. 31: Postal address may have an optional field

## Business management
- B.R. 32: A business is created by a user
- B.R. 33: A business is owned by a user
- B.R. 34: A business has a SIRET
- B.R. 35: A business has an APE code
- B.R. 36: A business has a tax code
- B.R. 37: A business can have a logo
- B.R. 38: Businesses are only visible by their owner

## Performance management
- B.R. 39: A performance can be a service provided or a good sold
- B.R. 40: A performance is related to a company
- B.R. 41: A performance has a price
- B.R. 42: A performance can be created, edited, or deleted by a business owner
- B.R. 43: A performance is associated with a tax

## Estimate management
- B.R. 44: An estimate can be created, edited, or deleted by a business owner
- B.R. 45: An estimate has at least one performance associated
- B.R. 46: An estimate can have the same performance associated multiple times
- B.R. 47: An estimate has a customer
- B.R. 48: An estimate has a creation date
- B.R. 49: An estimate may have a discount
- B.R. 50: An estimate has a state (emitted or accepted)
- B.R. 51: An estimate has an expiration date
- B.R. 52: An estimate has an expected delivery time

## Customer management
- B.R. 53: A user can create, update, or edit a customer
- B.R. 54: A customer can be a professional or individual
- B.R. 55: A professional customer has a business name (required)
- B.R. 56: An individual customer has a first name (required)
- B.R. 57: An individual customer has a last name (required)
- B.R. 58: A customer has an email (optional)
- B.R. 59: A customer has a phone number (optional)
- B.R. 60: A customer has a postal address (optional)

## Invoice management
- B.R. 61: A business owner can create, update, or edit an invoice
- B.R. 62: An invoice requires an approved estimate
- B.R. 63: An invoice has two states (emitted or paid)
- B.R. 64: An invoice has a price surcharge (set by default to zero)
- B.R. 65: An invoice has a payment limit date
- B.R. 66: An invoice has a payment date
- B.R. 67: An invoice has a creation date

## Expense management
- B.R. 68: A business owner can create, update, or edit an expense
- B.R. 69: An expense has a title
- B.R. 70: An expense has a price
- B.R. 71: An expense has a date
