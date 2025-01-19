'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectWhere } from '@/lib/queries';
import { Building, MoveRight, TrendingDown, TrendingUp } from 'lucide-react';
import { ProjectStatus } from '@prisma/client';
import { Badge } from '../ui/badge';

const ActiveProjectsCard = ({ orgId, status }: { orgId:string, status:ProjectStatus }) => {
  const [currentMonthProjects, setCurrentMonthProjects] = useState(0);
  const [inProgressProjects, setInProgressProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Get projects for in progress status
        const inProgressData = await getProjectWhere(orgId, 'In_Progress');
        
        // Get projects for the provided status
        const statusProjects = await getProjectWhere(orgId, status);
              
        // Get current month projects from status projects
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
          
        const thisMonthProjects = statusProjects.filter(project => {
          const projectDate = new Date(project.createdAt);
          return projectDate.getMonth() === currentMonth && 
            projectDate.getFullYear() === currentYear;
        });

        setCurrentMonthProjects(thisMonthProjects.length);
        setInProgressProjects(inProgressData.length);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [orgId, status]);

  const getBadgeStyles = () => {
    if (inProgressProjects > 0) {
      return "bg-green-200 text-green-800";
    } else if (inProgressProjects < 0) {
      return "bg-red-200 text-red-800";
    } else if (inProgressProjects === 0) {
      return "bg-gray-200 text-gray-800";
    }
    return "bg-gray-200 text-gray-800";
  };

  return (  
    <Card className='bg-primary-foreground shadow-lg dark:bg-card'>    
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium truncate">
          Proyectos Activos
        </CardTitle>
        <Building size={16} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="text-2xl font-bold truncate">
              {currentMonthProjects}
            </div>
            <Badge className={`flex items-center mt-3 gap-2 w-fit ${getBadgeStyles()}`}>
              {inProgressProjects > 0 ? <TrendingUp size={16} /> : inProgressProjects < 0 ? <TrendingDown size={16} /> : <MoveRight size={16} />}
              {inProgressProjects === 0 ? 'No hay nuevos proyectos' : `+${inProgressProjects} vs mes pasado`}
            </Badge>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveProjectsCard;