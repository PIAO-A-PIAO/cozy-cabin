# Cozy Cabin Backlog

## Pomodoro

### Focus Session History Pagination

Status: Planned

Description:
- Load older focus-session records as the user scrolls to the end of the history list.
- Use cursor-based pagination ordered by `createdAt` so the list stays fast as history grows.
- Keep the initial load small and append older records in batches.

Potential design:
- `GET /api/focus-sessions?limit=20`
- `GET /api/focus-sessions?limit=20&before=<cursor>`
- Frontend scroll sentinel or `IntersectionObserver` to trigger loading more

Priority:
Next sprint or later

## Letters

### Delivery Simulation

Status: Planned

Description:
- Letters should not arrive instantly.
- Delivery time depends on the virtual distance between users.
- The sender can track the letter while it is traveling.
- The recipient cannot read the letter until it arrives.

Potential design:
- Status:
  - DRAFT
  - DELIVERING
  - DELIVERED
- deliveryAt timestamp
- Future background job or lazy status update

Priority:
Sprint 5+

## Street Name

- Create a `Street` model in the database.
- Store street metadata, including:
  - `name`
  - `capacity`
  - `isFull`
- Replace `User.streetName` with a relation to `Street`.

### Registration

When a new user registers:

1. Find a street that is not marked as full.
2. Assign the user the next available house number on that street.
3. After the assignment, check whether the street has reached its capacity.
4. If the street is now full, update `isFull` to `true`.

### Account Deletion

When a user deletes their account:

1. Release the user's address.
2. If the street was previously marked as full, check whether an address has become available.
3. If there is now available capacity, update `isFull` to `false`.

### Notes

- Keep a unique constraint on `(streetId, houseNumber)` to guarantee address uniqueness.
- `isFull` should be treated as a cached state for efficient lookups. The system should still be able to derive the actual availability from the underlying address data if needed.
