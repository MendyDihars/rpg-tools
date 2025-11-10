export function sanitizeItem(it) {
  return {
    id: Number(it.id),
    baseName: String(it.baseName ?? ""),
    index: Number(it.index ?? 1),
    displayName: String(it.displayName ?? ""),
    hpMax: it.hpMax == null ? null : Number(it.hpMax),
    hpCur: it.hpCur == null ? null : Number(it.hpCur),
    bonus: it.bonus == null ? null : Number(it.bonus),
    dice: Array.isArray(it.dice) ? it.dice.map(Number) : it.dice === null ? null : null,
    total: Number(it.total ?? 0),
    type: it.type === "manual" ? "manual" : "group",
    order: Number(it.order ?? 0),
  };
}

export function rollD6() { return Math.floor(Math.random() * 6) + 1; }

export function roll3d6() { return [rollD6(), rollD6(), rollD6()]; }
