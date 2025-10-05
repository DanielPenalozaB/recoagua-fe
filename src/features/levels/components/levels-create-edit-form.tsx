'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CreateLevelDto } from '@/types/level'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateLevel, useLevel, useUpdateLevel } from '../hooks/use-level'

const levelFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(45, {
      message: 'El nombre debe tener menos de 45 caracteres.',
    }),
  description: z.string(),
  requiredPoints: z.number().min(0),
  rewards: z.string(),
})

type LevelFormValues = z.infer<typeof levelFormSchema>

// This can come from your database or API.
const defaultValues: Partial<LevelFormValues> = {
  name: '',
  description: '',
  requiredPoints: 0,
  rewards: '',
}

interface LevelCreateEditFormProps {
  readonly levelId?: number
}

export function LevelsCreateEditForm({ levelId }: LevelCreateEditFormProps) {
  const { push } = useRouter();
  const createLevelMutation = useCreateLevel();
  const updateLevelMutation = useUpdateLevel();
  const getLevelMutation = useLevel(levelId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = async (formData: LevelFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API call
      const userData: CreateLevelDto = {
        name: formData.name,
        description: formData.description,
        requiredPoints: formData.requiredPoints,
        rewards: formData.rewards
      };

      if (levelId) {
        await updateLevelMutation.mutateAsync({ id: levelId, data: userData });
      } else {
        await createLevelMutation.mutateAsync(userData);
      }

      // Redirect to levels list after successful creation
      push('/admin/levels');
    } catch (error) {
      // Error handling is already done in the mutation
      console.error('Ocurrió un error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (getLevelMutation?.isSuccess) {
      const user = getLevelMutation.data.data;
      form.setValue('name', user.name);
      form.setValue('description', user.description);
      form.setValue('requiredPoints', user.requiredPoints);
      form.setValue('rewards', user.rewards);
    }
  }, [getLevelMutation?.isSuccess]);

  const getButtonText = () => {
    if (levelId) {
      return isSubmitting ? 'Actualizando...' : 'Actualizar nivel';
    }
    return isSubmitting ? 'Creando...' : 'Crear nivel';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder='Ingresa el nombre' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder='Ingresa la descripción' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='requiredPoints'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puntaje requerido</FormLabel>
                <FormControl>
                  <Input placeholder='Ingresa el puntaje' type='number' {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='rewards'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recompensas</FormLabel>
                <FormControl>
                  <Input placeholder='Ingresa las recompensas' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='button'
          title='Cancelar'
          variant='outline'
          className='mr-2'
          onClick={() => push('/admin/levels')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          title={getButtonText()}
          disabled={isSubmitting || !form.formState.isValid}
          isLoading={isSubmitting}
        >
          {getButtonText()}
        </Button>
      </form>
    </Form>
  )
}
