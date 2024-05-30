import { MantineColor, MantineTheme } from "@mantine/core";

const PRESET_COLOR_MAPS = {
  complete: "blue",
  cancelled: "red",
  linkedin: "indigo",
  email: "orange",
  accepted: "green",
  active_convo: "yellow",
  active_convo_objection: "yellow",
  active_convo_qual_needed: "yellow",
  active_convo_question: "yellow",
  active_convo_scheduling: "yellow",
  active_convo_next_steps: "yellow",
  active_convo_revival: "yellow",
  active_convo_breakup: "yellow",
  bumped: "orange",
  demo: "blue",
  demo_complete: "green",
  demo_lost: "red",
  demo_loss: "red",
  demo_set: "pink",
  scheduling: "pink",
  email_clicked: "blue",
  email_replied: "orange",
  email_opened: "yellow",
  unknown: "blue",
  disqualified: "red",
  errror: "red",
  upload_failed: "orange",
  years_of_experience_at_current_job: "red",
  current_job_specialties: "pink",
  no_show: "red",
  none: "gray",

  terrible: "red",
  poor: "orange",
  fair: "yellow",
  good: "lime",
  great: "green",
  excellent: "teal",

  0: "indigo",
  1: "blue",
  2: "cyan",
  3: "green",
  4: "lime",
  5: "yellow",
  6: "orange",
  7: "red",
};

export function hashString(str, range) {
  if (!str) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % range;
  }
  return hash;
}

export function valueToColor(theme, value, defaultColor) {
  const defCol = defaultColor || "gray";

  if (!value) {
    return defCol;
  }
  value = value.toLowerCase().trim().replaceAll(" ", "_");

  if (PRESET_COLOR_MAPS[value]) {
    return PRESET_COLOR_MAPS[value];
  }

  // Get a 'random' mantine color name
  let i = 0;
  let index = hashString(value, Object.keys(theme.colors).length);
  for (let color in theme.colors) {
    if (i === index) {
      const c = color;
      if (["dark"].includes(c)) {
        return defCol;
      } else {
        return c;
      }
    }
    i++;
  }

  return defCol;
}
