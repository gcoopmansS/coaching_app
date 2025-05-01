// Converts "5:30" → 5.5
export function paceStringToDecimal(paceStr) {
  if (!paceStr || typeof paceStr !== "string") return null;
  const [min, sec] = paceStr.split(":").map(Number);
  if (isNaN(min) || isNaN(sec)) return null;
  return min + sec / 60;
}

// Estimate distance for a block
export function getBlockDistance(block) {
  if (block.durationType === "distance") {
    return parseFloat(block.duration) || 1;
  }

  if (block.durationType === "time") {
    const durationMin = parseFloat(block.duration);
    if (!durationMin || isNaN(durationMin)) return 1;

    if (block.intensityType === "pace" && block.intensity) {
      const pace = paceStringToDecimal(block.intensity);
      if (pace) return durationMin / pace;
    }

    return durationMin / 6; // assume 6:00 min/km
  }

  return 1;
}

// Estimate time for a block (in minutes)
export function getBlockTime(block) {
  if (block.durationType === "time") {
    return parseFloat(block.duration) || 0;
  }

  if (block.durationType === "distance") {
    const distance = parseFloat(block.duration);
    if (!distance || isNaN(distance)) return 0;

    // Estimate based on pace
    if (block.intensityType === "pace" && block.intensity) {
      const pace = paceStringToDecimal(block.intensity);
      if (pace) return distance * pace;
    }

    return distance * 6; // assume 6:00 min/km
  }

  return 0;
}

// Totals for a whole workout
export function getWorkoutTotalDistance(blocks = []) {
  return blocks.reduce((sum, block) => {
    if (block.type === "repeat" && Array.isArray(block.blocks)) {
      const innerSum = getWorkoutTotalDistance(block.blocks);
      return sum + innerSum * (block.repeat || 1);
    }
    return sum + getBlockDistance(block);
  }, 0);
}

export function getWorkoutTotalTime(blocks = []) {
  return blocks.reduce((sum, block) => {
    if (block.type === "repeat" && Array.isArray(block.blocks)) {
      const innerSum = getWorkoutTotalTime(block.blocks);
      return sum + innerSum * (block.repeat || 1);
    }
    return sum + getBlockTime(block);
  }, 0);
}
