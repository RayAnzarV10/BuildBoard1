import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadDropzone } from '@/lib/uploadthing'
import { useToast } from '@/hooks/use-toast'


type Props = {
    apiEndpoint: 'logo' | 'avatar' | 'subAccountLogo'
    onChange: (url?:string) => void
    value?: string
}

const FileUpload = ({apiEndpoint, onChange, value}: Props) => {
    const type = value?.split('.').pop();
    const { toast } = useToast()

    if(value) {
        return <div className='flex flex-col justify-center items-center'>
            {type !=='pdf' ? (
                <div className='relative w-40 h-40'>
                    <Image 
                        src={value}
                        alt='uploaded image'
                        className='object-contain'
                        fill
                    />
                </div>
            ) : (
                <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
                    <FileIcon/>
                    <a 
                        href={value} 
                        target='_blank' 
                        rel='noopener_noreferrer' 
                        className='ml-2 test-sm text-indigo-500 dark:text-indigo-400 hover:underline'
                    >
                    View Logo
                    </a>
                </div>
            )}
            <Button
                onClick={() => onChange('')}
                variant='ghost'
                type='button'
            >
                <X className='h-4 w-4'/>
                Quitar Logo
            </Button>
        </div>
    }
  return (
    <div className='w-full bg-muted/30 cursor-pointer p-4 border-2 border-dashed border-indigo-500 rounded-lg hover:bg-muted/50 transition-all duration-200 ease-in-out'>
        <UploadDropzone 
            endpoint={apiEndpoint}
            onClientUploadComplete={(res)=>{
                onChange(res?.[0].url)
                toast({
                    title: "Logo subido!",
                    description: "Tu logo ha sido subido exitosamente",
                  })
            }}
            onUploadError={(error: Error) => {
              console.log(error)  
            }}
        />
    </div>
  )
}

export default FileUpload