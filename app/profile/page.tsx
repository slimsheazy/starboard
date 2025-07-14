"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Trophy, Star, Crown, Zap, Heart, Sparkles } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

interface UserProfile {
  id: string
  username: string
  avatar_url: string
  total_points: number
  level: number
  readings_count: number
  favorite_house: string
  join_date: string
}

interface Reward {
  id: string
  title: string
  description: string
  points: number
  icon: string
  earned_date: string
  rarity: "common" | "rare" | "legendary"
}

interface Milestone {
  id: string
  title: string
  description: string
  target: number
  current: number
  points_reward: number
  completed: boolean
}

const avatarOptions = [
  { id: "cosmic", url: "/placeholder.svg?height=80&width=80", name: "Cosmic Wanderer" },
  { id: "mystic", url: "/placeholder.svg?height=80&width=80", name: "Mystic Sage" },
  { id: "stellar", url: "/placeholder.svg?height=80&width=80", name: "Stellar Guide" },
  { id: "lunar", url: "/placeholder.svg?height=80&width=80", name: "Lunar Oracle" },
  { id: "solar", url: "/placeholder.svg?height=80&width=80", name: "Solar Diviner" },
  { id: "ethereal", url: "/placeholder.svg?height=80&width=80", name: "Ethereal Spirit" },
]

const sampleRewards: Reward[] = [
  {
    id: "1",
    title: "First Reading",
    description: "Completed your first charm reading",
    points: 50,
    icon: "star",
    earned_date: "2024-01-15",
    rarity: "common",
  },
  {
    id: "2",
    title: "Charm Collector",
    description: "Discovered 25 different charms",
    points: 200,
    icon: "sparkles",
    earned_date: "2024-01-20",
    rarity: "rare",
  },
  {
    id: "3",
    title: "Mystic Master",
    description: "Reached level 10 in cosmic wisdom",
    points: 500,
    icon: "crown",
    earned_date: "2024-01-25",
    rarity: "legendary",
  },
]

const sampleMilestones: Milestone[] = [
  {
    id: "1",
    title: "Reading Enthusiast",
    description: "Complete 50 charm readings",
    target: 50,
    current: 32,
    points_reward: 300,
    completed: false,
  },
  {
    id: "2",
    title: "House Explorer",
    description: "Get readings from all 12 astrological houses",
    target: 12,
    current: 8,
    points_reward: 400,
    completed: false,
  },
  {
    id: "3",
    title: "Combination Master",
    description: "Discover 100 unique charm combinations",
    target: 100,
    current: 67,
    points_reward: 600,
    completed: false,
  },
]

function getRewardIcon(iconName: string) {
  switch (iconName) {
    case "star":
      return <Star className="w-4 h-4" />
    case "sparkles":
      return <Sparkles className="w-4 h-4" />
    case "crown":
      return <Crown className="w-4 h-4" />
    case "trophy":
      return <Trophy className="w-4 h-4" />
    case "zap":
      return <Zap className="w-4 h-4" />
    case "heart":
      return <Heart className="w-4 h-4" />
    default:
      return <Star className="w-4 h-4" />
  }
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "common":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "rare":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "legendary":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({
        id: "1",
        username: "CosmicSeeker",
        avatar_url: selectedAvatar.url,
        total_points: 1250,
        level: 8,
        readings_count: 32,
        favorite_house: "Scorpio",
        join_date: "2024-01-01",
      })
      setLoading(false)
    }, 1000)
  }, [selectedAvatar])

  const handleAvatarChange = (avatar: (typeof avatarOptions)[0]) => {
    setSelectedAvatar(avatar)
    setIsAvatarModalOpen(false)
    // Here you would update the user's avatar in Supabase
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your cosmic profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Sign in to view your profile</h2>
            <Button className="w-full">Sign In with Supabase</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Avatar className="w-24 h-24 border-4 border-white/30 group-hover:border-white/50 transition-all duration-300">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-purple-600 text-white text-2xl">
                        {user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Your Avatar</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    {avatarOptions.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`cursor-pointer p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          selectedAvatar.id === avatar.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                        onClick={() => handleAvatarChange(avatar)}
                      >
                        <Avatar className="w-16 h-16 mx-auto mb-2">
                          <AvatarImage src={avatar.url || "/placeholder.svg"} alt={avatar.name} />
                          <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-center font-medium">{avatar.name}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                <div className="flex items-center space-x-4 text-white/80">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Level {user.level}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>{user.total_points} points</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{user.readings_count} readings</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to Level {user.level + 1}</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="milestones" className="data-[state=active]:bg-white/20">
              Milestones
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-white/20">
              Rewards
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white/20">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-4">
            <div className="grid gap-4">
              {sampleMilestones.map((milestone) => (
                <Card key={milestone.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{milestone.title}</h3>
                      <Badge variant="secondary" className="bg-purple-600 text-white">
                        +{milestone.points_reward} pts
                      </Badge>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{milestone.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white/80">
                        <span>Progress</span>
                        <span>
                          {milestone.current}/{milestone.target}
                        </span>
                      </div>
                      <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid gap-4">
              {sampleRewards.map((reward) => (
                <Card key={reward.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                        {getRewardIcon(reward.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white">{reward.title}</h3>
                          <Badge className={getRarityColor(reward.rarity)}>{reward.rarity}</Badge>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300 font-medium">+{reward.points} points</span>
                          <span className="text-white/60 text-xs">
                            Earned {new Date(reward.earned_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Personal Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300 mb-1">#{user.level}</div>
                    <div className="text-white/80 text-sm">Current Level</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300 mb-1">{user.total_points}</div>
                    <div className="text-white/80 text-sm">Total Points</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300 mb-1">{user.readings_count}</div>
                    <div className="text-white/80 text-sm">Readings Cast</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300 mb-1">{user.favorite_house}</div>
                    <div className="text-white/80 text-sm">Favorite House</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
