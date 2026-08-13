-- Backfill new duration columns from the old focus session shape before
-- enforcing required constraints.

ALTER TABLE "FocusSession" ADD COLUMN "plannedDurationMinutes" INTEGER;
ALTER TABLE "FocusSession" ADD COLUMN "actualDurationMinutes" INTEGER;

UPDATE "FocusSession"
SET
  "plannedDurationMinutes" = COALESCE("durationMinutes", 25),
  "actualDurationMinutes" = COALESCE("durationMinutes", 25);

ALTER TABLE "FocusSession" ALTER COLUMN "plannedDurationMinutes" SET NOT NULL;
ALTER TABLE "FocusSession" ALTER COLUMN "actualDurationMinutes" SET NOT NULL;

ALTER TABLE "FocusSession" DROP COLUMN "startTime";
ALTER TABLE "FocusSession" DROP COLUMN "durationMinutes";
ALTER TABLE "FocusSession" DROP COLUMN "endTime";

DROP INDEX IF EXISTS "FocusSession_userId_startTime_idx";
CREATE INDEX "FocusSession_userId_createdAt_idx" ON "FocusSession"("userId", "createdAt");
