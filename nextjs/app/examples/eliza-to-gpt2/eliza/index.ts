// ELIZA running Weizenbaum's 1966 DOCTOR script, entirely in the browser. Ported from ll-26-27/eng298ai-20261020.
import { DOCTOR_SCRIPT } from "./doctor";
import { createEliza } from "./engine";

export const doctor = createEliza(DOCTOR_SCRIPT);
export const { greeting, initialState, respond } = doctor;
export { describeRule, type ElizaState, type Rule } from "./engine";
