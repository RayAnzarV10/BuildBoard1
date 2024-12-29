'use client'
import { useParams } from 'next/navigation'

//Esto es diferente a lo del tutorial, si algo sale mal despues de esto, revisar esta parte

const Page = () => {
  const params = useParams()
  
  return (
    <div>{params.orgId}</div>
  )
}

export default Page