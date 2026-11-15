// The grown-up check in front of the settings (07-preferences.feature):
// one times-table question from the 6 to 9 tables, answered on a number pad.
// Plain functions with no DOM, so they are easy to test.

export const TABLES = Object.freeze([6, 7, 8, 9]);

/**
 * A new question, e.g. { a: 7, b: 8, text: "What is 7 × 8?", answer: "56" }.
 * Its answer is never the same as previousAnswer, so a child who saw the last
 * answer typed can't reuse it. random() returns a number from 0 up to 1.
 */
export function newQuestion(previousAnswer = null, random = Math.random) {
  const choices = [];
  for (const a of TABLES) {
    for (const b of TABLES) {
      if (String(a * b) !== previousAnswer) choices.push({ a, b, text: `What is ${a} × ${b}?`, answer: String(a * b) });
    }
  }
  return choices[Math.floor(random() * choices.length)];
}

/** The check as it opens: a question and nothing typed yet. */
export function openCheck(previousAnswer = null, random = Math.random) {
  return { question: newQuestion(previousAnswer, random), entry: '', wrong: false, passed: false };
}

/**
 * Presses one key on the number pad: a digit "0"–"9" or "delete".
 * When as many digits as the answer has are typed, the check either passes
 * (the settings open) or the entry is cleared to try again. A wrong answer
 * keeps the same question and never locks the pad.
 */
export function pressKey(check, key) {
  if (check.passed) return check;
  if (key === 'delete') return { ...check, entry: check.entry.slice(0, -1), wrong: false };
  if (!/^[0-9]$/.test(key)) return check;

  const entry = check.entry + key;
  if (entry.length < check.question.answer.length) return { ...check, entry, wrong: false };
  if (entry === check.question.answer) return { ...check, entry, wrong: false, passed: true };
  return { ...check, entry: '', wrong: true };
}
