// Test Supabase Connection
// Run this with: node test-connection.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Not set')
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Not set')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Environment variables not set properly')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n📊 Testing database tables...')
    
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message)
    } else {
      console.log('✅ Users table accessible')
    }
    
    // Test workouts table
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('count')
      .limit(1)
    
    if (workoutsError) {
      console.log('❌ Workouts table error:', workoutsError.message)
    } else {
      console.log('✅ Workouts table accessible')
    }
    
    // Test inserting a user
    console.log('\n🧪 Testing user insertion...')
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name: 'Test User', age: 25 }])
      .select()
      .single()
    
    if (insertError) {
      console.log('❌ User insertion error:', insertError.message)
    } else {
      console.log('✅ User insertion successful')
      
      // Test workout insertion
      console.log('\n🏋️ Testing workout insertion...')
      const { error: workoutError } = await supabase
        .from('workouts')
        .insert([{ user_id: newUser.id, completed: true }])
      
      if (workoutError) {
        console.log('❌ Workout insertion error:', workoutError.message)
      } else {
        console.log('✅ Workout insertion successful')
      }
      
      // Clean up test data
      await supabase.from('users').delete().eq('id', newUser.id)
      console.log('🧹 Test data cleaned up')
    }
    
    console.log('\n🎉 All tests completed!')
    
  } catch (error) {
    console.log('❌ Connection error:', error.message)
  }
}

testConnection() 