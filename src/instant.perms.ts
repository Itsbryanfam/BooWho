// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  sessions: {
    allow: {
      view: "true",
      create: "true",
      update: "false",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
