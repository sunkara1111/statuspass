import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calendarDaysUntil,
  plannerSeverity,
} from "./planner";

test("calendarDaysUntil is inclusive of calendar dates only", () => {
  assert.equal(calendarDaysUntil("2026-03-20", "2026-03-20"), 0);
  assert.equal(calendarDaysUntil("2026-03-27", "2026-03-20"), 7);
  assert.equal(calendarDaysUntil("2026-03-10", "2026-03-20"), -10);
  assert.equal(calendarDaysUntil("bad", "2026-03-20"), null);
});

test("plannerSeverity follows 7 / 30 day bands", () => {
  assert.equal(plannerSeverity(null), "unset");
  assert.equal(plannerSeverity(45), "safe");
  assert.equal(plannerSeverity(30), "warning");
  assert.equal(plannerSeverity(7), "critical");
  assert.equal(plannerSeverity(-1), "critical");
});
