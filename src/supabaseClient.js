import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnprltvscraxrvguxhua.supabase.co'
const supabaseKey = 'sb_secret_LoOQ2JEl-I6Nlb1DToi9Gg_sojrChke'

export const supabase = createClient(supabaseUrl, supabaseKey)
