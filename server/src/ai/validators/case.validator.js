export function validateCanonicalCase(rawCase, difficulty = 'Medium') {
  const errors = [];

  if (!rawCase || typeof rawCase !== 'object') {
    return { valid: false, errors: ['Case data must be an object.'] };
  }

  // 1. Validate Case Metadata
  if (!rawCase.case || typeof rawCase.case !== 'object') {
    errors.push('Missing "case" metadata object.');
  } else {
    if (!rawCase.case.title) errors.push('Case title is missing.');
    if (!rawCase.case.incidentSummary) errors.push('Case incidentSummary is missing.');
  }

  // 2. Validate Suspects
  if (!Array.isArray(rawCase.suspects) || rawCase.suspects.length === 0) {
    errors.push('Suspects list must be a non-empty array.');
  } else {
    const minSuspects = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 4 : 4;
    if (rawCase.suspects.length < 3) {
      errors.push(`At least 3 suspects are required (got ${rawCase.suspects.length}).`);
    }

    const suspectIds = new Set();
    let culpritCount = 0;

    for (const suspect of rawCase.suspects) {
      if (!suspect.id) errors.push('Suspect is missing an id.');
      if (!suspect.name) errors.push(`Suspect ${suspect.id || 'unknown'} is missing a name.`);
      if (suspectIds.has(suspect.id)) errors.push(`Duplicate suspect id: ${suspect.id}`);
      suspectIds.add(suspect.id);

      if (suspect.isCulprit === true) {
        culpritCount += 1;
      }
    }

    // 3. Validate Canonical Solution
    if (!rawCase.canonicalSolution || typeof rawCase.canonicalSolution !== 'object') {
      errors.push('Missing "canonicalSolution" object.');
    } else {
      const { culpritId, motive, method } = rawCase.canonicalSolution;
      if (!culpritId) {
        errors.push('canonicalSolution is missing "culpritId".');
      } else if (!suspectIds.has(culpritId)) {
        errors.push(`canonicalSolution.culpritId "${culpritId}" is not in the suspects list.`);
      }

      if (!motive) errors.push('canonicalSolution is missing "motive".');
      if (!method) errors.push('canonicalSolution is missing "method".');

      // Ensure suspects mark matches canonicalSolution
      if (culpritCount !== 1) {
        // Fix up if needed: ensure exact culprit has isCulprit: true
        for (const suspect of rawCase.suspects) {
          suspect.isCulprit = suspect.id === culpritId;
        }
      }
    }
  }

  // 4. Validate Evidence
  if (!Array.isArray(rawCase.evidence) || rawCase.evidence.length === 0) {
    errors.push('Evidence list must be a non-empty array.');
  } else {
    if (rawCase.evidence.length < 4) {
      errors.push(`At least 4 evidence items are required (got ${rawCase.evidence.length}).`);
    }

    const suspectIds = new Set((rawCase.suspects || []).map((s) => s.id));
    for (const item of rawCase.evidence) {
      if (!item.id) errors.push('Evidence item is missing an id.');
      if (!item.title) errors.push('Evidence item is missing a title.');
      if (!item.type) errors.push(`Evidence ${item.id} is missing a type.`);

      // Validate suspect cross-references
      if (Array.isArray(item.relatedSuspectIds)) {
        for (const sId of item.relatedSuspectIds) {
          if (!suspectIds.has(sId)) {
            // Filter out invalid suspect ids gracefully
            item.relatedSuspectIds = item.relatedSuspectIds.filter((id) => suspectIds.has(id));
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
