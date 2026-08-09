// js/supabase.js

const SUPABASE_URL = "https://qinzshpkxetttzfjlhlv.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Iaz4PQnL25SRATsUY0s5hg_fxl5piRN";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
