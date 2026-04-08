import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = (Constants.expoConfig?.extra?.supabaseUrl ?? "") as string;
const supabaseAnonKey = (Constants.expoConfig?.extra?.supabaseAnonKey ?? "") as string;

export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
              storage: AsyncStorage,
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: false,
          },
      })
    : (null as ReturnType<typeof createClient>);
