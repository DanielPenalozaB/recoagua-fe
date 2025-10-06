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
import { useChallenge, useCreateChallenge, useUpdateChallenge } from '../hooks/use-challenge'
import { ChallengeDifficulty, ChallengeStatus, ChallengeType, CreateChallengeDto } from '@/types/challenge'

const challengeFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(45, {
      message: 'El nombre debe tener menos de 45 caracteres.',
    }),
  description: z.string(),
  score: z.number().min(0),
  difficulty: z.enum(ChallengeDifficulty),
  type: z.enum(ChallengeType),
  status: z.enum(ChallengeStatus)
})

type ChallengeFormValues = z.infer<typeof challengeFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ChallengeFormValues> = {
  name: '',
  description: '',
  score: 0,
  difficulty: ChallengeDifficulty.EASY,
  type: ChallengeType.EDUCATIONAL,
  status: ChallengeStatus.DRAFT
}

interface ChallengeCreateEditFormProps {
  readonly challengeId?: number
}

export function ChallengesCreateEditForm({ challengeId }: ChallengeCreateEditFormProps) {
  const { push } = useRouter();
  const createChallengeMutation = useCreateChallenge();
  const updateChallengeMutation = useUpdateChallenge();
  const getChallengeMutation = useChallenge(challengeId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const renderDifficultyLabel = (role: ChallengeDifficulty) => {
    switch (role.toLowerCase()) {
      case ChallengeDifficulty.EASY:
        return 'Fácil';

      case ChallengeDifficulty.MEDIUM:
        return 'Medio';

      case ChallengeDifficulty.HARD:
      default:
        return 'Difícil';
    }
  }

  const renderTypeLabel = (role: ChallengeType) => {
    switch (role.toLowerCase()) {
      case ChallengeType.EDUCATIONAL:
        return 'Educacional';

      case ChallengeType.COMMUNITY:
        return 'Comunidad';

      case ChallengeType.PRACTICAL:
      default:
        return 'Práctica';
    }
  }

  const renderStatusLabel = (role: ChallengeStatus) => {
    switch (role.toLowerCase()) {
      case ChallengeStatus.ACTIVE:
        return 'Activo';

      case ChallengeStatus.ARCHIVED:
        return 'Archivado';

      case ChallengeStatus.DRAFT:
      default:
        return 'Borrador';
    }
  }

  const onSubmit = async (formData: ChallengeFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API call
      const userData: CreateChallengeDto = {
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        score: formData.score,
        status: formData.status,
        challengeType: formData.type
      };

      if (challengeId) {
        await updateChallengeMutation.mutateAsync({ id: challengeId, data: userData });
      } else {
        await createChallengeMutation.mutateAsync(userData);
      }

      // Redirect to challenges list after successful creation
      push('/admin/challenges');
    } catch (error) {
      // Error handling is already done in the mutation
      console.error('Ocurrió un error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (getChallengeMutation?.isSuccess) {
      const user = getChallengeMutation.data.data;
      form.setValue('name', user.name);
      form.setValue('description', user.description);
      form.setValue('score', user.score);
      form.setValue('difficulty', user.difficulty);
      form.setValue('type', user.challengeType);
      form.setValue('status', user.status);
    }
  }, [getChallengeMutation?.isSuccess]);

  const getButtonText = () => {
    if (challengeId) {
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
            name='score'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puntaje</FormLabel>
                <FormControl>
                  <Input placeholder='Ingresa el puntaje' type='number' className='bg-white' {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                    {Object.keys(ChallengeDifficulty).map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty.toLowerCase()}>{renderDifficultyLabel(difficulty as ChallengeDifficulty)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger className='w-full bg-white'>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(ChallengeType).map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>{renderTypeLabel(type as ChallengeType)}</SelectItem>
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
                    {Object.keys(ChallengeStatus).map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>{renderStatusLabel(status as ChallengeStatus)}</SelectItem>
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
          onClick={() => push('/admin/challenges')}
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
