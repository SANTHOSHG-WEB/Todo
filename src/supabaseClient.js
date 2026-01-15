import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnprltvscraxrvguxhua.supabase.co'
const supabaseKey = 'YOUR_ANON_KEY_HERE'

export const supabase = createClient(supabaseUrl, supabaseKey)
