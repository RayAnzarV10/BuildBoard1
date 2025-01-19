import React from 'react'
import { getAuthUserDetails } from '@/lib/queries'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Wallet } from 'lucide-react'
import TotalIncomeCard from './total-income-card'
import ActiveProjectsCard from './active-projects'
import Projects from './search-projects'

const Dashboard = async() => {

  const user = await getAuthUserDetails()
  if (!user) return null
  if (!user.org) return 

  let orgId = user.org.id || ''

  return (
    <div className='flex-1 m-4 mt-[-2] space-y-4 rounded-md'>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <TotalIncomeCard orgId={orgId} />
        <ActiveProjectsCard orgId={orgId} status="In_Progress" />
        <Card>
          <CardContent>
            <div className="text-2xl font-bold text-center flex flex-col items-center justify-center h-24">
              Espacio Disponible
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-2xl font-bold text-center flex flex-col items-center justify-center h-24">
              Espacio Disponible
            </div>
          </CardContent>
        </Card>
      </div>
      <Projects />
    </div>
  )
}

export default Dashboard

