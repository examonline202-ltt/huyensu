
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://rfdlxvhamfqktsynsyqi.supabase.co';
export const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZGx4dmhhbWZxa3RzeW5zeXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODc5NTYsImV4cCI6MjA4NTc2Mzk1Nn0.JQ86AZ6yXZPGUkQZVG1_Az6QBGMwYto7QqGvvai7270';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
