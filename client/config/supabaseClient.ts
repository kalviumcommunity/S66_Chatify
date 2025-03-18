// import { createClient } from '@supabase/supabase-js'

// declare global {
//   interface ImportMeta {
//     env: {
//       VITE_SUPABASE_URL: string
//       VITE_SUPABASE_ANON_KEY: string
//     }
//   }
// }

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// filepath: /home/zape777/Documents/Chatify/client/config/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);