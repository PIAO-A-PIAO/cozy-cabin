# Cozy Cabin Backlog

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