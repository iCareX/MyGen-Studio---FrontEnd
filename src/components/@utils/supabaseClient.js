import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bxwbvaogioltesfptgsk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4d2J2YW9naW9sdGVzZnB0Z3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3ODY1MjMsImV4cCI6MjAzMjM2MjUyM30.jHOEbtFRNqS4YoFZt1GywcLtKz8SJXcZ9w0tMj9HQVk"
);
