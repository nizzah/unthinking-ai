export const NOTION_DB = {
  readings: process.env.NOTION_DB_READING!, // "Reading + Listening"
  daily:    process.env.NOTION_DB_DAILY!,   // "Daily journal"
  weekly:   process.env.NOTION_DB_WEEKLY!,  // "Weekly Dashboard"
} as const;

export const NOTION_PROPS = {
  title: "Name",
  tags: "Tags",
};
