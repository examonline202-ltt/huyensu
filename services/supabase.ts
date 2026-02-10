
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://ltypkaxtrrlxzsbvixpp.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0eXBrYXh0cnJseHpzYnZpeHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDg5NzYsImV4cCI6MjA4NjAyNDk3Nn0.TSsyYqjoZTKnIVpY1x_76KBCouH2w_kbKV-pkSaryiw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
