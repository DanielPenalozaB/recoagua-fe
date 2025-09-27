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
import { useCity, useCreateCity, useUpdateCity } from '@/features/cities/hooks/use-city'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRegions } from '@/features/regions/hooks/use-region'

const cityFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(45, {
      message: 'El nombre debe tener menos de 45 caracteres.',
    }),
  description: z.string().optional(),
  rainfall: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      const num = parseFloat(val.replace(',', '.'));
      return !isNaN(num) && num >= 0;
    }, {
      message: 'La lluvia debe ser un número válido mayor o igual a 0.',
    }),
  regionId: z.string({
    error: 'Por favor, selecciona una región.',
  }),
})

type CityFormValues = z.infer<typeof cityFormSchema>

// This can come from your database or API.
const defaultValues: Partial<CityFormValues> = {
  name: '',
  description: '',
  rainfall: '',
  regionId: '',
}

interface CitiesCreateEditFormProps {
  readonly cityId?: number
}

export function CitiesCreateEditForm({ cityId }: CitiesCreateEditFormProps) {
  const { push } = useRouter();
  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();
  const getCityMutation = useCity(cityId);
  const { data, isLoading, error } = useRegions({ limit: 100 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CityFormValues>({
    resolver: zodResolver(cityFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = async (formData: CityFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert rainfall string to number for API call
      const rainfall = formData.rainfall && formData.rainfall !== '' 
        ? parseFloat(formData.rainfall.replace(',', '.'))
        : undefined;

      // Prepare data for API call
      const cityData = {
        name: formData.name,
        description: formData.description,
        rainfall,
        regionId: parseInt(formData.regionId),
        language: 'es'
      };

      if (cityId) {
        await updateCityMutation.mutateAsync({ id: cityId, data: cityData });
      } else {
        await createCityMutation.mutateAsync(cityData);
      }
      
      // Redirect to cities list after successful creation
      push('/admin/cities');
    } catch (error) {
      // Error handling is already done in the mutation
      console.error('Failed to create city:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (getCityMutation?.isSuccess) {
      const city = getCityMutation.data.data;
      form.setValue('name', city.name);
      form.setValue('description', city.description);
      // Convert number to string for form display
      form.setValue('rainfall', city.rainfall ? city.rainfall.toString() : '');
      if (city.region) {
        form.setValue('regionId', city.region.id.toString());
      }
    }
  }, [getCityMutation?.isSuccess]);

  const placeholderText = error ? "Error al cargar regiones" : "Selecciona una región"
  const regionItems = error
    ? <SelectItem value="1" disabled>Error al cargar regiones</SelectItem>
    : data?.data.map((region) => (<SelectItem key={region.id.toString()} value={region.id.toString()}>{region.name}</SelectItem>));

  const getButtonText = () => {
    if (cityId) {
      return isSubmitting ? 'Actualizando...' : 'Actualizar ciudad';
    }
    return isSubmitting ? 'Creando...' : 'Crear ciudad';
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
            name='rainfall'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precipitación (mm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Ingresa la precipitación (ej: 12.5 o 12,5)'
                    type='text'
                    inputMode='decimal'
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string, numbers, comma, and decimal point
                      if (value === '' || /^[\d,.]*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='regionId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Región</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder={isLoading ? "Cargando regiones..." : placeholderText} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading
                      ? <SelectItem value="1" disabled>Cargando regiones...</SelectItem>
                      : regionItems
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
          onClick={() => push('/admin/cities')}
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