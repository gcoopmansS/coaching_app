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
    const raw = parseFloat(block.duration);
    if (!raw || isNaN(raw)) return 0;

    const unit = block.distanceUnit || "km";
    const distanceInKm = unit === "m" ? raw / 1000 : raw;

    if (block.intensityType === "pace" && block.intensity) {
      const pace = paceStringToDecimal(block.intensity);
      if (pace) return distanceInKm * pace;
    }

    return distanceInKm * 6; // default pace
  }

  return 0;
}

// Totals for a whole workout
export const getWorkoutTotalDistance = (blocks) => {
  return blocks.reduce((sum, block) => {
    if (block.durationType === "distance") {
      const raw = parseFloat(block.duration || 0);
      const unit = block.distanceUnit || "km";
      const distanceInKm = unit === "m" ? raw / 1000 : raw;
      return sum + distanceInKm;
    }
    return sum;
  }, 0);
};

export function getWorkoutTotalTime(blocks = []) {
  return blocks.reduce((sum, block) => {
    if (block.type === "repeat" && Array.isArray(block.blocks)) {
      const innerSum = getWorkoutTotalTime(block.blocks);
      return sum + innerSum * (block.repeat || 1);
    }
    return sum + getBlockTime(block);
  }, 0);
}
