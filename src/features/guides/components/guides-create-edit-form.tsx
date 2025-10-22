'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl, FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGuide, useCreateGuide, useUpdateGuide } from '../hooks/use-guide'
import { GuideDifficulty, GuideStatus, CreateGuideDto } from '@/types/guide'

const guideFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(45, {
      message: 'El nombre debe tener menos de 45 caracteres.',
    }),
  description: z.string(),
  estimatedDuration: z.number().min(0),
  difficulty: z.enum(GuideDifficulty),
  status: z.enum(GuideStatus)
})

type GuideFormValues = z.infer<typeof guideFormSchema>

// This can come from your database or API.
const defaultValues: Partial<GuideFormValues> = {
  name: '',
  description: '',
  estimatedDuration: 0,
  difficulty: GuideDifficulty.BEGINNER,
  status: GuideStatus.DRAFT
}

interface GuideCreateEditFormProps {
  readonly guideId?: number
}

export function GuidesCreateEditForm({ guideId }: GuideCreateEditFormProps) {
  const { push } = useRouter();
  const createGuideMutation = useCreateGuide();
  const updateGuideMutation = useUpdateGuide();
  const getGuideMutation = useGuide(guideId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GuideFormValues>({
    resolver: zodResolver(guideFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const renderDifficultyLabel = (role: GuideDifficulty) => {
    switch (role.toLowerCase()) {
      case GuideDifficulty.BEGINNER:
        return 'Principiante';

      case GuideDifficulty.INTERMEDIATE:
        return 'Intermedio';

      case GuideDifficulty.ADVANCED:
      default:
        return 'Avanzado';
    }
  }

  const renderStatusLabel = (role: GuideStatus) => {
    switch (role.toLowerCase()) {
      case GuideStatus.PUBLISHED:
        return 'Publicado';

      case GuideStatus.ARCHIVED:
        return 'Archivado';

      case GuideStatus.DRAFT:
      default:
        return 'Borrador';
    }
  }

  const onSubmit = async (formData: GuideFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API call
      const userData: CreateGuideDto = {
        name: formData.name,
        description: formData.description,
        estimatedDuration: formData.estimatedDuration,
        language: 'es',
        status: formData.status,
      };

      if (guideId) {
        await updateGuideMutation.mutateAsync({ id: guideId, data: userData });
      } else {
        await createGuideMutation.mutateAsync(userData);
      }

      // Redirect to guides list after successful creation
      push('/admin/guides');
    } catch (error) {
      // Error handling is already done in the mutation
      console.error('Ocurrió un error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (getGuideMutation?.isSuccess) {
      const user = getGuideMutation.data.data;
      form.setValue('name', user.name);
      form.setValue('description', user.description);
      form.setValue('estimatedDuration', user.estimatedDuration);
      form.setValue('difficulty', user.difficulty);
      form.setValue('status', user.status);
    }
  }, [getGuideMutation?.isSuccess]);

  const getButtonText = () => {
    if (guideId) {
      return isSubmitting ? 'Actualizando...' : 'Actualizar reto';
    }
    return isSubmitting ? 'Creando...' : 'Crear reto';
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
                  <Input placeholder='Ingresa el nombre' type='text' className='bg-white' {...field} />
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
                  <Input placeholder='Ingresa la descripción' type='text' className='bg-white' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='estimatedDuration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puntaje</FormLabel>
                <FormControl>
                  <Input placeholder='Tiempo estimado' type='number' className='bg-white' {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='difficulty'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dificultad</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger className='w-full bg-white'>
                      <SelectValue placeholder="Selecciona una dificultad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(GuideDifficulty).map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty.toLowerCase()}>{renderDifficultyLabel(difficulty as GuideDifficulty)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger className='w-full bg-white'>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(GuideStatus).map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>{renderStatusLabel(status as GuideStatus)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          onClick={() => push('/admin/guides')}
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
