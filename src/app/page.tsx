'use client'

import { useState, useEffect } from 'react'
import { supabase, type User, type Workout } from '@/lib/supabase'
import { UserPlus, Trophy, CheckCircle, XCircle, Users, Trash2, Calendar, Activity } from 'lucide-react'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  const [workoutCounts, setWorkoutCounts] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [recentWorkouts, setRecentWorkouts] = useState<Array<Workout & { user_name: string }>>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      setError('Supabase connection not configured. Please check your environment variables.')
      return
    }
    fetchUsers()
    fetchWorkoutCounts()
    fetchRecentWorkouts()
  }, [])

  const fetchUsers = async () => {
    if (!supabase) {
      setError('Supabase connection not available.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching users:', error)
        setError('Failed to load users. Please check your Supabase connection.')
      } else if (data) {
        setUsers(data)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users. Please check your Supabase connection.')
    }
  }

  const fetchWorkoutCounts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('user_id, completed')
        .eq('completed', true)
      
      if (error) {
        console.error('Error fetching workout counts:', error)
      } else if (data) {
        const counts: Record<string, number> = {}
        data.forEach(workout => {
          counts[workout.user_id] = (counts[workout.user_id] || 0) + 1
        })
        setWorkoutCounts(counts)
      }
    } catch (err) {
      console.error('Error fetching workout counts:', err)
    }
  }

  const fetchRecentWorkouts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          users(name)
        `)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) {
        console.error('Error fetching recent workouts:', error)
      } else if (data) {
        const workoutsWithNames = data.map(workout => ({
          ...workout,
          user_name: workout.users?.name || 'Unknown User'
        }))
        setRecentWorkouts(workoutsWithNames)
      }
    } catch (err) {
      console.error('Error fetching recent workouts:', err)
    }
  }

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase connection not available.')
      return
    }

    if (!name.trim() || !age.trim()) {
      setError('Please enter both name and age.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name: name.trim(), age: parseInt(age) }])
        .select()
        .single()

      if (error) {
        console.error('Error registering user:', error)
        setError('Failed to register user. Please check your Supabase connection.')
      } else if (data) {
        setCurrentUser(data)
        setShowRegistration(false)
        setName('')
        setAge('')
        fetchUsers()
      }
    } catch (err) {
      console.error('Error registering user:', err)
      setError('Failed to register user. Please check your Supabase connection.')
    }
    
    setLoading(false)
  }

  const deleteUser = async (userId: string) => {
    if (!supabase) {
      setError('Supabase connection not available.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        console.error('Error deleting user:', error)
        setError('Failed to delete user. Please try again.')
      } else {
        // If the deleted user was the current user, clear selection
        if (currentUser?.id === userId) {
          setCurrentUser(null)
        }
        fetchUsers()
        fetchWorkoutCounts()
        fetchRecentWorkouts()
        setShowDeleteConfirm(null)
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Failed to delete user. Please try again.')
    }
    
    setLoading(false)
  }

  const recordWorkout = async (completed: boolean) => {
    if (!currentUser || !supabase) return

    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{ user_id: currentUser.id, completed }])

      if (error) {
        console.error('Error recording workout:', error)
        setError('Failed to record workout. Please try again.')
      } else {
        fetchWorkoutCounts()
        fetchRecentWorkouts()
      }
    } catch (err) {
      console.error('Error recording workout:', err)
      setError('Failed to record workout. Please try again.')
    }
    
    setLoading(false)
  }

  const selectUser = (user: User) => {
    setCurrentUser(user)
    setError('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            💪 Workout Tracker
          </h1>
          <p className="text-lg text-gray-700">Track your fitness journey with friends!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* User Selection/Registration */}
        <div className="max-w-md mx-auto mb-8">
          {!currentUser ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Select User</h2>
              </div>
              
              {users.length > 0 && (
                <div className="space-y-3 mb-6">
                  {users.map(user => (
                    <div key={user.id} className="relative">
                      <button
                        onClick={() => selectUser(user)}
                        className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                      >
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">Age: {user.age}</div>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowRegistration(true)}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                <UserPlus className="w-6 h-6" />
                Add New User
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {currentUser.name}!</h2>
                <p className="text-gray-700 text-lg">Did you work out today?</p>
              </div>
              
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => recordWorkout(true)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold text-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  Yes! 💪
                </button>
                <button
                  onClick={() => recordWorkout(false)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold text-lg"
                >
                  <XCircle className="w-6 h-6" />
                  No 😔
                </button>
              </div>
              
              <button
                onClick={() => setCurrentUser(null)}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Switch User
              </button>
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Recent Workouts</h2>
              </div>
              
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{workout.user_name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(workout.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">✓ Completed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {users.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
              </div>
              
              <div className="space-y-3">
                {users
                  .sort((a, b) => (workoutCounts[b.id] || 0) - (workoutCounts[a.id] || 0))
                  .map((user, index) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        currentUser?.id === user.id 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          index === 0 ? 'bg-yellow-500 shadow-lg' :
                          index === 1 ? 'bg-gray-400 shadow-lg' :
                          index === 2 ? 'bg-orange-500 shadow-lg' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{user.name}</div>
                          <div className="text-gray-600">Age: {user.age}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {workoutCounts[user.id] || 0}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">workouts</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add New User</h2>
              <form onSubmit={registerUser}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowRegistration(false)}
                    className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Delete User</h2>
              <p className="text-gray-700 text-center mb-6">
                Are you sure you want to delete this user? This action cannot be undone and will also delete all their workout records.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteUser(showDeleteConfirm)}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
