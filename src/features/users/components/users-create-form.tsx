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
import { UserRole } from '@/types/user'
import { useCities } from '@/hooks/use-cities'
import { useRouter } from 'next/navigation'
import { useCreateUser } from '../hooks/use-user'
import { useState } from 'react'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(45, {
      message: 'El nombre debe tener menos de 45 caracteres.',
    }),
  email: z.email({
    message: 'Por favor, ingresa un email válido.',
  }),
  cityId: z.string({
    error: 'Por favor, selecciona una ciudad.',
  }),
  role: z.enum(UserRole, {
    error: 'Por favor, selecciona un rol.'
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  name: '',
  email: '',
}

export function UsersCreateForm() {
  const { push } = useRouter();
  const { data, isLoading, error } = useCities({ limit: 100 });
  const createUserMutation = useCreateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const renderRoleLabel = (role: UserRole) => {
    switch (role.toLowerCase()) {
      case UserRole.ADMIN:
        return 'Administrador';

      case UserRole.MODERATOR:
        return 'Moderador';

      case UserRole.CITIZEN:
      default:
        return 'Ciudadano';
    }
  }

  const onSubmit = async (formData: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API call
      const userData = {
        email: formData.email,
        name: formData.name,
        cityId: parseInt(formData.cityId),
        role: formData.role,
        language: 'es'
      };

      await createUserMutation.mutateAsync(userData);

      // Redirect to users list after successful creation
      push('/admin/users');
    } catch (error) {
      // Error handling is already done in the mutation
      console.error('Failed to create user:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const placeholderText = error ? "Error al cargar ciudades" : "Selecciona una ciudad"

  const cityItems = error
    ? <SelectItem value="1" disabled>Error al cargar ciudades</SelectItem>
    : data?.data.map((city) => (<SelectItem key={city.id.toString()} value={city.id.toString()}>{city.name}</SelectItem>));

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
                  <Input placeholder='Ingresa el nombre completo' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Ingresa el nombre completo' type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(UserRole).map((role) => (<SelectItem key={role} value={role.toLowerCase()}>{renderRoleLabel(role as UserRole)}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='cityId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={isLoading ? "Cargando ciudades..." : placeholderText} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading
                      ? <SelectItem value="1" disabled>Cargando ciudades...</SelectItem>
                      : cityItems
                    }
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
          onClick={() => push('/admin/users')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          title='Crear usuario'
          disabled={isSubmitting || !form.formState.isValid}
          isLoading={isSubmitting}
        >
            {isSubmitting ? 'Creando...' : 'Crear usuario'}
        </Button>
      </form>
    </Form>
  )
}
