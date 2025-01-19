'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationIncome } from '@/lib/queries';
import { Badge } from '../ui/badge';
import { DollarSign, MoveRight, TrendingDown, TrendingUp } from 'lucide-react';

const TotalIncomeCard = ({ orgId }: { orgId:string }) => {
  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const incomes = await getOrganizationIncome(orgId);
        
        // Obtener fecha actual
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Filtrar ingresos del mes actual y anterior
        const currentMonthIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.date);
          return incomeDate.getMonth() === currentMonth && 
            incomeDate.getFullYear() === currentYear;
        });

        const previousMonthIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.date);
          return incomeDate.getMonth() === (currentMonth - 1 || 11) && 
            incomeDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
        });

        // Calcular totales
        const currentTotal = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
        const previousTotal = previousMonthIncomes.reduce((sum, income) => sum + income.amount, 0);

        // Calcular porcentaje de cambio
        const change = previousTotal === 0 
          ? 100 
          : ((currentTotal - previousTotal) / previousTotal) * 100;

        setCurrentMonthIncome(currentTotal);
        setPercentageChange(change);
      } catch (error) {
        console.error('Error fetching income data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, [orgId]);

  const getBadgeStyles = () => {
    if (currentMonthIncome === 0) {
      return "bg-gray-200 text-gray-800";
    } else if (percentageChange < 0) {
      return "bg-red-200 text-red-800";
    } else if (percentageChange > 0) {
      return "bg-green-200 text-green-800";
    }
    return "bg-gray-200 text-gray-800";
  };

  return (
    <Card className='bg-primary-foreground shadow-lg dark:bg-card'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium truncate">
          Ingresos Mensuales
        </CardTitle>
        <DollarSign size={16} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="text-2xl font-bold truncate">
              ${currentMonthIncome.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <Badge className={`flex items-center mt-3 gap-2 w-fit ${getBadgeStyles()}`}>
              {currentMonthIncome === 0 ? <MoveRight size={16} /> : percentageChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {currentMonthIncome === 0 ? 'No hay ingresos este mes' : `+${Math.abs(percentageChange).toFixed(1)}% vs mes pasado`}
            </Badge>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalIncomeCard;