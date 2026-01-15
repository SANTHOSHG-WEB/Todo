import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnprltvscraxrvguxhua.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucHJsdHZzY3JheHJ2Z3V4aHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NjAwNDYsImV4cCI6MjA4NDAzNjA0Nn0.XxqxeMXoncdBxFvTkyYLjekFJaIIYpZfQwKAfh5bAnY'

export const supabase = createClient(supabaseUrl, supabaseKey)
