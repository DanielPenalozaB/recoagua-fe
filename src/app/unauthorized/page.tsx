'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const { back, push } = useRouter();

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Acceso no autorizado</span>
        <p className='text-muted-foreground text-center'>
          Por favor inicia sesión con las credenciales adecuadas <br /> para acceder a este recurso
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => back()}>
            Atrás
          </Button>
          <Button onClick={() => push('/')}>Regresar al inicio</Button>
        </div>
      </div>
    </div>
  )
}
